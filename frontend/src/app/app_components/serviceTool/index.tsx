"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import Header from "./Header";
import AddressSettings from "./AddressSettings";
import Controls from "./Controls";

type Props = {
  name: string;
  server: string;
  port: number;
  username?: string;
  password?: string;
  healthUrl?: string;
  onDelete?: () => void;
  onUpdate: (updatedData: any) => void;
};

export default function ServiceTool({
  name,
  server,
  port,
  username,
  password,
  healthUrl,
  onDelete,
  onUpdate,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentServer, setCurrentServer] = useState(server);
  const [currentPort, setCurrentPort] = useState(port.toString());
  const [currentHealthUrl, setCurrentHealthUrl] = useState(healthUrl ?? "");
  const [status, setStatus] = useState<"up" | "down" | "unknown">("unknown");
  const [serverOptions, setServerOptions] = useState<string[]>([]);
  const [serverMap, setServerMap] = useState<Record<string, { ip: string }>>({});

  // ───────────────────────────────────────────────────────────────
  // Effects
  // ───────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const res = await axios.get(
          "/api/jsonHandler?file=/src/app/settings&key=servers"
        );
        const servers = res.data ?? {};
        setServerOptions(Object.keys(servers));
        setServerMap(servers);
      } catch (err) {
        console.error("Failed to load server options", err);
      }
    };

    fetchServers();
  }, []);

  useEffect(() => {
    if (Object.keys(serverMap).length > 0) {
      checkHealth();
    }
  }, [serverMap]);

  // ───────────────────────────────────────────────────────────────
  // Actions
  // ───────────────────────────────────────────────────────────────

  const checkHealth = async () => {
    if (!isValidCheck()) return;

    const url = `http://${serverMap[currentServer].ip}:${currentPort}/${currentHealthUrl}`;
    console.log("[Health Check]", url);

    setLoading(true);
    setStatus("unknown");

    try {
      const res = await axios.get(url);
      setStatus(res.status === 200 ? "up" : "down");
    } catch {
      setStatus("down");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    onUpdate({
      server: currentServer,
      port: parseInt(currentPort),
      username,
      password,
      healthUrl: currentHealthUrl,
    });
    checkHealth();
  };

  const isValidCheck = () => {
    return (
      !!currentHealthUrl &&
      !!currentServer &&
      !!currentPort &&
      !!serverMap[currentServer]?.ip
    );
  };

  const isModified = currentServer !== server || parseInt(currentPort) !== port;

  // ───────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────

  return (
    <div className="w-full overflow-x-auto border-2 border-gray-700 rounded-2xl bg-gray-800 backdrop-blur-md font-mono text-white">
      <Header
        serviceStatus={status}
        serviceName={name}
        server={currentServer}
        servicePort={parseInt(currentPort)}
        loading={loading}
        expanded={expanded}
        toggleExpanded={() => setExpanded((prev) => !prev)}
      />

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expandedPanel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col md:flex-row flex-wrap">
              {/* Address Settings */}
              <div className="flex flex-col w-full md:w-1/2 lg:w-1/3 xl:w-1/2 p-4 gap-4 border-r border-gray-800">
                <AddressSettings
                  serverOptions={serverOptions}
                  currentServer={currentServer}
                  setCurrentServer={setCurrentServer}
                  currentPort={currentPort}
                  setCurrentPort={setCurrentPort}
                />
              </div>

              {/* Controls */}
              <div className="flex w-full h-full md:w-1/2 lg:w-2/3 xl:w-1/2 p-4 gap-4">
                <Controls
                  loading={loading}
                  canCheck={!loading && isValidCheck()}
                  canUpdate={!loading && isModified}
                  onCheck={checkHealth}
                  onUpdate={handleUpdate}
                  onDelete={onDelete}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
