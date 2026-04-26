"use client"

import { useState } from "react"
import {
  Calendar,
  Download,
  ChevronDown,
  FileText,
  BarChart3,
  Users,
  Receipt,
  FileSpreadsheet,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

// Sample data for reports
const salesSummaryData = [
  { date: "2024-01-15", invoiceCount: 12, grossSales: 45000, taxCollected: 6750, net: 38250 },
  { date: "2024-01-16", invoiceCount: 8, grossSales: 32000, taxCollected: 4800, net: 27200 },
  { date: "2024-01-17", invoiceCount: 15, grossSales: 58000, taxCollected: 8700, net: 49300 },
  { date: "2024-01-18", invoiceCount: 10, grossSales: 41000, taxCollected: 6150, net: 34850 },
  { date: "2024-01-19", invoiceCount: 18, grossSales: 72000, taxCollected: 10800, net: 61200 },
]

const chartData = [
  { name: "Mon", sales: 45000 },
  { name: "Tue", sales: 32000 },
  { name: "Wed", sales: 58000 },
  { name: "Thu", sales: 41000 },
  { name: "Fri", sales: 72000 },
]

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--primary))",
  },
}

const stockValuationData = [
  { item: "Cotton T-Shirt - White", sku: "SKU-001", qty: 150, avgCost: 450, totalValue: 67500 },
  { item: "Denim Jeans - Blue", sku: "SKU-002", qty: 80, avgCost: 1200, totalValue: 96000 },
  { item: "Summer Dress - Floral", sku: "SKU-003", qty: 45, avgCost: 800, totalValue: 36000 },
  { item: "Polo Shirt - Navy", sku: "SKU-004", qty: 200, avgCost: 550, totalValue: 110000 },
  { item: "Casual Shorts - Khaki", sku: "SKU-005", qty: 120, avgCost: 650, totalValue: 78000 },
]

const udhanaAgingData = [
  { customer: "ABC Traders", total: 125000, d30: 45000, d60: 35000, d90: 25000, d90plus: 20000 },
  { customer: "XYZ Retail", total: 85000, d30: 60000, d60: 25000, d90: 0, d90plus: 0 },
  { customer: "Fashion Hub", total: 210000, d30: 80000, d60: 70000, d90: 40000, d90plus: 20000 },
  { customer: "Style Corner", total: 65000, d30: 40000, d60: 15000, d90: 10000, d90plus: 0 },
  { customer: "Metro Garments", total: 180000, d30: 50000, d60: 60000, d90: 45000, d90plus: 25000 },
]

const taxSummaryData = [
  { type: "VAT (15%)", taxable: 850000, taxAmount: 127500 },
  { type: "SSCL (2.5%)", taxable: 720000, taxAmount: 18000 },
  { type: "PAL (5%)", taxable: 180000, taxAmount: 9000 },
  { type: "Zero Rated", taxable: 250000, taxAmount: 0 },
]

