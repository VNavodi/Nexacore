"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Download, Plus, Pencil, Trash2, Settings2, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  ProductAPI,
  ProductRequest,
  ProductResponse,
  StockAdjustmentRequest,
} from "@/lib/api/productAPI"

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
  const [isLoading, setIsLoading] = useState(false)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isGeneratingSku, setIsGeneratingSku] = useState(false)
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Form state
  const [sku, setSku] = useState("SKU-001")
  const [itemName, setItemName] = useState("")
  const [category, setCategory] = useState("")
  const [costPrice, setCostPrice] = useState("")
  const [sellingPrice, setSellingPrice] = useState("")
  const [openingStock, setOpeningStock] = useState("")
  const [reorderLevel, setReorderLevel] = useState("")
  const [adjustSku, setAdjustSku] = useState("")
  const [adjustmentValue, setAdjustmentValue] = useState("")
  const [adjustReason, setAdjustReason] = useState("")
  const [adjustNotes, setAdjustNotes] = useState("")
  const [isAdjustingStock, setIsAdjustingStock] = useState(false)

  const loadProducts = async (showLoading = true) => {
    if (showLoading) {
      setIsTableLoading(true)
    }
    try {
      const data = await ProductAPI.getAllProducts()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products")
    } finally {
      setIsTableLoading(false)
    }
  }

  useEffect(() => {
    // Initial table hydration from backend API without sync state update in effect chain.
    void loadProducts(false)
  }, [])

  const getStockStatus = (stockOnHand: number, reorderLevel: number) => {
    if (stockOnHand <= 0) return "Out of Stock"
    if (reorderLevel > stockOnHand) return "Low Stock"
    return "In Stock"
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        categoryFilter === "all" || product.category.toLowerCase() === categoryFilter.toLowerCase()
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, categoryFilter])

  const generateNextSku = async () => {
    setIsGeneratingSku(true)
    try {
      const products = await ProductAPI.getAllProducts()
      const maxSkuNumber = products.reduce((max, product) => {
        const match = product.sku?.match(/^SKU-(\d+)$/i)
        if (!match) return max
        const value = Number.parseInt(match[1], 10)
        return Number.isNaN(value) ? max : Math.max(max, value)
      }, 0)
      setSku(`SKU-${String(maxSkuNumber + 1).padStart(3, "0")}`)
    } catch {
      setSku("SKU-001")
    } finally {
      setIsGeneratingSku(false)
    }
  }

  const validateForm = (): boolean => {
    if (!sku.trim()) {
      setError("SKU is required")
      return false
    }
    if (!itemName.trim()) {
      setError("Item name is required")
      return false
    }
    if (!category) {
      setError("Category is required")
      return false
    }
    if (!costPrice || isNaN(parseFloat(costPrice))) {
      setError("Valid cost price is required")
      return false
    }
    if (!sellingPrice || isNaN(parseFloat(sellingPrice))) {
      setError("Valid selling price is required")
      return false
    }
    if (!openingStock || isNaN(parseInt(openingStock))) {
      setError("Valid opening stock quantity is required")
      return false
    }
    setError(null)
    return true
  }

  const handleSaveItem = async () => {
    setError(null)
    setSuccess(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const productRequest: ProductRequest = {
        sku: sku.trim(),
        name: itemName.trim(),
        category,
        costPrice: parseFloat(costPrice),
        sellingPrice: parseFloat(sellingPrice),
        openingStock: parseInt(openingStock),
        reorderLevel: reorderLevel ? parseInt(reorderLevel) : 0,
      }

      await ProductAPI.createProduct(productRequest)
      setSuccess("Product created successfully!")
      await loadProducts()

      // Reset form
      resetForm()
      setIsModalOpen(false)

      // Optionally refresh the product list here
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSku("SKU-001")
    setItemName("")
    setCategory("")
    setCostPrice("")
    setSellingPrice("")
    setOpeningStock("")
    setReorderLevel("")
    setError(null)
    setSuccess(null)
  }

  const handleCloseModal = () => {
    resetForm()
    setIsModalOpen(false)
  }

  const handleOpenModal = async () => {
    resetForm()
    setIsModalOpen(true)
    await generateNextSku()
  }

  const matchedAdjustmentItem = useMemo(
    () => products.find((product) => product.sku.toLowerCase() === adjustSku.trim().toLowerCase()),
    [products, adjustSku]
  )

  const resetAdjustmentForm = () => {
    setAdjustSku("")
    setAdjustmentValue("")
    setAdjustReason("")
    setAdjustNotes("")
  }

  const handleApplyAdjustment = async () => {
    setError(null)
    setSuccess(null)

    const enteredSku = adjustSku.trim()
    if (!enteredSku) {
      setError("SKU is required for stock adjustment")
      return
    }
    if (!matchedAdjustmentItem) {
      setError("No item found for the entered SKU")
      return
    }
    const parsedAdjustment = Number.parseInt(adjustmentValue, 10)
    if (!adjustmentValue || Number.isNaN(parsedAdjustment) || parsedAdjustment === 0) {
      setError("Enter a valid non-zero adjustment value")
      return
    }
    if (!adjustReason) {
      setError("Please select a reason")
      return
    }

    setIsAdjustingStock(true)
    try {
      const request: StockAdjustmentRequest = {
        // Always send the exact SKU stored in backend to avoid case mismatch failures.
        sku: matchedAdjustmentItem.sku,
        quantity: parsedAdjustment,
        operation: "adjustment",
        reason: adjustReason,
        notes: adjustNotes.trim() || undefined,
      }
      await ProductAPI.adjustStock(request)
      await loadProducts()
      setSuccess(`Stock adjusted for ${matchedAdjustmentItem.name}`)
      resetAdjustmentForm()
      setIsSheetOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to apply stock adjustment")
    } finally {
      setIsAdjustingStock(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Items & Stock</h1>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
          {error}
        </div>
      )}

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
              <Button onClick={handleOpenModal}>
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
                
                <TableHead className="w-[120px]">SKU</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead className="w-[140px]">Category</TableHead>
                <TableHead className="w-[130px] text-right">Stock on Hand</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isTableLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Loading items...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((item) => (
                <TableRow key={item.id}>
                  
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right font-medium">
                    {item.stockOnHand}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(getStockStatus(item.stockOnHand, item.reorderLevel))}>
                      {getStockStatus(item.stockOnHand, item.reorderLevel)}
                    </Badge>
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Item Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU Code</Label>
              <Input id="sku" value={sku} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">
                Auto-generated 
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                placeholder="Enter item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="costPrice">Cost Price</Label>
                <Input
                  id="costPrice"
                  type="number"
                  placeholder="0.00"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sellingPrice">Selling Price</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  placeholder="0.00"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="openingStock">Opening Stock</Label>
                <Input
                  id="openingStock"
                  type="number"
                  placeholder="0"
                  value={openingStock}
                  onChange={(e) => setOpeningStock(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reorderLevel">Reorder Level</Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  placeholder="0"
                  value={reorderLevel}
                  onChange={(e) => setReorderLevel(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem} disabled={isLoading || isGeneratingSku}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Saving..." : "Save Item"}
            </Button>
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
              <Input
                id="adjustSku"
                placeholder="Enter item SKU"
                value={adjustSku}
                onChange={(e) => setAdjustSku(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
              Enter in the format SKU-000. (Example: SKU-001.)                    
              </p>
               
            </div>

            <div className="grid gap-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                value={matchedAdjustmentItem?.name ?? ""}
                disabled
                className="bg-muted"
                placeholder="Item name will appear after SKU match"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="currentQty">Current Quantity</Label>
              <Input
                id="currentQty"
                value={matchedAdjustmentItem?.stockOnHand?.toString() ?? ""}
                disabled
                className="bg-muted"
                placeholder="Current quantity will appear after SKU match"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="adjustment">Adjustment (+/-)</Label>
              <Input
                id="adjustment"
                type="number"
                placeholder="Enter adjustment value"
                value={adjustmentValue}
                onChange={(e) => setAdjustmentValue(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Use positive values to add stock, negative to reduce
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Select value={adjustReason} onValueChange={setAdjustReason}>
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
                value={adjustNotes}
                onChange={(e) => setAdjustNotes(e.target.value)}
              />
            </div>
          </div>
          <SheetFooter>
            <Button className="w-full" onClick={handleApplyAdjustment} disabled={isAdjustingStock}>
              {isAdjustingStock && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isAdjustingStock ? "Applying..." : "Apply Adjustment"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
