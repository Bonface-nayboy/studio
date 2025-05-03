// src/components/ui/pagination.tsx
import * as React from "react"

const Pagination = React.forwardRef<
  React.HTMLAttributes<HTMLDivElement>,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center -space-x-1", className)} {...props} />
))
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  React.HTMLAttributes<HTMLDivElement>,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("flex items-center space-x-1", className)} {...props} />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  React.HTMLAttributes<HTMLLIElement>,
  { page: number; className?: string } & React.HTMLAttributes<HTMLLIElement>
>(({ className, page, ...props }, ref) => (
  <li>
    <a
      ref={ref}
      href={`#${page}`}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8",
        className
      )}
      {...props}
    >
      {page}
    </a>
  </li>
))
PaginationItem.displayName = "PaginationItem"

const PaginationNext = React.forwardRef<
  React.HTMLAttributes<HTMLAnchorElement>,
  React.HTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <li>
    <a
      ref={ref}
      href="#"
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8",
        className
      )}
      {...props}
    >
      <span className="sr-only">Next</span>
      <ChevronRightIcon className="h-4 w-4" />
    </a>
  </li>
))
PaginationNext.displayName = "PaginationNext"

const PaginationPrevious = React.forwardRef<
  React.HTMLAttributes<HTMLAnchorElement>,
  React.HTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <li>
    <a
      ref={ref}
      href="#"
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />
      <span className="sr-only">Previous</span>
    </a>
  </li>
))
PaginationPrevious.displayName = "PaginationPrevious"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious }