"use client"

import { useState } from "react"
import {
  Search,
  Download,
  Plus,
  Eye,
  Pencil,
  PackageCheck,
  X,
  Trash2,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

// Sample data for display
const purchaseOrders = [
  {
    id: "PO-001",
    supplier: "ABC Distributors",
    orderDate: "2024-01-15",
    expectedDelivery: "2024-01-22",
    totalItems: 25,
    status: "completed",
  },
  {
    id: "PO-002",
    supplier: "XYZ Wholesale",
    orderDate: "2024-01-18",
    expectedDelivery: "2024-01-25",
    totalItems: 12,
    status: "ordered",
  },
  {
    id: "PO-003",
    supplier: "Global Imports Ltd",
    orderDate: "2024-01-20",
    expectedDelivery: "2024-01-28",
    totalItems: 45,
    status: "partial",
  },
  {
    id: "PO-004",
    supplier: "Metro Supplies",
    orderDate: "2024-01-22",
    expectedDelivery: "2024-02-01",
    totalItems: 8,
    status: "draft",
  },
  {
    id: "PO-005",
    supplier: "Prime Vendors",
    orderDate: "2024-01-23",
    expectedDelivery: "2024-02-05",
    totalItems: 32,
    status: "ordered",
  },
]

const poItems = [
  {
    id: 1,
    name: "Widget A",
    orderedQty: 100,
    unitCost: 25.0,
    expectedDate: "2024-01-25",
    receivedQty: 0,
  },
  {
    id: 2,
    name: "Widget B",
    orderedQty: 50,
    unitCost: 45.0,
    expectedDate: "2024-01-25",
    receivedQty: 0,
  },
  {
    id: 3,
    name: "Component X",
    orderedQty: 200,
    unitCost: 12.5,
    expectedDate: "2024-01-28",
    receivedQty: 0,
  },
]

const suppliers = [
  "ABC Distributors",
  "XYZ Wholesale",
  "Global Imports Ltd",
  "Metro Supplies",
  "Prime Vendors",
]

const items = [
  "Widget A",
  "Widget B",
  "Component X",
  "Part Y",
  "Assembly Z",
  "Material M",
]

function getStatusBadge(status: string) {
  switch (status) {
    case "draft":
      return <Badge variant="secondary">Draft</Badge>
    case "ordered":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Ordered</Badge>
    case "partial":
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Partially Received</Badge>
    case "completed":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function PurchasesContent() {
  const [isNewPOModalOpen, setIsNewPOModalOpen] = useState(true)
  const [isReceiptPanelOpen, setIsReceiptPanelOpen] = useState(false)
  const [orderLines, setOrderLines] = useState([
    { id: 1, item: "", orderedQty: 0, unitCost: 0, expectedDate: "", receivedQty: 0 },
  ])
  const [receiptLines, setReceiptLines] = useState(poItems)

  const addOrderLine = () => {
    setOrderLines([
      ...orderLines,
      {
        id: orderLines.length + 1,
        item: "",
        orderedQty: 0,
        unitCost: 0,
        expectedDate: "",
        receivedQty: 0,
      },
    ])
  }

  const removeOrderLine = (id: number) => {
    if (orderLines.length > 1) {
      setOrderLines(orderLines.filter((line) => line.id !== id))
    }
  }

  const subtotal = orderLines.reduce(
    (sum, line) => sum + line.orderedQty * line.unitCost,
    0
  )
  const tax = subtotal * 0.1
  const grandTotal = subtotal + tax

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Purchases</h1>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search purchase orders..."
                  className="pl-9 w-64"
                />
              </div>

              {/* Supplier Filter */}
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Suppliers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier} value={supplier.toLowerCase().replace(/\s+/g, "-")}>
                      {supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="ordered">Ordered</SelectItem>
                  <SelectItem value="partial">Partially Received</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => setIsNewPOModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Purchase Order
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO #</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Delivery</TableHead>
                <TableHead className="text-center">Total Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-medium">{po.id}</TableCell>
                  <TableCell>{po.supplier}</TableCell>
                  <TableCell>{po.orderDate}</TableCell>
                  <TableCell>{po.expectedDelivery}</TableCell>
                  <TableCell className="text-center">{po.totalItems}</TableCell>
                  <TableCell>{getStatusBadge(po.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setIsReceiptPanelOpen(true)}
                      >
                        <PackageCheck className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Goods Receipt Panel */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Receive Stock Against PO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Purchase Order</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select PO to receive" />
                </SelectTrigger>
                <SelectContent>
                  {purchaseOrders
                    .filter((po) => po.status === "ordered" || po.status === "partial")
                    .map((po) => (
                      <SelectItem key={po.id} value={po.id}>
                        {po.id} - {po.supplier}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Receipt Date</Label>
              <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
            </div>
          </div>

          {/* Receipt Items Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Ordered Qty</TableHead>
                  <TableHead className="text-center">Previously Received</TableHead>
                  <TableHead className="text-center">Receiving Now</TableHead>
                  <TableHead className="text-center">Damage/Loss</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receiptLines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="font-medium">{line.name}</TableCell>
                    <TableCell className="text-center">{line.orderedQty}</TableCell>
                    <TableCell className="text-center">{line.receivedQty}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        className="w-24 mx-auto text-center"
                        placeholder="0"
                        min={0}
                        max={line.orderedQty - line.receivedQty}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        className="w-24 mx-auto text-center"
                        placeholder="0"
                        min={0}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea placeholder="Add any notes about this receipt (e.g., damage details, discrepancies)..." />
          </div>

          <div className="flex justify-end">
            <Button>
              <PackageCheck className="h-4 w-4 mr-2" />
              Confirm Receipt
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* New/Edit PO Modal */}
      <Dialog open={isNewPOModalOpen} onOpenChange={setIsNewPOModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Purchase Order</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="supplier" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="supplier">Supplier & Dates</TabsTrigger>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            {/* Supplier & Dates Tab */}
            <TabsContent value="supplier" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Supplier</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier.toLowerCase().replace(/\s+/g, "-")}>
                          {supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>PO Number</Label>
                  <Input value="PO-006" disabled className="bg-muted" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Order Date</Label>
                  <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>
                <div className="space-y-2">
                  <Label>Expected Delivery Date</Label>
                  <Input type="date" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Delivery Address</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Warehouse</SelectItem>
                      <SelectItem value="secondary">Secondary Store</SelectItem>
                      <SelectItem value="outlet">Outlet Branch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net30">Net 30</SelectItem>
                      <SelectItem value="net60">Net 60</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                      <SelectItem value="prepaid">Prepaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Items Tab */}
            <TabsContent value="items" className="space-y-4 mt-4">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Item</TableHead>
                      <TableHead className="w-[100px] text-center">Ordered Qty</TableHead>
                      <TableHead className="w-[120px] text-center">Unit Cost</TableHead>
                      <TableHead className="w-[140px]">Expected Date</TableHead>
                      <TableHead className="w-[100px] text-center">Received</TableHead>
                      <TableHead className="w-[100px] text-right">Line Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderLines.map((line, index) => (
                      <TableRow key={line.id}>
                        <TableCell>
                          <Select
                            value={line.item}
                            onValueChange={(value) => {
                              const updated = [...orderLines]
                              updated[index].item = value
                              setOrderLines(updated)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {items.map((item) => (
                                <SelectItem key={item} value={item.toLowerCase().replace(/\s+/g, "-")}>
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            className="text-center"
                            value={line.orderedQty || ""}
                            onChange={(e) => {
                              const updated = [...orderLines]
                              updated[index].orderedQty = Number(e.target.value)
                              setOrderLines(updated)
                            }}
                            min={0}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            className="text-center"
                            value={line.unitCost || ""}
                            onChange={(e) => {
                              const updated = [...orderLines]
                              updated[index].unitCost = Number(e.target.value)
                              setOrderLines(updated)
                            }}
                            min={0}
                            step={0.01}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={line.expectedDate}
                            onChange={(e) => {
                              const updated = [...orderLines]
                              updated[index].expectedDate = e.target.value
                              setOrderLines(updated)
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            className="text-center bg-muted"
                            value={line.receivedQty}
                            disabled
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${(line.orderedQty * line.unitCost).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeOrderLine(line.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button variant="outline" onClick={addOrderLine}>
                <Plus className="h-4 w-4 mr-2" />
                Add Line
              </Button>

              {/* Totals */}
              <Collapsible defaultOpen>
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ChevronDown className="h-4 w-4" />
                    Tax Breakdown
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">VAT (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </CollapsibleContent>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Grand Total</span>
                    <span className="text-xl font-bold">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </Collapsible>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Internal Notes</Label>
                <Textarea
                  placeholder="Add internal notes (not visible to supplier)..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Supplier Instructions</Label>
                <Textarea
                  placeholder="Add special instructions for the supplier..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Terms & Conditions</Label>
                <Textarea
                  placeholder="Enter any specific terms and conditions..."
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setIsNewPOModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="secondary">Save as Draft</Button>
            <Button>Create Purchase Order</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Goods Receipt Sheet (Alternative drawer view) */}
      <Sheet open={isReceiptPanelOpen} onOpenChange={setIsReceiptPanelOpen}>
        <SheetContent className="w-[500px] sm:w-[600px]">
          <SheetHeader>
            <SheetTitle>Quick Goods Receipt</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label>Purchase Order</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select PO" />
                </SelectTrigger>
                <SelectContent>
                  {purchaseOrders
                    .filter((po) => po.status === "ordered" || po.status === "partial")
                    .map((po) => (
                      <SelectItem key={po.id} value={po.id}>
                        {po.id} - {po.supplier}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Items to Receive</Label>
              {receiptLines.map((line) => (
                <div key={line.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{line.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Ordered: {line.orderedQty} | Received: {line.receivedQty}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      className="w-20 text-center"
                      placeholder="Qty"
                      min={0}
                      max={line.orderedQty - line.receivedQty}
                    />
                    <Input
                      type="number"
                      className="w-20 text-center"
                      placeholder="Loss"
                      min={0}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Receipt notes..." />
            </div>

            <Button className="w-full">
              <PackageCheck className="h-4 w-4 mr-2" />
              Confirm Receipt
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
