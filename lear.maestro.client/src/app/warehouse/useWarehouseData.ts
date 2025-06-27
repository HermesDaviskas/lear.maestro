// --- useWarehouseData.ts ---

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useServiceConfig } from "../ServiceConfigContext";
import { showLoadingPopup, showErrorPopup, closePopup } from "../lib/alerts";
import {
  BufferGroupFlattened,
  SectionFlattened,
  WarehouseServiceResponse,
} from "../types";
import { flattenBuffers, flattenSections } from "./flatten";

export function useWarehouseData() {
  const requiredService = "warehouse-srv";
  const { services, servers } = useServiceConfig();
  const service = services?.[requiredService];
  const server = service ? servers?.[service.server] : null;

  const [buffers, setBuffers] = useState<BufferGroupFlattened[]>([]);
  const [sections, setSections] = useState<SectionFlattened[]>([]);

  const fetchWarehouseData = useCallback(async () => {
    if (!server || !service) return;
    const url = `http://${server.ip}:${service.port}/backend/warehouse`;

    try {
      showLoadingPopup("Loading warehouse data");
      const res = await axios.get<WarehouseServiceResponse>(url);
      const flatBuffers = flattenBuffers(res.data.buffers);
      const flatSections = flattenSections(res.data.outerSections);

      setBuffers(flatBuffers);
      setSections(flatSections);
    } catch (err: any) {
      showErrorPopup(`Failed to fetch warehouse data. ${err}`);
    } finally {
      closePopup();
    }
  }, [server, service]);

  useEffect(() => {
    fetchWarehouseData();
  }, [fetchWarehouseData]);

  const updateBufferUsage = (key: string, newUsage: "load" | "unload") => {
    setBuffers((prev) =>
      prev.map((b) => (b.bufferGroupKey === key ? { ...b, usage: newUsage } : b))
    );
  };

  const loadBuffers = buffers
    .filter((b) => b.usage === "load")
    .map((b) => ({
      bufferGroupKey: b.bufferGroupKey,
      bufferGroupName: b.bufferGroupName,
    }));

  const unloadBuffers = buffers
    .filter((b) => b.usage === "unload")
    .map((b) => ({
      bufferGroupKey: b.bufferGroupKey,
      bufferGroupName: b.bufferGroupName,
    }));

  return {
    buffers,
    sections,
    updateBufferUsage,
    loadBuffers,
    unloadBuffers,
  };
}
