"use client"

import { useState, useEffect } from "react"
import { 
  RefreshCw, 
  Copy, 
  Key, 
  Webhook, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  Zap,
  ArrowRightLeft
} from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export function IntegrationsContent() {
  const [webhookUrl] = useState("https://yourapi.com/api/v1/sales/webhook")
  const [secretKey, setSecretKey] = useState("sk_live_51pX9v..." + Math.random().toString(36).substring(7))
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(true)

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const regenerateKey = () => {
    const newKey = "sk_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setSecretKey(newKey)
    toast.info("New secret key generated. Remember to update your POS settings.")
  }

  const testConnection = () => {
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
      toast.success("Connection test successful! Your POS is communicating with the stock module.")
    }, 1500)
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">Manage connections between your POS system and inventory.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Configuration Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Webhook className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>POS Webhook Integration</CardTitle>
                  <CardDescription>Connect your Point of Sale system to automate stock updates.</CardDescription>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={isConnected 
                    ? "bg-green-500/10 text-green-600 border-green-200" 
                    : "bg-red-500/10 text-red-600 border-red-200"
                }
              >
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="webhook-url">Webhook Endpoint URL</Label>
                <div className="flex gap-2">
                  <Input 
                    id="webhook-url" 
                    value={webhookUrl} 
                    readOnly 
                    className="bg-muted font-mono text-xs"
                  />
                  <Button variant="outline" size="icon" onClick={() => handleCopy(webhookUrl, "Webhook URL")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Provide this URL to your POS provider's webhook settings.</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="secret-key">HMAC Secret Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input 
                      id="secret-key" 
                      type="password"
                      value={secretKey} 
                      readOnly 
                      className="bg-muted font-mono text-xs pr-10"
                    />
                    <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                  <Button variant="outline" size="icon" onClick={() => handleCopy(secretKey, "Secret Key")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={regenerateKey}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Used to sign and verify payloads for secure communication.</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Sync Settings</h3>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Stock Deduction</Label>
                    <p className="text-xs text-muted-foreground">Update stock levels instantly when a sale is completed on POS.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Return Reconciliation</Label>
                    <p className="text-xs text-muted-foreground">Restock items automatically when marked as "Returned" in POS.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Conflict Notifications</Label>
                    <p className="text-xs text-muted-foreground">Notify admins when POS stock differs from system records.</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </CardContent>
          <CardHeader className="pt-0">
             <div className="flex justify-end gap-3 border-t pt-6">
                <Button variant="outline" onClick={testConnection} disabled={isConnecting}>
                  {isConnecting ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                  Test Connection
                </Button>
                <Button>Save Configuration</Button>
             </div>
          </CardHeader>
        </Card>

        {/* Sidebar Info Cards */}
        <div className="space-y-6">
          <Card className="bg-primary/[0.02] border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Security Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
              <p>All communication is encrypted via TLS 1.3. We use HMAC-SHA256 signatures to verify that incoming requests originate from your POS system.</p>
              <p>Do not share your Secret Key. If compromised, regenerate it immediately to prevent unauthorized stock adjustments.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4 text-primary" />
                Connection Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Last Sync</span>
                <span className="font-medium">2 minutes ago</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Total Events (24h)</span>
                <span className="font-medium">1,284</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Error Rate</span>
                <span className="text-green-600 font-medium">0.02%</span>
              </div>
              <Button variant="ghost" className="w-full text-xs h-8 text-primary" size="sm">
                View Integration Logs
                <ExternalLink className="h-3 w-3 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50/30">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-yellow-900">Sync Pending</p>
                  <p className="text-[11px] text-yellow-700 leading-normal">
                    There are 4 stock events currently in the retry queue waiting for processing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
