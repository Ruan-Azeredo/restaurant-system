import { useEffect, useState, useCallback, useMemo } from "react";
import { api } from "@/services/api";
import { socketService } from "@/services/socketService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  XCircle,
  Package,
  Clock,
  CheckCircle2,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/domain";
import { toast } from "sonner";

// Extract types from the API service
type OrderResponse = Awaited<ReturnType<typeof api.getOrders>>[number];

const STATUS_CONFIG: Record<
  OrderStatus,
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

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  "client-order": "confirm-order",
  "confirm-order": "production",
  production: "delivery",
  delivery: "delivered",
  delivered: null,
  failed: null,
};

function OrderCard({
  order,
  onUpdateStatus,
}: {
  order: OrderResponse;
  onUpdateStatus: (id: string, nextStatus: OrderStatus) => void;
}) {
  const config = STATUS_CONFIG[order.order_status];
  const Icon = config.icon;
  const nextStatus = NEXT_STATUS[order.order_status];

  const dateStr = useMemo(() => {
    return new Date(order.order_createdAt).toLocaleString("pt-BR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, [order.order_createdAt]);

  return (
    <Card className="group relative border-none bg-card/40 backdrop-blur-md shadow-2xl shadow-black/20 hover:bg-card/60 transition-all duration-500 overflow-hidden">
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
            <Icon className="size-3 mr-1.5" />
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
              <div className="size-12 rounded-xl overflow-hidden bg-muted/20 border border-white/5 shadow-inner shrink-0">
                {op.product_imgUrl ? (
                  <img
                    src={op.product_imgUrl}
                    alt={op.product_name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center text-muted-foreground/20">
                    <Package className="size-5" />
                  </div>
                )}
              </div>
              <div className="space-y-0.5 flex-1">
                <span className="text-sm font-bold text-foreground">
                  {op.product_name}
                </span>
                {op.product_observation && (
                  <p className="text-[10px] font-bold text-primary/60 italic">
                    “{op.product_observation}”
                  </p>
                )}
              </div>
              <div className="bg-muted/50 px-2 py-0.5 rounded-full border border-white/5">
                <span className="font-black tabular-nums text-[10px]">
                  {op.product_quantity}x
                </span>
              </div>
            </div>
          ))}
        </div>

        {nextStatus && (
          <div className="pt-4">
            <Button
              className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] group/btn gap-2"
              onClick={() => onUpdateStatus(order.order_id, nextStatus)}
            >
              Move to {STATUS_CONFIG[nextStatus].label}
              <RefreshCw className="size-3 group-hover/btn:rotate-180 transition-transform duration-500" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AdminOrdersView() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (e) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Real-time status updates (Admin Global)
  useEffect(() => {
    const unsubStatus = socketService.subscribeToAllStatusUpdates(
      ({ order_id, status }) => {
        setOrders((current) =>
          current.map((o) =>
            o.order_id === order_id ? { ...o, order_status: status as any } : o,
          ),
        );
      },
    );

    const unsubCreated = socketService.subscribeToNewOrders((newOrder) => {
      setOrders((current) => {
        // Prevent duplicates
        if (current.some((o) => o.order_id === newOrder.order_id))
          return current;
        return [newOrder, ...current];
      });
      toast.info(`New Order Rocketed In! #${newOrder.order_id.slice(0, 8)}`, {
        icon: "🚀",
      });
    });

    return () => {
      unsubStatus();
      unsubCreated();
    };
  }, []);

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    try {
      await api.updateOrderStatus(id, status);
      toast.success(`Order moved to ${STATUS_CONFIG[status].label}`);
      load();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const activeOrders = orders.filter((o) =>
    ["client-order", "confirm-order", "production", "delivery"].includes(
      o.order_status,
    ),
  );
  const completedOrders = orders.filter((o) =>
    ["delivered", "failed"].includes(o.order_status),
  );

  return (
    <div className="relative min-h-screen pb-20 bg-[#0a0a0a] text-white selection:bg-primary/30">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative px-6 py-16 max-w-6xl mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
              Control Center
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Admin Orders
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Manage and track all kitchen operations in real-time.
            </p>
          </div>
        </div>

        <Tabs defaultValue="active" className="space-y-12">
          <TabsList className="h-16 bg-white/5 p-1.5 backdrop-blur-xl border border-white/10 rounded-2xl w-full sm:w-fit">
            <TabsTrigger
              value="active"
              className="h-full px-10 rounded-xl transition-all font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary"
            >
              Active Dashboard
              {activeOrders.length > 0 && (
                <span className="ml-3 bg-white/20 px-2 py-0.5 rounded-full">
                  {activeOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="h-full px-10 rounded-xl transition-all font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary"
            >
              Order History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-0 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeOrders.map((o) => (
                <OrderCard
                  key={o.order_id}
                  order={o}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
            {activeOrders.length === 0 && !loading && (
              <div className="py-20 text-center text-muted-foreground">
                No active orders at the moment.
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {completedOrders.map((o) => (
                <OrderCard
                  key={o.order_id}
                  order={o}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
