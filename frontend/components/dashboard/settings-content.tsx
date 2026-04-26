"use client"

import { useState } from "react"
import {
  Settings,
  Users,
  Receipt,
  Bell,
  Globe,
  Database,
  Upload,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Download,
  Mail,
  MessageSquare,
  Smartphone,
  Check,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const settingsSections = [
  { id: "general", label: "General", icon: Settings },
  { id: "users", label: "Users & Roles", icon: Users },
  { id: "tax", label: "Tax Rules", icon: Receipt },
  { id: "alerts", label: "Alerts & Notifications", icon: Bell },
  { id: "language", label: "Language & Region", icon: Globe },
  { id: "backup", label: "Backup & Sync", icon: Database },
]

// Sample data for users
const sampleUsers = [
  { id: 1, name: "John Doe", email: "john@company.com", role: "Owner", lastActive: "2 hours ago" },
  { id: 2, name: "Jane Smith", email: "jane@company.com", role: "Accountant", lastActive: "1 day ago" },
  { id: 3, name: "Mike Johnson", email: "mike@company.com", role: "Staff", lastActive: "3 hours ago" },
]

// Sample tax rules
const sampleTaxRules = [
  { id: 1, name: "VAT", rate: 18, appliesTo: "All Items", active: true },
  { id: 2, name: "SSCL", rate: 2.5, appliesTo: "All Items", active: true },
  { id: 3, name: "PAL", rate: 5, appliesTo: "Imported Items", active: true },
  { id: 4, name: "NBT", rate: 2, appliesTo: "Services", active: false },
]

// Sample low stock items
const sampleLowStockItems = [
  { id: 1, name: "Widget A", currentThreshold: 10 },
  { id: 2, name: "Gadget B", currentThreshold: 5 },
  { id: 3, name: "Component C", currentThreshold: 15 },
]

export function SettingsContent() {
  const [activeSection, setActiveSection] = useState("general")
  const [inviteUserOpen, setInviteUserOpen] = useState(false)
  const [addTaxRuleOpen, setAddTaxRuleOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
      </div>

      <div className="flex gap-6">
        {/* Left Navigation */}
        <Card className="w-64 shrink-0 h-fit">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {settingsSections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </button>
                )
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Right Content Area */}
        <div className="flex-1">
          {activeSection === "general" && <GeneralPanel />}
          {activeSection === "users" && (
            <UsersPanel 
              onInviteUser={() => setInviteUserOpen(true)} 
            />
          )}
          {activeSection === "tax" && (
            <TaxRulesPanel 
              onAddRule={() => setAddTaxRuleOpen(true)} 
            />
          )}
          {activeSection === "alerts" && <AlertsPanel />}
          {activeSection === "language" && <LanguagePanel />}
          {activeSection === "backup" && <BackupPanel />}
        </div>
      </div>

      {/* Invite User Modal */}
      <Dialog open={inviteUserOpen} onOpenChange={setInviteUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Send an invitation to a new team member.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invite-name">Full Name</Label>
                <Input id="invite-name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email</Label>
                <Input id="invite-email" type="email" placeholder="john@company.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-role">Role</Label>
              <Select defaultValue="staff">
                <SelectTrigger id="invite-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="accountant">Accountant</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="perm-view" defaultChecked />
                  <label htmlFor="perm-view" className="text-sm">View Reports</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="perm-edit" defaultChecked />
                  <label htmlFor="perm-edit" className="text-sm">Edit Items</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="perm-create" defaultChecked />
                  <label htmlFor="perm-create" className="text-sm">Create Orders</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="perm-delete" />
                  <label htmlFor="perm-delete" className="text-sm">Delete Records</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="perm-settings" />
                  <label htmlFor="perm-settings" className="text-sm">Manage Settings</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="perm-users" />
                  <label htmlFor="perm-users" className="text-sm">Manage Users</label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setInviteUserOpen(false)}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tax Rule Modal */}
      <Dialog open={addTaxRuleOpen} onOpenChange={setAddTaxRuleOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add Tax Rule</DialogTitle>
            <DialogDescription>
              Create a new tax rule for your business.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tax-name">Tax Name</Label>
              <Input id="tax-name" placeholder="e.g., VAT, GST" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax-rate">Rate (%)</Label>
                <Input id="tax-rate" type="number" placeholder="0.00" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-applies">Applies To</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="tax-applies">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="products">Products Only</SelectItem>
                    <SelectItem value="services">Services Only</SelectItem>
                    <SelectItem value="imported">Imported Items</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="tax-active" defaultChecked />
              <Label htmlFor="tax-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTaxRuleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddTaxRuleOpen(false)}>
              Add Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// General Settings Panel
function GeneralPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Configure your business information and preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="business-name">Business Name</Label>
            <Input id="business-name" placeholder="Your Business Name" defaultValue="Nexacore Inventory" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact Number</Label>
            <Input id="contact" placeholder="+94 XX XXX XXXX" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Business Address</Label>
          <Textarea 
            id="address" 
            placeholder="123 Main Street, Colombo, Sri Lanka"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Business Logo</Label>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50">
              <Upload className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
            <Select defaultValue="lkr">
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lkr">LKR - Sri Lankan Rupee</SelectItem>
                <SelectItem value="usd">USD - US Dollar</SelectItem>
                <SelectItem value="eur">EUR - Euro</SelectItem>
                <SelectItem value="gbp">GBP - British Pound</SelectItem>
                <SelectItem value="inr">INR - Indian Rupee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fiscal-year">Fiscal Year Start</Label>
            <Select defaultValue="april">
              <SelectTrigger id="fiscal-year">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="january">January</SelectItem>
                <SelectItem value="april">April</SelectItem>
                <SelectItem value="july">July</SelectItem>
                <SelectItem value="october">October</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Users & Roles Panel
function UsersPanel({ onInviteUser }: { onInviteUser: () => void }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Users & Roles</CardTitle>
          <CardDescription>Manage team members and their permissions.</CardDescription>
        </div>
        <Button onClick={onInviteUser}>
          <Plus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      user.role === "Owner" 
                        ? "default" 
                        : user.role === "Accountant" 
                        ? "secondary" 
                        : "outline"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-3">Role Permissions Reference</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-foreground">Owner</p>
              <p className="text-muted-foreground">Full access to all features</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Accountant</p>
              <p className="text-muted-foreground">Financial reports, invoices, payments</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Staff</p>
              <p className="text-muted-foreground">Inventory, orders, basic reports</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Tax Rules Panel
function TaxRulesPanel({ onAddRule }: { onAddRule: () => void }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tax Rules</CardTitle>
          <CardDescription>Configure tax rates and rules for your business.</CardDescription>
        </div>
        <Button onClick={onAddRule}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-muted/50 rounded-lg flex items-center gap-2">
          <Receipt className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Rules stored in <code className="px-1 py-0.5 bg-muted rounded text-xs">config/tax-rules.yaml</code>
          </span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tax Name</TableHead>
              <TableHead>Rate %</TableHead>
              <TableHead>Applies To</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleTaxRules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>{rule.rate}%</TableCell>
                <TableCell>{rule.appliesTo}</TableCell>
                <TableCell>
                  <Switch defaultChecked={rule.active} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
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
  )
}

// Alerts & Notifications Panel
function AlertsPanel() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Thresholds</CardTitle>
          <CardDescription>Set minimum stock levels for alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Current Threshold</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleLowStockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        defaultValue={item.currentThreshold} 
                        className="w-20 h-8"
                      />
                      <span className="text-sm text-muted-foreground">units</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="outline" size="sm" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Item Threshold
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>Choose how you want to receive alerts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-muted-foreground">Receive alerts via WhatsApp</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium">SMS</p>
                <p className="text-sm text-muted-foreground">Receive alerts via SMS</p>
              </div>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">Receive alerts via Email</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Language & Region Panel
function LanguagePanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Language & Region</CardTitle>
        <CardDescription>Configure language preferences and regional settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-4">Enabled Languages</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇬🇧</span>
                <div>
                  <p className="font-medium">English (en)</p>
                  <p className="text-sm text-muted-foreground">Default system language</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge>Default</Badge>
                <Switch defaultChecked disabled />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇱🇰</span>
                <div>
                  <p className="font-medium">Sinhala (si)</p>
                  <p className="text-sm text-muted-foreground">සිංහල භාෂාව</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇱🇰</span>
                <div>
                  <p className="font-medium">Tamil (ta)</p>
                  <p className="text-sm text-muted-foreground">தமிழ் மொழி</p>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="default-lang">Default Language</Label>
          <Select defaultValue="en">
            <SelectTrigger id="default-lang" className="w-64">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="si">Sinhala</SelectItem>
              <SelectItem value="ta">Tamil</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="date-format">Date Format</Label>
            <Select defaultValue="dmy">
              <SelectTrigger id="date-format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select defaultValue="colombo">
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="colombo">Asia/Colombo (GMT+5:30)</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="london">Europe/London</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Backup & Sync Panel
function BackupPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup & Sync</CardTitle>
        <CardDescription>Manage data backup and synchronization settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Last Sync</p>
              <p className="text-sm text-muted-foreground">April 26, 2026 at 10:45 AM</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Check className="h-3 w-3" />
                Synced
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Force Sync Now
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Export as JSON</DropdownMenuItem>
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as SQL Dump</DropdownMenuItem>
              <DropdownMenuItem>Full Backup (ZIP)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <Label htmlFor="auto-backup">Auto-backup Frequency</Label>
          <Select defaultValue="daily">
            <SelectTrigger id="auto-backup" className="w-64">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Every Hour</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="never">Never (Manual Only)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Backup History</h4>
          <div className="border rounded-lg divide-y">
            <div className="flex items-center justify-between p-3">
              <div>
                <p className="text-sm font-medium">backup_2026-04-26.zip</p>
                <p className="text-xs text-muted-foreground">12.4 MB • April 26, 2026</p>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-3">
              <div>
                <p className="text-sm font-medium">backup_2026-04-25.zip</p>
                <p className="text-xs text-muted-foreground">12.1 MB • April 25, 2026</p>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-3">
              <div>
                <p className="text-sm font-medium">backup_2026-04-24.zip</p>
                <p className="text-xs text-muted-foreground">11.9 MB • April 24, 2026</p>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-lg">
          <h4 className="font-medium text-destructive mb-2">Danger Zone</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Permanently delete all data. This action cannot be undone.
          </p>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All Data
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
