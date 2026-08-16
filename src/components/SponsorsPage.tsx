import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ExternalLink, ArrowRight, ShieldCheck, Zap, Award, CheckCircle2, Globe, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { useWebHaptics } from '../hooks/useWebHaptics';
import { MapleLogo } from './MapleLogo';

export interface SponsorSlot {
  id: number;
  companyName: string;
  description: string;
  logoType?: string;
  siteUrl?: string;
  isAvailable: boolean;
}

interface SponsorsPageProps {
  theme: 'dark' | 'light';
  sponsors: SponsorSlot[];
  checkoutUrl: string;
  onNavigateHome: () => void;
  showToast?: (message: string) => void;
}

export const SponsorsPage: React.FC<SponsorsPageProps> = ({
  theme,
  sponsors,
  checkoutUrl,
  onNavigateHome,
}) => {
  const { trigger: triggerHaptic } = useWebHaptics();
  const isDark = theme === 'dark';

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 pt-1 pb-12 flex flex-col items-center font-sans relative">
      
      {/* Top Header Row with Back Button on Left */}
      <div className="w-full relative flex items-center justify-center pt-2 mb-1">
        {onNavigateHome && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <button
              onClick={() => {
                if (triggerHaptic) triggerHaptic('light');
                onNavigateHome();
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                isDark 
                  ? 'bg-[#181818] hover:bg-[#222] border-white/10 text-neutral-300 hover:text-white' 
                  : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200 hover:text-black shadow-xs'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>
        )}
      </div>

      {/* Hero Header */}
      <div className="flex flex-col items-center text-center gap-2.5 max-w-2xl mx-auto mt-0 mb-6">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-sm ${
          isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          <Heart className="w-3.5 h-3.5 fill-emerald-400" />
          <span>Support Open Source</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Sponsor Amicro
        </h1>

        <p className={`text-sm sm:text-base max-w-lg ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Put your brand in front of thousands of developers and designers exploring modern web micro-interactions.
        </p>
      </div>

      {/* Compact Grid of Sponsors */}
      <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {sponsors.map((slot) => {
          if (!slot.isAvailable) {
            const isMaple = slot.logoType === 'maple';
            return (
              <a
                key={slot.id}
                href={slot.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHaptic('light')}
                className={`group relative flex flex-col items-center justify-center text-center p-3.5 min-h-[90px] rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                  isMaple
                    ? (isDark
                        ? 'bg-[#1a1410] border-[#E86F00]/30 hover:border-[#E86F00]/50 hover:bg-[#231a14] text-white shadow-[inset_0_1px_0_rgba(232,111,0,0.15)]'
                        : 'bg-[#FFF7ED] border-[#FDBA74]/80 hover:border-[#FB923C] hover:bg-[#FFEDD5] text-[#7C2D12] shadow-[0_2px_12px_rgba(232,111,0,0.06)]')
                    : (isDark
                        ? 'bg-[#181818] border-neutral-800/80 hover:bg-[#1e1e1e] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                        : 'bg-white border-neutral-200 hover:shadow-xs text-black shadow-2xs')
                }`}
              >
                <div className="flex flex-col items-center justify-center w-full">
                  {isMaple ? (
                    <div className="flex items-center gap-2 font-bold tracking-tight text-[14px] text-neutral-900 dark:text-orange-200">
                      <MapleLogo className="w-5 h-5 shrink-0" />
                      <span>Maple</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 font-bold tracking-tight text-[14px] text-emerald-500 w-full px-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                      <span className="truncate max-w-[120px]">{slot.companyName}</span>
                    </div>
                  )}
                  <p className={`text-[11px] leading-[15px] mt-1.5 font-medium line-clamp-2 w-full px-0.5 transition-colors ${
                    isMaple
                      ? (isDark ? 'text-orange-200/80 group-hover:text-orange-100' : 'text-[#9A3412] group-hover:text-[#7C2D12]')
                      : (isDark ? 'text-neutral-400 group-hover:text-neutral-300' : 'text-neutral-600 group-hover:text-neutral-800')
                  }`} title={slot.description}>
                    {slot.description}
                  </p>
                </div>
              </a>
            );
          } else {
            return (
              <button
                key={slot.id}
                onClick={() => {
                  triggerHaptic('medium');
                  window.open(checkoutUrl, '_blank');
                }}
                className={`group flex flex-col items-center justify-center text-center p-3.5 rounded-2xl border border-dashed transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-transparent min-h-[90px] ${
                  isDark
                    ? 'border-neutral-800 hover:border-emerald-500/50 text-neutral-400 hover:text-emerald-400 hover:bg-neutral-900/10'
                    : 'border-neutral-300 hover:border-emerald-500/50 text-neutral-500 hover:text-emerald-600 hover:bg-neutral-50/30'
                }`}
              >
                <span className="text-[13px] font-bold tracking-tight flex items-center gap-1">
                  <span>+</span> Sponsor
                </span>
                <span className={`text-[10px] mt-1 transition-colors ${isDark ? 'text-neutral-500 group-hover:text-emerald-400/80' : 'text-neutral-500 group-hover:text-emerald-600'}`}>
                  $49/mo
                </span>
              </button>
            );
          }
        })}
      </div>

      {/* Listed & Featured In Section */}
      <div className="w-full max-w-4xl mb-16 flex flex-col items-center">
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Community Registries</span>
          </div>
          <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
            Listed &amp; Featured In
          </h3>
          <p className={`text-xs sm:text-sm mt-1 max-w-md ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Discover Amicro across verified developer component directories and open-source indices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {/* Slot 1: shadcn/ui */}
          <motion.a
            href="http://ui.shadcn.com/docs/directory?q=amicro"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
            onClick={() => triggerHaptic('light')}
            className={`group relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[145px] no-underline ${
              isDark
                ? 'bg-[#181818] border-white/10 hover:border-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                : 'bg-white border-neutral-200 hover:border-neutral-300 text-black shadow-xs hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between w-full">
              <div className="flex items-center gap-3">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKRzd461qDnF3wBH_PtvR6q1Nn6AIoUIpU1c40BL6Rpw&s=10"
                  alt="shadcn/ui logo"
                  className="w-8 h-8 rounded-lg object-contain bg-black p-0.5 border border-white/10 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-sm leading-tight group-hover:text-emerald-400 transition-colors">shadcn/ui</h4>
                  <span className={`text-[10.5px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    Official Directory
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <p className={`text-xs mt-3.5 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Featured in the curated shadcn/ui community registry &amp; directory.
            </p>
          </motion.a>

          {/* Slot 2: Ossium */}
          <motion.a
            href="https://ossium.in/home/repos/Subhan-code/Amicro--Micro-transitions-"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
            onClick={() => triggerHaptic('light')}
            className={`group relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[145px] no-underline ${
              isDark
                ? 'bg-[#181818] border-white/10 hover:border-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                : 'bg-white border-neutral-200 hover:border-neutral-300 text-black shadow-xs hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between w-full">
              <div className="flex items-center gap-3">
                <img
                  src="https://ossium.in/_next/image?url=%2Fossium_logo.webp&w=256&q=75"
                  alt="Ossium logo"
                  className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-black/40 p-0.5 border border-white/10 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-sm leading-tight group-hover:text-indigo-400 transition-colors">Ossium</h4>
                  <span className={`text-[10.5px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    Open Source Index
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <p className={`text-xs mt-3.5 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Indexed &amp; showcased on the Ossium curated open source repository registry.
            </p>
          </motion.a>

          {/* Slot 3: Creative Empty Slot */}
          <div
            className={`relative p-5 rounded-2xl border border-dashed flex flex-col justify-between min-h-[145px] select-none ${
              isDark
                ? 'border-white/15 bg-white/[0.02] text-neutral-400'
                : 'border-neutral-300 bg-neutral-50/50 text-neutral-600'
            }`}
          >
            <div className="flex items-start justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-mono font-bold text-xs text-amber-400 shrink-0">
                  +
                </div>
                <div>
                  <h4 className={`font-bold text-sm leading-tight ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                    More Coming Soon
                  </h4>
                  <span className="text-[10.5px] text-amber-400/90 font-medium">
                    In Progress ✨
                  </span>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            </div>

            <p className={`text-xs mt-3.5 leading-relaxed italic ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
              Submissions in review across more premier UI catalogs &amp; registries.
            </p>
          </div>
        </div>
      </div>

      {/* Sponsorship Perks Section */}
      <div className={`w-full max-w-4xl p-8 sm:p-10 rounded-3xl border ${
        isDark ? 'bg-[#121215] border-white/10' : 'bg-white border-neutral-200 shadow-xl'
      }`}>
        <h3 className={`text-xl font-bold tracking-tight mb-6 text-center ${isDark ? 'text-white' : 'text-black'}`}>
          Why Sponsor Amicro?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-1">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>High Reach</h4>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Over 50,000+ monthly developer impressions from frontend engineers &amp; product teams.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>Open Source Impact</h4>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Directly fund independent open source UI component development and maintenance.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-1">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>Instant Setup</h4>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Automated Polar checkout updates your logo &amp; backlink on the live platform immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
