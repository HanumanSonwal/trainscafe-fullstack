import { Card, CardContent } from "@/components/ui/card"

export default function DashboardPage() {

  return (
    <div className="grid md:grid-cols-3 gap-6">

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Total Vendors
          </p>
          <p className="text-2xl font-semibold">
            24
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Orders Today
          </p>
          <p className="text-2xl font-semibold">
            132
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Active Stations
          </p>
          <p className="text-2xl font-semibold">
            12
          </p>
        </CardContent>
      </Card>

    </div>
  )
}