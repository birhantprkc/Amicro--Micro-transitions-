import React from "react";

export function FocusBlurDemo({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  return (
    <div className="flex w-full flex-col items-center gap-6 font-sans">
      <style>{`
        .blur-group:has(.blur-target:hover) .blur-target:not(:hover) {
          filter: blur(4px);
          opacity: 0.35;
        }
        .blur-target {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      {/* CSS :has() Typography Blur Grid */}
      <div className={`w-full rounded-[24px] p-6 sm:p-8 border flex flex-col items-center text-center gap-4 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#181818] border-white/10' : 'bg-white border-neutral-200 shadow-sm'
      }`}>
        <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-400">
          CSS :has() Parent Selector
        </span>
        <div className="flex flex-wrap justify-center gap-x-3 text-xl sm:text-3xl font-bold blur-group cursor-default py-4">
          <span className={theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}>Explore</span>
          {["Animations,", "Transitions,", "Physics,", "Micro-UI"].map((word) => (
            <span 
              key={word} 
              className={`blur-target cursor-pointer hover:text-indigo-400 transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-neutral-900'
              }`}
            >
              {word}
            </span>
          ))}
        </div>
        <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
          Hovering over any word automatically blurs and softens its peer sibling elements using pure CSS.
        </p>
      </div>
    </div>
  );
}
