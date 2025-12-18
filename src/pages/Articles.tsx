import { Link } from 'react-router-dom'
import articlesData from '../articles.json'
import { type Article } from '../types/content'
import './Articles.css'

const Articles = () => {
  const articles = articlesData as Article[]

  const getArticleLink = (article: Article) => {
    if (article.link.type === 'external') {
      return article.link.url
    }
    return `/articles/${article.link.url}`
  }

  return (
    <section id="articles" className="articles-page">
      <h2 className="articles-heading">Articles</h2>
      <p className="articles-description">
        Read my thoughts on technology, development, and industry insights.
      </p>
      
      <div className="articles-grid">
        {articles.map((article, index) => (
          <div key={index} className="article-card">
            <div className="article-header">
              <h3 className="article-title">{article.name}</h3>
              {article.featured && <span className="featured-badge">Featured</span>}
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
                  Read Article →
                </a>
              ) : (
                <Link to={getArticleLink(article)} className="article-link">
                  Read Article →
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
