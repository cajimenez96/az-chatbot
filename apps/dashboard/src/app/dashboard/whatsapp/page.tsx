"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, RefreshCcw, AlertTriangle } from "lucide-react";
import { WhatsAppStatus } from "./components/WhatsAppStatus";
import { Instructions } from "./components/Instructions";
import business from "@/../business.json";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function WhatsAppPage() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("chatbot-auth-storage")
      : null;
  const parsedToken = token ? JSON.parse(token)?.state?.token : null;

  const { data, isLoading, isError, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["bot-status"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/bot/status`, {
        headers: { Authorization: `Bearer ${parsedToken}` },
      });
      if (!res.ok) throw new Error("Error al obtener estado del bot");
      return res.json();
    },
    refetchInterval: (query) => (query.state.data?.isConnected ? 30000 : 5000),
  });

  const lastUpdate = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString()
    : "--:--";

  return (
    <div style={{ maxWidth: "800px" }}>
      <header className="page-header">
        <h1 className="page-title">CONEXIÓN WHATSAPP</h1>
        <p className="page-subtitle">
          Vinculá tu número de {business.client.name} para activar el chatbot.
        </p>
      </header>

      <div className="card-default">
        <div className="card-body">
          <WhatsAppStatus data={data} isLoading={isLoading} isError={isError} />
          {!data?.isConnected && <Instructions />}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-md)",
          marginTop: "var(--space-xl)",
        }}
      >
        <button
          className="btn-pill btn-pill--outline"
          onClick={() => refetch()}
        >
          FORZAR ACTUALIZACIÓN
        </button>
        <span className="text-caption">
          Última sincronización: {lastUpdate}
        </span>
      </div>
    </div>
  );
}
