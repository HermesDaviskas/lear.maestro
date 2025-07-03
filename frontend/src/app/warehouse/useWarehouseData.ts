// ./useWarehouseData.ts

import { useEffect, useState } from "react";
import axios from "axios";

export function useWarehouseData() {
  const [data, setData] = useState<WarehouseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial load from Next.js route API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<WarehouseResponse>("/api/getWarehouse");
        setData(res.data);
      } catch (err: any) {
        console.error(err || "Initial Axios load error:");
        setError(
          err.response?.data?.error || err.message || "Failed to load warehouse data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Live updates from proxy WebSocket (localhost:4000)
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => {
      console.log("[WS] Connected to proxy server");
    };

    ws.onmessage = (event) => {
      try {
        const incoming = JSON.parse(event.data);
        console.log("[WS] Update received:", incoming);
        setData(incoming);
      } catch (err) {
        console.error("[WS] Invalid JSON from proxy:", err);
        setError("Invalid WebSocket update format");
      }
    };

    ws.onerror = (err) => {
      console.error("[WS] WebSocket error:", err);
      setError("WebSocket connection error");
    };

    ws.onclose = () => {
      console.warn("[WS] Proxy WebSocket connection closed");
    };

    return () => ws.close();
  }, []);

  return { data, loading, error };
}
