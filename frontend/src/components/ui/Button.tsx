import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

type BaseProps = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

type ButtonAsButton = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  as?: 'button'
}

type ButtonAsAnchor = BaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> & {
  as: 'a'
}

type ButtonAsLink = BaseProps & Omit<LinkProps, 'className'> & {
  as: typeof Link
}

type ButtonProps = ButtonAsButton | ButtonAsAnchor | ButtonAsLink

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md', 
  as: Tag = 'button',
  className = '',
  ...props 
}: ButtonProps) => {
  const baseClasses = 'rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-900 focus:ring-primary',
    secondary: 'bg-secondary text-gray-900 hover:bg-yellow-500 focus:ring-secondary',
    accent: 'bg-accent text-white hover:bg-red-600 focus:ring-accent',
    outline: 'border border-primary text-primary hover:bg-blue-50 focus:ring-primary',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  }

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

  if (Tag === 'a') {
    const anchorProps = props as ButtonAsAnchor
    return (
      <a className={combinedClasses} {...anchorProps}>
        {children}
      </a>
    )
  }

  if (Tag === Link) {
    const linkProps = props as ButtonAsLink
    return (
      <Link className={combinedClasses} {...linkProps}>
        {children}
      </Link>
    )
  }

  const buttonProps = props as ButtonAsButton
  return (
    <button className={combinedClasses} {...buttonProps}>
      {children}
    </button>
  )
}

export default Button