import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ExternalLink, ArrowLeft, Code, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { researchAPI } from '../utils/api';

const ResearchDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await researchAPI.getById(id);
      setProject(response.data);
    } catch (err) {
      setError('Failed to load research project');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Research project not found'}</p>
          <Link to="/research" className="btn-primary">
            Back to Research
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/research"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Research
        </Link>

        {/* Project Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              project.status === 'Completed' ? 'bg-green-100 text-green-800' :
              project.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {project.status}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {project.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
            {project.start_date && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {project.start_date} {project.end_date && `- ${project.end_date}`}
              </div>
            )}
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Project
              </a>
            )}
          </div>

          {/* Technologies */}
          {project.technologies && (
            <div className="flex items-start gap-2 mb-6">
              <Code className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
              <div className="flex flex-wrap gap-2">
                {project.technologies.split(',').map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full font-medium"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Project Image */}
        {project.image_url && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Project Description */}
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Overview</h2>
          
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom code block styling
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                // Style links
                a: ({ node, ...props }) => (
                  <a
                    className="text-primary-600 hover:text-primary-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                // Style headings
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-bold mt-4 mb-2" {...props} />
                ),
                // Style blockquotes
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-primary-500 pl-4 italic my-4 text-gray-700"
                    {...props}
                  />
                ),
                // Style lists
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside my-4 space-y-2" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside my-4 space-y-2" {...props} />
                ),
                // Style images
                img: ({ node, ...props }) => (
                  <img className="rounded-lg shadow-md my-6" {...props} />
                ),
                // Style paragraphs
                p: ({ node, ...props }) => (
                  <p className="mb-4 leading-relaxed text-gray-700" {...props} />
                ),
              }}
            >
              {project.description}
            </ReactMarkdown>
          </div>

          {/* Project Link */}
          {project.project_url && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full Project
              </a>
            </div>
          )}
        </div>

        {/* Back to Research Button */}
        <div className="mt-8 text-center">
          <Link to="/research" className="btn-primary">
            ← Back to All Projects
          </Link>
        </div>
      </article>
    </div>
  );
};

export default ResearchDetail;