"use client"

import {
  Package,
  Clock,
  Truck,
  FileText,
  ChevronDown,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function DashboardContent() {
  return (
    <div className="flex flex-col gap-6">
      {/* Sales Activity & Inventory Summary Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sales Activity */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Sales Activity</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4">
              <span className="text-3xl font-bold text-[#e04f4f]">228</span>
              <span className="text-sm text-gray-500">Qty</span>
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>TO BE PACKED</span>
              </div>
            </div>
            <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4">
              <span className="text-3xl font-bold text-[#3b82f6]">6</span>
              <span className="text-sm text-gray-500">Pkgs</span>
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                <Package className="h-3 w-3" />
                <span>TO BE SHIPPED</span>
              </div>
            </div>
            <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4">
              <span className="text-3xl font-bold text-[#3b82f6]">10</span>
              <span className="text-sm text-gray-500">Pkgs</span>
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                <Truck className="h-3 w-3" />
                <span>TO BE DELIVERED</span>
              </div>
            </div>
            <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4">
              <span className="text-3xl font-bold text-[#3b82f6]">474</span>
              <span className="text-sm text-gray-500">Qty</span>
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                <FileText className="h-3 w-3" />
                <span>TO BE INVOICED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Summary */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Inventory Summary</h2>
          <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 uppercase">Quantity in Hand</span>
              <span className="text-lg font-bold text-gray-900">10458...</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 uppercase">Quantity to be Received</span>
              <span className="text-lg font-bold text-gray-900">168</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details & Top Selling Items Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Product Details */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-4 text-sm font-semibold uppercase text-gray-700">Product Details</h3>
          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-8">
                <span className="text-sm text-[#e04f4f]">Low Stock Items</span>
                <span className="text-sm font-semibold text-[#e04f4f]">3</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <span className="text-sm text-gray-600">All Item Group</span>
                <span className="text-sm font-semibold text-gray-900">39</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <span className="text-sm text-gray-600">All Items</span>
                <span className="text-sm font-semibold text-gray-900">190</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <span className="flex items-center gap-1 text-sm text-[#e04f4f]">
                  Unconfirmed Items
                  <Info className="h-3 w-3" />
                </span>
                <span className="text-sm font-semibold text-[#e04f4f]">121</span>
              </div>
            </div>
            {/* Donut Chart Placeholder */}
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#22c55e"
                  strokeWidth="3"
                  strokeDasharray="71 29"
                  strokeLinecap="round"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="20 80"
                  strokeDashoffset="-71"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-lg font-bold text-gray-700">71%</span>
            </div>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase text-gray-700">Top Selling Items</h3>
            <Button variant="ghost" size="sm" className="text-xs text-gray-500">
              Previous Year
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <div className="mb-2 h-16 w-16 rounded-lg bg-gray-100" />
              <span className="text-xs text-gray-500 text-center truncate w-full">Hanswooly Cotton Cas...</span>
              <span className="text-sm font-semibold text-gray-900">171 <span className="text-xs text-gray-500">pcs</span></span>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 h-16 w-16 rounded-lg bg-gray-100" />
              <span className="text-xs text-gray-500 text-center truncate w-full">Cutiepie Rompers-spo...</span>
              <span className="text-sm font-semibold text-gray-900">45 <span className="text-xs text-gray-500">sets</span></span>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 h-16 w-16 rounded-lg bg-gray-100" />
              <span className="text-xs text-gray-500 text-center truncate w-full">Cut...</span>
              <span className="text-sm font-semibold text-gray-900">32 <span className="text-xs text-gray-500">pcs</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Order & Sales Order Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Purchase Order */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase text-gray-700">Purchase Order</h3>
            <Button variant="ghost" size="sm" className="text-xs text-gray-500">
              This Month
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <div className="flex flex-col items-center py-4">
            <span className="text-sm text-gray-500">Quantity Ordered</span>
            <span className="text-4xl font-bold text-[#e04f4f]">652.00</span>
          </div>
        </div>

        {/* Sales Order */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-4 text-sm font-semibold uppercase text-gray-700">Sales Order</h3>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 hover:bg-transparent">
                <TableHead className="text-xs text-gray-500 font-medium">Channel</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium text-center">Draft</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium text-center">Confirmed</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium text-center">Packed</TableHead>
                <TableHead className="text-xs text-gray-500 font-medium text-center">Shipped</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-gray-100">
                <TableCell className="text-sm text-gray-700">Direct sales</TableCell>
                <TableCell className="text-sm text-gray-900 text-center">0</TableCell>
                <TableCell className="text-sm text-gray-900 text-center">50</TableCell>
                <TableCell className="text-sm text-gray-900 text-center">0</TableCell>
                <TableCell className="text-sm text-gray-900 text-center">0</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
