import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, Trash2, Plus, Edit, LogOut } from 'lucide-react';
import { researchAPI, authAPI } from '../utils/api';
import SessionTimeout from '../components/SessionTimeout';

const AdminResearch = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    project_url: '',
    technologies: '',
    status: 'Completed',
    start_date: '',
    end_date: '',
    order: 0,
  });

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
      fetchProjects();
    } catch (err) {
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await researchAPI.getAll();
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await researchAPI.update(editingId, formData);
        alert('✅ Research project updated successfully!');
      } else {
        await researchAPI.create(formData);
        alert('✅ Research project created successfully!');
      }
      
      resetForm();
      fetchProjects();
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Error saving research project');
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url || '',
      project_url: project.project_url || '',
      technologies: project.technologies || '',
      status: project.status,
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      order: project.order,
    });
    setEditingId(project.id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    const project = projects.find(p => p.id === id);
    const title = project ? project.title : 'this project';
    
    if (!window.confirm(`Delete "${title}"?\n\nThis cannot be undone.`)) {
      return;
    }
    
    try {
      await researchAPI.delete(id);
      alert('✅ Research project deleted successfully!');
      fetchProjects();
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Error deleting project');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      project_url: '',
      technologies: '',
      status: 'Completed',
      start_date: '',
      end_date: '',
      order: 0,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <>
      <SessionTimeout />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Research Admin</h1>
              <p className="text-gray-600 mt-2">Manage research projects</p>
            </div>
            <div className="flex gap-4">
              {/* Navigation Links */}
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 text-gray-700 hover:text-primary-600"
              >
                ← Dashboard
              </button>
              <button
                onClick={() => navigate('/admin/blogs')}
                className="px-4 py-2 text-gray-700 hover:text-blue-600"
              >
                Blogs
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
              
              {/* New Project Button */}
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  if (showForm) resetForm();
                }}
                className="btn-primary flex items-center"
              >
                {showForm ? 'Cancel' : <><Plus className="w-5 h-5 mr-2" />New Project</>}
              </button>
            </div>
          </div>

          {/* Create/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? 'Edit Research Project' : 'Create New Research Project'}
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
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description * (Supports Markdown)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    rows="8"
                    placeholder="Write your project description in Markdown...

## Key Features
- Feature 1
- Feature 2

### Technologies Used
This project uses **Python**, _TensorFlow_, and more..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Supports Markdown: **bold**, _italic_, ## headings, ```code```, links, lists
                  </p>
                </div>

                {/* Image URL & Project URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project URL (GitHub, etc.)
                    </label>
                    <input
                      type="url"
                      value={formData.project_url}
                      onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technologies (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Python, TensorFlow, Docker"
                  />
                </div>

                {/* Status, Dates, Order */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Completed">Completed</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Planned">Planned</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Jan 2023"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="text"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Dec 2023"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <button type="submit" className="btn-primary flex items-center">
                    <Save className="w-5 h-5 mr-2" />
                    {editingId ? 'Update Project' : 'Create Project'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Existing Projects */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Research Projects ({projects.length})
            </h2>

            {projects.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">No research projects yet. Create your first one!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    {project.image_url && (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-40 object-cover rounded mb-4"
                      />
                    )}
                    
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 flex-1">
                        {project.title}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    
                    {project.technologies && (
                      <p className="text-xs text-gray-500 mb-3">
                        <strong>Tech:</strong> {project.technologies}
                      </p>
                    )}
                    
                    {project.start_date && (
                      <p className="text-xs text-gray-500 mb-4">
                        {project.start_date} {project.end_date && `- ${project.end_date}`}
                      </p>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(`/research/${project.id}`, '_blank')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="View Detail Page"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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

export default AdminResearch;