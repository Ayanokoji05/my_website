import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { researchAPI } from '../utils/api';

const Research = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await researchAPI.getAll();
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load research projects. Please try again later.');
      console.error('Error fetching research projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
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
          <button onClick={fetchProjects} className="btn-primary">
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Research Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore my current and past research projects in bioinformatics and computational biology
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No research projects available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="card group flex flex-col h-full">
                {/* Project Image */}
                {project.image_url && (
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Project Status Badge */}
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 self-start ${
                  project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>

                {/* Project Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {project.title}
                </h3>

                {/* Project Description - Truncated */}
                <p className="text-gray-600 mb-4 flex-grow">
                  {truncateText(project.description, 150)}
                </p>

                {/* Technologies */}
                {project.technologies && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.technologies.split(',').slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                    {project.technologies.split(',').length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{project.technologies.split(',').length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Project Duration */}
                {project.start_date && (
                  <p className="text-sm text-gray-500 mb-4">
                    {project.start_date} {project.end_date && `- ${project.end_date}`}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <Link
                    to={`/research/${project.id}`}
                    className="flex items-center justify-center text-primary-600 hover:text-primary-700 font-medium text-sm border border-primary-600 hover:border-primary-700 rounded-lg px-4 py-2 transition-colors"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                  
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center text-gray-600 hover:text-gray-800 font-medium text-sm border border-gray-300 hover:border-gray-400 rounded-lg px-4 py-2 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Project
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Research;