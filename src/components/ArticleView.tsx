import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css'
import articlesData from '../articles.json'
import contentData from '../content.json'
import { type Article } from '../types/content'
import './ArticleView.css'

const ArticleView = () => {
  const location = useLocation()
  const [content, setContent] = useState<string>('')
  const [activeSection, setActiveSection] = useState<string>('')
  const contentRef = useRef<HTMLDivElement>(null)
  const textContent = contentData.articleView
  
  // Extract the filename from the path
  const filename = location.pathname.replace('/articles/', '')
  
  const article = (articlesData as Article[]).find(
    a => a.link.type === 'internal' && a.link.url === filename
  )

  useEffect(() => {
    if (article && article.link.type === 'internal') {
      const baseUrl = import.meta.env.BASE_URL || '/'
      fetch(`${baseUrl}${article.link.url}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.text()
        })
        .then(text => setContent(text))
        .catch(err => console.error('Error loading content:', err))
    }
  }, [article])

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

  if (!article) {
    return (
      <div className="article-view">
        <div className="not-found">
          <h1>{textContent.notFoundHeading}</h1>
          <Link to="/articles" className="back-link">{textContent.backLinkText}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="article-view">
      <div className="article-header">
        <Link to="/articles" className="back-link">{textContent.backLinkText}</Link>
        <h1 className="article-title">{article.name}</h1>
      </div>

      <div className="article-content-wrapper">
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

        <div className="article-content" ref={contentRef}>
          {content ? (
            <div className="latex-content">
              <Latex>{processContent(content)}</Latex>
            </div>
          ) : (
            <p className="loading">Loading content...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArticleView
