import { Download, Award, Briefcase, GraduationCap } from 'lucide-react';

const About = () => {
  const skills = [
    { category: 'Programming', items: ['Python', 'R', 'SQL'] },
    { category: 'Data Analysis', items: ['Pandas', 'NumPy', 'Matplotlib'] },
    { category: 'Bioinformatics', items: ['BioPython', 'Genomics', 'RNA-Seq', 'BLAST'] },
    { category: 'Tools', items: ['Git', 'Linux', 'Jupyter'] },
  ];

  const education = [
    {
      degree: 'Int. M.Sc. in Life Sciences',
      institution: 'NISER, Bhubaneswar',
      year: '2023 - present',
      scholarship: 'DISHA Fellowship',
      description: 'Coursework: Molecular Biology, Genetics, Biochemistry, Animal Physiology, Microbiology, Plant Physiology, Cell Biology, Ecology, Evolutionary Biology',
    },
    {
      degree: 'Senior Secondary Schooling',
      institution: 'Air Force School, Hindan',
      year: '2021 - 2023',
      description: 'Coursework: PCB (Physics, Chemistry, Biology)',
    },
  ];

  const experience = [
    {
      position: 'Summer Intern',
      organization: 'IISER Bhopal',
      period: 'May 2024 - July 2024',
      description: 'Built scalable bioinformatics pipelines for large-scale CDS retrieval (~500 species), alignment (GUIDANCE2), phylogenetic analysis, and automated LaTeX reporting using Bash, R, and Biopython.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Me</h1>
          <p className="text-xl text-primary-100">
            Researcher, Aspiring Data Scientist, and Lifelong Learner
          </p>
        </div>
      </section>

      {/* Biography */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Biography</h2>
            <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
              <p>
                I'm a passionate researcher specializing in life sciences and computational biology. 
                I'm currently pursuing my Master's in Life Sciences at NISER, Bhubaneswar, India.
              </p>
              <p>
                With a strong background in both biology and computer science, I bridge the gap 
                between wet lab experiments and computational analysis. I aspire to uncover 
                novel insights from large-scale genomic and proteomic datasets.
              </p>
              <p>
                When I'm not analyzing data or writing code, you can find me reading scientific 
                papers or attending conferences.
              </p>
            </div>

            {/* CV Download Button */}
            <div className="mt-8">
              <a
                href="/assets/pratush_cv-2.pdf"
                download
                className="btn-primary inline-flex items-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download CV
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <GraduationCap className="w-8 h-8 text-primary-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Education</h2>
          </div>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{edu.degree}</h3>
                <p className="text-primary-600 font-semibold mb-2">{edu.institution}</p>
                <p className="text-gray-500 text-sm mb-3">{edu.year}</p>
                <p className="text-gray-600">{edu.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Briefcase className="w-8 h-8 text-primary-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Experience</h2>
          </div>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{exp.position}</h3>
                <p className="text-primary-600 font-semibold mb-2">{exp.organization}</p>
                <p className="text-gray-500 text-sm mb-3">{exp.period}</p>
                <p className="text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Award className="w-8 h-8 text-primary-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Skills & Expertise</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skillGroup, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {skillGroup.category}
                </h3>
                <ul className="space-y-2">
                  {skillGroup.items.map((skill, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;