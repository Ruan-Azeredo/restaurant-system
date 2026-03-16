import { useEffect, useState, useCallback } from "react";
import { api } from "@/services/api";
import { useCart } from "@/store/cartStore";
import type { Product } from "@/types/domain";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CatalogView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addToCart } = useCart();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { products } = await api.getProducts();
      setProducts(products);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = (product: Product) => {
    addToCart(product);
    setAddedIds((prev) => new Set(prev).add(product.id));
    toast.success(`${product.name} added to cart`);
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center animate-in fade-in duration-500">
        <div className="p-4 rounded-full bg-destructive/10 text-destructive">
          <Check className="size-8 rotate-45" />
        </div>
        <div className="space-y-2">
          <p className="text-foreground font-semibold text-lg">
            Failed to load menu
          </p>
          <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
            {error}
          </p>
        </div>
        <Button variant="outline" onClick={load} className="px-8">
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="relative px-6 py-16 max-w-6xl mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Menu
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          Experience gourmet dining delivered to your table.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Card
                key={i}
                className="overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-sm"
              >
                <Skeleton className="aspect-[4/3] w-full" />
                <CardHeader className="space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardFooter>
                  <Skeleton className="h-10 w-full rounded-full" />
                </CardFooter>
              </Card>
            ))
          : products.map((product) => {
              const added = addedIds.has(product.id);
              return (
                <Card
                  key={product.id}
                  className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between bg-card"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={product.imgUrl}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    {!product.available && (
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
                        <Badge
                          variant="outline"
                          className="bg-background/80 px-4 py-1 text-sm font-bold uppercase tracking-wider"
                        >
                          Sold Out
                        </Badge>
                      </div>
                    )}
                    {product.available && (
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm px-3 py-1 shadow-lg border-none">
                          Popular
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader className="p-5 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                        {product.name}
                      </CardTitle>
                    </div>
                    {product.description && (
                      <CardDescription className="text-sm line-clamp-2 mt-2 leading-relaxed h-10">
                        {product.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="px-5 py-2 flex items-center justify-between">
                    {product.price != null && (
                      <p className="text-2xl font-black text-foreground tracking-tight">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(product.price))}
                      </p>
                    )}
                  </CardContent>

                  <CardFooter className="p-5 pt-3">
                    <Button
                      className={cn(
                        "w-full gap-2 font-bold h-11 transition-all cursor-pointer",
                        added
                          ? "bg-green-600 hover:bg-green-600 scale-95"
                          : "shadow-lg shadow-primary/20",
                      )}
                      disabled={!product.available || added}
                      onClick={() => handleAdd(product)}
                    >
                      {added ? (
                        <>
                          <Check className="size-5 stroke-[3]" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <Plus className="size-5 stroke-[3]" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
      </div>

      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 gap-6 text-center animate-in fade-in duration-1000">
          <div className="p-6 rounded-full bg-muted/30">
            <ShoppingCart className="size-16 text-muted-foreground/30" />
          </div>
          <div className="space-y-1">
            <p className="text-xl font-semibold text-foreground">Menu Empty</p>
            <p className="text-muted-foreground">
              We are preparing something special for you.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
