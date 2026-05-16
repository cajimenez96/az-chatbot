"use client";

import { Plus, Search, Database, Trash2, Settings, X, MessageSquare, HelpCircle, List } from "lucide-react";
import { useFAQsStore } from "@/store/useFAQsStore";
import { useBlocksStore } from "@/store/useBlocksStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WhatsAppPreview } from "@/components/builder/WhatsAppPreview";
import { useEffect, useState } from "react";
import type { IFAQ, BlockType, BlockOption } from "@az-chatbot/types";

export default function FAQsPage() {
  const {
    faqs,
    categories,
    loading,
    fetchFAQs,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    fetchCategories,
    addCategory,
    deleteCategory,
  } = useFAQsStore();

  const { blocks, fetchBlocks } = useBlocksStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFaq, setSelectedFaq] = useState<Partial<IFAQ> | null>(null);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState("");

  useEffect(() => {
    fetchFAQs();
    fetchCategories();
    fetchBlocks();
  }, [fetchFAQs, fetchCategories, fetchBlocks]);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateNew = () => {
    const newFaq: Partial<IFAQ> = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'message',
      question: "Nueva Pregunta",
      message: "Escribí aquí la respuesta...",
      category: categories[0]?.id || "general",
      keywords: [],
      options: [],
      active: true,
      hits: 0
    };
    setSelectedFaq(newFaq);
  };

  const handleSave = async () => {
    if (!selectedFaq) return;

    try {
      const isNew = !faqs.find(f => f.id === selectedFaq.id);
      if (isNew) {
        await addFAQ(selectedFaq as any);
      } else {
        await updateFAQ(selectedFaq.id!, selectedFaq as any);
      }
      await fetchFAQs();
      alert("¡Conocimiento guardado correctamente!");
    } catch (err) {
      console.error("Error saving FAQ:", err);
    }
  };

  const addOption = () => {
    const newOption: BlockOption = {
      id: Math.random().toString(36).substring(2, 7),
      label: '',
      nextBlockId: '',
    };
    setSelectedFaq({ ...selectedFaq!, options: [...(selectedFaq!.options || []), newOption] });
  };

  const updateOption = (index: number, field: keyof BlockOption, value: string) => {
    const newOptions = [...(selectedFaq!.options || [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setSelectedFaq({ ...selectedFaq!, options: newOptions });
  };

  const removeOption = (index: number) => {
    setSelectedFaq({ ...selectedFaq!, options: (selectedFaq!.options || []).filter((_, i) => i !== index) });
  };

  return (
    <div style={{ height: "calc(100vh - 120px)", display: "flex", flexDirection: "column", position: "relative" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-xl)", borderBottom: "1px solid var(--color-hairline-strong)", paddingBottom: "var(--space-md)" }}>
        <div>
          <p style={{ font: "var(--text-overline)", color: "var(--color-ash)", marginBottom: "var(--space-xxs)" }}>CONOCIMIENTO ESTRUCTURADO</p>
          <h1 style={{ font: "var(--text-display-xs)", color: "var(--color-ink)", textTransform: "uppercase" }}>Base de Conocimientos (FAQs)</h1>
        </div>
        <div style={{ display: "flex", gap: "var(--space-md)" }}>
          <button onClick={() => setIsCatModalOpen(true)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--color-hairline-strong)", backgroundColor: "white" }}>
            <Settings size={18} color="var(--color-ash)" />
          </button>
          <Button onClick={handleCreateNew} style={{ width: "auto", padding: "0 var(--space-lg)", height: "40px" }}>
            <Plus size={18} style={{ marginRight: "var(--space-xs)" }} /> NUEVO BLOQUE FAQ
          </Button>
          {selectedFaq && (
            <Button onClick={handleSave} style={{ width: "auto", padding: "0 var(--space-lg)", height: "40px", backgroundColor: "var(--color-ink)", color: "white" }}>
              GUARDAR CAMBIOS
            </Button>
          )}
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "var(--space-xxxl)", flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{ gridColumn: "span 3", display: "flex", flexDirection: "column", gap: "var(--space-lg)", overflowY: "auto" }}>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-ash)" }} />
            <input type="text" placeholder="Buscar en la base..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: "100%", padding: "10px 12px 10px 36px", font: "var(--text-body-sm)", border: "1px solid var(--color-hairline-strong)", outline: "none" }} />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            <button onClick={() => setSelectedCategory("all")} style={{ padding: "4px 8px", fontSize: "10px", fontWeight: "bold", border: "1px solid var(--color-ink)", backgroundColor: selectedCategory === "all" ? "var(--color-ink)" : "transparent", color: selectedCategory === "all" ? "white" : "var(--color-ink)" }}>TODAS</button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} style={{ padding: "4px 8px", fontSize: "10px", fontWeight: "bold", border: "1px solid var(--color-ink)", backgroundColor: selectedCategory === cat.id ? "var(--color-ink)" : "transparent", color: selectedCategory === cat.id ? "white" : "var(--color-ink)" }}>{cat.label.toUpperCase()}</button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filteredFaqs.map((faq) => (
              <div key={faq.id} onClick={() => setSelectedFaq({ ...faq })} style={{ padding: "var(--space-md)", border: "1px solid var(--color-hairline-strong)", cursor: "pointer", backgroundColor: selectedFaq?.id === faq.id ? "var(--color-surface-dark)" : "white", color: selectedFaq?.id === faq.id ? "white" : "var(--color-ink)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "9px", fontWeight: "bold", opacity: 0.7 }}>
                    {(faq.category || 'general').toUpperCase()} • {(faq.type || 'message').toUpperCase()}
                  </span>
                </div>
                <p style={{ font: "var(--text-body-sm)", fontWeight: "bold", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{faq.question}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Editor (Copia del Builder) */}
        <div style={{ gridColumn: "span 5", backgroundColor: "white", padding: "var(--space-xxl)", border: "1px solid var(--color-hairline-strong)", overflowY: "auto" }}>
          {selectedFaq ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ font: "var(--text-overline)", color: "var(--color-ash)" }}>Título / Trigger</label>
                    <input value={selectedFaq.question} onChange={(e) => setSelectedFaq({ ...selectedFaq!, question: e.target.value })} style={{ padding: "12px", border: "1px solid var(--color-stone)", font: "var(--text-body-md)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ font: "var(--text-overline)", color: "var(--color-ash)" }}>Tipo de Bloque</label>
                  <select value={selectedFaq.type} onChange={(e) => setSelectedFaq({ ...selectedFaq!, type: e.target.value as BlockType })} style={{ height: "48px", border: "none", borderBottom: "1px solid var(--color-stone)", font: "var(--text-body-md)" }}>
                    <option value="message">Mensaje Simple</option>
                    <option value="question">Pregunta (Captura de dato)</option>
                    <option value="menu">Menú de Opciones</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ font: "var(--text-overline)", color: "var(--color-ash)" }}>Categoría</label>
                  <select value={selectedFaq.category} onChange={(e) => setSelectedFaq({ ...selectedFaq!, category: e.target.value })} style={{ height: "48px", border: "none", borderBottom: "1px solid var(--color-stone)" }}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ font: "var(--text-overline)", color: "var(--color-ash)" }}>Keywords (coma)</label>
                  <input value={selectedFaq.keywords?.join(", ")} onChange={(e) => setSelectedFaq({ ...selectedFaq!, keywords: e.target.value.split(",").map(k => k.trim()) })} style={{ padding: "12px", border: "1px solid var(--color-stone)" }} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ font: "var(--text-overline)", color: "var(--color-ash)" }}>Contenido del Mensaje</label>
                <textarea value={selectedFaq.message} onChange={(e) => setSelectedFaq({ ...selectedFaq!, message: e.target.value })} style={{ width: "100%", padding: "16px", border: "1px solid var(--color-stone)", minHeight: "120px", font: "var(--text-body-md)" }} />
              </div>

              {selectedFaq.type === 'question' && (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ font: "var(--text-overline)", color: "var(--color-ash)" }}>Guardar respuesta en (saveAs)</label>
                  <input value={selectedFaq.saveAs} onChange={(e) => setSelectedFaq({ ...selectedFaq!, saveAs: e.target.value })} style={{ padding: "12px", border: "1px solid var(--color-stone)" }} placeholder="ej: nombre_usuario" />
                </div>
              )}

              {(selectedFaq.type === 'message' || selectedFaq.type === 'question') && (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ font: "var(--text-overline)", color: "var(--color-ash)" }}>Siguiente Paso</label>
                  <select value={selectedFaq.nextBlockId} onChange={(e) => setSelectedFaq({ ...selectedFaq!, nextBlockId: e.target.value })} style={{ height: "48px", border: "none", borderBottom: "1px solid var(--color-stone)" }}>
                    <option value="">Fin de flujo</option>
                    <optgroup label="Bloques Builder">
                        {blocks.map(b => <option key={b.id} value={b.id}>{b.id.toUpperCase()}</option>)}
                    </optgroup>
                    <optgroup label="Otras FAQs">
                        {faqs.filter(f => f.id !== selectedFaq.id).map(f => <option key={f.id} value={`faq_search_direct_${f.id}`}>{f.question}</option>)}
                    </optgroup>
                    <optgroup label="Acciones">
                        <option value="human_handoff">DERIVAR A HUMANO</option>
                        <option value="main_menu">VOLVER AL INICIO</option>
                    </optgroup>
                  </select>
                </div>
              )}

              {selectedFaq.type === 'menu' && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", borderTop: "1px solid var(--color-stone)", paddingTop: "24px" }}>
                   <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h3 style={{ font: "var(--text-overline)" }}>Opciones del Menú</h3>
                    <Button variant="ghost" size="sm" onClick={addOption}>+ AÑADIR</Button>
                   </div>
                   {selectedFaq.options?.map((opt, i) => (
                     <div key={opt.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 32px", gap: "8px", backgroundColor: "#f9f9f9", padding: "12px", border: "1px solid #eee" }}>
                        <input value={opt.label} onChange={(e) => updateOption(i, 'label', e.target.value)} placeholder="Etiqueta" style={{ padding: "4px", fontSize: "12px" }} />
                        <select value={opt.nextBlockId} onChange={(e) => updateOption(i, 'nextBlockId', e.target.value)} style={{ padding: "4px", fontSize: "11px" }}>
                            <option value="">Menú Principal</option>
                            <optgroup label="FAQs">
                                {faqs.map(f => <option key={f.id} value={`faq_search_direct_${f.id}`}>{f.question}</option>)}
                            </optgroup>
                            <optgroup label="Bloques">
                                {blocks.map(b => <option key={b.id} value={b.id}>{b.id.toUpperCase()}</option>)}
                            </optgroup>
                            <optgroup label="Acciones">
                                <option value="human_handoff">HUMANO</option>
                            </optgroup>
                        </select>
                        <button onClick={() => removeOption(i)} style={{ color: "red" }}>×</button>
                     </div>
                   ))}
                </div>
              )}

              {selectedFaq.id !== 'main_faq_menu' && (
                <div style={{ marginTop: "40px", borderTop: "1px solid #fee", paddingTop: "20px" }}>
                  <Button variant="outline" onClick={() => { if(confirm("¿Eliminar?")) deleteFAQ(selectedFaq.id!); setSelectedFaq(null); }} style={{ color: "red", borderColor: "red", height: "32px", fontSize: "11px" }}>ELIMINAR FAQ</Button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px", opacity: 0.3 }}>
              <Database size={64} />
              <p>Seleccioná o creá un bloque de conocimiento</p>
            </div>
          )}
        </div>

        {/* Preview */}
        <div style={{ gridColumn: "span 4", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "var(--color-surface-soft)" }}>
           <WhatsAppPreview 
            message={selectedFaq?.message || "Vista previa..."} 
            type={selectedFaq?.type as any || 'message'} 
            options={selectedFaq?.options || []} 
           />
        </div>
      </div>

      {/* Modal Categorías */}
      {isCatModalOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", width: "400px", padding: "32px", border: "1px solid var(--color-ink)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
              <h3>GESTIONAR CATEGORÍAS</h3>
              <button onClick={() => setIsCatModalOpen(false)}><X /></button>
            </div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              <input value={newCatLabel} onChange={(e) => setNewCatLabel(e.target.value)} placeholder="Nueva categoría..." style={{ flex: 1, padding: "8px", border: "1px solid #ddd" }} />
              <Button onClick={async () => { await addCategory(newCatLabel); setNewCatLabel(""); }}>AÑADIR</Button>
            </div>
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              {categories.map(c => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
                  <span>{c.label}</span>
                  {c.id !== 'general' && <button onClick={() => deleteCategory(c.id)} style={{ color: "red" }}><Trash2 size={14}/></button>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
