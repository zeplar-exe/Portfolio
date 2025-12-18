import { useEffect, useState } from 'react'
import { marked } from 'marked'

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true,
})

export const useMarkdownRenderer = (mdUrl: string) => {
  const [html, setHtml] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true)
        setError('')

        // Fetch the markdown file
        const response = await fetch(mdUrl)
        if (!response.ok) {
          throw new Error(`Failed to load markdown: ${response.statusText}`)
        }
        
        const markdown = await response.text()
        
        // Convert to HTML
        const htmlContent = await marked.parse(markdown)
        setHtml(htmlContent)
      } catch (err) {
        console.error('Markdown loading error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (mdUrl) {
      loadMarkdown()
    }
  }, [mdUrl])

  return { html, error, loading }
}

interface MarkdownRendererProps {
  mdUrl: string
  className?: string
}

export const MarkdownRenderer = ({ mdUrl, className = '' }: MarkdownRendererProps) => {
  const { html, error, loading } = useMarkdownRenderer(mdUrl)

  if (loading) {
    return <div className={`markdown-loading ${className}`}>Loading content...</div>
  }

  if (error) {
    return (
      <div className={`markdown-error ${className}`}>
        <p>Error rendering content:</p>
        <pre>{error}</pre>
      </div>
    )
  }

  return (
    <div 
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
