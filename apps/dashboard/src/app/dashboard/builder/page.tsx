"use client";

import React, { useEffect, useState } from "react";
import { useBlocksStore } from "@/store/useBlocksStore";
import { IBlock } from "@az-chatbot/types";
import { BlockEditor } from "@/components/builder/BlockEditor";
import { WhatsAppPreview } from "@/components/builder/WhatsAppPreview";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Plus,
  Layout,
  Smartphone,
  Trash2,
  Edit3,
  MessageSquare,
  List,
  HelpCircle,
} from "lucide-react";

export default function BuilderPage() {
  const { blocks, fetchBlocks, loading, removeBlock } = useBlocksStore();
  const [selectedBlock, setSelectedBlock] = useState<IBlock | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [livePreviewBlock, setLivePreviewBlock] = useState<Partial<IBlock> | null>(
    null,
  );

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const handleEdit = (block: IBlock) => {
    setSelectedBlock(block);
    setLivePreviewBlock(block);
    setIsCreating(true);
  };

  const handleCreate = () => {
    setSelectedBlock(null);
    setLivePreviewBlock({
      id: "nuevo_bloque",
      type: "message",
      message: "",
      options: [],
    });
    setIsCreating(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("¿Estás seguro de eliminar este bloque?")) {
      await removeBlock(id);
    }
  };

  return (
    <div className="builder-layout bg-canvas relative">
      {/* Patrón de puntos de fondo */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      <header className="builder-header ">
        <div className="builder-title-group mx-3! ">
          <h1>CONSTRUCTOR</h1>
          <p>DISEÑÁ EL FLUJO DE TU ASISTENTE VIRTUAL</p>
        </div>
        <Button
          onClick={handleCreate}
          className="rounded-full bg-primary!  text-on-primary! text-[12px] font-black uppercase tracking-[0.2em] px-8! h-12 transition-all active:scale-95 flex items-center justify-center gap-3 border-none! shadow-sm hover:shadow-md mb-3!"
        >
          <Plus size={18} strokeWidth={3} /> NUEVO BLOQUE
        </Button>
      </header>

      <div className="grid grid-cols-12 gap-12 flex-1 min-h-0 relative z-10 overflow-hidden mb-15!">
        {/* Sidebar: Blocks List */}
        <div className="col-span-3 flex flex-col gap-8 overflow-y-auto pr-4 no-scrollbar">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black text-ink uppercase tracking-[0.25em] opacity-40  pl-2.5!">
              BLOQUES
            </h3>
            <div className="h-px flex-1 mx-4 bg-hairline opacity-50"></div>
            <span className="text-[10px] bg-ink text-white px-2! py-0.5! rounded-md! font-bold!">
              {blocks.length}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {loading && blocks.length === 0 ? (
              <div className="p-10 text-center border border-hairline border-dashed rounded-2xl bg-surface-soft/30 backdrop-blur-sm">
                <p className="text-xs text-mute font-medium italic">
                  Cargando...
                </p>
              </div>
            ) : (
              blocks
                ?.filter((b) => b && b.id)
                .map((block) => {
                  const isSelected = selectedBlock?.id === block.id;
                  const Icon =
                    block.type === "menu"
                      ? List
                      : block.type === "question"
                        ? HelpCircle
                        : MessageSquare;

                  return (
                    <div
                      key={block.id}
                      onClick={() => handleEdit(block)}
                      className={cn(
                        /* Usamos !p-8 para FORZAR el padding por sobre cualquier otro estilo */
                        "flex flex-col p-3! mx-2! border transition-all duration-300 cursor-pointer rounded-2xl group relative overflow-hidden",
                        isSelected
                          ? "bg-primary! border-primary! text-ink shadow-lg z-10 active-glow"
                          : "glass-card text-ink border-hairline hover:border-hairline-strong",
                      )}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                              isSelected
                                ? "bg-black/10 text-ink shadow-inner"
                                : "bg-white/50 text-mute group-hover:text-ink shadow-sm border border-black/5",
                            )}
                          >
                            <Icon size={14} strokeWidth={2.5} />
                          </div>
                          <span
                            className={cn(
                              "text-[9px] font-black uppercase tracking-widest px-2.5! py-0.5 rounded-lg ",
                              isSelected
                                ? "bg-black/10 text-ink"
                                : "bg-black/5 text-mute border border-black/5",
                            )}
                          >
                            {block.type}
                          </span>
                        </div>

                        {block.id.trim().toLowerCase() !== "welcome" && (
                          <button
                            onClick={(e) => handleDelete(e, block.id)}
                            className={cn(
                              "opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-full transition-all",
                              isSelected
                                ? "text-ink/60 hover:bg-black/10 hover:text-ink"
                                : "text-mute hover:bg-error/10 hover:text-error hover:scale-110",
                            )}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <p
                        className={cn(
                          "font-black text-[13px] tracking-tight truncate uppercase font-heading pl-0.5",
                          isSelected ? "text-ink" : "text-ink opacity-80",
                        )}
                      >
                        {block.id}
                      </p>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="col-span-6 overflow-y-auto no-scrollbar pb-10 px-8 ">
          {selectedBlock || isCreating ? (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <BlockEditor
                block={selectedBlock}
                onCancel={() => {
                  setSelectedBlock(null);
                  setLivePreviewBlock(null);
                  setIsCreating(false);
                }}
                onChange={(updated) => setLivePreviewBlock(updated)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[600px] bg-white/30 backdrop-blur-md border border-hairline border-dashed rounded-3xl p-16 text-center group hover:bg-white/50 transition-all duration-500">
              <div className="w-20 h-20 bg-canvas border border-hairline rounded-4xl flex items-center justify-center mb-8 text-mute group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ">
                <Layout size={32} strokeWidth={1} className="opacity-40" />
              </div>
              <h3 className="text-2xl font-black text-ink tracking-tight mb-4 uppercase font-heading">
                Centro de Control
              </h3>
              <p className="text-sm text-body/60 max-w-[280px] leading-relaxed font-medium">
                Elegí un bloque de la izquierda para desplegar sus opciones o
                iniciá uno nuevo desde el botón superior.
              </p>
              <div className="mt-8 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-primary/20 animate-pulse delay-150"></div>
              </div>
            </div>
          )}
        </div>

        {/* Preview Area */}
        <div className="col-span-3 flex flex-col gap-6 pl-4 overflow-y-auto no-scrollbar pb-10">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone size={14} className="text-mute" />
            <h3 className="text-[10px] font-bold text-mute uppercase tracking-[0.2em]">
              Vista Previa en Vivo
            </h3>
          </div>

          <div className="phone-mockup">
            {/* WhatsApp Header */}
            <div className="whatsapp-header">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <div className="w-4 h-4 bg-white/40 rounded-full animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold leading-tight">
                  Asistente Virtual
                </p>
                <p className="text-[10px] opacity-70">En línea</p>
              </div>
            </div>

            {/* WhatsApp Body */}
            <div className="whatsapp-content ">
              {livePreviewBlock ? (
                <div
                  key={livePreviewBlock.id}
                  className="flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out"
                >
                  <div className="chat-bubble mt-3! py-2! px-3! ml-2.5!">
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {livePreviewBlock.message ||
                        "Escribí un mensaje para previsualizar..."}
                    </p>
                  </div>

                  {livePreviewBlock.type === "menu" &&
                    livePreviewBlock.options &&
                    livePreviewBlock.options.length > 0 && (
                      <div className="flex flex-col gap-2 mt-3! mx-auto! w-full max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-150 fill-mode-both">
                        {livePreviewBlock.options.map((opt) => (
                          <div
                            key={opt.id}
                            className="bg-white py-2.5! px-4! rounded-full text-center text-black text-[12px] font-bold shadow-sm border border-black/5 hover:bg-surface-soft transition-colors"
                          >
                            {opt.label || "Botón sin texto"}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6 opacity-40 animate-in fade-in duration-500">
                  <MessageSquare size={32} className="mb-4 text-mute" />
                  <p className="text-xs font-bold uppercase tracking-widest text-mute">
                    Seleccioná un bloque
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
