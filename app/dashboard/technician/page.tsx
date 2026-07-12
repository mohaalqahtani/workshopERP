// app/dashboard/technician/page.tsx
import prisma from "@/lib/prisma"
import SessionInfo from "./_components/session-info"
import StatusButton from "./_components/status-button"

export default async function TechnicianPage() {
  const customers = await prisma.Customers.findMany({
    include: {
      vehicles: {
        include: {
          job_cards: true  // ← نجيب بطاقات العمل مع كل مركبة
        }
      }
    }
  })

  return (
    <div className="p-6">
      {/* <SessionInfo /> */}
      <SessionInfo/>


      <ul className="mt-4 space-y-4">
        {customers.map((customer) => (
          <li key={customer.id} className="p-4 border rounded-lg space-y-2">

            <p className="font-bold">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.phone}</p>

            {customer.vehicles.map((vehicle) => (
              <div key={vehicle.id} className="pr-4 border-r-2 space-y-1">
                <p className="text-sm font-medium">
                  🚗 {vehicle.brand} {vehicle.model} — {vehicle.plate_number}
                </p>

                {vehicle.job_cards.map((card) => (
                  <div key={card.id} className="flex items-center gap-3 text-sm">
                    <span>بطاقة #{card.id}</span>
                    <span className="text-muted-foreground">{card.status}</span>

                    {/* هنا الجزء التفاعلي الوحيد — Client Component */}
                    <StatusButton
                      jobCardId={card.id}
                      currentStatus={card.status}
                    />
                  </div>
                ))}
              </div>
            ))}

          </li>
        ))}
      </ul>
    </div>
  )
}