export function ReportsContent() {
  const [activeTab, setActiveTab] = useState("sales-summary")
  const [hasData, setHasData] = useState(true)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileText className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No Report Data</h3>
      <p className="text-muted-foreground max-w-sm mb-4">
        Select your filters and click &quot;Apply Filters&quot; to generate the report.
      </p>
      <Button onClick={() => setHasData(true)}>
        Run Report
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Report Selector Tabs */}
      <Card>
        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="sales-summary" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Sales Summary
              </TabsTrigger>
              <TabsTrigger value="stock-valuation" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Stock Valuation
              </TabsTrigger>
              <TabsTrigger value="udhana-aging" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Udhana Aging
              </TabsTrigger>
              <TabsTrigger value="tax-summary" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Tax Summary
              </TabsTrigger>
              <TabsTrigger value="custom-export" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Custom Export
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Filters Row */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Date Range */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-10 w-40"
                  defaultValue="2024-01-01"
                />
              </div>
              <span className="text-muted-foreground">to</span>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-10 w-40"
                  defaultValue="2024-01-31"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="footwear">Footwear</SelectItem>
              </SelectContent>
            </Select>

            {/* Supplier Filter */}
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                <SelectItem value="supplier-1">ABC Textiles</SelectItem>
                <SelectItem value="supplier-2">XYZ Fabrics</SelectItem>
                <SelectItem value="supplier-3">Fashion Imports</SelectItem>
              </SelectContent>
            </Select>

            {/* Customer Filter */}
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="customer-1">ABC Traders</SelectItem>
                <SelectItem value="customer-2">XYZ Retail</SelectItem>
                <SelectItem value="customer-3">Fashion Hub</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 ml-auto">
              <Button onClick={() => setHasData(true)}>
                Apply Filters
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content Area */}
      <Card>
        <CardContent className="p-4 min-h-[500px]">
          {!hasData ? (
            <EmptyState />
          ) : (
            <>
              {/* Sales Summary Report */}
              {activeTab === "sales-summary" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Sales Summary Report</h3>
                    <Badge variant="secondary">Last 5 days</Badge>
                  </div>
                  
                  {/* Chart */}
                  <div className="h-64 border rounded-lg p-4">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                      </BarChart>
                    </ChartContainer>
                  </div>

                  {/* Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Invoice Count</TableHead>
                        <TableHead className="text-right">Gross Sales</TableHead>
                        <TableHead className="text-right">Tax Collected</TableHead>
                        <TableHead className="text-right">Net</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesSummaryData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.date}</TableCell>
                          <TableCell className="text-right">{row.invoiceCount}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.grossSales)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.taxCollected)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(row.net)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell className="font-semibold">Total</TableCell>
                        <TableCell className="text-right font-semibold">63</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(248000)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(37200)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(210800)}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              )}

              {/* Stock Valuation Report */}
              {activeTab === "stock-valuation" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Stock Valuation Report</h3>
                    <Badge variant="secondary">As of today</Badge>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">Qty on Hand</TableHead>
                        <TableHead className="text-right">Avg Cost</TableHead>
                        <TableHead className="text-right">Total Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockValuationData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.item}</TableCell>
                          <TableCell className="text-muted-foreground">{row.sku}</TableCell>
                          <TableCell className="text-right">{row.qty}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.avgCost)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(row.totalValue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={4} className="text-right font-semibold">
                          Total Inventory Value
                        </TableCell>
                        <TableCell className="text-right text-xl font-bold">
                          {formatCurrency(387500)}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              )}

              {/* Udhana Aging Report */}
              {activeTab === "udhana-aging" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Udhana Aging Report</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">0-30d</Badge>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">31-60d</Badge>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">61-90d</Badge>
                      <Badge variant="destructive">90+d</Badge>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-right">Total Outstanding</TableHead>
                        <TableHead className="text-right">0-30 Days</TableHead>
                        <TableHead className="text-right">31-60 Days</TableHead>
                        <TableHead className="text-right">61-90 Days</TableHead>
                        <TableHead className="text-right">90+ Days</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {udhanaAgingData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.customer}</TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(row.total)}</TableCell>
                          <TableCell className="text-right">
                            <span className="text-green-600">{formatCurrency(row.d30)}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-yellow-600">{formatCurrency(row.d60)}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-orange-600">{formatCurrency(row.d90)}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-destructive font-medium">{formatCurrency(row.d90plus)}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell className="font-semibold">Total</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(665000)}</TableCell>
                        <TableCell className="text-right text-green-600 font-semibold">{formatCurrency(275000)}</TableCell>
                        <TableCell className="text-right text-yellow-600 font-semibold">{formatCurrency(205000)}</TableCell>
                        <TableCell className="text-right text-orange-600 font-semibold">{formatCurrency(120000)}</TableCell>
                        <TableCell className="text-right text-destructive font-semibold">{formatCurrency(65000)}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              )}

              {/* Tax Summary Report */}
              {activeTab === "tax-summary" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Tax Summary Report</h3>
                    <Badge variant="secondary">Jan 2024</Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">VAT Collected</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(127500)}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">SSCL Collected</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(18000)}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">PAL Collected</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(9000)}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total Tax</p>
                        <p className="text-2xl font-bold">{formatCurrency(154500)}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tax Type</TableHead>
                        <TableHead className="text-right">Taxable Amount</TableHead>
                        <TableHead className="text-right">Tax Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {taxSummaryData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.type}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.taxable)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(row.taxAmount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell className="font-semibold">Grand Total</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(2000000)}</TableCell>
                        <TableCell className="text-right text-xl font-bold">{formatCurrency(154500)}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              )}

              {/* Custom Export */}
              {activeTab === "custom-export" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Custom Export Builder</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Select Data Source</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose data source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="invoices">Sales Invoices</SelectItem>
                            <SelectItem value="items">Items & Stock</SelectItem>
                            <SelectItem value="customers">Customers</SelectItem>
                            <SelectItem value="suppliers">Suppliers</SelectItem>
                            <SelectItem value="purchases">Purchase Orders</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Select Fields</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                          {["Invoice #", "Date", "Customer", "Amount", "Tax", "Status", "Items", "Notes"].map((field) => (
                            <label key={field} className="flex items-center gap-2 text-sm">
                              <input type="checkbox" className="rounded border-input" defaultChecked />
                              {field}
                            </label>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Preview</Button>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Generate Export
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
