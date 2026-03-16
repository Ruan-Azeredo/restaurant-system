import { useEffect, useState, useCallback } from "react";
import { socketService } from "@/services/socketService";
import type { OrderResultPayload } from "@/services/socketService";

interface UseOrderSocketReturn {
  result: OrderResultPayload | null;
  isWaiting: boolean;
  subscribe: (jobId: string) => void;
  reset: () => void;
}

export function useOrderSocket(): UseOrderSocketReturn {
  const [result, setResult] = useState<OrderResultPayload | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  const subscribe = useCallback((id: string) => {
    setResult(null);
    setIsWaiting(true);
    setJobId(id);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setIsWaiting(false);
    setJobId(null);
  }, []);

  useEffect(() => {
    if (!jobId) return;

    // Ensure we're connected and subscribe to the specific job room
    const cleanup = socketService.subscribeToOrder(jobId, (data) => {
      setResult(data);
      setIsWaiting(false);
    });

    return cleanup;
  }, [jobId]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);

  return { result, isWaiting, subscribe, reset };
}
