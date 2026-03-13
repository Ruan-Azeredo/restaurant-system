import { useEffect, useState, useCallback } from "react";
import { api } from "@/services/api";
import type { Order } from "@/types/domain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ClipboardList, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrdersViewProps {
  clientId: string | null;
}

type OrderStatus = Order["status"];

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  confirmed: "Confirmed",
  rejected: "Rejected",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_VARIANT: Record<
  OrderStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  processing: "secondary",
  confirmed: "default",
  rejected: "destructive",
  delivered: "secondary",
  cancelled: "outline",
};

const ACTIVE_STATUSES: OrderStatus[] = ["pending", "processing", "confirmed"];

function OrderCard({ order }: { order: Order }) {
  const status = order.status as OrderStatus;
  const date = new Date(order.createdAt).toLocaleString("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden group hover:bg-card transition-all duration-300">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-black tracking-tight text-foreground uppercase">
              Order <span className="text-primary">#{order.id.slice(0, 8)}</span>
            </CardTitle>
            <CardDescription className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest leading-none">
              {date}
            </CardDescription>
          </div>
          <Badge 
            variant={STATUS_VARIANT[status]} 
            className={cn(
              "rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-white/5",
              status === "pending" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
              status === "processing" && "bg-blue-500/10 text-blue-500 border-blue-500/20",
              status === "confirmed" && "bg-green-500/10 text-green-500 border-green-500/20",
            )}
          >
            {STATUS_LABEL[status] ?? status}
          </Badge>
        </div>
      </CardHeader>
      
      {order.order_products && order.order_products.length > 0 && (
        <CardContent className="px-6 pb-6 pt-0 space-y-4">
          <div className="h-px bg-white/5 w-full" />
          <ul className="space-y-3">
            {order.order_products.map((op) => (
              <li key={op.id} className="flex items-center justify-between text-sm group/item">
                <span className="text-muted-foreground font-medium group-hover/item:text-foreground transition-colors">
                  {op.product?.name ?? `Selection ${op.product_id.slice(0, 6)}`}
                </span>
                <span className="font-black tabular-nums bg-muted/30 px-2 py-0.5 rounded text-[10px]">
                  ×{op.quantity}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-6 text-center animate-in fade-in duration-1000">
      <div className="p-8 rounded-full bg-muted/10 border border-white/5 shadow-inner">
        <ClipboardList className="size-16 text-muted-foreground/20 stroke-[1.5]" />
      </div>
      <p className="text-muted-foreground font-medium text-lg max-w-sm leading-relaxed">{label}</p>
    </div>
  );
}

export function OrdersView({ clientId }: OrdersViewProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);
    setError(null);
    try {
      const { orders } = await api.getOrdersByClient(clientId);
      setOrders(orders ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  const activeOrders = orders.filter((o) =>
    ACTIVE_STATUSES.includes(o.status as OrderStatus)
  );
  const historyOrders = orders.filter(
    (o) => !ACTIVE_STATUSES.includes(o.status as OrderStatus)
  );

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Orders</h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-md">
            Track the status of your gourmet selections in real-time.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={load}
          disabled={loading || !clientId}
          className="gap-2 rounded-full px-6 font-bold bg-background/50 backdrop-blur-sm border-white/10 hover:bg-background/80 shadow-sm transition-all active:scale-95"
        >
          <RefreshCw className={cn("size-4 stroke-[2.5]", loading && "animate-spin")} />
          Refresh Status
        </Button>
      </div>

      {!clientId ? (
        <EmptyState label="No client identified. Please refresh the page to authenticate." />
      ) : error ? (
        <div className="flex flex-col items-center gap-6 py-24 text-center animate-in fade-in duration-500">
          <div className="p-4 rounded-full bg-destructive/10 text-destructive">
            <XCircle className="size-8 stroke-[2.5]" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-bold">Could not fetch orders</p>
            <p className="text-muted-foreground text-sm max-w-xs">{error}</p>
          </div>
          <Button variant="outline" onClick={load} className="rounded-full px-8">
            Try again
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="active" className="space-y-8">
          <TabsList className="bg-muted/30 p-1 rounded-full w-fit backdrop-blur-sm border border-white/5">
            <TabsTrigger value="active" className="rounded-full px-6 py-2 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">
              Active Orders
              {!loading && activeOrders.length > 0 && (
                <span className="ml-2 bg-primary-foreground/20 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {activeOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-full px-6 py-2 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="animate-in fade-in slide-in-from-left-4 duration-500">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Card key={i} className="border-none shadow-md bg-card/50">
                    <CardHeader className="p-6">
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-4 w-1/3 mt-2" />
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : activeOrders.length === 0 ? (
              <EmptyState label="No active orders at the moment. Time to start the feast?" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeOrders.map((o) => (
                  <OrderCard key={o.id} order={o} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="animate-in fade-in slide-in-from-right-4 duration-500">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="border-none shadow-md bg-card/50">
                    <CardHeader className="p-6">
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-4 w-1/3 mt-2" />
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : historyOrders.length === 0 ? (
              <EmptyState label="Your history is clean. Let's build some memories!" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {historyOrders.map((o) => (
                  <OrderCard key={o.id} order={o} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
