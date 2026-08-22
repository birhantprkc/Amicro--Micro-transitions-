import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  Type, Copy, Check, Terminal, ArrowLeft, RefreshCw, Sparkles 
} from 'lucide-react';
import { IconSwap, IconSwapItem } from './IconSwap';
import { ScrambleHover, ScrambleHoverDemo } from './css-animations/ScrambleHover';
import { FocusBlurDemo } from './css-animations/FocusBlur';

export interface TextAnimationItem {
  id: string;
  name: string;
  category: string;
  description: string;
  cliCommand: string;
  componentCode: string;
}

export const textAnimationsData: TextAnimationItem[] = [
  {
    id: 'scramble-text',
    name: 'Scramble Text Decoder',
    category: 'matrix-fx',
    description: 'Matrix-style text decoding scrambler with custom character sets, intervals, and direction.',
    cliCommand: 'npx @subhanhq/amicro@latest add scramble-text',
    componentCode: `// Scramble decoder component using character randomization and interval reveals.`
  },
  {
    id: 'focus-blur',
    name: 'CSS :has() Focus Blur',
    category: 'hover-focus',
    description: 'Zero-JS sibling focus-blur depth hierarchy using CSS :has() parent-child selector physics.',
    cliCommand: 'npx @subhanhq/amicro@latest add focus-blur',
    componentCode: `// Zero JS focus blur via .group:has(.target:hover) .target:not(:hover) { filter: blur(3px); }`
  },
  {
    id: 'wave-reveal',
    name: 'Staggered Wave Reveal',
    category: 'reveal',
    description: 'Per-letter vertical spring entrance with staggered letter delay and 3D rotation settle.',
    cliCommand: 'npx @subhanhq/amicro@latest add wave-reveal',
    componentCode: `// Staggered letter animation with translateY(-20px) spring physics.`
  },
  {
    id: 'gradient-shimmer',
    name: 'Ambient Gradient Shimmer',
    category: 'gradient',
    description: 'Continuous metallic light beam sweeping across typography with background-clip: text.',
    cliCommand: 'npx @subhanhq/amicro@latest add gradient-shimmer',
    componentCode: `// Shimmering background-clip text with linear-gradient sweep keyframes.`
  },
  {
    id: 'typewriter-cursor',
    name: 'Mechanical Typewriter',
    category: 'typing',
    description: 'Stepping character-by-character typewriter effect with blinking vertical cursor line.',
    cliCommand: 'npx @subhanhq/amicro@latest add typewriter-text',
    componentCode: `// Stepped typewriter typing animation with CSS blink cursor.`
  },
  {
    id: 'perspective-flip',
    name: '3D Perspective Word Flip',
    category: '3d-fx',
    description: 'Rolling 3D cube face rotation switching between multiple keywords on hover.',
    cliCommand: 'npx @subhanhq/amicro@latest add perspective-flip',
    componentCode: `// 3D rotateX cube face rotation with preserve-3d transform style.`
  }
];

