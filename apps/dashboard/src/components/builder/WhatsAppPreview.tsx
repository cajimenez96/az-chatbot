import React from "react";

interface WhatsAppPreviewProps {
  message: string;
  type: "message" | "question" | "menu";
  options?: { label: string }[];
}

export const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({
  message,
  type,
  options,
}) => {
  return (
    <div className="w-[320px] bg-canvas border border-hairline rounded-lg overflow-hidden shadow-sm">
      {/* WhatsApp Header */}
      <div className="bg-[#075e54] p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-surface-soft rounded-full flex items-center justify-center text-mute">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="leading-tight">
          <p className="text-white font-medium text-sm tracking-tight font-heading">Assistant</p>
          <p className="text-white/70 text-[10px]">En línea</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="h-[400px] bg-[#e5ddd5] p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
        <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm max-w-[85%] self-start relative animate-in fade-in slide-in-from-left-2 duration-300">
          <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
            {message}
          </p>
          <p className="text-[10px] text-slate-400 text-right mt-1">14:41</p>
        </div>

        {type === "menu" && options && options.length > 0 && (
          <div className="flex flex-col gap-2 mt-2 w-full px-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {options.map((opt, i) => (
              <div
                key={i}
                className="bg-white text-[#00a884] font-bold text-sm py-2.5 px-4 rounded-full text-center shadow-sm border border-slate-50 hover:bg-slate-50 transition-colors cursor-default"
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WhatsApp Input area */}
      <div className="bg-[#f0f0f0] p-3 flex items-center gap-3">
        <div className="flex-1 bg-white h-10 rounded-full px-4 flex items-center">
          <p className="text-slate-400 text-sm">Mensaje...</p>
        </div>
        <div className="w-10 h-10 bg-[#00a884] rounded-full flex items-center justify-center text-white shadow-md active:scale-90 transition-transform">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
