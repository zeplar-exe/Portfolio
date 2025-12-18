import { Link } from 'react-router-dom'
import projectsData from '../projects.json'
import articlesData from '../articles.json'
import { type Project, type Article } from '../types/content'
import './Summary.css'

const Summary = () => {
  const projects = projectsData as Project[]
  const articles = articlesData as Article[]
  
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3)
  const featuredArticles = articles.filter(a => a.featured).slice(0, 3)

  const getProjectLink = (project: Project) => {
    if (project.link.type === 'external') {
      return project.link.url
    }
    return `/projects/${project.link.url}`
  }

  const getArticleLink = (article: Article) => {
    if (article.link.type === 'external') {
      return article.link.url
    }
    return `/articles/${article.link.url}`
  }

  return (
    <section id="summary" className="summary-page">
      <div className="summary-container">
        <img 
          src="/profile.jpg" 
          alt="Profile" 
          className="summary-image"
        />
        <h1 className="summary-blurb">Welcome to My Portfolio</h1>
        <p className="summary-subtext">
          I'm a passionate developer with expertise in creating modern web applications. 
          My focus is on building intuitive, performant, and accessible user experiences 
          using the latest technologies. Through my work, I strive to solve real-world 
          problems and deliver solutions that make a difference.
        </p>
      </div>

      {/* Featured Projects Section */}
      <div className="featured-section">
        <h2 className="featured-heading">Featured Projects</h2>
        <div className="featured-grid">
          {featuredProjects.map((project, index) => (
            <div key={index} className="featured-card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              {project.link.type === 'external' ? (
                <a 
                  href={project.link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="featured-link"
                >
                  Learn More →
                </a>
              ) : (
                <Link to={getProjectLink(project)} className="featured-link">
                  Learn More →
                </Link>
              )}
            </div>
          ))}
        </div>
        <Link to="/projects" className="view-all-link">View All Projects →</Link>
      </div>

      {/* Featured Articles Section */}
      <div className="featured-section">
        <h2 className="featured-heading">Featured Articles</h2>
        <div className="featured-grid">
          {featuredArticles.map((article, index) => (
            <div key={index} className="featured-card">
              <h3>{article.name}</h3>
              <p>{article.description}</p>
              {article.link.type === 'external' ? (
                <a 
                  href={article.link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="featured-link"
                >
                  Read More →
                </a>
              ) : (
                <Link to={getArticleLink(article)} className="featured-link">
                  Read More →
                </Link>
              )}
            </div>
          ))}
        </div>
        <Link to="/articles" className="view-all-link">View All Articles →</Link>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <h2 className="contact-heading">Get In Touch</h2>
        <p className="contact-description">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>
        <div className="contact-location">
          <svg className="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span className="location-text">Based in San Diego, CA</span>
        </div>
        <div className="contact-methods">
          <a href="mailto:baker.zanderh@gmail.com" className="contact-button">
            <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Email Me
          </a>
          <a href="https://github.com/zeplar-exe" target="_blank" rel="noopener noreferrer" className="contact-button">
            <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
          <a href="https://linkedin.com/in/zandebak" target="_blank" rel="noopener noreferrer" className="contact-button">
            <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}

export default Summary
