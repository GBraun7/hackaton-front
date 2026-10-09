import type { HTMLAttributes, TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm', className)} {...props} />
}
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-1.5 p-5', className)} {...props} />
}
export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('font-semibold tracking-tight', className)} {...props} />
}
export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-slate-500', className)} {...props} />
}
export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 pt-0', className)} {...props} />
}
export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', className)} {...props} />
}
export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <div className="relative w-full overflow-auto"><table className={cn('w-full caption-bottom text-sm', className)} {...props} /></div>
}
export function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn('h-11 px-5 text-left text-xs font-medium text-slate-500', className)} {...props} />
}
export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('p-5 align-middle', className)} {...props} />
}
