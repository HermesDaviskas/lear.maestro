"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

// Types
export type ServiceConfigEntry = {
  server: string;
  port: number;
  username?: string;
  password?: string;
  healthUrl?: string;
};

export type ServerConfigEntry = {
  ip: string;
};

type ServiceConfigMap = Record<string, ServiceConfigEntry>;
type ServerConfigMap = Record<string, ServerConfigEntry>;

type ConfigContextType = {
  services: ServiceConfigMap | null;
  servers: ServerConfigMap | null;
};

const ServiceConfigContext = createContext<ConfigContextType>({
  services: null,
  servers: null,
});

export const useServiceConfig = () => useContext(ServiceConfigContext);

// Provider
export const ServiceConfigProvider = ({ children }: { children: ReactNode }) => {
  const settingsFilePath = "/src/app/settings";
  const [services, setServices] = useState<ServiceConfigMap | null>(null);
  const [servers, setServers] = useState<ServerConfigMap | null>(null);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const [servicesRes, serversRes] = await Promise.all([
          axios.get(`/api/jsonHandler?file=${settingsFilePath}&key=services`),
          axios.get(`/api/jsonHandler?file=${settingsFilePath}&key=servers`),
        ]);
        setServices(servicesRes.data ?? {});
        setServers(serversRes.data ?? {});
      } catch (err) {
        console.error("Failed to load configs", err);
      }
    };

    fetchConfigs();
  }, []);

  return (
    <ServiceConfigContext.Provider value={{ services, servers }}>
      {children}
    </ServiceConfigContext.Provider>
  );
};
