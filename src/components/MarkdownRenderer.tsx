import { useEffect, useState, useRef } from 'react'
import { Marked } from 'marked'
import markedKatex from 'marked-katex-extension'
import 'katex/dist/katex.min.css'

// Create custom renderer to add IDs to headers and handle footnotes
let headerIndex = 0

const renderer = {
  heading({ text, depth }: { text: string; depth: number }) {
    const id = `header-${headerIndex++}`
    return `<h${depth} id="${id}">${text}</h${depth}>\n`
  }
}

const marked = new Marked({
  breaks: true,
  gfm: true,
})

// Add KaTeX extension for math rendering
marked.use(markedKatex({
  throwOnError: false,
  output: 'html'
}))

marked.use({ renderer })

// Process footnotes manually - must happen AFTER markdown conversion
function processFootnotes(html: string, markdown: string): string {
  const footnoteRefs: { [key: string]: string } = {}
  const footnoteOrder: string[] = []
  
  // Extract footnote definitions [^1] content or [^1]: content from original markdown
  // Match pattern: [^ref] or [^ref]: followed by content until next blank line or next footnote
  const footnoteDefRegex = /^\[\^(\w+)\]:?\s*(.+?)(?=\n\n|\n\[\^|\n###|\n$|$)/gms
  let match
  
  while ((match = footnoteDefRegex.exec(markdown)) !== null) {
    const ref = match[1]
    const content = match[2].trim()
    footnoteRefs[ref] = content
    if (!footnoteOrder.includes(ref)) {
      footnoteOrder.push(ref)
    }
  }
  
  console.log('Footnote refs found:', footnoteRefs)
  console.log('Footnote order:', footnoteOrder)
  
  // Find all footnote references in the original markdown and track order
  const refRegex = /\[\^(\w+)\]/g
  while ((match = refRegex.exec(markdown)) !== null) {
    const ref = match[1]
    if (!footnoteOrder.includes(ref)) {
      footnoteOrder.push(ref)
    }
  }
  
  console.log('Final footnote order:', footnoteOrder)
  
  // Replace footnote references [^1] in HTML with links
  let processed = html.replace(/\[\^(\w+)\]/g, (_match, ref) => {
    return `<sup><a href="#fn-${ref}" id="fnref-${ref}" class="footnote-ref">[${ref}]</a></sup>`
  })
  
  console.log('Refs to process:', footnoteOrder.filter(ref => footnoteRefs[ref]))
  
  // Build footnotes section if there are any
  if (footnoteOrder.length > 0 && Object.keys(footnoteRefs).length > 0) {
    const footnotesHtml = footnoteOrder
      .filter(ref => footnoteRefs[ref])
      .map(ref => 
        `<li id="fn-${ref}">
          ${footnoteRefs[ref]}
          <a href="#fnref-${ref}" class="footnote-backref"> ↩</a>
        </li>`
      )
      .join('\n')
    
    console.log('Generated footnotes HTML:', footnotesHtml)
    
    processed += `
<div class="footnotes">
<hr>
<ol>
${footnotesHtml}
</ol>
</div>`
  }
  
  return processed
}

export const useMarkdownRenderer = (mdUrl: string) => {
  const [html, setHtml] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true)
        setError('')

        headerIndex = 0

        // Fetch the markdown file
        const response = await fetch(mdUrl)
        if (!response.ok) {
          throw new Error(`Failed to load markdown: ${response.statusText}`)
        }
        
        const markdown = await response.text()
        
        // Remove footnote definitions from markdown before converting
        // Match both [^1]: and [^1] formats
        const cleanedMarkdown = markdown.replace(/^\[\^(\w+)\]:?\s*(.+?)(?=\n\n|\n\[\^|\n###|\n$|$)/gms, '')
        
        // Convert to HTML
        let htmlContent = await marked.parse(cleanedMarkdown)
        
        // Process footnotes after HTML conversion
        htmlContent = processFootnotes(htmlContent, markdown)
        
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
  const contentRef = useRef<HTMLDivElement>(null)

  // Handle footnote link clicks for smooth scrolling
  useEffect(() => {
    const container = contentRef.current
    if (!container) return

    const handleFootnoteClick = (e: Event) => {
      const target = e.target as HTMLElement
      
      console.log('Click detected:', target.tagName, target.getAttribute('href'))
      
      // Check if clicked element is a footnote link
      if (target.tagName === 'A') {
        const href = target.getAttribute('href')
        
        console.log('Link clicked, href:', href)
        
        // Only handle internal footnote links (starting with #fn)
        if (href && href.startsWith('#fn')) {
          e.preventDefault()
          console.log('Preventing default and scrolling to:', href)
          const targetId = href.substring(1) // Remove the '#'
          const targetElement = document.getElementById(targetId)
          
          console.log('Target element:', targetElement)
          
          if (targetElement) {
            targetElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            })
          }
        }
      }
    }

    container.addEventListener('click', handleFootnoteClick)
    return () => container.removeEventListener('click', handleFootnoteClick)
  }, [html])

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
      ref={contentRef}
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
