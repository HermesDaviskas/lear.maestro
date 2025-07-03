"use client";

import { useEffect } from "react";
import { useSettingsData } from "./useSettingsData";
import PingTool from "../app_components/serverTool";
import ServiceTool from "../app_components/serviceTool";

export default function SettingsPage() {
  const {
    servers,
    services,
    loading,
    newServerName,
    newServerIp,
    newServiceName,
    selectedServer,
    port,
    setNewServerName,
    setNewServerIp,
    setNewServiceName,
    setSelectedServer,
    setPort,
    handleAddServer,
    handleEditServer,
    handleDeleteServer,
    handleAddService,
    handleDeleteService,
    handleUpdateService,
  } = useSettingsData();

  return (
    <div className="font-mono text-white w-full p-4 rounded-2xl border-gray-700 backdrop-blur-md">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Servers */}
        <div className="space-y-8 w-full">
          <section className="p-4 rounded-lg border-gray-800">
            <h2 className="text-lg font-bold text-cyan-400 mb-2">Add New Terminal</h2>
            <div className="flex w-full p-4 gap-4 bg-gray-800 border-2 border-gray-700 rounded-2xl ">
              <input
                type="text"
                placeholder="Server name"
                value={newServerName}
                onChange={(e) => setNewServerName(e.target.value.trim().toLowerCase())}
                className="w-full h-9 px-4 bg-gray-800 text-gray-400 border border-gray-500 rounded-md"
              />
              <input
                type="text"
                placeholder="IP address"
                value={newServerIp}
                onChange={(e) => setNewServerIp(e.target.value.trim())}
                className="w-full h-9 px-4 bg-gray-800 text-gray-400 border border-gray-500 rounded-md"
              />
              <button
                onClick={handleAddServer}
                disabled={!newServerName || !newServerIp}
                className="bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-1 rounded-md font-bold disabled:opacity-50"
              >
                OK
              </button>
            </div>
          </section>

          <section className="p-4 rounded-lg border-gray-800">
            <h2 className="text-lg font-bold text-cyan-400 mb-4">Manage Terminals</h2>
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
        <div className="space-y-8 w-full">
          <section className="p-4 rounded-lg border-gray-800">
            <h2 className="text-lg font-bold text-cyan-400 mb-2">Add New Service</h2>
            <div className="flex w-full p-4 gap-4 bg-gray-800 border-2 border-gray-700 rounded-2xl ">
              <input
                type="text"
                placeholder="Service name"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value.trim().toLowerCase())}
                className="w-full h-9 px-4 bg-gray-800 text-gray-400 border border-gray-500 rounded-md"
              />
              <select
                value={selectedServer}
                onChange={(e) => setSelectedServer(e.target.value)}
                className="w-full h-9 px-4 bg-gray-800 text-gray-400 border border-gray-500 rounded-md"
              >
                <option value="">Select terminal</option>
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
                className="w-sm h-9 px-4 bg-gray-800 text-gray-400 border border-gray-500 rounded-md"
              />
              <button
                onClick={handleAddService}
                disabled={!newServiceName || !selectedServer || !port}
                className="bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-1 rounded-md font-bold disabled:opacity-50"
              >
                OK
              </button>
            </div>
          </section>

          <section className="p-4 rounded-lg border-gray-800">
            <h2 className="text-lg font-bold text-cyan-400 mb-4">Manage Services</h2>
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
    </div>
  );
}
