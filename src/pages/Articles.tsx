import { Link } from 'react-router-dom'
import articlesData from '../articles.json'
import contentData from '../content.json'
import { type Article } from '../types/content'
import './Articles.css'

const Articles = () => {
  const content = contentData.articles
  
  // Sort articles: featured first, then by last_updated (most recent first)
  const articles = (articlesData as Article[]).sort((a, b) => {
    // Featured items come first
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1
    }
    // Then sort by last_updated (most recent first)
    return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
  })

  const getArticleLink = (article: Article) => {
    if (article.link.type === 'external') {
      return article.link.url
    }
    return `/articles/${article.link.url}`
  }

  return (
    <section id="articles" className="articles-page">
      <h2 className="articles-heading">{content.heading}</h2>
      <p className="articles-description">
        {content.description}
      </p>
      
      <div className="articles-grid">
        {articles.map((article, index) => (
          <div key={index} className="article-card">
            <div className="article-header">
              <h3 className="article-title">{article.name}</h3>
              {article.featured && <span className="featured-badge">{content.featuredBadgeText}</span>}
            </div>
            <p className="article-description">{article.description}</p>
            
            <div className="article-links">
              {article.link.type === 'external' ? (
                <a 
                  href={article.link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="article-link"
                >
                  {content.readArticleText}
                </a>
              ) : (
                <Link to={getArticleLink(article)} className="article-link">
                  {content.readArticleText}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Articles
