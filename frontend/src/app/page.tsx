"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Plus, Tv2 } from "lucide-react";
import ConnectionForm from "@/components/ConnectionForm";
import ConnectionCard from "@/components/ConnectionCard";
import Modal from "@/components/Modal";
import type { Connection } from "@/types/connection";

type ApiStatus = "loading" | "alive" | "dead";
type ConnectionsStatus = "loading" | "success" | "error";

export default function MainScreen() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>("loading");
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectionsStatus, setConnectionsStatus] = useState<ConnectionsStatus>("loading");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch(`${NEXT_PUBLIC_API_URL}/healthcheck`, {
          method: "GET",
          signal: AbortSignal.timeout(500),
        });
        setApiStatus(response.ok ? "alive" : "dead");
      } catch (error) {
        console.error("Healthcheck failed:", error);
        setApiStatus("dead");
      }
    }

    checkHealth();
  }, []);

  const fetchConnections = useCallback(async () => {
    setConnectionsStatus("loading");
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/connections`);
      if (!response.ok) throw new Error("Failed to fetch connections");
      const data: Connection[] = await response.json();
      setConnections(data);
      setConnectionsStatus("success");
    } catch (error) {
      console.error("Failed to load connections:", error);
      setConnectionsStatus("error");
    }
  }, [NEXT_PUBLIC_API_URL]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const handleFormSuccess = useCallback(() => {
    setIsModalOpen(false);
    fetchConnections();
  }, [fetchConnections]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Main Screen</h1>
        <p className="text-slate-500 mt-1">Overview of your integrated systems.</p>
      </header>

      {apiStatus === "loading" && (
        <div className="flex items-center gap-2 p-4 text-amber-800 bg-amber-50 border border-amber-200 rounded-lg animate-pulse">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-medium">Connecting to API backend...</span>
        </div>
      )}

      {apiStatus === "dead" && (
        <div className="flex items-center gap-3 p-4 text-red-800 bg-red-50 border border-red-200 rounded-lg shadow-sm">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div>
            <span className="font-semibold">API is not alive!</span>
            <p className="text-sm text-red-700 mt-0.5">
              Could not establish a connection to {NEXT_PUBLIC_API_URL}/healthcheck. Please verify your backend server is running.
            </p>
          </div>
        </div>
      )}

      {apiStatus === "alive" && (
        <div className="flex items-center gap-3 p-4 text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-semibold">API is alive</span>
            <p className="text-sm text-emerald-700 mt-0.5">Successfully connected to the FastAPI backend service.</p>
          </div>
        </div>
      )}

      {/* Connections List */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Stream Connections</h3>
            <p className="text-sm text-slate-500 mt-0.5">All registered RTSP stream connections.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition"
          >
            <Plus className="h-4 w-4" />
            Add connection
          </button>
        </div>

        {connectionsStatus === "loading" && (
          <div className="flex items-center gap-2 text-slate-500 py-6 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading connections...</span>
          </div>
        )}

        {connectionsStatus === "error" && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">Could not load connections.</span>
          </div>
        )}

        {connectionsStatus === "success" && connections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-3">
            <Tv2 className="h-10 w-10" />
            <p className="text-sm">No connections registered yet.</p>
          </div>
        )}

        {connectionsStatus === "success" && connections.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections.map((connection) => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Stream Connection"
      >
        <ConnectionForm onSuccess={handleFormSuccess} />
      </Modal>
    </div>
  );
}
