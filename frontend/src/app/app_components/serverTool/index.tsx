"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import Header from "./Header";
import ServerSettings from "./ServerSettings";
import Controls from "./Controls";

type Props = {
  ip: string;
  title: string;
  onUpdate: (newIp: string) => Promise<void>;
  onDelete?: () => void;
};

export default function ServerTool({ ip, title, onUpdate, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newIP, setNewIP] = useState(ip);
  const [status, setStatus] = useState<"up" | "down" | "unknown">("unknown");
  const [flightTime, setFlightTime] = useState<number | null>(null);

  // ─────────────────────────────
  // Effects
  // ─────────────────────────────

  useEffect(() => {
    checkHealth(ip);
  }, [ip]);

  useEffect(() => {
    setNewIP(ip);
  }, [ip]);

  // ─────────────────────────────
  // Logic
  // ─────────────────────────────

  const isModified = newIP !== ip;
  const isValidCheck = !!newIP;

  const checkHealth = async (ipToPing: string) => {
    if (!ipToPing) return;

    setLoading(true);
    setStatus("unknown");
    setFlightTime(null);

    try {
      const response = await axios.get(`/api/pingTool?ip=${ipToPing}`);
      const data = response.data;
      if (data.isUp) {
        setStatus("up");
        setFlightTime(data.flightTimeMs ?? null);
      } else {
        setStatus("down");
        setFlightTime(null);
      }
    } catch {
      setStatus("down");
      setFlightTime(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    await onUpdate(newIP);
    checkHealth(newIP);
  };

  // ─────────────────────────────
  // Render
  // ─────────────────────────────

  return (
    <div className="w-full overflow-x-auto border-2 border-gray-700 rounded-2xl bg-gray-800 backdrop-blur-md font-mono text-white">
      <Header
        serverStatus={status}
        serverName={title}
        serverIP={newIP}
        serverReplyTime={status === "up" && flightTime !== null ? flightTime : null}
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
              {/* Server Settings */}
              <div className="flex flex-col w-full md:w-1/2 lg:w-1/3 xl:w-1/2 p-4 gap-4 border-r border-gray-800">
                <ServerSettings
                  currentServer={title}
                  currentServerIP={newIP}
                  setCurrentServerIP={setNewIP}
                />
              </div>

              {/* Controls */}
              <div className="flex w-full h-full md:w-1/2 lg:w-2/3 xl:w-1/2 p-4 gap-4">
                <Controls
                  loading={loading}
                  canCheck={!loading && isValidCheck}
                  canUpdate={!loading && isModified}
                  onCheck={() => checkHealth(newIP)}
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
