export interface Link {
  type: 'internal' | 'external'
  url: string
}

export interface Project {
  name: string
  description: string
  featured: boolean
  last_updated: string
  link: Link
  hosts: {
    github?: string
    [key: string]: string | undefined
  }
  gallery: string[]
}

export interface Article {
  name: string
  description: string
  featured: boolean
  last_updated: string
  link: Link
}
