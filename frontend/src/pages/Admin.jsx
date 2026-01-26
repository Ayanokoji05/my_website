import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, Trash2, Plus, Edit, LogOut } from 'lucide-react';
import { blogAPI, authAPI } from '../utils/api';
import SessionTimeout from '../components/SessionTimeout';

const Admin = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // ✅ ADD THIS AUTH CHECK
  useEffect(() => {
    verifyAuthentication();
  }, []);

  const verifyAuthentication = async () => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      await authAPI.verify();
      fetchBlogs(); // Load blogs if authenticated
    } catch (err) {
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: 'Pratush Kumar',
    published: true,
    tags: '',
  });
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogAPI.getAll();
      setBlogs(response.data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // ✅ UPDATE existing blog
        await blogAPI.update(editingId, formData);
        alert('✅ Blog post updated successfully!');
      } else {
        // CREATE new blog
        await blogAPI.create(formData);
        alert('✅ Blog post created successfully!');
      }
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        author: 'Pratush Kumar',
        published: true,
        tags: '',
      });
      setShowForm(false);
      setEditingId(null);
      fetchBlogs();
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Error saving blog post');
    }
  };

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      author: blog.author,
      published: blog.published,
      tags: blog.tags || '',
    });
    setEditingId(blog.id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    // Get the blog title for confirmation message
    const blog = blogs.find(b => b.id === id);
    const title = blog ? blog.title : 'this blog post';
    
    if (!window.confirm(`Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`)) {
        return;
    }
    
    try {
        await blogAPI.delete(id);
        alert('✅ Blog post deleted successfully!');
        fetchBlogs(); // Refresh the list
    } catch (err) {
        console.error('Error deleting blog post:', err);
        alert('❌ Error deleting blog post. Please try again.');
    }
  };

  const insertMarkdown = (syntax) => {
    const textarea = document.getElementById('content-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const selected = text.substring(start, end);

    let newText;
    let newCursorPos;

    switch (syntax) {
      case 'bold':
        newText = `${before}**${selected || 'bold text'}**${after}`;
        newCursorPos = start + 2;
        break;
      case 'italic':
        newText = `${before}_${selected || 'italic text'}_${after}`;
        newCursorPos = start + 1;
        break;
      case 'heading':
        newText = `${before}## ${selected || 'Heading'}${after}`;
        newCursorPos = start + 3;
        break;
      case 'link':
        newText = `${before}[${selected || 'link text'}](url)${after}`;
        newCursorPos = start + 1;
        break;
      case 'code':
        newText = `${before}\`\`\`python\n${selected || 'code here'}\n\`\`\`${after}`;
        newCursorPos = start + 10;
        break;
      case 'list':
        newText = `${before}\n- ${selected || 'list item'}\n- item 2${after}`;
        newCursorPos = start + 3;
        break;
      default:
        return;
    }

    setFormData({ ...formData, content: newText });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <>
      <SessionTimeout />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Blog Admin</h1>
              <p className="text-gray-600 mt-2">Manage your blog posts</p>
            </div>
            <div className="flex gap-4">
              {/* Navigation Links */}
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 text-gray-700 hover:text-primary-600 flex items-center gap-2"
              >
                ← Dashboard
              </button>
              <button
                onClick={() => navigate('/admin/research')}
                className="px-4 py-2 text-gray-700 hover:text-green-600"
              >
                Research
              </button>
              <button
                onClick={() => navigate('/admin/papers')}
                className="px-4 py-2 text-gray-700 hover:text-purple-600"
              >
                Publications
              </button>
              
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-700 hover:text-red-600 flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
              
              {/* New Post Button */}
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  if (showForm) {
                    setEditingId(null);
                    setFormData({
                      title: '',
                      content: '',
                      excerpt: '',
                      author: 'Pratush Kumar',
                      published: true,
                      tags: '',
                    });
                  }
                }}
                className="btn-primary flex items-center"
              >
                {showForm ? 'Cancel' : <><Plus className="w-5 h-5 mr-2" />New Post</>}
              </button>
            </div>
          </div>

          {/* Create/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter blog post title"
                    required
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt (Short Description)
                  </label>
                  <input
                    type="text"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Brief summary of your post"
                  />
                </div>

                {/* Markdown Toolbar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content (Markdown) *
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-100 rounded">
                    <button
                      type="button"
                      onClick={() => insertMarkdown('bold')}
                      className="px-3 py-1 bg-white border rounded hover:bg-gray-50 text-sm font-bold"
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('italic')}
                      className="px-3 py-1 bg-white border rounded hover:bg-gray-50 text-sm italic"
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('heading')}
                      className="px-3 py-1 bg-white border rounded hover:bg-gray-50 text-sm font-bold"
                      title="Heading"
                    >
                      H
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('link')}
                      className="px-3 py-1 bg-white border rounded hover:bg-gray-50 text-sm"
                      title="Link"
                    >
                      🔗
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('code')}
                      className="px-3 py-1 bg-white border rounded hover:bg-gray-50 text-sm font-mono"
                      title="Code Block"
                    >
                      {'</>'}
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('list')}
                      className="px-3 py-1 bg-white border rounded hover:bg-gray-50 text-sm"
                      title="List"
                    >
                      •
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode(!previewMode)}
                      className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm ml-auto flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {previewMode ? 'Edit' : 'Preview'}
                    </button>
                  </div>

                  {previewMode ? (
                    <div className="w-full min-h-[400px] px-4 py-3 border border-gray-300 rounded-lg bg-white prose max-w-none">
                      <div className="text-sm text-gray-500 mb-2">Preview:</div>
                      {formData.content || 'Nothing to preview yet...'}
                    </div>
                  ) : (
                    <textarea
                      id="content-textarea"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                      rows="15"
                      placeholder="Write your blog post in Markdown...

  ## Example Heading

  This is a paragraph with **bold** and _italic_ text.

  ### Code Example
  ```python
  def hello():
      print('Hello, World!')
  ```

  - List item 1
  - List item 2
  "
                      required
                    />
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    💡 Supports Markdown: **bold**, _italic_, ## headings, ```code```, links, lists
                  </p>
                </div>

                {/* Author and Tags Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="bioinformatics, python, machine-learning"
                    />
                  </div>
                </div>

                {/* Published Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData({ ...formData, published: e.target.checked })
                    }
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="published" className="ml-2 text-sm text-gray-700">
                    Publish immediately
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button type="submit" className="btn-primary flex items-center">
                    <Save className="w-5 h-5 mr-2" />
                    {editingId ? 'Update Post' : 'Create Post'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Existing Posts List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Existing Blog Posts ({blogs.length})
            </h2>

            {blogs.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">No blog posts yet. Create your first one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {blog.excerpt || blog.content.substring(0, 100) + '...'}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          <span>By {blog.author}</span>
                          <span>•</span>
                          <span>
                            {new Date(blog.created_at).toLocaleDateString()}
                          </span>
                          {blog.tags && (
                            <>
                              <span>•</span>
                              <span>{blog.tags}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => window.open(`/blog/${blog.id}`, '_blank')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(blog)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;