import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { MarkdownRenderer } from './MarkdownRenderer'
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
  
  // Extract the filename from the path
  const filename = location.pathname.replace('/articles/', '')
  
  const article = (articlesData as Article[]).find(
    a => a.link.type === 'internal' && a.link.url === filename
  )

  useEffect(() => {
    if (article && article.link.type === 'internal') {
      const baseUrl = import.meta.env.BASE_URL || '/'
      // Just set the URL, the MarkdownRenderer will fetch it
      setMdUrl(`${baseUrl}${article.link.url}`)
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
      <div className="article-header">
        <Link to="/articles" className="back-link">{textContent.backLinkText}</Link>
        <h1 className="article-title">{article.name}</h1>
      </div>

      <div className="article-content-wrapper">
        <div className="article-content" ref={contentRef}>
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
