"use client"

import { useState } from "react"
import { Search, Download, Plus, Pencil, Trash2, X, Settings2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"

// Sample data structure for display
const sampleItems = [
  {
    id: 1,
    sku: "SKU-001",
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    stockOnHand: 145,
    status: "In Stock",
    attributes: ["Batch", "Warranty"],
  },
  {
    id: 2,
    sku: "SKU-002",
    name: "Organic Green Tea - 100g",
    category: "Grocery",
    stockOnHand: 8,
    status: "Low Stock",
    attributes: ["Expiry", "Batch"],
  },
  {
    id: 3,
    sku: "SKU-003",
    name: "Stainless Steel Water Bottle",
    category: "Kitchenware",
    stockOnHand: 0,
    status: "Out of Stock",
    attributes: ["Rack"],
  },
  {
    id: 4,
    sku: "SKU-004",
    name: "Cotton T-Shirt - Medium",
    category: "Apparel",
    stockOnHand: 52,
    status: "In Stock",
    attributes: ["Size", "Color"],
  },
  {
    id: 5,
    sku: "SKU-005",
    name: "Vitamin D3 Supplements",
    category: "Health",
    stockOnHand: 3,
    status: "Low Stock",
    attributes: ["Expiry", "Batch", "Rack"],
  },
]

function getStatusVariant(status: string) {
  switch (status) {
    case "In Stock":
      return "default"
    case "Low Stock":
      return "secondary"
    case "Out of Stock":
      return "destructive"
    default:
      return "outline"
  }
}

export function ItemsContent() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Items & Stock</h1>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Search and Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  className="pl-9 w-[280px]"
                />
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

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setIsSheetOpen(true)}>
                <Settings2 className="mr-2 h-4 w-4" />
                Stock Adjustment
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Item
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
                <TableHead className="w-[50px]">
                  <Checkbox />
                </TableHead>
                <TableHead className="w-[120px]">SKU</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead className="w-[140px]">Category</TableHead>
                <TableHead className="w-[130px] text-right">Stock on Hand</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[200px]">Custom Attributes</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right font-medium">
                    {item.stockOnHand}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.attributes.map((attr) => (
                        <span
                          key={attr}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground"
                        >
                          {attr}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Item Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Item</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="basic" className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="pricing">Pricing & Tax</TabsTrigger>
              <TabsTrigger value="stock">Stock</TabsTrigger>
              <TabsTrigger value="attributes">Custom Attributes</TabsTrigger>
            </TabsList>

            {/* Basic Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="Enter SKU code" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input id="name" placeholder="Enter item name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="grocery">Grocery</SelectItem>
                      <SelectItem value="kitchenware">Kitchenware</SelectItem>
                      <SelectItem value="apparel">Apparel</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter item description" />
                </div>
              </div>
            </TabsContent>

            {/* Pricing & Tax Tab */}
            <TabsContent value="pricing" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="costPrice">Cost Price</Label>
                    <Input id="costPrice" type="number" placeholder="0.00" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sellingPrice">Selling Price</Label>
                    <Input id="sellingPrice" type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input id="taxRate" type="number" placeholder="0" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="taxType">Tax Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tax type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inclusive">Inclusive</SelectItem>
                        <SelectItem value="exclusive">Exclusive</SelectItem>
                        <SelectItem value="exempt">Exempt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Stock Tab */}
            <TabsContent value="stock" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="openingStock">Opening Stock</Label>
                    <Input id="openingStock" type="number" placeholder="0" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reorderLevel">Reorder Level</Label>
                    <Input id="reorderLevel" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="warehouse">Warehouse</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">Main Warehouse</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="outlet">Retail Outlet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit of Measure</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="l">Liters (L)</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Custom Attributes Tab */}
            <TabsContent value="attributes" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Dynamic Fields (JSONB)</h4>
                    <p className="text-xs text-muted-foreground">
                      Add custom key-value pairs for this item
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Field
                  </Button>
                </div>

                <div className="space-y-3">
                  {/* Example dynamic fields */}
                  <div className="flex items-center gap-3">
                    <Input placeholder="Key" defaultValue="Expiry" className="flex-1" />
                    <Input placeholder="Value" defaultValue="2026-12-31" className="flex-1" />
                    <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input placeholder="Key" defaultValue="Batch" className="flex-1" />
                    <Input placeholder="Value" defaultValue="BTH-2024-001" className="flex-1" />
                    <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input placeholder="Key" defaultValue="Rack" className="flex-1" />
                    <Input placeholder="Value" defaultValue="A-12" className="flex-1" />
                    <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsModalOpen(false)}>Save Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock Adjustment Panel - Right Side Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-[400px]">
          <SheetHeader>
            <SheetTitle>Quick Stock Adjustment</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4 px-4">
            <div className="grid gap-2">
              <Label htmlFor="adjustSku">SKU</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select item SKU" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SKU-001">SKU-001 - Wireless Headphones</SelectItem>
                  <SelectItem value="SKU-002">SKU-002 - Organic Green Tea</SelectItem>
                  <SelectItem value="SKU-003">SKU-003 - Water Bottle</SelectItem>
                  <SelectItem value="SKU-004">SKU-004 - Cotton T-Shirt</SelectItem>
                  <SelectItem value="SKU-005">SKU-005 - Vitamin D3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="currentQty">Current Quantity</Label>
              <Input id="currentQty" value="145" disabled className="bg-muted" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="adjustment">Adjustment (+/-)</Label>
              <Input id="adjustment" type="number" placeholder="Enter adjustment value" />
              <p className="text-xs text-muted-foreground">
                Use positive values to add stock, negative to reduce
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
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
              <Textarea
                id="notes"
                placeholder="Add any additional notes..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <SheetFooter>
            <Button className="w-full" onClick={() => setIsSheetOpen(false)}>Apply Adjustment</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
