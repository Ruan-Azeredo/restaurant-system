import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/store/cartStore";
import { CartSheet } from "@/views/CartSheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, UtensilsCrossed, ClipboardList } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { api } from "@/services/api";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { to: "/", label: "Menu", icon: UtensilsCrossed },
  { to: "/orders", label: "Orders", icon: ClipboardList },
];

interface AppLayoutProps {
  children: React.ReactNode;
  clientId: string | null;
}

export function AppLayout({ children, clientId }: AppLayoutProps) {
  const location = useLocation();
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-svh flex flex-col bg-background">
      {/* Top navigation */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mr-4">
            <UtensilsCrossed className="size-5 text-primary" />
            <span className="font-semibold text-sm">Restaurant</span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1 flex-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to}>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    size="sm"
                    className={cn("gap-2", active && "font-semibold")}
                  >
                    <Icon className="size-4" />
                    {label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Cart button */}
          <Button
            variant="outline"
            size="sm"
            className="relative gap-2"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="size-4" />
            Cart
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 size-5 p-0 flex items-center justify-center text-[10px] leading-none">
                {totalItems > 99 ? "99+" : totalItems}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Cart sheet */}
      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        clientId={clientId}
      />

      <Toaster richColors position="top-right" />
    </div>
  );
}

/** Thin wrapper that loads a clientId and passes it everywhere it's needed */
export function useClientId() {
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    api
      .getClients()
      .then(({ clients }) => {
        if (clients?.[0]) setClientId(clients[0].id);
      })
      .catch(console.error);
  }, []);

  return clientId;
}
