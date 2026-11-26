import type { ReactNode } from 'react'

interface PageHeadingProps {
  title: string
  description?: string
  eyebrow?: string
  children?: ReactNode
}

export function PageHeading({ title, description, eyebrow, children }: PageHeadingProps) {
  return (
    <header className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 tabIndex={-1}>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {children && <div className="page-heading-actions">{children}</div>}
    </header>
  )
}
