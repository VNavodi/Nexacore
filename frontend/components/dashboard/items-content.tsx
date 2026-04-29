"use client"

import { useState, useEffect } from "react"
import { Search, Download, Plus, Pencil, Trash2, X, Settings2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from "@/components/ui/sheet"

// ── Types ──────────────────────────────────────────────
type Item = {
  id: number
  sku: string
  name: string
  description?: string
  price: number
  stockQuantity: number
  category: string
}

type NewItemForm = {
  sku: string
  name: string
  description: string
  category: string
  price: number
  stockQuantity: number
}

const EMPTY_FORM: NewItemForm = {
  sku: "",
  name: "",
  description: "",
  category: "",
  price: 0,
  stockQuantity: 0,
}

const API = "http://localhost:8080/api/v1/products"

// ── Helper ─────────────────────────────────────────────
function getStatus(qty: number) {
  if (qty === 0) return "Out of Stock"
  if (qty < 10) return "Low Stock"
  return "In Stock"
}

function getStatusVariant(status: string) {
  if (status === "In Stock") return "default"
  if (status === "Low Stock") return "secondary"
  return "destructive"
}

export function ItemsContent() {
  const [items, setItems] = useState<Item[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [form, setForm] = useState<NewItemForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // ── Load items from backend ──
  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    try {
      const token = localStorage.getItem("token") // JWT token
      const res = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch {
      // backend down වෙලා නැත්නම් sample data show කරන්න
      setItems([])
    }
  }

  // ── Form field change handler ──
  function handleChange(field: keyof NewItemForm, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // ── Save new item ──
  async function handleSave() {
    setError("")

    // Basic validation
    if (!form.sku.trim()) { setError("SKU is required"); return }
    if (!form.name.trim()) { setError("Item name is required"); return }
    if (!form.category) { setError("Category is required"); return }

    setSaving(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          stockQuantity: Number(form.stockQuantity),
          category: form.category,
          sku: form.sku,
        }),
      })

      if (res.ok) {
        await fetchItems()          // table refresh
        setForm(EMPTY_FORM)         // form reset
        setIsModalOpen(false)
      } else {
        const msg = await res.text()
        setError(msg || "Save failed. Try again.")
      }
    } catch {
      setError("Cannot connect to server. Check backend is running.")
    } finally {
      setSaving(false)
    }
  }

  // ── Delete item ──
  async function handleDelete(id: number) {
    if (!confirm("Delete this item?")) return
    const token = localStorage.getItem("token")
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Items & Stock</h1>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search items..." className="pl-9 w-[280px]" />
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="grocery">Grocery</SelectItem>
                  <SelectItem value="kitchenware">Kitchenware</SelectItem>
                  <SelectItem value="apparel">Apparel</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setIsSheetOpen(true)}>
                <Settings2 className="mr-2 h-4 w-4" /> Stock Adjustment
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
              <Button onClick={() => { setForm(EMPTY_FORM); setError(""); setIsModalOpen(true) }}>
                <Plus className="mr-2 h-4 w-4" /> New Item
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"><Checkbox /></TableHead>
                <TableHead className="w-[120px]">SKU</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead className="w-[140px]">Category</TableHead>
                <TableHead className="w-[130px] text-right">Stock</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No items found. Click &quot;New Item&quot; to add one.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => {
                const status = getStatus(item.stockQuantity)
                return (
                  <TableRow key={item.id}>
                    <TableCell><Checkbox /></TableCell>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right font-medium">{item.stockQuantity}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(status)}>{status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── New Item Modal ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Item</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="stock">Stock</TabsTrigger>
            </TabsList>

            {/* Basic Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  placeholder="e.g. SKU-001"
                  value={form.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter item name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => handleChange("category", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Grocery">Grocery</SelectItem>
                    <SelectItem value="Kitchenware">Kitchenware</SelectItem>
                    <SelectItem value="Apparel">Apparel</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter item description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Selling Price *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={form.price || ""}
                  onChange={(e) => handleChange("price", e.target.value)}
                />
              </div>
            </TabsContent>

            {/* Stock Tab */}
            <TabsContent value="stock" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="openingStock">Opening Stock</Label>
                <Input
                  id="openingStock"
                  type="number"
                  placeholder="0"
                  value={form.stockQuantity || ""}
                  onChange={(e) => handleChange("stockQuantity", e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Error message */}
          {error && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock Adjustment Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-[400px]">
          <SheetHeader>
            <SheetTitle>Quick Stock Adjustment</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4 px-4">
            <div className="grid gap-2">
              <Label>SKU</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select item SKU" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.id} value={item.sku}>
                      {item.sku} - {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adjustment">Adjustment (+/-)</Label>
              <Input id="adjustment" type="number" placeholder="e.g. -5 or +10" />
              <p className="text-xs text-muted-foreground">
                Positive to add, negative to reduce
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Reason</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="audit">Audit Adjustment</SelectItem>
                  <SelectItem value="return">Customer Return</SelectItem>
                  <SelectItem value="found">Found/Recovered</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Add notes..." className="min-h-[100px]" />
            </div>
          </div>
          <SheetFooter>
            <Button className="w-full" onClick={() => setIsSheetOpen(false)}>
              Apply Adjustment
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}