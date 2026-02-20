"use client"

import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Column {
  key: string
  label: string
  className?: string
  hideOnMobile?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  onRowClick?: (row: any) => void
  className?: string
}

export function DataTable({ columns, data, onRowClick, className }: DataTableProps) {
  return (
    <>
      {/* Desktop table */}
      <div className={cn("hidden lg:block", className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={cn(col.className)}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow
                key={row.id ?? i}
                onClick={() => onRowClick?.(row)}
                onKeyDown={onRowClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onRowClick(row); } } : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? "button" : undefined}
                className={cn(onRowClick && "cursor-pointer")}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className={cn(col.className)}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-8 text-center text-sm text-muted-foreground">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card list */}
      <div className={cn("flex flex-col lg:hidden", className)}>
        {data.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">데이터가 없습니다.</p>
        )}
        {data.map((row, i) => (
          <div
            key={row.id ?? i}
            onClick={() => onRowClick?.(row)}
            onKeyDown={onRowClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onRowClick(row); } } : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            role={onRowClick ? "button" : undefined}
            className={cn(
              "border-b border-border px-5 py-4 sm:px-8",
              onRowClick && "cursor-pointer active:bg-muted/50"
            )}
          >
            {columns
              .filter((col) => !col.hideOnMobile)
              .map((col) => (
                <div key={col.key} className="flex items-baseline justify-between py-0.5">
                  <span className="text-xs text-muted-foreground">{col.label}</span>
                  <span className="text-sm text-foreground">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </>
  )
}
