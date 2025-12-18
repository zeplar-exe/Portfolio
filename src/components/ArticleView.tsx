import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { MarkdownRenderer } from './MarkdownRenderer'
import { TableOfContents } from './TableOfContents'
import { useTableOfContents } from '../hooks/useTableOfContents'
import './MarkdownRenderer.css'
import articlesData from '../articles.json'
import contentData from '../content.json'
import { type Article } from '../types/content'
import './ArticleView.css'

const ArticleView = () => {
  const location = useLocation()
  const [mdUrl, setMdUrl] = useState<string>('')
  const contentRef = useRef<HTMLDivElement>(null)
  const textContent = contentData.articleView
  const { headers, activeSection, scrollToSection } = useTableOfContents(mdUrl)
  
  // Extract the filename from the path
  const filename = location.pathname.replace('/articles/', '')
  
  const article = (articlesData as Article[]).find(
    a => a.link.type === 'internal' && a.link.url === filename
  )

  useEffect(() => {
    if (article && article.link.type === 'internal') {
      const baseUrl = import.meta.env.BASE_URL || '/'
      const url = `${baseUrl}${article.link.url}`
      setMdUrl(url)
    }
  }, [article])

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
      <div className="article-view-header">
        <Link to="/articles" className="back-link">{textContent.backLinkText}</Link>
        <h1 className="article-view-title">{article.name}</h1>
      </div>

      <div className="article-view-content-wrapper">
        <TableOfContents 
          headers={headers} 
          activeSection={activeSection} 
          onNavigate={scrollToSection} 
        />
        
        <div className="article-view-content" ref={contentRef}>
          {mdUrl ? (
            <div className="markdown-content-wrapper">
              <MarkdownRenderer mdUrl={mdUrl} />
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
