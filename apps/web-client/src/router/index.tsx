import { Routes, Route } from "react-router-dom";
import { AppLayout, useClientId } from "@/layout/AppLayout";
import { CatalogView } from "@/views/CatalogView";
import { OrdersView } from "@/views/OrdersView";

export default function AppRoutes() {
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
