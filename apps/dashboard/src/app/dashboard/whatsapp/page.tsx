"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import {
  Smartphone,
  CheckCircle2,
  RefreshCcw,
  AlertTriangle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function WhatsAppPage() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("renault-auth-storage")
      : null;
  const parsedToken = token ? JSON.parse(token)?.state?.token : null;

  const { data, isLoading, isError, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["bot-status"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/bot/status`, {
        headers: {
          Authorization: `Bearer ${parsedToken}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener estado del bot");
      return res.json();
    },
    // Polling inteligente: 5s si espera QR, 30s si ya está conectado
    refetchInterval: (query) => {
      return query.state.data?.isConnected ? 30000 : 5000;
    },
  });

  const lastUpdate = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString()
    : "--:--";

  return (
    <div style={{ maxWidth: "800px" }}>
      <header style={{ marginBottom: "var(--space-xxl)" }}>
        <h1
          style={{
            font: "var(--text-heading-lg)",
            color: "white",
            marginBottom: "var(--space-xs)",
          }}
        >
          CONEXIÓN WHATSAPP
        </h1>
        <p style={{ font: "var(--text-body-md)", color: "var(--color-ash)" }}>
          Vinculá tu número de Renault para activar el chatbot.
        </p>
      </header>

      <div
        style={{
          backgroundColor: "var(--color-surface)",
          padding: "var(--space-xxl)",
          border: "1px solid var(--color-surface-light)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-xl)",
          textAlign: "center",
        }}
      >
        {isLoading && <div style={{ color: "white" }}>Cargando estado...</div>}

        {isError && (
          <div
            style={{
              color: "#ff4444",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertTriangle size={20} />
            Hubo un error al conectar con la API
          </div>
        )}

        {data?.isConnected ? (
          <div
            style={{
              padding: "var(--space-xxl)",
              backgroundColor: "rgba(0, 255, 100, 0.1)",
              border: "1px solid #00ff64",
              width: "100%",
            }}
          >
            <CheckCircle2
              size={60}
              color="#00ff64"
              style={{ marginBottom: "var(--space-md)" }}
            />
            <h2
              style={{
                color: "black",
                font: "var(--text-heading-sm)",
                marginBottom: "8px",
              }}
            >
              BOT CONECTADO
            </h2>
            <p style={{ color: "var(--color-ash)" }}>
              El sistema está operando normalmente y respondiendo consultas.
            </p>
          </div>
        ) : (
          <>
            {data?.qrCode ? (
              <div
                style={{
                  backgroundColor: "white",
                  padding: "var(--space-xl)",
                  borderRadius: "8px",
                  boxShadow: "0 0 30px rgba(255, 237, 0, 0.2)",
                }}
              >
                <QRCodeSVG value={data.qrCode} size={256} />
              </div>
            ) : (
              <div
                style={{
                  padding: "var(--space-xxl)",
                  border: "2px dashed var(--color-surface-light)",
                  width: "100%",
                }}
              >
                <RefreshCcw
                  size={40}
                  className="animate-spin"
                  color="var(--color-primary)"
                  style={{ marginBottom: "var(--space-md)" }}
                />
                <p style={{ color: "white" }}>Esperando código QR del Bot...</p>
                <p style={{ color: "var(--color-ash)", fontSize: "14px" }}>
                  Asegurate de que el proceso del Bot esté corriendo en tu
                  servidor.
                </p>
              </div>
            )}

            <div style={{ marginTop: "var(--space-lg)" }}>
              <h3
                style={{
                  color: "white",
                  font: "var(--text-body-lg)",
                  marginBottom: "var(--space-md)",
                }}
              >
                Instrucciones de vinculación:
              </h3>
              <ol
                style={{
                  textAlign: "left",
                  color: "var(--color-ash)",
                  lineHeight: "1.6",
                }}
              >
                <li>Abrí WhatsApp en tu teléfono.</li>
                <li>
                  Tocá <b>Menú</b> o <b>Configuración</b> y seleccioná{" "}
                  <b>Dispositivos vinculados</b>.
                </li>
                <li>
                  Tocá en <b>Vincular un dispositivo</b>.
                </li>
                <li>
                  Apuntá tu cámara a esta pantalla para escanear el código.
                </li>
              </ol>
            </div>
          </>
        )}
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
          onClick={() => refetch()}
          style={{
            backgroundColor: "transparent",
            border: "1px solid var(--color-primary)",
            color: "var(--color-primary)",
            padding: "10px 20px",
            cursor: "pointer",
            font: "var(--text-button-sm)",
          }}
        >
          FORZAR ACTUALIZACIÓN
        </button>
        <span style={{ color: "var(--color-ash)", fontSize: "12px" }}>
          Última sincronización: {lastUpdate}
        </span>
      </div>
    </div>
  );
}
