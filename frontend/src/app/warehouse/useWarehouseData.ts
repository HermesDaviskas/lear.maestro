import { useEffect, useState } from "react";
import axios from "axios";
import { showLoadingPopup, showErrorPopup, closePopup } from "../lib/alerts";
import { useServiceConfig } from "../ServiceConfigContext";

export interface BufferState {
  usage: BufferUsage;
  quantity: number;
}

export function useWarehouseData() {
  const [data, setData] = useState<WarehouseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bufferStates, setBufferStates] = useState<Record<string, BufferState>>({});

  const [restLoaded, setRestLoaded] = useState(false);
  const [wsLoaded, setWsLoaded] = useState(false);

  const { services, servers } = useServiceConfig();
  const requiredService = "proxy-srv";

  // Show loading and error popups
  useEffect(() => {
    if (loading) showLoadingPopup("Loading warehouse data...");
    else closePopup();
  }, [loading]);

  useEffect(() => {
    if (error) {
      showErrorPopup("Failed to load warehouse data", error);
    }
  }, [error]);

  // Set loading to false only when both sources are ready
  useEffect(() => {
    if (restLoaded && wsLoaded) {
      setLoading(false);
    }
  }, [restLoaded, wsLoaded]);

  // Initial load from REST API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<WarehouseResponse>("/api/getWarehouse");
        setData((prev) => prev ?? res.data); // preserve WS if faster
        setRestLoaded(true);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || "Initial REST load failed");
      }
    };

    fetchData();
  }, []);

  // WebSocket updates using config
  useEffect(() => {
    if (!services || !servers) return;

    const service = services[requiredService];
    const server = service ? servers[service.server] : null;

    if (!service || !server) {
      setError("Missing or invalid proxy-srv configuration");
      return;
    }

    const wsUrl = `ws://${server.ip}:${service.port}`;
    console.log(`Connecting to ${wsUrl}`);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("[WS] Connected to proxy server");
    };

    ws.onmessage = (event) => {
      try {
        const incoming = JSON.parse(event.data);
        setData(incoming);
        setWsLoaded(true);
      } catch (err) {
        console.error("[WS] Invalid JSON:", err);
        setError("Invalid WebSocket update format");
      }
    };

    ws.onerror = (err) => {
      console.error("[WS] Error:", err);
      setError("WebSocket connection error");
    };

    ws.onclose = () => {
      console.warn("[WS] Connection closed");
    };

    return () => ws.close();
  }, [services, servers]);

  // Sync bufferStates on data update
  useEffect(() => {
    if (!data?.buffers) return;

    const initialStates: Record<string, BufferState> = {};
    data.buffers.forEach((entry) => {
      const [key, value] = Object.entries(entry)[0];
      initialStates[key] = { usage: value.usage, quantity: 0 };
    });

    setBufferStates(initialStates);
  }, [data]);

  // Derived: load/unload buffer lists
  const loadBuffers = Object.entries(bufferStates)
    .filter(([, s]) => s.usage === "load")
    .map(([key]) => ({
      bufferGroupKey: key,
      bufferGroupName:
        data?.buffers.find((b) => Object.keys(b)[0] === key)?.[key].nameStr || key,
    }));

  const unloadBuffers = Object.entries(bufferStates)
    .filter(([, s]) => s.usage === "unload")
    .map(([key]) => ({
      bufferGroupKey: key,
      bufferGroupName:
        data?.buffers.find((b) => Object.keys(b)[0] === key)?.[key].nameStr || key,
    }));

  // State mutation handlers
  const setBufferUsage = (key: string, usage: BufferUsage) => {
    setBufferStates((prev) => ({
      ...prev,
      [key]: { ...prev[key], usage },
    }));
  };

  const setBufferQuantity = (key: string, quantity: number) => {
    setBufferStates((prev) => ({
      ...prev,
      [key]: { ...prev[key], quantity },
    }));
  };

  const getBufferQuantity = (key: string) => bufferStates[key]?.quantity ?? 0;

  return {
    data,
    loading,
    error,
    bufferStates,
    loadBuffers,
    unloadBuffers,
    setBufferUsage,
    setBufferQuantity,
    getBufferQuantity,
  };
}
