"use client"

import { useState } from "react"
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  CreditCard,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

// Sample data for items dropdown
const sampleItems = [
  { id: "1", name: "Cotton T-Shirt", price: 1500 },
  { id: "2", name: "Denim Jeans", price: 3500 },
  { id: "3", name: "Sneakers", price: 8500 },
  { id: "4", name: "Leather Belt", price: 2000 },
  { id: "5", name: "Sunglasses", price: 4500 },
]

// Sample customers
const sampleCustomers = [
  { id: "1", name: "Zylker Retail" },
  { id: "2", name: "ABC Trading Co." },
  { id: "3", name: "Fashion Hub" },
  { id: "4", name: "Metro Stores" },
]

// Sample credit ledger data
const creditLedgerData = [
  {
    id: "1",
    customer: "Zylker Retail",
    creditLimit: 500000,
    outstanding: 125000,
    aging30: 50000,
    aging60: 45000,
    aging90: 30000,
    status: "warning",
  },
  {
    id: "2",
    customer: "ABC Trading Co.",
    creditLimit: 300000,
    outstanding: 280000,
    aging30: 100000,
    aging60: 80000,
    aging90: 100000,
    status: "danger",
  },
  {
    id: "3",
    customer: "Fashion Hub",
    creditLimit: 200000,
    outstanding: 45000,
    aging30: 45000,
    aging60: 0,
    aging90: 0,
    status: "good",
  },
  {
    id: "4",
    customer: "Metro Stores",
    creditLimit: 400000,
    outstanding: 150000,
    aging30: 80000,
    aging60: 70000,
    aging90: 0,
    status: "warning",
  },
]

interface InvoiceItem {
  id: string
  itemId: string
  itemName: string
  qty: number
  unitPrice: number
  discount: number
  tax: string
  lineTotal: number
}

