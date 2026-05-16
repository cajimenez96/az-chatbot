"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ILead } from "@az-chatbot/types";
import { Calendar, Mail, Phone, Tag } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";

export default function LeadsPage() {
  const {
    data: leads,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const res = await api.get<{ data: ILead[] }>("/leads");
      console.log(res.data.data);
      return res.data.data;
    },
  });

  return (
    <div className="page-container">
      <header className="page-header mb-0">
        <h1 className="page-title">GESTIÓN DE LEADS</h1>
        <p className="page-subtitle">
          Seguimiento de prospectos capturados por el asistente virtual
        </p>
      </header>

      {isLoading ? (
        <div className="p-10 card-default bg-surface-soft text-center">
          <p className="text-caption">Cargando leads...</p>
        </div>
      ) : error ? (
        <div className="p-10 card-default border-error/20 bg-error/5 text-center">
          <p className="text-error font-medium">
            Error al cargar la lista de leads. Por favor, verificá tu conexión.
          </p>
        </div>
      ) : (
        <div className="card-default card-overflow">
          <Table>
            <TableHeader className="bg-surface-soft">
              <TableRow>
                <TableHead className="th-cell">CLIENTE</TableHead>
                <TableHead className="th-cell">CONTACTO</TableHead>
                <TableHead className="th-cell">INTERÉS</TableHead>
                <TableHead className="th-cell">FECHA</TableHead>
                <TableHead className="th-cell">ESTADO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(leads) && leads.length > 0 ? (
                leads.map((lead) => (
                  <TableRow key={lead.id} className="border-b border-hairline">
                    <TableCell className="td-cell">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          {lead.name?.charAt(0) || "U"}
                        </div>
                        <span className="font-(--text-button-md) text-ink">
                          {lead.name || "Sin nombre"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="td-cell">
                      <div className="flex flex-col gap-1">
                        <div className="text-caption flex items-center gap-1.5">
                          <Phone size={13} /> {lead.phone}
                        </div>
                        <div className="text-caption flex items-center gap-1.5">
                          <Mail size={13} /> {lead.name || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="td-cell">
                      <span className="tag-pill">
                        <Tag size={11} />{" "}
                        {lead.interest?.toUpperCase() || "GENERAL"}
                      </span>
                    </TableCell>
                    <TableCell className="td-cell">
                      <div className="text-caption flex items-center gap-1.5">
                        <Calendar size={13} />{" "}
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="td-cell">
                      <StatusBadge status={lead.status} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="p-10 text-center">
                    <span className="text-caption">
                      No hay leads registrados todavía.
                    </span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
