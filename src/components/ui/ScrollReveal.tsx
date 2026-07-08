'use client'

import { useInView } from '@/hooks/useInView'

interface Props {
  children: React.ReactNode
  className?: string
  delay?: 1 | 2 | 3 | 4 | 5
  as?: 'div' | 'section' | 'span'
}

export default function ScrollReveal({
  children,
  className = '',
  delay,
  as: Tag = 'div',
}: Props) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const delayClass = delay ? `reveal-delay-${delay}` : ''

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'revealed' : ''} ${delayClass} ${className}`}
    >
      {children}
    </Tag>
  )
}
