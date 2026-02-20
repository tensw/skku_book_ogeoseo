interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 pt-5 sm:px-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{description}</p>
        )}
      </div>
      {action}
    </header>
  )
}
