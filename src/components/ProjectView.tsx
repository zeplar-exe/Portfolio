import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css'
import projectsData from '../projects.json'
import contentData from '../content.json'
import { type Project } from '../types/content'
import './ProjectView.css'

const ProjectView = () => {
  const location = useLocation()
  const [content, setContent] = useState<string>('')
  const [activeSection, setActiveSection] = useState<string>('')
  const contentRef = useRef<HTMLDivElement>(null)
  const textContent = contentData.projectView
  
  // Extract the filename from the path
  const filename = location.pathname.replace('/projects/', '')
  
  const project = (projectsData as Project[]).find(
    p => p.link.type === 'internal' && p.link.url === filename
  )

  useEffect(() => {
    if (project && project.link.type === 'internal') {
      const baseUrl = import.meta.env.BASE_URL || '/'
      fetch(`${baseUrl}${project.link.url}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.text()
        })
        .then(text => setContent(text))
        .catch(err => console.error('Error loading content:', err))
    }
  }, [project])

  // Extract headers from LaTeX content for TOC
  const extractHeaders = (text: string) => {
    const headers: { level: number; title: string; id: string }[] = []
    const sectionRegex = /\\(section|subsection|subsubsection)\{([^}]+)\}/g
    let match
    let index = 0

    while ((match = sectionRegex.exec(text)) !== null) {
      const level = match[1] === 'section' ? 1 : match[1] === 'subsection' ? 2 : 3
      const title = match[2]
      const id = `section-${index++}`
      headers.push({ level, title, id })
    }

    return headers
  }

  const headers = extractHeaders(content)

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100
      
      for (let i = headers.length - 1; i >= 0; i--) {
        const element = document.getElementById(headers[i].id)
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(headers[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headers])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Process content to add IDs to sections
  const processContent = (text: string) => {
    let index = 0
    return text.replace(
      /\\(section|subsection|subsubsection)\{([^}]+)\}/g,
      (match) => {
        const id = `section-${index++}`
        return `<div id="${id}">${match}</div>`
      }
    )
  }

  if (!project) {
    return (
      <div className="project-view">
        <div className="not-found">
          <h1>{textContent.notFoundHeading}</h1>
          <Link to="/projects" className="back-link">{textContent.backLinkText}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="project-view">
      <div className="project-header">
        <Link to="/projects" className="back-link">{textContent.backLinkText}</Link>
        {project.hosts.github && (
          <a 
            href={project.hosts.github} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="github-link-header"
          >
            <svg className="github-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            {textContent.githubButtonText}
          </a>
        )}
        <h1 className="project-title">{project.name}</h1>
      </div>

      <div className="project-content-wrapper">
        {headers.length > 0 && (
          <aside className="toc">
            <h3 className="toc-title">{textContent.tocHeading}</h3>
            <nav className="toc-nav">
              {headers.map((header) => (
                <button
                  key={header.id}
                  data-section={header.id}
                  className={`toc-item toc-level-${header.level} ${
                    activeSection === header.id ? 'active' : ''
                  }`}
                  onClick={() => scrollToSection(header.id)}
                >
                  {header.title}
                </button>
              ))}
            </nav>
          </aside>
        )}

        <div className="project-content" ref={contentRef}>
          {content ? (
            <div className="latex-content">
              <Latex>{processContent(content)}</Latex>
            </div>
          ) : (
            <p className="loading">Loading content...</p>
          )}

          {project.gallery && project.gallery.length > 0 && (
            <div className="gallery">
              <h2 className="gallery-title">Gallery</h2>
              <div className="gallery-grid">
                {project.gallery.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${project.name} screenshot ${index + 1}`}
                    className="gallery-image"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectView
