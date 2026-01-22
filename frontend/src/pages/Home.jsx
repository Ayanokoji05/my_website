import { ArrowRight, Award, BookOpen, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const highlights = [
    {
      icon: Code,
      title: 'Research Projects',
      description: 'Active research in Life sciences',
      link: '/research',
    },
    {
      icon: BookOpen,
      title: 'Publications',
      description: 'Peer-reviewed papers in top-tier journals',
      link: '/papers',
    },
    {
      icon: Award,
      title: 'Achievements',
      description: 'Awards and recognition in the scientific community',
      link: '/about',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Hi, I'm <span className="text-primary-200">Pratush Kumar Pusti</span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 mb-8">
                Researcher | Academic
              </p>
              <p className="text-lg text-primary-50 mb-8 leading-relaxed">
                I'm proficient in wet lab techniques in the field of Molecular biology, Genetics, Cell Biology and Immunology.
                I also have strong computational skills in Data Science and Bioinformatics enabling me to analyze complex biological data and derive meaningful insights.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/research" className="btn-primary bg-white text-primary-600 hover:bg-primary-50">
                  View Research
                </Link>
                <Link to="/contact" className="btn-secondary bg-primary-700 hover:bg-primary-600 text-white">
                  Get in Touch
                </Link>
              </div>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 p-2">
                  <img
                    src="WhatsApp Image 2026-01-22 at 12.23.23.jpeg"
                    alt="Pratush Kumar Pusti"
                    className="w-full h-full rounded-full object-cover border-4 border-white"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-400 rounded-full opacity-50 blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-300 rounded-full opacity-50 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What I Do
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Interested in molecular systems biology and immunology. With a growing passion for data science and neurology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="card group hover:scale-105 transition-transform duration-200"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors">
                    <item.icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <span className="text-primary-600 font-medium flex items-center group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Interested in Collaboration?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            I'm always open to discussing research opportunities, collaborations, or speaking engagements.
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center">
            Contact Me <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;