// ./useWarehouseData.ts

import { useEffect, useState } from "react";
import axios from "axios";
import { useServiceConfig } from "../ServiceConfigContext";

export function useWarehouseData() {
  const [data, setData] = useState<WarehouseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { services, servers } = useServiceConfig();
  const requiredService = "warehouse-srv";
  const service = services?.[requiredService];
  const server = service ? servers?.[service.server] : null;

  useEffect(() => {
    const fetchData = async () => {
      if (!server || !service) return;

      const url = `http://${server.ip}:${service.port}/backend/warehouse`;

      try {
        const res = await axios.get<WarehouseResponse>(url);
        setData(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to load warehouse data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [server, service]);

  return { data, loading, error };
}
