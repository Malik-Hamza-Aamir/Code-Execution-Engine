import React from 'react'
import { merge } from '../../utils/classMerge'

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
    as?: React.ElementType
    title?: React.ReactNode
    description?: React.ReactNode
    image?: string
    footer?: React.ReactNode
    variant?: 'default' | 'elevated' | 'ghost'
}

const base = 'rounded-2xl border bg-white overflow-hidden'
const variants: Record<NonNullable<CardProps['variant']>, string> = {
    default: 'shadow-sm border-surface-100',
    elevated: 'shadow-lg border-transparent',
    ghost: 'bg-transparent border-transparent'
}

const headerBase = 'p-4 flex items-start gap-4'
const contentBase = 'p-4'
const footerBase = 'p-4 border-t'

export default function Card({
    as: Component = 'div',
    title,
    description,
    image,
    footer,
    variant = 'default',
    className,
    children,
    ...rest
}: CardProps) {
    return (
        <Component className={merge(base, variants[variant], className ?? "")} {...rest}>
            {image && (
                <div className="w-full h-44 bg-surface-100 overflow-hidden">
                    <img src={image} alt={typeof title === 'string' ? title : 'card image'} className="w-full h-full object-cover" />
                </div>
            )}

            {(title || description) && (
                <div className={headerBase}>
                    <div className="flex-1">
                        {title && <h3 className="text-lg font-semibold text-surface-900">{title}</h3>}
                        {description && <p className="mt-1 text-sm text-surface-700">{description}</p>}
                    </div>
                </div>
            )}

            {children && <div className={contentBase}>{children}</div>}

            {footer && <div className={footerBase}>{footer}</div>}
        </Component>
    )
}

// Subcomponents (shadcn style exports)
export function CardHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={merge('px-4 py-3', className)} {...props}>
            {children}
        </div>
    )
}

export function CardTitle({ children, className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h4 className={merge('text-base font-semibold', className)} {...props}>
            {children}
        </h4>
    )
}

export function CardDescription({ children, className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={merge('text-sm text-surface-700', className)} {...props}>
            {children}
        </p>
    )
}

export function CardContent({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={merge('p-4', className)} {...props}>
            {children}
        </div>
    )
}

export function CardFooter({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={merge('p-4 border-t', className)} {...props}>
            {children}
        </div>
    )
}
