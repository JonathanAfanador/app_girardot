import type { ReactNode } from 'react'

interface CardProps {
  title: string
  description?: string
  imageUrl?: string
  children?: ReactNode
}

const Card = ({ title, description, imageUrl, children }: CardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-200 hover:shadow-lg">
      {imageUrl && (
        <img 
          className="w-full h-48 object-cover" 
          src={imageUrl} 
          alt={title} 
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="mt-2 text-gray-600">{description}</p>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  )
}

export default Card