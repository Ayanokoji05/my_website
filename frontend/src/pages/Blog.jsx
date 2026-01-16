import { useState, useEffect } from 'react';
import { Calendar, User, Tag } from 'lucide-react';
import { blogAPI } from '../utils/api';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getAll();
      setBlogs(response.data);
    } catch (err) {
      setError('Failed to load blog posts. Please try again later.');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchBlogs} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Thoughts, insights, and updates from my research journey
          </p>
        </div>

        {/* Blog Posts */}
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No blog posts available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article key={blog.id} className="card group cursor-pointer hover:shadow-xl">
                {/* Blog Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {blog.title}
                </h2>

                {/* Meta Information */}
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(blog.created_at)}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {blog.author}
                  </div>
                </div>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.excerpt || blog.content.substring(0, 150) + '...'}
                </p>

                {/* Tags */}
                {blog.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="flex items-center px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Read More Link */}
                <a
                  href={`/blog/${blog.id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center"
                >
                  Read more →
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;