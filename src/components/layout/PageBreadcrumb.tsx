import NextLink from 'next/link'
import { Fragment } from 'react'

import { Container } from '@/components/Section'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

type Crumb = { label?: string | null; url?: string | null }

const linkClass = 'hover:text-seal-700'

/** Slim strip under the header: Beranda > ancestors > current page. Scrolls away with the page. */
export function PageBreadcrumb({ ancestors = [], current }: { ancestors?: Crumb[]; current: string }) {
  return (
    <div className="border-b border-border bg-background">
      <Container>
        <Breadcrumb className="py-2.5">
          <BreadcrumbList className="flex-nowrap overflow-x-auto whitespace-nowrap">
            <BreadcrumbItem>
              <BreadcrumbLink render={<NextLink href="/" />} className={linkClass}>
                Beranda
              </BreadcrumbLink>
            </BreadcrumbItem>
            {ancestors.map((crumb) =>
              crumb.url ? (
                <Fragment key={crumb.url}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<NextLink href={crumb.url} />} className={linkClass}>
                      {crumb.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Fragment>
              ) : null,
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{current}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Container>
    </div>
  )
}
