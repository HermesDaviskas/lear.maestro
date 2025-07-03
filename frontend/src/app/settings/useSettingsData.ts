// src/app/useSettingsData.ts
import { useEffect, useState } from "react";
import axios from "axios";
import {
  showLoadingPopup,
  showErrorPopup,
  showSuccessPopup,
  closePopup,
} from "../lib/alerts";

type ServerMap = Record<string, { ip: string }>;

export function useSettingsData() {
  const settingsFilePath = "/src/app/settings";

  const [servers, setServers] = useState<ServerMap>({});
  const [services, setServices] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const [newServerName, setNewServerName] = useState("");
  const [newServerIp, setNewServerIp] = useState("");

  const [newServiceName, setNewServiceName] = useState("");
  const [selectedServer, setSelectedServer] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123456");
  const [healthUrl, setHealthUrl] = useState("backend/health");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    showLoadingPopup("Loading settings");
    try {
      const [serverRes, serviceRes] = await Promise.all([
        axios.get(`/api/jsonHandler?file=${settingsFilePath}&key=servers`),
        axios.get(`/api/jsonHandler?file=${settingsFilePath}&key=services`),
      ]);
      setServers(serverRes.data ?? {});
      setServices(serviceRes.data ?? {});
      closePopup();
    } catch (err) {
      console.error("Failed to load settings:", err);
      showErrorPopup("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleAddServer = async () => {
    if (!newServerName || !newServerIp) return;
    try {
      await axios.patch(`/api/jsonHandler?file=${settingsFilePath}`, {
        key: `servers.${newServerName}.ip`,
        value: newServerIp,
      });
      setNewServerName("");
      setNewServerIp("");
      showSuccessPopup("Server added successfully");
      await fetchSettings();
    } catch (err) {
      console.error("Add server error:", err);
      showErrorPopup("Failed to add server");
    }
  };

  const handleEditServer = async (key: string, newIp: string) => {
    try {
      await axios.patch(`/api/jsonHandler?file=${settingsFilePath}`, {
        key: `servers.${key}.ip`,
        value: newIp,
      });
      showSuccessPopup("Server updated successfully");
      await fetchSettings();
    } catch (err) {
      console.error("Edit server error:", err);
      showErrorPopup("Failed to update server");
    }
  };

  const handleDeleteServer = async (key: string) => {
    if (!confirm(`Delete server '${key}'?`)) return;
    try {
      await axios.delete(`/api/jsonHandler?file=${settingsFilePath}&key=servers.${key}`);
      showSuccessPopup("Server deleted successfully");
      await fetchSettings();
    } catch (err) {
      console.error("Delete server error:", err);
      showErrorPopup("Failed to delete server");
    }
  };

  const handleAddService = async () => {
    if (!newServiceName || !selectedServer || !port) return;
    try {
      const value = {
        server: selectedServer,
        port: parseInt(port),
        username,
        password,
        healthUrl,
      };

      await axios.patch(`/api/jsonHandler?file=${settingsFilePath}`, {
        key: `services.${newServiceName}`,
        value,
      });

      setNewServiceName("");
      setSelectedServer("");
      setPort("");
      setUsername("admin");
      setPassword("123456");
      setHealthUrl("backend/health");

      showSuccessPopup("Service added successfully");
      await fetchSettings();
    } catch (err) {
      console.error("Add service error:", err);
      showErrorPopup("Failed to add service");
    }
  };

  const handleDeleteService = async (key: string) => {
    if (!confirm(`Delete service '${key}'?`)) return;
    try {
      await axios.delete(`/api/jsonHandler?file=${settingsFilePath}&key=services.${key}`);
      showSuccessPopup("Service deleted successfully");
      await fetchSettings();
    } catch (err) {
      console.error("Delete service error:", err);
      showErrorPopup("Failed to delete service");
    }
  };

  const handleUpdateService = async (key: string, updatedData: any) => {
    try {
      await axios.patch(`/api/jsonHandler?file=${settingsFilePath}`, {
        key: `services.${key}`,
        value: updatedData,
      });
      showSuccessPopup("Service updated successfully");
      await fetchSettings();
    } catch (err) {
      console.error("Update service error:", err);
      showErrorPopup("Failed to update service");
    }
  };

  return {
    servers,
    services,
    loading,
    newServerName,
    newServerIp,
    newServiceName,
    selectedServer,
    port,
    username,
    password,
    healthUrl,
    setNewServerName,
    setNewServerIp,
    setNewServiceName,
    setSelectedServer,
    setPort,
    setUsername,
    setPassword,
    setHealthUrl,
    handleAddServer,
    handleEditServer,
    handleDeleteServer,
    handleAddService,
    handleDeleteService,
    handleUpdateService,
  };
}
