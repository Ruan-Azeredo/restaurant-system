import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/store/cartStore";
import { AppLayout, useClientId } from "@/layout/AppLayout";
import { CatalogView } from "@/views/CatalogView";
import { OrdersView } from "@/views/OrdersView";

function AppRoutes() {
  const clientId = useClientId();

  return (
    <AppLayout clientId={clientId}>
      <Routes>
        <Route path="/" element={<CatalogView />} />
        <Route path="/orders" element={<OrdersView clientId={clientId} />} />
      </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
