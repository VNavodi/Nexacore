import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function ContactsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800">Contacts</h1>
          <p className="text-gray-500 mt-2">Manage your contacts and customers here.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
