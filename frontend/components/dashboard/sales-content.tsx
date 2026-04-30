"use client"

import { useState } from "react"
import { toast } from "sonner"
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

const SALES_API_BASE_URLS = process.env.NEXT_PUBLIC_API_URL
  ? [process.env.NEXT_PUBLIC_API_URL]
  : ["http://localhost:8081/api", "http://localhost:8080/api"]

interface InvoiceItem {
  id: string
  itemName: string
  qty: number
  unitPrice: number
  discount: number
  lineTotal: number
}

export function SalesContent() {
  const getAuthHeaders = () => {
    const headers: Record<string, string> = {}
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) headers.Authorization = `Bearer ${token}`
    }
    return headers
  }

  const postInvoiceWithFallback = async (payload: unknown) => {
    let lastResponse: Response | null = null
    let lastError: Error | null = null

    for (let i = 0; i < SALES_API_BASE_URLS.length; i++) {
      const baseUrl = SALES_API_BASE_URLS[i]
      try {
        const response = await fetch(`${baseUrl}/invoices`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(payload),
        })
        lastResponse = response

        const shouldRetry =
          i < SALES_API_BASE_URLS.length - 1 &&
          !process.env.NEXT_PUBLIC_API_URL &&
          (response.status === 403 || response.status >= 500)

        if (shouldRetry) continue
        return response
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Network request failed")
        if (i === SALES_API_BASE_URLS.length - 1) {
          break
        }
      }
    }

    if (lastResponse) return lastResponse
    throw lastError ?? new Error("Unable to reach invoice API")
  }

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedCustomerForPayment, setSelectedCustomerForPayment] = useState("")

  const [customerName, setCustomerName] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now()}`)
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split('T')[0])

  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      itemName: "",
      qty: 0,
      unitPrice: 0,
      discount: 0,
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

  const parseNumber = (value: string) => {
    if (value.trim() === "") return 0
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  const parseInteger = (value: string) => {
    if (value.trim() === "") return 0
    const parsed = Number.parseInt(value, 10)
    return Number.isFinite(parsed) ? parsed : 0
  }

  const subtotalBeforeDiscount = invoiceItems.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  )
  const discountAmount = invoiceItems.reduce(
    (sum, item) => sum + (item.qty * item.unitPrice * item.discount) / 100,
    0
  )
  const grandTotal = subtotalBeforeDiscount - discountAmount

  const handleConfirmSale = async () => {
    if (!customerName) {
      toast.error("Please enter customer name")
      return
    }

    if (invoiceItems.length === 0) {
      toast.error("Please add at least one item.")
      return
    }

    const hasInvalidItem = invoiceItems.some(
      (item) => !item.itemName.trim() || item.qty <= 0 || item.unitPrice <= 0
    )

    if (hasInvalidItem) {
      toast.error("Each item must have a name, quantity, and unit price.")
      return
    }

    const payload = {
      customerName,
      invoiceNumber,
      invoiceDate,
      subtotal: subtotalBeforeDiscount,
      grandTotal,
      items: invoiceItems.map(item => ({
        itemName: item.itemName,
        qty: item.qty,
        unitPrice: item.unitPrice,
        discount: item.discount,
        lineTotal: item.lineTotal
      }))
    };

    try {
      const response = await postInvoiceWithFallback(payload)
      if (response.ok) {
        toast.success("Sale confirmed!", {
          description: `Invoice ${invoiceNumber} has been saved successfully.`,
        })
        setCustomerName("")
        setInvoiceNumber(`INV-${Date.now()}`)
        setInvoiceItems([])
      } else {
        const errorText = await response.text()
        toast.error(errorText || "Failed to save invoice.")
      }
    } catch (error) {
      console.error("Error saving invoice:", error)
      toast.error("Error saving invoice.")
    }
  }

  const handleCancel = () => {
    setCustomerName("");
    setInvoiceNumber(`INV-${Date.now()}`);
    setInvoiceItems([]);
  }

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
          <div className="grid grid-cols-3 gap-4">
            <FieldGroup>
              <Field>
                <FieldLabel>Customer</FieldLabel>
                <Input 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  placeholder="Enter customer name" 
                />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Invoice #</FieldLabel>
                <Input value={invoiceNumber} disabled className="bg-muted" />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Date</FieldLabel>
                <Input 
                  type="date" 
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
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
                  <TableHead className="w-[120px] text-right">Line Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.itemName}
                        onChange={(e) => updateInvoiceItem(item.id, "itemName", e.target.value)}
                        placeholder="Enter item name"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.qty === 0 ? "" : item.qty}
                        onChange={(e) =>
                          updateInvoiceItem(item.id, "qty", parseInteger(e.target.value))
                        }
                        className="w-full"
                        min={1}
                        step={1}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        placeholder="Unit price"
                        value={item.unitPrice === 0 ? "" : item.unitPrice}
                        onChange={(e) =>
                          updateInvoiceItem(item.id, "unitPrice", parseNumber(e.target.value))
                        }
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        placeholder="Discount %"
                        value={item.discount === 0 ? "" : item.discount}
                        onChange={(e) =>
                          updateInvoiceItem(item.id, "discount", parseNumber(e.target.value))
                        }
                        className="w-full"
                        min={0}
                        max={100}
                      />
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
                <span className="text-muted-foreground">Subtotal (Before Discount)</span>
                <span>Rs. {subtotalBeforeDiscount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount Amount</span>
                <span>- Rs. {discountAmount.toLocaleString()}</span>
              </div>

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
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleConfirmSale}>Confirm Sale</Button>
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
