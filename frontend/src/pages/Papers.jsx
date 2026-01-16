import { useState, useEffect } from 'react';
import { ExternalLink, FileText, Download } from 'lucide-react';
import { papersAPI } from '../utils/api';

const Papers = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const response = await papersAPI.getAll();
      setPublications(response.data);
    } catch (err) {
      setError('Failed to load publications. Please try again later.');
      console.error('Error fetching publications:', err);
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchPublications} className="btn-primary">
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
            Publications
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Peer-reviewed publications and academic papers
          </p>
        </div>

        {/* Publications List */}
        {publications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              No publications available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {publications.map((paper) => (
              <div key={paper.id} className="card">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {paper.title}
                    </h3>

                    {/* Authors */}
                    <p className="text-gray-700 mb-2">{paper.authors}</p>

                    {/* Journal and Year */}
                    <p className="text-gray-600 italic mb-3">
                      {paper.journal && <span>{paper.journal}, </span>}
                      {paper.year && <span>{paper.year}</span>}
                    </p>

                    {/* Abstract */}
                    {paper.abstract && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {paper.abstract}
                      </p>
                    )}

                    {/* Citation */}
                    {paper.citation && (
                      <details className="mb-4">
                        <summary className="cursor-pointer text-primary-600 font-medium text-sm">
                          Show Citation
                        </summary>
                        <p className="mt-2 p-3 bg-gray-50 rounded text-sm font-mono text-gray-700">
                          {paper.citation}
                        </p>
                      </details>
                    )}

                    {/* Links */}
                    <div className="flex flex-wrap gap-3">
                      {paper.doi && (
                        <a
                          href={`https://doi.org/${paper.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          DOI
                        </a>
                      )}
                      {paper.pdf_url && (
                        <a
                          href={paper.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Year Badge (for larger screens) */}
                  {paper.year && (
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <span className="inline-block px-4 py-2 bg-primary-100 text-primary-800 rounded-lg font-bold text-lg">
                        {paper.year}
                      </span>
                    </div>
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

export default Papers;