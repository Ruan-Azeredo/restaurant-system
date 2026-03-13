```js
import { io } from "socket.io-client";

// 1. Connect to the server
const socket = io("http://localhost:3031");

// 2. POST the order and get job_id
const { job_id } = await fetch("/v1/order", { method: "POST", ... }).then(r => r.json());

// 3. Subscribe to that job's room
socket.emit("subscribe-order", { job_id });

// 4. Wait for the result
socket.on("order-result", (data) => {
  if (data.status === "confirmed") {
    // data.order, data.order_products, data.ingredient_verification
  } else {
    // data.reason — e.g. "Insufficient ingredients"
  }
});

```
