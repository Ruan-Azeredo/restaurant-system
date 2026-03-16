import { useEffect, useState, useCallback, useMemo } from "react";
import { api } from "@/services/api";
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
import {
  ClipboardList,
  RefreshCw,
  XCircle,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Extract types from the API service
type OrderResponse = Awaited<ReturnType<typeof api.getOrdersByClient>>[number];
type OrdersViewProps = {
  clientId: string;
};

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: any;
    colorClass: string;
  }
> = {
  "client-order": {
    label: "Sent to Kitchen",
    variant: "outline",
    icon: Clock,
    colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  "confirm-order": {
    label: "Confirmed",
    variant: "secondary",
    icon: CheckCircle2,
    colorClass: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  production: {
    label: "In Preparation",
    variant: "default",
    icon: RefreshCw,
    colorClass: "text-primary bg-primary/10 border-primary/20",
  },
  delivery: {
    label: "Out for Delivery",
    variant: "secondary",
    icon: Package,
    colorClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  delivered: {
    label: "Arrived",
    variant: "secondary",
    icon: CheckCircle2,
    colorClass: "text-green-500 bg-green-500/10 border-green-500/20",
  },
  failed: {
    label: "Declined",
    variant: "destructive",
    icon: XCircle,
    colorClass: "text-red-500 bg-red-500/10 border-red-500/20",
  },
};

const ACTIVE_STATUSES = [
  "client-order",
  "confirm-order",
  "production",
  "delivery",
];

function OrderCard({ order }: { order: OrderResponse }) {
  const config =
    STATUS_CONFIG[order.order_status] || STATUS_CONFIG["client-order"];
  const Icon = config.icon;

  const dateStr = useMemo(() => {
    return new Date(order.order_createdAt).toLocaleString("pt-BR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, [order.order_createdAt]);

  return (
    <Card className="group relative border-none bg-card/40 backdrop-blur-md shadow-2xl shadow-black/20 hover:bg-card/60 transition-all duration-500 overflow-hidden">
      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <CardHeader className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Receipt className="size-4" />
              </div>
              <CardTitle className="text-xl font-bold tracking-tight text-foreground uppercase">
                Order{" "}
                <span className="text-primary/60 text-sm ml-1">
                  #{order.order_id.slice(0, 8)}
                </span>
              </CardTitle>
            </div>
            <CardDescription className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] flex items-center gap-1.5">
              <Clock className="size-3" />
              {dateStr}
            </CardDescription>
          </div>
          <Badge
            className={cn(
              "px-3 py-1 text-[10px] font-black uppercase tracking-widest border transition-colors",
              config.colorClass,
            )}
          >
            <Icon className="size-3 mr-1.5 animate-pulse" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-0 space-y-6 relative z-10">
        <div className="h-px bg-white/5 w-full" />

        <div className="space-y-4">
          {order.order_products.map((op) => (
            <div
              key={op.product_id}
              className="flex items-start justify-between gap-5 group/item"
            >
              <div className="size-16 rounded-2xl overflow-hidden bg-muted/20 border border-white/5 shadow-inner shrink-0 group-hover/item:border-primary/20 transition-colors">
                {op.product_imgUrl ? (
                  <img
                    src={op.product_imgUrl ?? undefined}
                    alt={op.product_name}
                    className="size-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center text-muted-foreground/20">
                    <Package className="size-6" />
                  </div>
                )}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground group-hover/item:text-primary transition-colors">
                    {op.product_name}
                  </span>
                </div>
                {op.product_description && (
                  <p className="text-xs text-muted-foreground/60 leading-relaxed font-medium line-clamp-2">
                    {op.product_description}
                  </p>
                )}
                {op.product_observation && (
                  <p className="text-[11px] font-bold text-primary/60 italic mt-1.5 flex items-center gap-1.5">
                    <span className="size-1 rounded-full bg-primary/40" />“
                    {op.product_observation}”
                  </p>
                )}
              </div>
              <div className="flex items-center">
                <div className="bg-muted/50 px-3 py-1 rounded-full border border-white/5">
                  <span className="font-black tabular-nums text-[11px]">
                    {op.product_quantity}x
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  label,
  icon: Icon = ClipboardList,
}: {
  label: string;
  icon?: any;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-6 text-center animate-in fade-in zoom-in-95 duration-1000">
      <div className="relative">
        <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
        <div className="relative p-10 rounded-3xl bg-card/50 border border-white/5 shadow-2xl backdrop-blur-sm">
          <Icon className="size-16 text-primary/30 stroke-[1.5]" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-foreground font-black text-2xl tracking-tight">
          Everything quiet here
        </p>
        <p className="text-muted-foreground font-medium text-lg max-w-sm leading-relaxed px-4">
          {label}
        </p>
      </div>
    </div>
  );
}

function LoadingGrid({ count = 2 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-none bg-card/40 backdrop-blur-md">
          <CardHeader className="p-8">
            <div className="flex justify-between items-start">
              <div className="space-y-3 flex-1">
                <Skeleton className="h-8 w-2/3 rounded-lg" />
                <Skeleton className="h-4 w-1/3 rounded-md" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-0">
            <Skeleton className="h-24 w-full rounded-2xl" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function OrdersView({ clientId }: OrdersViewProps) {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getOrdersByClient(clientId);
      setOrders(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  const activeOrders = useMemo(
    () =>
      orders.filter((o) =>
        ACTIVE_STATUSES.includes(order_status_map(o.order_status)),
      ),
    [orders],
  );

  const historyOrders = useMemo(
    () =>
      orders.filter(
        (o) => !ACTIVE_STATUSES.includes(order_status_map(o.order_status)),
      ),
    [orders],
  );

  // Simple helper to normalize status for filtering if needed
  function order_status_map(status: string) {
    return status.toLowerCase();
  }

  return (
    <div className="relative min-h-screen pb-20">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative px-6 py-16 max-w-6xl mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
              <div className="size-1.5 rounded-full bg-primary animate-ping" />
              Live Track
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              My Selections
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Follow your culinary journey from the kitchen to your table.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={load}
            disabled={loading || !clientId}
            className="group gap-3 font-black text-xs uppercase tracking-widest bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:border-white/20 shadow-2xl transition-all active:scale-95"
          >
            <RefreshCw
              className={cn(
                "size-4 transition-transform duration-500",
                loading && "animate-spin",
                !loading && "group-hover:rotate-180",
              )}
            />
            Sync Order Status
          </Button>
        </div>

        {!clientId ? (
          <EmptyState
            label="We couldn't find your session. Try refreshing to reconnect."
            icon={XCircle}
          />
        ) : error ? (
          <div className="flex flex-col items-center gap-8 py-32 text-center animate-in fade-in duration-500">
            <div className="p-6 rounded-3xl bg-destructive/10 text-destructive border border-destructive/20 shadow-2xl shadow-destructive/10">
              <XCircle className="size-12 stroke-[2.5]" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black tracking-tight">
                Connection Error
              </h3>
              <p className="text-muted-foreground font-medium text-lg max-w-xs mx-auto leading-relaxed">
                {error}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={load}
              className="rounded-2xl h-14 px-10 font-black uppercase tracking-widest bg-destructive/5 border-destructive/20 hover:bg-destructive/10 transition-all"
            >
              Try reconnecting
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="active" className="space-y-12">
            <TabsList className="h-16 bg-white/5 p-1.5 backdrop-blur-xl border border-white/10 rounded-2xl w-full sm:w-fit">
              <TabsTrigger
                value="active"
                className="h-full pl-10 rounded-xl transition-all font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-2xl"
              >
                In the Kitchen
                {!loading && activeOrders.length > 0 && (
                  <span className="ml-3 bg-white/20 text-[10px] font-black px-2 py-0.5 rounded-full shadow-inner">
                    {activeOrders.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="h-full px-10 rounded-xl transition-all font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-2xl"
              >
                Past Memories
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="active"
              className="mt-0 ring-offset-background focus-visible:outline-none animate-in fade-in slide-in-from-bottom-8 duration-700"
            >
              {loading ? (
                <LoadingGrid count={2} />
              ) : activeOrders.length === 0 ? (
                <EmptyState label="Zero active orders. The kitchen is waiting for your next command!" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {activeOrders.map((o) => (
                    <OrderCard key={o.order_id} order={o} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="history"
              className="mt-0 ring-offset-background focus-visible:outline-none animate-in fade-in slide-in-from-bottom-8 duration-700"
            >
              {loading ? (
                <LoadingGrid count={4} />
              ) : historyOrders.length === 0 ? (
                <EmptyState label="No history yet. Every great tradition starts with a first order!" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {historyOrders.map((o) => (
                    <OrderCard key={o.order_id} order={o} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
