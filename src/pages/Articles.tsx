import { Link } from 'react-router-dom'
import articlesData from '../articles.json'
import contentData from '../content.json'
import { type Article } from '../types/content'
import './Articles.css'

const Articles = () => {
  const content = contentData.articles
  
  const sortArticles = (items: Article[]) => items.sort((a, b) => {
    // Featured items come first
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1
    }
    // Then sort by last_updated (most recent first)
    return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
  })

  const allArticles = articlesData as Article[]
  const activeArticles = sortArticles(allArticles.filter((article) => !article.archived))
  const archivedArticles = sortArticles(allArticles.filter((article) => article.archived))

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
        {activeArticles.map((article, index) => (
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

      {archivedArticles.length > 0 && (
        <section className="archived-section">
          <h3 className="archived-heading">ARCHIVED</h3>
          <div className="articles-grid archived-grid">
            {archivedArticles.map((article, index) => (
              <div key={`archived-${index}`} className="article-card">
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
      )}
    </section>
  )
}

export default Articles
