import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-12">
        <p className="text-gray-500">Documents Content Area</p>
      </div>
    </DashboardLayout>
  )
}
