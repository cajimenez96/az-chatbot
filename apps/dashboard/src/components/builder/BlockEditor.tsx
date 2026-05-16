import React, { useState, useEffect } from "react";
import { IBlock, BlockType, BlockOption } from "@az-chatbot/types";
import { useBlocksStore } from "@/store/useBlocksStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Save, X, Plus, Trash2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockEditorProps {
  block: IBlock | null;
  onCancel: () => void;
  onChange?: (updatedBlock: Partial<IBlock>) => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({
  block,
  onCancel,
  onChange,
}) => {
  const { createBlock, updateBlock, blocks } = useBlocksStore();
  const [formData, setFormData] = useState<Partial<IBlock>>({
    id: "",
    type: "message",
    message: "",
    options: [],
    saveAs: "",
    nextBlockId: "",
  });

  // Notificar cambios al padre para la vista previa en vivo
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  useEffect(() => {
    if (block) {
      setFormData(block);
    } else {
      setFormData({
        id: "",
        type: "message",
        message: "",
        options: [],
        saveAs: "",
        nextBlockId: "",
      });
    }
  }, [block]);

  const handleSave = async () => {
    if (block) {
      await updateBlock(block.id, formData);
    } else {
      await createBlock(formData as any);
    }
    onCancel();
  };

  const addOption = () => {
    const newOption: BlockOption = {
      id: Math.random().toString(36).substring(2, 7),
      label: "",
      nextBlockId: "",
    };
    setFormData({
      ...formData,
      options: [...(formData.options || []), newOption],
    });
  };

  const updateOption = (
    index: number,
    field: keyof BlockOption,
    value: string,
  ) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, options: newOptions });
  };

  const removeOption = (index: number) => {
    setFormData({
      ...formData,
      options: (formData.options || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="flex flex-col gap-8 p-4! bg-canvas border border-hairline rounded-lg shadow-sm mb-15!">
      <header className="flex items-center justify-between border-b border-hairline pb-6!">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <Edit3 size={16} />
          </div>
          <h2 className="text-xl font-medium text-ink tracking-tight font-heading uppercase">
            {block ? `Editando: ${block.id}` : "Nuevo Bloque"}
          </h2>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="rounded-full px-2! h-9 border-hairline hover:bg-surface-soft transition-all text-xs font-semibold uppercase tracking-wider"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-full px-3! h-9 bg-primary! hover:bg-ink-deep! text-on-primary! text-xs font-bold uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 border-none! shadow-sm"
          >
            <Save size={14} /> Guardar
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-mute uppercase tracking-widest ml-4">
            Identificador Único
          </label>
          <Input
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            placeholder="ej: saludo_inicial"
            disabled={!!block}
            className="h-11 rounded-full border-hairline bg-surface-soft focus:bg-canvas transition-all font-medium text-ink px-3!"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-mute uppercase tracking-widest ml-4">
            Tipo de Interacción
          </label>
          <div className="relative">
            <select
              className="w-full h-11 px-3! bg-surface-soft border border-hairline rounded-full focus:bg-canvas focus:border-ink outline-none transition-all text-sm font-medium text-ink appearance-none cursor-pointer"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as BlockType })
              }
            >
              <option value="message">Mensaje Informativo</option>
              <option value="question">Pregunta con Respuesta</option>
              <option value="menu">Menú de Opciones (Botones)</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-mute">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-mute uppercase tracking-widest ml-4">
          Mensaje de WhatsApp
        </label>
        <textarea
          className="w-full p-3! border border-hairline rounded-2xl focus:border-ink outline-none min-h-[140px] bg-surface-soft focus:bg-canvas transition-all text-sm font-normal leading-relaxed text-ink placeholder:text-mute resize-none"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          placeholder="Escribí el contenido que enviará el asistente..."
        />
        {formData.type === "question" && (
          <div className="flex items-center gap-2 mt-1! ml-4!">
            <Info size={12} className="text-primary" />
            <p className="text-[13px] text-mute font-medium">
              Usá{" "}
              <code className="text-ink font-bold bg-surface-soft px-1 rounded">
                {"{name}"}
              </code>{" "}
              para insertar el nombre del usuario automáticamente.
            </p>
          </div>
        )}
      </div>

      {formData.type === "question" && (
        <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 duration-300">
          <label className="text-[10px] font-bold text-mute uppercase tracking-widest ">
            Guardar respuesta en variable
          </label>
          <Input
            value={formData.saveAs}
            onChange={(e) =>
              setFormData({ ...formData, saveAs: e.target.value })
            }
            placeholder="ej: email_usuario"
            className="h-11 rounded-full border-hairline bg-surface-soft focus:bg-canvas transition-all font-medium text-ink px-5!"
          />
        </div>
      )}

      {(formData.type === "message" || formData.type === "question") && (
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-mute uppercase tracking-widest ml-4">
            ¿Qué pasa después?
          </label>
          <div className="relative">
            <select
              className="w-full h-11 px-3! bg-surface-soft border border-hairline rounded-full focus:bg-canvas focus:border-ink outline-none transition-all text-sm font-medium text-ink appearance-none cursor-pointer"
              value={formData.nextBlockId}
              onChange={(e) =>
                setFormData({ ...formData, nextBlockId: e.target.value })
              }
            >
              <option value="">Finalizar conversación</option>
              <optgroup label="Bloques Existentes" className="font-bold ">
                {blocks
                  ?.filter((b) => b && b.id && b.id !== formData.id)
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.id.toUpperCase()}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Acciones del Sistema" className="font-bold">
                <option value="faq_search_direct_main_faq_menu">
                  MENÚ DE FAQs PRINCIPAL
                </option>
                <option value="faq_search">BUSCADOR INTELIGENTE</option>
                <option value="human_handoff">
                  DERIVAR A UN AGENTE HUMANO
                </option>
              </optgroup>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-mute">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {formData.type === "menu" && (
        <div className="flex flex-col gap-6 pt-8 border-t border-hairline mt-2 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mt-2.5!">
            <h3 className="text-xs font-bold text-ink uppercase tracking-widest ">
              Opciones del Menú (Botones)
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={addOption}
              className="rounded-full bg-surface-soft hover:bg-hairline px-4 h-8 text-[10px] font-bold uppercase tracking-wider flex gap-1.5"
            >
              <Plus size={14} /> Añadir Botón
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            {formData.options?.map((opt, i) => (
              <div
                key={opt.id}
                className="flex items-end gap-4 bg-surface-soft p-4 rounded-2xl border border-hairline relative group transition-all hover:bg-canvas hover:border-hairline-strong shadow-sm"
              >
                <div className="flex-1 grid grid-cols-2 gap-4 p-3!">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-mute uppercase tracking-widest ml-2 ">
                      Texto del Botón
                    </label>
                    <Input
                      value={opt.label}
                      onChange={(e) => updateOption(i, "label", e.target.value)}
                      placeholder="ej: Ver precios"
                      className="h-9 rounded-full border-hairline bg-canvas px-3! text-xs font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-mute uppercase tracking-widest ml-2">
                      Ir al Bloque
                    </label>
                    <div className="relative">
                      <select
                        className="w-full h-9 px-3! bg-canvas border border-hairline rounded-full focus:border-ink outline-none transition-all text-xs font-medium text-ink appearance-none cursor-pointer"
                        value={opt.nextBlockId}
                        onChange={(e) =>
                          updateOption(i, "nextBlockId", e.target.value)
                        }
                      >
                        <option value="">Seleccionar...</option>
                        {blocks
                          .filter((b) => b.id)
                          .map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.id.toUpperCase()}
                            </option>
                          ))}
                        <option value="human_handoff">DERIVAR A HUMANO</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-mute">
                        <svg
                          width="8"
                          height="5"
                          viewBox="0 0 10 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 1L5 5L9 1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeOption(i)}
                  className="w-8 h-8 mb-3.5! me-3.5! bg-canvas border border-hairline rounded-full flex items-center justify-center text-mute hover:text-error hover:border-error transition-all shadow-sm shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {(!formData.options || formData.options.length === 0) && (
              <div className="text-center p-8 border border-hairline border-dashed rounded-2xl bg-white/50">
                <p className="text-xs text-mute font-medium py-6!">
                  No hay opciones configuradas aún.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Re-importing missing Lucide components since I changed the imports
import { Edit3 } from "lucide-react";
