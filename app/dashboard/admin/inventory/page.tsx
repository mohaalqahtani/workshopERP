import prisma from "@/lib/prisma"
import AddPartUI from "./_components/addPartUI"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import TablePagination from "./_components/Pagination"


type Props = {
    searchParams: Promise<{page?: string}>
}
export default async function inventoryPage({searchParams}: Props){
    // const partsCar = await prisma.parts_Inventory.findMany({
    //     skip: 0,
    //     take: 10,
    // })
    const {page} = await searchParams
    const currentPage = Number(page) || 1
    const itemsPerPage = 10
    const skip = (currentPage - 1) * itemsPerPage
    const [ partsCar, totalCount] = await Promise.all([
        prisma.parts_Inventory.findMany({
            skip,
            take: itemsPerPage,
        }),
        prisma.parts_Inventory.count()
    ])
    const totalPages = Math.ceil(totalCount / itemsPerPage)

    return(
        <>

    <Table>
  <TableCaption>هذي هي القطع المتوفرة</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-25">اسم القطعة</TableHead>
      <TableHead>عدد القطعة</TableHead>
      <TableHead>سعر القطعة</TableHead>
      <TableHead className="text-right">القطعة مخصصة لـ</TableHead>
      <TableHead className="text-right">صورة القطعة</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
        {partsCar.map((part)=>(
    <TableRow key={part.id}>
      <TableCell className="font-medium">{part.name}</TableCell>
      <TableCell>{part.stock_qty}</TableCell>
      <TableCell>{part.base_price.toString()}</TableCell>
      <TableCell className="text-right">{part.compatible_cars}</TableCell>
      <TableCell className="text-right">{part.image_url}</TableCell>
    </TableRow>
    ))}
  </TableBody>
</Table>
    <TablePagination
    currentPage={currentPage}
    totalPages={totalPages}
    />

        <AddPartUI/>
        </>
    )
}