import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, Trash2, Plus, Edit, LogOut } from 'lucide-react';
import { papersAPI, authAPI } from '../utils/api';
import SessionTimeout from '../components/SessionTimeout';


const AdminPapers = () => {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    journal: '',
    year: new Date().getFullYear(),
    doi: '',
    pdf_url: '',
    abstract: '',
    citation: '',
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
      fetchPapers();
    } catch (err) {
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    }
  };

  const fetchPapers = async () => {
    try {
      const response = await papersAPI.getAll();
      setPapers(response.data);
    } catch (err) {
      console.error('Error fetching papers:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await papersAPI.update(editingId, formData);
        alert('✅ Publication updated successfully!');
      } else {
        await papersAPI.create(formData);
        alert('✅ Publication created successfully!');
      }
      
      resetForm();
      fetchPapers();
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Error saving publication');
    }
  };

  const handleEdit = (paper) => {
    setFormData({
      title: paper.title,
      authors: paper.authors,
      journal: paper.journal || '',
      year: paper.year || new Date().getFullYear(),
      doi: paper.doi || '',
      pdf_url: paper.pdf_url || '',
      abstract: paper.abstract || '',
      citation: paper.citation || '',
      order: paper.order,
    });
    setEditingId(paper.id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    const paper = papers.find(p => p.id === id);
    const title = paper ? paper.title : 'this publication';
    
    if (!window.confirm(`Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`)) {
      return;
    }
    
    try {
      await papersAPI.delete(id);
      alert('✅ Publication deleted successfully!');
      fetchPapers();
    } catch (err) {
      console.error('Error deleting publication:', err);
      alert('❌ Error deleting publication. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      authors: '',
      journal: '',
      year: new Date().getFullYear(),
      doi: '',
      pdf_url: '',
      abstract: '',
      citation: '',
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
              <h1 className="text-4xl font-bold text-gray-900">Publications Admin</h1>
              <p className="text-gray-600 mt-2">Manage academic publications</p>
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
                onClick={() => navigate('/admin/research')}
                className="px-4 py-2 text-gray-700 hover:text-green-600"
              >
                Research
              </button>
              
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-700 hover:text-red-600 flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
              
              {/* New Publication Button */}
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  if (showForm) resetForm();
                }}
                className="btn-primary flex items-center"
              >
                {showForm ? 'Cancel' : <><Plus className="w-5 h-5 mr-2" />New Publication</>}
              </button>
            </div>
          </div>

          {/* Create/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? 'Edit Publication' : 'Create New Publication'}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Full title of the publication"
                    required
                  />
                </div>

                {/* Authors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Authors *
                  </label>
                  <input
                    type="text"
                    value={formData.authors}
                    onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="John Doe, Jane Smith, et al."
                    required
                  />
                </div>

                {/* Journal & Year */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Journal / Conference
                    </label>
                    <input
                      type="text"
                      value={formData.journal}
                      onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Nature, Science, ISMB, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="1900"
                      max="2100"
                    />
                  </div>
                </div>

                {/* DOI & PDF URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DOI
                    </label>
                    <input
                      type="text"
                      value={formData.doi}
                      onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="10.1234/journal.2024.001"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Digital Object Identifier (without https://doi.org/)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PDF URL
                    </label>
                    <input
                      type="url"
                      value={formData.pdf_url}
                      onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://example.com/paper.pdf"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Link to full text PDF
                    </p>
                  </div>
                </div>

                {/* Abstract */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Abstract
                  </label>
                  <textarea
                    value={formData.abstract}
                    onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="5"
                    placeholder="Brief summary of the paper..."
                  />
                </div>

                {/* Citation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Citation (Formatted)
                  </label>
                  <textarea
                    value={formData.citation}
                    onChange={(e) => setFormData({ ...formData, citation: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                    rows="3"
                    placeholder="Doe, J., Smith, A., & Johnson, B. (2024). Title of the Paper. Journal of Something, 10(1), 1-15. https://doi.org/10.1234/journal.2024.001"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Pre-formatted citation in your preferred style (APA, MLA, Chicago, etc.)
                  </p>
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lower numbers appear first (0 = highest priority)
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4">
                  <button type="submit" className="btn-primary flex items-center">
                    <Save className="w-5 h-5 mr-2" />
                    {editingId ? 'Update Publication' : 'Create Publication'}
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

          {/* Existing Publications List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Existing Publications ({papers.length})
            </h2>

            {papers.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">No publications yet. Add your first one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {papers.map((paper) => (
                  <div 
                    key={paper.id} 
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {paper.title}
                        </h3>

                        {/* Authors */}
                        <p className="text-gray-700 mb-2">
                          {paper.authors}
                        </p>

                        {/* Journal & Year */}
                        <p className="text-gray-600 italic mb-2">
                          {paper.journal && <span>{paper.journal}, </span>}
                          {paper.year}
                        </p>

                        {/* Abstract Preview */}
                        {paper.abstract && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {paper.abstract}
                          </p>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                          {paper.doi && (
                            <span className="flex items-center">
                              <strong className="mr-1">DOI:</strong> {paper.doi}
                            </span>
                          )}
                          {paper.pdf_url && (
                            <span>• PDF Available</span>
                          )}
                          {paper.order !== undefined && (
                            <span>• Order: {paper.order}</span>
                          )}
                        </div>

                        {/* Citation Preview */}
                        {paper.citation && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-xs text-primary-600 hover:text-primary-700">
                              Show Citation
                            </summary>
                            <p className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono text-gray-700">
                              {paper.citation}
                            </p>
                          </details>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => window.open(`/papers`, '_blank')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View on Publications Page"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(paper)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Edit Publication"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(paper.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Publication"
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

export default AdminPapers;