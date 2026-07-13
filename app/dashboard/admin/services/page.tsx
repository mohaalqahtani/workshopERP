import prisma from "@/lib/prisma"
// import AddPartUI from "./_components/addPartUI"
import AddServices from "./_components/addServices"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


type Props = {
    searchParams: Promise<{page?: string}>
}
export default async function servicesPage({searchParams}: Props){
    // const partsCar = await prisma.parts_Inventory.findMany({
    //     skip: 0,
    //     take: 10,
    // })
    const {page} = await searchParams
    const currentPage = Number(page) || 1
    const itemsPerPage = 10
    const skip = (currentPage - 1) * itemsPerPage
    const [ servicesList, totalCount] = await Promise.all([
        prisma.services_List.findMany({
            skip,
            take: itemsPerPage,
        }),
        prisma.services_List.count()
    ])
    const totalPages = Math.ceil(totalCount / itemsPerPage)

    return(
        <>

    <Table>
  <TableCaption>هذي هي الخدمات المتوفرة</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-25">اسم الخدمة</TableHead>
      <TableHead>وصف الخدمة</TableHead>
      <TableHead>عدد العمال المطلوبين</TableHead>
      <TableHead className="text-right">سعر الخدمة</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
        {servicesList.map((service)=>(
    <TableRow key={service.id}>
      <TableCell className="font-medium">{service.name}</TableCell>
      <TableCell>{service.description}</TableCell>
      <TableCell>{service.required_mechanics.toString()}</TableCell>
      <TableCell className="text-right">{service.price.toString()}</TableCell>
    </TableRow>
    ))}
  </TableBody>
</Table>
    {/* <TablePagination
    currentPage={currentPage}
    totalPages={totalPages}
    />

        <AddPartUI/> */}
        <AddServices/>
        </>
    )
}