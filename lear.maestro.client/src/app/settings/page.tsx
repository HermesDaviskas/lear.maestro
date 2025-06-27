"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import PingTool from "../app_components/PingTool/PingTool";
import ServiceTool from "../app_components/serviceTool/serviceTool";

type ServerMap = {
  [key: string]: {
    ip: string;
  };
};

const settingsFilePath = "/src/app/settings";

export default function SettingsPage() {
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
  const [healthUrl, setHealthUrl] = useState("/backend/health");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const serverRes = await axios.get(
        `/api/jsonHandler?file=${settingsFilePath}&key=servers`
      );
      setServers(serverRes.data ?? {});
      const serviceRes = await axios.get(
        `/api/jsonHandler?file=${settingsFilePath}&key=services`
      );
      setServices(serviceRes.data ?? {});
    } catch (err) {
      console.error("Failed to load settings:", err);
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
      await fetchSettings();
    } catch (err) {
      console.error("Add server error:", err);
    }
  };

  const handleEditServer = async (key: string, newIp: string) => {
    try {
      await axios.patch(`/api/jsonHandler?file=${settingsFilePath}`, {
        key: `servers.${key}.ip`,
        value: newIp,
      });
      await fetchSettings();
    } catch (err) {
      console.error("Edit server error:", err);
    }
  };

  const handleDeleteServer = async (key: string) => {
    if (!confirm(`Are you sure you want to delete the server "${key}"?`)) return;
    try {
      await axios.delete(`/api/jsonHandler?file=${settingsFilePath}&key=servers.${key}`);
      await fetchSettings();
    } catch (err) {
      console.error("Delete server error:", err);
    }
  };

  const handleAddService = async () => {
    if (!newServiceName || !selectedServer || !port) return;
    try {
      const serviceData: any = {
        server: selectedServer,
        port: parseInt(port),
      };
      if (username) serviceData.username = username;
      if (password) serviceData.password = password;
      if (healthUrl) serviceData.healthUrl = healthUrl;

      await axios.patch(`/api/jsonHandler?file=${settingsFilePath}`, {
        key: `services.${newServiceName}`,
        value: serviceData,
      });

      setNewServiceName("");
      setSelectedServer("");
      setPort("");
      setUsername("");
      setPassword("");
      setHealthUrl("");

      await fetchSettings();
    } catch (err) {
      console.error("Add service error:", err);
    }
  };

  const handleDeleteService = async (key: string) => {
    if (!confirm(`Are you sure you want to delete the service "${key}"?`)) return;
    try {
      await axios.delete(`/api/jsonHandler?file=${settingsFilePath}&key=services.${key}`);
      await fetchSettings();
    } catch (err) {
      console.error("Delete service error:", err);
    }
  };

  const handleUpdateService = async (key: string, updatedData: any) => {
    try {
      await axios.patch(`/api/jsonHandler?file=${settingsFilePath}`, {
        key: `services.${key}`,
        value: updatedData,
      });
      await fetchSettings();
    } catch (err) {
      console.error("Update service error:", err);
    }
  };

  if (loading) return <div className="p-4">Loading servers and services...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 w-full">
      {/* Left Column - Servers */}
      <div className="space-y-8">
        {/* Add Server */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Add New Server</h2>
          <div className="flex gap-4 flex-wrap items-center">
            <input
              type="text"
              placeholder="Server name"
              value={newServerName}
              onChange={(e) => setNewServerName(e.target.value.trim().toLowerCase())}
              className="border rounded px-2 h-8 w-40"
            />
            <input
              type="text"
              placeholder="IP address"
              value={newServerIp}
              onChange={(e) => setNewServerIp(e.target.value.trim())}
              className="border rounded px-2 h-8 w-40"
            />
            <button
              onClick={handleAddServer}
              disabled={!newServerName || !newServerIp}
              className="bg-green-700 text-white rounded px-4 h-8 hover:bg-green-600 disabled:opacity-50"
            >
              <span className="text-lg font-bold">+</span>
            </button>
          </div>
        </section>

        {/* Manage Servers */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Manage Servers</h2>
          <div className="space-y-6">
            {Object.keys(servers).length > 0 ? (
              Object.entries(servers).map(([key, { ip }]) => (
                <PingTool
                  key={key}
                  title={key}
                  ip={ip}
                  onUpdate={(newIp) => handleEditServer(key, newIp)}
                  onDelete={() => handleDeleteServer(key)}
                />
              ))
            ) : (
              <p>No servers configured. Add one above.</p>
            )}
          </div>
        </section>
      </div>

      {/* Right Column - Services */}
      <div className="space-y-8">
        {/* Add Service */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Add New Service</h2>
          <div className="flex gap-4 flex-wrap items-center">
            <input
              type="text"
              placeholder="Service name"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value.trim().toLowerCase())}
              className="border rounded px-2 h-8 w-40"
            />
            <select
              value={selectedServer}
              onChange={(e) => setSelectedServer(e.target.value)}
              className="border rounded px-2 h-8 w-40 bg-black"
            >
              <option value="">Select server</option>
              {Object.keys(servers).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="border rounded px-2 h-8 w-24"
            />
            {/* <input
                type="text"
                placeholder="Username (optional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border rounded px-2 h-8 w-40"
              /> */}
            {/* <input
                type="password"
                placeholder="Password (optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded px-2 h-8 w-40"
              /> */}
            {/* <input
                type="text"
                placeholder="Health URL"
                value={healthUrl}
                onChange={(e) => setHealthUrl(e.target.value.trim())}
                className="border rounded px-2 h-8 w-60"
              /> */}
            <button
              onClick={handleAddService}
              disabled={!newServiceName || !selectedServer || !port}
              className="bg-green-700 text-white rounded px-4 h-8 hover:bg-green-600 disabled:opacity-50"
            >
              <span className="text-lg font-bold">+</span>
            </button>
          </div>
        </section>

        {/* Manage Services */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Manage Services</h2>
          <div className="space-y-6">
            {Object.keys(services).length > 0 ? (
              Object.entries(services).map(([key, svc]) => (
                <ServiceTool
                  key={key}
                  name={key}
                  server={svc.server}
                  port={svc.port}
                  username={svc.username}
                  password={svc.password}
                  healthUrl={svc.healthUrl}
                  onDelete={() => handleDeleteService(key)}
                  onUpdate={(updatedData) => handleUpdateService(key, updatedData)}
                />
              ))
            ) : (
              <p>No services configured. Add one above.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
