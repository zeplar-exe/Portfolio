import { useState, useEffect } from 'react'

export interface Header {
  level: number
  title: string
  id: string
}

export const useTableOfContents = (mdUrl: string) => {
  const [headers, setHeaders] = useState<Header[]>([])
  const [activeSection, setActiveSection] = useState<string>('')

  // Extract headers from markdown
  useEffect(() => {
    if (!mdUrl) return

    fetch(mdUrl)
      .then(response => response.text())
      .then(text => {
        const headerRegex = /^(#{1,3})\s+(.+)$/gm
        const extractedHeaders: Header[] = []
        let match
        let index = 0

        while ((match = headerRegex.exec(text)) !== null) {
          const level = match[1].length
          const title = match[2].trim()
          const id = `header-${index++}`
          extractedHeaders.push({ level, title, id })
        }

        setHeaders(extractedHeaders)
      })
      .catch(err => console.error('Failed to fetch markdown:', err))
  }, [mdUrl])

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
      // Update active section immediately for better UX
      setActiveSection(id)
    }
  }

  return { headers, activeSection, scrollToSection }
}
