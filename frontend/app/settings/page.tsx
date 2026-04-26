import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
          <p className="text-gray-500 mt-2">Configure your application settings here.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
