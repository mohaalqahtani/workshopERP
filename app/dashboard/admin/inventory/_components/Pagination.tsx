import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type Props = {
  currentPage: number
  totalPages: number
}

export default function TablePagination({ currentPage, totalPages }: Props) {

  // نبني أرقام الصفحات التي نعرضها
  // مثال: أنت في صفحة 5 من 10
  // نعرض: 1 ... 4 5 6 ... 10
  function getPageNumbers() {
    const pages: (number | "ellipsis")[] = []

    if (totalPages <= 5) {
      // لو الصفحات قليلة — اعرض كلها
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // دائماً عرض الصفحة الأولى
      pages.push(1)

      // نقاط قبل الوسط لو الصفحة الحالية بعيدة عن البداية
      if (currentPage > 3) pages.push("ellipsis")

      // الصفحات حول الصفحة الحالية
      const start = Math.max(2, currentPage - 1)
      const end   = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // نقاط بعد الوسط لو الصفحة الحالية بعيدة عن النهاية
      if (currentPage < totalPages - 2) pages.push("ellipsis")

      // دائماً عرض الصفحة الأخيرة
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <Pagination className="mt-4">
      <PaginationContent>

        {/* ── زر السابق ── */}
        <PaginationItem>
          {currentPage > 1 ? (
            <PaginationPrevious href={`?page=${currentPage - 1}`} />
          ) : (
            <PaginationPrevious
              href="#"
              className="pointer-events-none opacity-40"
              // ↑ معطّل في الصفحة الأولى
            />
          )}
        </PaginationItem>

        {/* ── أرقام الصفحات ── */}
        {getPageNumbers().map((page, index) =>
          page === "ellipsis" ? (
            // نقاط "..."
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            // رقم صفحة
            <PaginationItem key={page}>
              <PaginationLink
                href={`?page=${page}`}
                isActive={page === currentPage}
                // ↑ يلوّن الصفحة الحالية
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* ── زر التالي ── */}
        <PaginationItem>
          {currentPage < totalPages ? (
            <PaginationNext href={`?page=${currentPage + 1}`} />
          ) : (
            <PaginationNext
              href="#"
              className="pointer-events-none opacity-40"
              // ↑ معطّل في الصفحة الأخيرة
            />
          )}
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  )
}