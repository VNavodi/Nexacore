"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Download, Plus, Pencil, Trash2, Settings2, Loader2, CheckCircle2, AlertCircle, RefreshCw, Barcode } from "lucide-react"
import JsBarcode from "jsbarcode"
import { toast } from "sonner"
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

function getStockLevelStyle(stockOnHand: number, reorderLevel: number) {
  if (stockOnHand <= 0) return "bg-red-500 text-white"
  // if (stockOnHand <= reorderLevel) return "bg-red-500 text-white"
  if (stockOnHand > reorderLevel ) return "bg-green-100 text-green-700"
  return "bg-slate-100 text-slate-700"
}

function getSyncStatusBadge(status: string) {
  switch (status) {
    case "Synced":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 gap-1 px-2 py-1 h-auto font-medium">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Synced
        </Badge>
      )
    case "Sync Failed":
      return (
        <button 
          onClick={() => toast.error("Sync failed: Connection timeout with POS system.", {
            description: "Click to retry synchronization.",
            action: {
              label: "Retry",
              onClick: () => toast.success("Retrying sync...")
            }
          })}
          className="transition-transform active:scale-95"
        >
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 gap-1 px-2 py-1 h-auto font-medium cursor-pointer">
            <AlertCircle className="h-3.5 w-3.5" />
            Sync Failed
          </Badge>
        </button>
      )
    case "Syncing":
      return (
        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 gap-1 px-2 py-1 h-auto font-medium">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          Syncing
        </Badge>
      )
    default:
      return null
  }
}

export function ItemsContent() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTableLoading, setIsTableLoading] = useState(true)
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
  const [barcodeDialogOpen, setBarcodeDialogOpen] = useState(false)
  const [activeBarcodeItem, setActiveBarcodeItem] = useState<ProductResponse | null>(null)
  const [isSyncVisible, setIsSyncVisible] = useState(true)

  const loadProducts = async (showLoading = true) => {
    if (showLoading) {
      setIsTableLoading(true)
    }
    try {
      const data = await ProductAPI.getAllProducts()
      setProducts(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch products")
    } finally {
      setIsTableLoading(false)
    }
  }

  useEffect(() => {
    // Initial table hydration from backend API
    void loadProducts(false)

    // Check sync status visibility
    const checkSyncVisibility = () => {
      const savedSync = localStorage.getItem("nexacore_auto_sync_enabled")
      setIsSyncVisible(savedSync === null || savedSync === "true")
    }

    checkSyncVisibility()

    // Listen for changes from Integrations page
    window.addEventListener("syncSettingsChanged", checkSyncVisibility)
    return () => window.removeEventListener("syncSettingsChanged", checkSyncVisibility)
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
      toast.error("SKU is required")
      return false
    }
    if (!itemName.trim()) {
      toast.error("Item name is required")
      return false
    }
    if (!category) {
      toast.error("Category is required")
      return false
    }
    if (!costPrice || isNaN(parseFloat(costPrice))) {
      toast.error("Valid cost price is required")
      return false
    }
    if (!sellingPrice || isNaN(parseFloat(sellingPrice))) {
      toast.error("Valid selling price is required")
      return false
    }
    if (!openingStock || isNaN(parseInt(openingStock))) {
      toast.error("Valid opening stock quantity is required")
      return false
    }
    return true
  }

  const handleSaveItem = async () => {
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
      toast.success("Item created successfully!", {
        description: `${itemName.trim()} has been added to inventory.`,
      })
      await loadProducts()
      resetForm()
      setIsModalOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save product")
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
    const normalizedSku = adjustSku.trim()
    if (!normalizedSku) {
      toast.error("SKU is required for stock adjustment")
      return
    }
    if (!matchedAdjustmentItem) {
      toast.error("No item found for the entered SKU")
      return
    }
    const parsedAdjustment = Number.parseInt(adjustmentValue, 10)
    if (!adjustmentValue || Number.isNaN(parsedAdjustment) || parsedAdjustment === 0) {
      toast.error("Enter a valid non-zero adjustment value")
      return
    }
    if (!adjustReason) {
      toast.error("Please select a reason")
      return
    }

    setIsAdjustingStock(true)
    try {
      const request: StockAdjustmentRequest = {
        sku: normalizedSku,
        quantity: parsedAdjustment,
        operation: "adjustment",
        reason: adjustReason,
        notes: adjustNotes.trim() || undefined,
      }
      await ProductAPI.adjustStock(request)
      await loadProducts()
      toast.success(`Stock adjusted for ${matchedAdjustmentItem.name}`, {
        description: `New stock on hand has been updated.`,
      })
      resetAdjustmentForm()
      setIsSheetOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to apply stock adjustment")
    } finally {
      setIsAdjustingStock(false)
    }
  }

  const handleShowBarcode = (item: ProductResponse) => {
    setActiveBarcodeItem(item)
    setBarcodeDialogOpen(true)
  }

  const downloadBarcode = () => {
    if (!activeBarcodeItem) return

    const canvas = document.createElement("canvas")
    JsBarcode(canvas, activeBarcodeItem.sku, {
      format: "CODE128",
      lineColor: "#000",
      width: 2,
      height: 100,
      displayValue: true,
      fontSize: 20,
      margin: 10,
      background: "#fff"
    })

    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = `barcode_${activeBarcodeItem.sku}.png`
    link.click()
    toast.success(`Barcode for ${activeBarcodeItem.sku} downloaded`)
  }

  useEffect(() => {
    if (barcodeDialogOpen && activeBarcodeItem) {
      const timer = setTimeout(() => {
        const element = document.getElementById("barcode-svg")
        if (element) {
          JsBarcode(element, activeBarcodeItem.sku, {
            format: "CODE128",
            width: 2,
            height: 80,
            displayValue: true,
          })
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [barcodeDialogOpen, activeBarcodeItem])

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
              {/* <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button> */}
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
                <TableHead className="w-[120px] text-center">Barcode</TableHead>
                <TableHead className="w-[150px] text-center">Stock Level</TableHead>
                {isSyncVisible && <TableHead className="w-[140px] text-center">Sync Status</TableHead>}
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isTableLoading ? (
                <TableRow>
                  <TableCell colSpan={isSyncVisible ? 7 : 6} className="text-center py-8 text-muted-foreground">
                    Loading items...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isSyncVisible ? 7 : 6} className="text-center py-8 text-muted-foreground">
                    No items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((item) => (
                <TableRow key={item.id}>
                  
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleShowBarcode(item)}
                      title="View Barcode"
                    >
                      <Barcode className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStockLevelStyle(item.stockOnHand, item.reorderLevel)}`}>
                      {item.stockOnHand} in stock
                    </span>
                  </TableCell>
                  {isSyncVisible && (
                    <TableCell className="text-center">
                      {/* Mocking sync status based on ID for demonstration */}
                      {getSyncStatusBadge(
                        item.id % 3 === 0 ? "Synced" : 
                        item.id % 3 === 1 ? "Sync Failed" : "Syncing"
                      )}
                    </TableCell>
                  )}
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

      {/* Barcode Dialog */}
      <Dialog open={barcodeDialogOpen} onOpenChange={setBarcodeDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Item Barcode</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <svg id="barcode-svg"></svg>
            </div>
            <div className="text-center space-y-1">
              <p className="font-semibold text-lg">{activeBarcodeItem?.name}</p>
              <p className="text-sm text-muted-foreground">SKU: {activeBarcodeItem?.sku}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBarcodeDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={downloadBarcode}>
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
