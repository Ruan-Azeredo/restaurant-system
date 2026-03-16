import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "@/store/cartStore";
import AppRoutes from "@/router";

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