interface TextAnimationsPageProps {
  theme: 'dark' | 'light';
  showToast?: (message: string) => void;
  triggerHaptic?: (type: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy') => void;
  onNavigateHome?: () => void;
}

export function TextAnimationsPage({
  theme,
  showToast,
  triggerHaptic,
  onNavigateHome,
}: TextAnimationsPageProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleCopyCode = useCallback(
    (item: TextAnimationItem) => {
      const codeToCopy = item.componentCode || item.cliCommand;
      navigator.clipboard
        .writeText(codeToCopy)
        .then(() => {
          if (triggerHaptic) triggerHaptic('success');
          setCopiedId(item.id);
          setTimeout(() => setCopiedId(null), 2000);
          if (showToast) showToast(`Copied ${item.name} code!`);
        })
        .catch(() => {
          if (triggerHaptic) triggerHaptic('error');
          if (showToast) showToast('Failed to copy code.');
        });
    },
    [showToast, triggerHaptic]
  );

  const handleCopyCli = useCallback(
    (command: string, name: string) => {
      navigator.clipboard
        .writeText(command)
        .then(() => {
          if (triggerHaptic) triggerHaptic('success');
          if (showToast) showToast(`Copied ${name} CLI command!`);
        })
        .catch(() => {
          if (triggerHaptic) triggerHaptic('error');
          if (showToast) showToast('Failed to copy CLI command.');
        });
    },
    [showToast, triggerHaptic]
  );

  const renderLiveTextEffect = (id: string) => {
    switch (id) {
      case 'scramble-text':
        return (
          <div className="w-full flex items-center justify-center px-4 text-center">
            <div className={`text-base sm:text-lg font-bold font-mono ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
              <ScrambleHover text="DECODE_REACT" />
            </div>
          </div>
        );
      case 'focus-blur':
        return (
          <div className="w-full flex items-center justify-center">
            <FocusBlurDemo theme={theme} />
          </div>
        );
      case 'wave-reveal':
        return (
          <div className="flex items-center justify-center gap-1 font-bold text-base select-none">
            {'ELEVATE'.split('').map((char, i) => (
              <motion.span
                key={`${i}-${refreshKey}`}
                animate={{ y: [0, -8, 0], color: theme === 'dark' ? ['#fff', '#818cf8', '#fff'] : ['#111', '#6366f1', '#111'] }}
                transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.12 }}
                className="cursor-pointer"
              >
                {char}
              </motion.span>
            ))}
          </div>
        );
      case 'gradient-shimmer':
        return (
          <div className="flex items-center justify-center">
            <style>{`
              @keyframes text_shimmer {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
              .shimmer-text {
                background: linear-gradient(90deg, ${theme === 'dark' ? '#555 0%, #fff 50%, #555 100%' : '#888 0%, #000 50%, #888 100%'});
                background-size: 200% auto;
                color: transparent;
                -webkit-background-clip: text;
                background-clip: text;
                animation: text_shimmer 3s linear infinite;
              }
            `}</style>
            <span className="text-xl sm:text-2xl font-black tracking-widest shimmer-text select-none uppercase">
              SHIMMER_FX
            </span>
          </div>
        );
      case 'typewriter-cursor':
        return (
          <div className="flex items-center justify-center font-mono font-bold text-sm sm:text-base">
            <style>{`
              @keyframes blink_cursor {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
              }
              .blink-bar { animation: blink_cursor 0.9s infinite; }
            `}</style>
            <span className={theme === 'dark' ? 'text-neutral-200' : 'text-neutral-900'}>
              npm create amicro
            </span>
            <span className={`w-2 h-4 ml-1 blink-bar ${theme === 'dark' ? 'bg-indigo-400' : 'bg-indigo-600'}`} />
          </div>
        );
      case 'perspective-flip':
        return (
          <div className="flex items-center justify-center h-8 overflow-hidden select-none font-bold text-sm sm:text-base">
            <motion.div
              animate={{ y: [0, -32, -64, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, times: [0, 0.33, 0.66, 1], ease: 'easeInOut' }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <span className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}>FAST</span>
              <span className={theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}>FLUID</span>
              <span className={theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}>PREMIUM</span>
            </motion.div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-[1080px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10 font-sans">
      {/* Top Header Back Navigation */}
      <div className="flex items-center justify-between w-full">
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white' 
                : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200 hover:text-black'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        )}

        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white'
              : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200'
          }`}
          title="Replay text animations"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Replay Animations</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
          theme === 'dark' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
        }`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Typography & Text Motion</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
          Text Animations
        </h1>
        
        <p className={`text-sm sm:text-base max-w-xl ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
          A curated collection of {textAnimationsData.length} interactive text decoders, focus blur depth selectors, and pure-CSS kinetic typography effects.
        </p>
      </div>

      {/* Featured Spotlight: Scramble Text Sandbox */}
      <div className={`rounded-[28px] p-6 sm:p-8 border flex flex-col justify-between items-center text-center gap-4 shadow-xl transition-all ${
        theme === 'dark' ? 'bg-[#181818] border-white/10 shadow-black/30' : 'bg-white border-neutral-200 shadow-neutral-200/50'
      }`}>
        <div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-400">
            Interactive Spotlight
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            Scramble Text Decoder
          </h2>
          <p className={`text-xs sm:text-sm mt-1 max-w-md ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Hover over the buttons below or test custom text decode algorithms with live speed and character scrambling.
          </p>
        </div>

        <div className="py-6 w-full flex items-center justify-center">
          <ScrambleHoverDemo theme={theme} />
        </div>

        <button
          onClick={() => handleCopyCli('npx @subhanhq/amicro@latest add scramble-text', 'Scramble Text Decoder')}
          className={`max-w-xs w-full py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            theme === 'dark' ? 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10' : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Copy CLI Command</span>
        </button>
      </div>

      {/* Main Catalog Grid (Strictly 3 in a row) */}
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">
            Text FX Library ({textAnimationsData.length})
          </h2>
          <span className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Hover cards to trigger typography physics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center sm:place-items-stretch">
          {textAnimationsData.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                className={`relative w-full max-w-[340px] sm:max-w-none h-[230px] sm:h-[268px] rounded-[24px] transition-all duration-300 group ${
                  theme === 'dark'
                    ? 'bg-[#181818] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-[#202020]'
                    : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100/85 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] text-black'
                }`}
              >
                {/* Inner Preview Stage Canvas */}
                <div
                  className={`absolute left-[12px] top-[12px] right-[12px] h-[155px] sm:h-[188px] rounded-[14px] flex items-center justify-center overflow-hidden transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
                  }`}
                >
                  <div
                    className={`absolute inset-0 rounded-[14px] pointer-events-none z-10 ${
                      theme === 'dark'
                        ? 'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]'
                        : 'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]'
                    }`}
                  />
                  {/* Live Render */}
                  {renderLiveTextEffect(item.id)}
                </div>

                {/* Card Footer Bar */}
                <div className="absolute left-[16px] bottom-[14px] right-[16px] flex items-center justify-between">
                  <div className="flex flex-col truncate pr-2">
                    <span
                      className={`text-[13px] font-semibold tracking-[-0.01em] truncate transition-colors ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}
                    >
                      {item.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 capitalize truncate">
                      {item.category.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Action Copy Button */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleCopyCode(item)}
                    className={`p-2 rounded-xl transition-all cursor-pointer border flex items-center justify-center shrink-0 ${
                      isCopied
                        ? (theme === 'dark'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-emerald-100 text-emerald-600 border-emerald-300')
                        : (theme === 'dark'
                            ? 'bg-white/[0.08] border-transparent hover:bg-white/[0.14] text-neutral-300 hover:text-white'
                            : 'bg-neutral-100 border-transparent hover:bg-neutral-200 text-neutral-650 hover:text-black')
                    }`}
                    title="Copy component code"
                  >
                    <IconSwap>
                      <IconSwapItem key={isCopied ? 'check' : 'copy'}>
                        {isCopied ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </IconSwapItem>
                    </IconSwap>
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
