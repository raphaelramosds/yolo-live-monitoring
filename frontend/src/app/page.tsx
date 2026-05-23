"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import ConnectionForm from "@/components/ConnectionForm";

export default function MainScreen() {
  const [status, setStatus] = useState<"loading" | "alive" | "dead">("loading");
  
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''; 

  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch(`${NEXT_PUBLIC_API_URL}/healthcheck`, {
          method: "GET",
          // Avoid long-hanging requests if the server is completely down
          signal: AbortSignal.timeout(4000) 
        });

        if (response.ok) {
          setStatus("alive");
        } else {
          setStatus("dead");
        }
      } catch (error) {
        console.error("Healthcheck failed:", error);
        setStatus("dead");
      }
    }

    checkHealth();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Main Screen</h1>
        <p className="text-slate-500 mt-1">Overview of your integrated systems.</p>
      </header>

      {/* Connection Alerts */}
      {status === "loading" && (
        <div className="flex items-center gap-2 p-4 text-amber-800 bg-amber-50 border border-amber-200 rounded-lg animate-pulse">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-medium">Connecting to API backend...</span>
        </div>
      )}

      {status === "dead" && (
        <div className="flex items-center gap-3 p-4 text-red-800 bg-red-50 border border-red-200 rounded-lg shadow-sm">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div>
            <span className="font-semibold">API is not alive!</span>
            <p className="text-sm text-red-700 mt-0.5">Could not establish a connection to {NEXT_PUBLIC_API_URL}/healthcheck. Please verify your backend server is running.</p>
          </div>
        </div>
      )}

      {status === "alive" && (
        <div className="flex items-center gap-3 p-4 text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-semibold">API is alive</span>
            <p className="text-sm text-emerald-700 mt-0.5">Successfully connected to the FastAPI backend service.</p>
          </div>
        </div>
      )}

      {/* Main Content Dashboard Card placeholder */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-slate-800">Register Stream Connection</h3>
          <p className="text-sm text-slate-500 mt-0.5">Add a new RTSP stream for live monitoring.</p>
        </div>
        <ConnectionForm />
      </div>
    </div>
  );
}