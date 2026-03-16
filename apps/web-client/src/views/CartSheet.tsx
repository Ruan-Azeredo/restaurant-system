import { useState, useCallback, useEffect } from "react";
import { useCart } from "@/store/cartStore";
import { useOrderSocket } from "@/hooks/useOrderSocket";
import { api } from "@/services/api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface CartSheetProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  clientId: string | null;
}

export function CartSheet({ open, onOpenChange, clientId }: CartSheetProps) {
  const {
    items,
    totalItems,
    totalPrice,
    removeFromCart,
    updateQuantity,
    updateObservation,
    clearCart,
  } = useCart();
  const { isWaiting, subscribe, result, reset } = useOrderSocket();
  const [placing, setPlacing] = useState(false);

  // Handle immediate clearing on confirmation
  useEffect(() => {
    if (result?.status === "confirmed") {
      clearCart();
    }
  }, [result?.status, clearCart]);

  const handlePlaceOrder = useCallback(async () => {
    if (!clientId) {
      toast.error("No client selected. Please reload the page.");
      return;
    }
    if (items.length === 0) return;

    setPlacing(true);
    try {
      const { job_id } = await api.placeOrder({
        client_id: clientId,
        order_products: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          observation: i.observation,
        })),
      });
      subscribe(job_id);
    } catch (e) {
      toast.error((e as Error).message);
      setPlacing(false);
    }
  }, [clientId, items, subscribe]);

  const handleDismissResult = () => {
    onOpenChange(false);
    setTimeout(() => {
      reset();
      setPlacing(false);
    }, 300);
  };

  const isLoading = placing || isWaiting;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0 border-l border-white/10 bg-card/95 backdrop-blur-2xl"
      >
        <SheetHeader className="px-8 pt-10 pb-6 space-y-1">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-3xl font-black tracking-tighter flex items-center gap-3">
              <ShoppingCart className="size-8 text-primary stroke-[2.5]" />
              Cart
            </SheetTitle>
            {totalItems > 0 && (
              <Badge className="bg-primary/10 text-primary border-none font-bold px-3">
                {totalItems} items
              </Badge>
            )}
          </div>
          <SheetDescription className="text-base font-medium text-muted-foreground/80">
            {items.length === 0
              ? "Your epicurean journey starts here."
              : "Refine your selection before we begin."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-8 flex-1 flex flex-col min-h-0">
          <Separator className="bg-white/5" />

          {/* Order result overlay */}
          {result ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-8 py-12 text-center animate-in zoom-in-95 duration-500">
              <div
                className={cn(
                  "p-6 rounded-full shadow-2xl",
                  result.status === "confirmed"
                    ? "bg-green-500/20 text-green-500 shadow-green-500/20"
                    : "bg-destructive/20 text-destructive shadow-destructive/20",
                )}
              >
                {result.status === "confirmed" ? (
                  <CheckCircle2 className="size-16 stroke-[2.5]" />
                ) : (
                  <XCircle className="size-16 stroke-[2.5]" />
                )}
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black tracking-tight">
                  {result.status === "confirmed" ? "Exquisite!" : "Apologies"}
                </h3>
                <p className="text-muted-foreground text-lg max-w-[280px]">
                  {result.status === "confirmed"
                    ? "Your order has been acknowledged and is being prepared."
                    : (result.reason ??
                      "We encountered an issue. Please try again.")}
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full h-12 font-bold bg-white/5 border-white/10 hover:bg-white/10"
                onClick={handleDismissResult}
              >
                {result.status === "confirmed" ? "Perfect" : "Back to Cart"}
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-2 px-2">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 gap-6 text-center animate-in fade-in duration-700">
                    <div className="p-8 rounded-full bg-muted/20">
                      <ShoppingCart className="size-12 text-muted-foreground/30" />
                    </div>
                    <p className="text-muted-foreground font-medium text-lg">
                      Your cart is feeling a bit light.
                    </p>
                  </div>
                ) : (
                  <div className="py-6 space-y-8">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="group relative flex flex-col gap-4 mb-6 pb-6 border-b border-white/5 last:border-0"
                      >
                        <div className="flex gap-5 items-start">
                          <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                              {item.product.name}
                            </h4>
                            <div className="flex items-center gap-3">
                              <p className="text-primary font-bold">
                                {new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(Number(item.product.price))}
                              </p>
                              <span className="text-muted-foreground/40 text-xs font-black uppercase tracking-widest">
                                Quantity: {item.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center bg-muted/30 rounded-full p-1 border border-white/5">
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="rounded-full hover:bg-background/80"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                            >
                              <Minus className="size-3.5" />
                            </Button>
                            <span className="text-sm font-black w-8 text-center tabular-nums">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="rounded-full hover:bg-background/80"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                            >
                              <Plus className="size-3.5" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-all"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>

                        {/* Collapsible Observation */}
                        <Collapsible className="w-full">
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-fit h-auto p-0 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary hover:bg-transparent"
                            >
                              {item.observation
                                ? "Edit Observation"
                                : "+ Add Observation"}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <input
                              type="text"
                              placeholder="Add special instructions (e.g., no onions)..."
                              value={item.observation || ""}
                              onChange={(e) =>
                                updateObservation(item.product.id, e.target.value)
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50 transition-all font-medium"
                            />
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {items.length > 0 && (
                <div className="py-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-muted-foreground">
                      Investment
                    </span>
                    <span className="text-3xl font-black tracking-tighter text-foreground">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(totalPrice)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full h-14 text-lg font-black shadow-2xl shadow-primary/30 transition-all hover:translate-y-[-2px] active:translate-y-[0px] active:scale-[0.98]"
                      onClick={handlePlaceOrder}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="size-5 animate-spin stroke-[3]" />
                          Crafting your order…
                        </>
                      ) : (
                        "Place Grand Order"
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground font-bold hover:bg-destructive/5 hover:text-destructive transition-colors"
                      onClick={clearCart}
                      disabled={isLoading}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
