import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { blogAPI } from '../utils/api';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getById(id);
      setBlog(response.data);
    } catch (err) {
      setError('Failed to load blog post');
      console.error('Error:', err);
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

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Blog post not found'}</p>
          <Link to="/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        {/* Blog Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(blog.created_at)}
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {blog.author}
            </div>
          </div>

          {/* Tags */}
          {blog.tags && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.split(',').map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Blog Content with Markdown */}
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
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
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Back to Blog Button */}
        <div className="mt-8 text-center">
          <Link to="/blog" className="btn-primary">
            ← Back to All Posts
          </Link>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;