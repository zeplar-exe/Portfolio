import { type Header } from '../hooks/useTableOfContents'
import './TableOfContents.css'

interface TableOfContentsProps {
  headers: Header[]
  activeSection: string
  onNavigate: (id: string) => void
}

export const TableOfContents = ({ headers, activeSection, onNavigate }: TableOfContentsProps) => {
  if (headers.length === 0) return null

  return (
    <aside className="table-of-contents">
      <h2>Contents</h2>
      <nav>
        <ul>
          {headers.map((header) => (
            <li
              key={header.id}
              className={`toc-level-${header.level} ${activeSection === header.id ? 'active' : ''}`}
            >
              <a
                href={`#${header.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate(header.id)
                }}
              >
                {header.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
