import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronDown } from "lucide-react";

const options = ["Daily", "Weekly", "Monthly", "Yearly"];

export interface FrequencySelectorProps {
  theme?: "dark" | "light";
  className?: string;
}

export function FrequencySelector({ theme = "dark", className = "" }: FrequencySelectorProps) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState("Daily");

  return (
    <motion.div 
      layout
      className={`flex w-full max-w-[320px] flex-col overflow-hidden rounded-3xl p-[6px] transition-colors duration-300 ${
        theme === "dark" 
          ? "bg-[#181818] border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]" 
          : "bg-neutral-200/80 border border-neutral-300/40 shadow-[0_6px_16px_rgba(0,0,0,0.04)]"
      } ${className}`}
      onClick={() => {
        if (!expanded) setExpanded(true);
      }}
    >
      <div className="relative flex items-center justify-between h-[36px]">
        
        {/* The "Frequency" Label */}
        <motion.div 
          animate={{ 
            filter: expanded ? "blur(4px)" : "blur(0px)", 
            opacity: expanded ? 0.3 : 1 
          }}
          transition={{ duration: 0.3 }}
          className={`flex h-full items-center justify-center px-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap select-none ${
            theme === "dark" ? "text-neutral-400" : "text-neutral-600"
          }`}
        >
          Frequency
        </motion.div>

        {/* The Content */}
        <AnimatePresence mode="popLayout">
          {expanded ? (
            <motion.div 
              key="expanded"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className="absolute inset-0 flex h-full w-full justify-between gap-1.5"
            >
              <div className={`relative flex w-full items-center justify-between rounded-full px-1 shadow-sm ${
                theme === "dark" ? "bg-[#121212] border border-white/5" : "bg-neutral-100"
              }`}>
                {options.map((opt) => (
                  <div 
                    key={opt}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(opt);
                    }}
                    className={`relative flex-1 text-center cursor-pointer rounded-full px-2 py-1 text-xs transition-colors duration-200 z-10 select-none font-medium ${
                      selected === opt 
                        ? (theme === "dark" ? "text-white font-semibold" : "text-neutral-900 font-semibold") 
                        : (theme === "dark" ? "text-neutral-400 hover:text-neutral-200" : "text-neutral-500 hover:text-neutral-700")
                    }`}
                  >
                    {selected === opt && (
                      <motion.div 
                        layoutId="active-freq-pill"
                        className={`absolute inset-0 rounded-full shadow-sm ${
                          theme === "dark" ? "bg-white/15 border border-white/10" : "bg-neutral-200/90"
                        }`}
                        style={{ zIndex: -1 }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{opt}</span>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(false);
                }}
                className={`flex h-full shrink-0 cursor-pointer items-center justify-center rounded-full px-3 transition-colors shadow-sm ${
                  theme === "dark"
                    ? "bg-white text-black hover:bg-neutral-200"
                    : "bg-neutral-950 text-white hover:bg-neutral-800"
                }`}
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="collapsed"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)", x: 20 }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)", x: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)", x: 20 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className={`relative flex h-full w-fit items-center gap-1.5 rounded-full pl-3.5 pr-2.5 cursor-pointer transition-colors shadow-sm select-none ${
                theme === "dark"
                  ? "bg-neutral-850 hover:bg-neutral-800 text-white border border-white/10"
                  : "bg-neutral-100 hover:bg-white text-neutral-800"
              }`}
            >
              <div className="text-xs font-semibold">{selected}</div>
              <div className={`flex h-full items-center justify-center ${
                theme === "dark" ? "text-neutral-400" : "text-neutral-500"
              }`}>
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
