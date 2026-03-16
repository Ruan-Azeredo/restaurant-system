import { AdminOrdersView } from "./views/AdminOrdersView";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="dark">
      <AdminOrdersView />
      <Toaster position="top-right" richColors theme="dark" />
    </div>
  );
}

export default App;