export function SalesContent() {
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      itemId: "1",
      itemName: "Cotton T-Shirt",
      qty: 10,
      unitPrice: 1500,
      discount: 5,
      tax: "VAT",
      lineTotal: 14250,
    },
    {
      id: "2",
      itemId: "3",
      itemName: "Sneakers",
      qty: 5,
      unitPrice: 8500,
      discount: 0,
      tax: "VAT",
      lineTotal: 42500,
    },
  ])
  const [taxBreakdownOpen, setTaxBreakdownOpen] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedCustomerForPayment, setSelectedCustomerForPayment] = useState("")

  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      itemId: "",
      itemName: "",
      qty: 1,
      unitPrice: 0,
      discount: 0,
      tax: "None",
      lineTotal: 0,
    }
    setInvoiceItems([...invoiceItems, newItem])
  }

  const removeInvoiceItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter((item) => item.id !== id))
  }

  const updateInvoiceItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceItems(
      invoiceItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          
          // If selecting an item, update price
          if (field === "itemId") {
            const selectedItem = sampleItems.find((i) => i.id === value)
            if (selectedItem) {
              updatedItem.itemName = selectedItem.name
              updatedItem.unitPrice = selectedItem.price
            }
          }
          
          // Recalculate line total
          const subtotal = updatedItem.qty * updatedItem.unitPrice
          const discountAmount = subtotal * (updatedItem.discount / 100)
          updatedItem.lineTotal = subtotal - discountAmount
          
          return updatedItem
        }
        return item
      })
    )
  }

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.lineTotal, 0)
  const vatItems = invoiceItems.filter((item) => item.tax === "VAT")
  const vatAmount = vatItems.reduce((sum, item) => sum + item.lineTotal * 0.15, 0)
  const sscl = subtotal * 0.025
  const grandTotal = subtotal + vatAmount + sscl

  const openPaymentModal = (customer: string) => {
    setSelectedCustomerForPayment(customer)
    setPaymentModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return <Badge variant="default">Good Standing</Badge>
      case "warning":
        return <Badge variant="secondary">Review Required</Badge>
      case "danger":
        return <Badge variant="destructive">Over Limit</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* New Invoice Card */}
      <Card>
        <CardHeader>
          <CardTitle>New Invoice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Invoice Header */}
          <div className="grid grid-cols-4 gap-4">
            <FieldGroup>
              <Field>
                <FieldLabel>Customer</FieldLabel>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleCustomers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Invoice #</FieldLabel>
                <Input value="INV-2024-0042" disabled className="bg-muted" />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Date</FieldLabel>
                <Input type="date" defaultValue="2024-01-15" />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Due Date</FieldLabel>
                <Input type="date" defaultValue="2024-02-15" />
              </Field>
            </FieldGroup>
          </div>

          {/* Items Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Item</TableHead>
                  <TableHead className="w-[80px]">Qty</TableHead>
                  <TableHead className="w-[120px]">Unit Price</TableHead>
                  <TableHead className="w-[100px]">Discount %</TableHead>
                  <TableHead className="w-[120px]">Tax</TableHead>
                  <TableHead className="w-[120px] text-right">Line Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Select
                        value={item.itemId}
                        onValueChange={(value) => updateInvoiceItem(item.id, "itemId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {sampleItems.map((sampleItem) => (
                            <SelectItem key={sampleItem.id} value={sampleItem.id}>
                              {sampleItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          updateInvoiceItem(item.id, "qty", parseInt(e.target.value) || 0)
                        }
                        className="w-full"
                        min={1}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateInvoiceItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)
                        }
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.discount}
                        onChange={(e) =>
                          updateInvoiceItem(item.id, "discount", parseFloat(e.target.value) || 0)
                        }
                        className="w-full"
                        min={0}
                        max={100}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.tax}
                        onValueChange={(value) => updateInvoiceItem(item.id, "tax", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="VAT">VAT (15%)</SelectItem>
                          <SelectItem value="SSCL">SSCL (2.5%)</SelectItem>
                          <SelectItem value="PAL">PAL (5%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      Rs. {item.lineTotal.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInvoiceItem(item.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Button variant="outline" size="sm" onClick={addInvoiceItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>

          {/* Invoice Footer */}
          <div className="flex justify-end">
            <div className="w-80 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>

              <Collapsible open={taxBreakdownOpen} onOpenChange={setTaxBreakdownOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full justify-between p-0 h-auto font-normal">
                    <span className="text-muted-foreground text-sm">Tax Breakdown</span>
                    {taxBreakdownOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm pl-4">
                    <span className="text-muted-foreground">VAT (15%)</span>
                    <span>Rs. {vatAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm pl-4">
                    <span className="text-muted-foreground">SSCL (2.5%)</span>
                    <span>Rs. {sscl.toLocaleString()}</span>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-xl font-bold">Grand Total</span>
                  <span className="text-xl font-bold">Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button variant="secondary">Save Draft</Button>
            <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
              Mark as Credit/Udhana
            </Button>
            <Button>Generate IRD Invoice</Button>
          </div>
        </CardContent>
      </Card>

      {/* Udhana Ledger Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Customer Credit Tracking (Udhana Ledger)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Credit Limit</TableHead>
                  <TableHead className="text-right">Outstanding</TableHead>
                  <TableHead className="text-center">Aging (30/60/90+)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditLedgerData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.customer}</TableCell>
                    <TableCell className="text-right">
                      Rs. {row.creditLimit.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      Rs. {row.outstanding.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {row.aging30 > 0 ? `${(row.aging30 / 1000).toFixed(0)}k` : "-"}
                        </span>
                        <span className="text-sm text-amber-600 font-medium">
                          {row.aging60 > 0 ? `${(row.aging60 / 1000).toFixed(0)}k` : "-"}
                        </span>
                        <span className="text-sm text-destructive font-medium">
                          {row.aging90 > 0 ? `${(row.aging90 / 1000).toFixed(0)}k` : "-"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(row.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openPaymentModal(row.customer)}
                        >
                          Collect Payment
                        </Button>
                        <Button variant="link" size="sm" className="text-green-600">
                          <MessageCircle className="mr-1 h-4 w-4" />
                          WhatsApp
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Collect Payment</DialogTitle>
            <DialogDescription>
              Record a payment from {selectedCustomerForPayment}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <FieldGroup>
              <Field>
                <FieldLabel>Customer</FieldLabel>
                <Input value={selectedCustomerForPayment} disabled className="bg-muted" />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Amount (Rs.)</FieldLabel>
                <Input type="number" placeholder="Enter amount" />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Payment Method</FieldLabel>
                <Select defaultValue="cash">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="po">Payment Order (PO)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Reference #</FieldLabel>
                <Input placeholder="Transaction reference" />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Notes</FieldLabel>
                <Textarea placeholder="Additional notes..." rows={3} />
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setPaymentModalOpen(false)}>
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
