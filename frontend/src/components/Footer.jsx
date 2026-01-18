import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com/Ayanokoji05', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/pratush-kumar-pusti-68992b2b9', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/yourusername', label: 'Twitter' },
    { icon: Mail, href: 'mailto:your.email@example.com', label: 'Email' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-gray-400 text-sm">
              Academic researcher passionate about bioinformatics. Sharing insights through research, publications, and blog posts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/research" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Research Projects
                </a>
              </li>
              <li>
                <a href="/papers" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Publications
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Pratush Kumar Pusti. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;