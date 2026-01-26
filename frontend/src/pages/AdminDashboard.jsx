import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  FlaskConical, 
  FileText, 
  LogOut, 
  User,
  Shield,
  Activity,
  Calendar
} from 'lucide-react';
import { authAPI, blogAPI, researchAPI, papersAPI } from '../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    blogs: 0,
    research: 0,
    papers: 0,
  });
  const [username, setUsername] = useState('');

  useEffect(() => {
    verifyAuthentication();
    fetchStats();
  }, []);

  const verifyAuthentication = async () => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const response = await authAPI.verify();
      setUsername(response.data.username);
    } catch (err) {
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    }
  };

  const fetchStats = async () => {
    try {
      const [blogsRes, researchRes, papersRes] = await Promise.all([
        blogAPI.getAll(0, 100),
        researchAPI.getAll(),
        papersAPI.getAll(),
      ]);
      
      setStats({
        blogs: blogsRes.data.length,
        research: researchRes.data.length,
        papers: papersRes.data.length,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    }
  };

  const adminSections = [
    {
      title: 'Blog Posts',
      icon: BookOpen,
      count: stats.blogs,
      color: 'blue',
      path: '/admin/blogs',
      description: 'Manage blog posts and articles',
    },
    {
      title: 'Research Projects',
      icon: FlaskConical,
      count: stats.research,
      color: 'green',
      path: '/admin/research',
      description: 'Manage research projects and work',
    },
    {
      title: 'Publications',
      icon: FileText,
      count: stats.papers,
      color: 'purple',
      path: '/admin/papers',
      description: 'Manage academic papers and publications',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your portfolio content</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-5 h-5" />
                <span className="font-medium">{username || 'Admin'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {adminSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.path}
                onClick={() => navigate(section.path)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${getColorClasses(section.color)}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">
                    {section.count}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {section.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {section.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/blogs')}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
            >
              <BookOpen className="w-5 h-5 text-primary-600" />
              <span className="font-medium">Manage Blogs</span>
            </button>
            
            <button
              onClick={() => navigate('/admin/research')}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
            >
              <FlaskConical className="w-5 h-5 text-green-600" />
              <span className="font-medium">Manage Research</span>
            </button>
            
            <button
              onClick={() => navigate('/admin/papers')}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
            >
              <FileText className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Manage Publications</span>
            </button>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Security Information
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your session will expire after 24 hours of inactivity</li>
                <li>• All admin actions are authenticated with JWT tokens</li>
                <li>• Always logout when finished to keep your account secure</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Last Login Info */}
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Session active</span>
          <span>•</span>
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;