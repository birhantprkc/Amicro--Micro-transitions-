import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  Sparkles, 
  Bot, 
  Zap, 
  Activity, 
  CheckCircle2, 
  Database, 
  Cpu, 
  Flame, 
  Plus, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import { MapleLogo } from './MapleLogo';
import { useWebHaptics } from '../hooks/useWebHaptics';

export interface SponsorSlot {
  id: number;
  companyName: string;
  description: string;
  logoType?: string;
  siteUrl?: string;
  isAvailable: boolean;
}

interface AppleSponsorShowcaseProps {
  theme: 'dark' | 'light';
  sponsors: SponsorSlot[];
  checkoutUrl: string;
  onNavigateToSponsors?: () => void;
  showToast?: (message: string) => void;
}

export const AppleSponsorShowcase: React.FC<AppleSponsorShowcaseProps> = ({
  theme,
  sponsors,
  checkoutUrl,
  onNavigateToSponsors,
  showToast,
}) => {
  const isDark = theme === 'dark';
  const { trigger: triggerHaptic } = useWebHaptics();
  
  // 3D Card Hover Perspective Physics
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const isHovered = useRef(false);

  const rotateXSpring = useSpring(useTransform(mouseY, [0, 1], [6, -6]), { stiffness: 260, damping: 25 });
  const rotateYSpring = useSpring(useTransform(mouseX, [0, 1], [-6, 6]), { stiffness: 260, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    isHovered.current = true;
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  // Interactive Live Demo Simulator State (Apple Product Experience)
  const [activeTab, setActiveTab] = useState<'agent' | 'traces' | 'clickhouse'>('agent');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryLatency, setQueryLatency] = useState('11.4ms');
  const [rowsScanned, setRowsScanned] = useState('4.82B');
  const [queryCount, setQueryCount] = useState(142);

  const handleRunAiQuery = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    triggerHaptic('medium');
    setIsQuerying(true);

    const latencies = ['4.2ms', '6.8ms', '8.1ms', '5.5ms', '3.9ms'];
    const rows = ['5.14B', '6.20B', '7.45B', '4.91B', '8.02B'];
    
    setTimeout(() => {
      setQueryLatency(latencies[Math.floor(Math.random() * latencies.length)]);
      setRowsScanned(rows[Math.floor(Math.random() * rows.length)]);
      setQueryCount(prev => prev + 1);
      setIsQuerying(false);
      triggerHaptic('success');
      if (showToast) {
        showToast("AI Agent query resolved in sub-second ClickHouse execution!");
      }
    }, 600);
  };

  const mapleSlot = sponsors.find(s => !s.isAvailable && s.logoType === 'maple') || sponsors[0];
  const remainingSlots = sponsors.filter(s => s.id !== mapleSlot?.id);

  return (
    <section className="w-full max-w-[1200px] mx-auto mt-12 mb-16 px-4 sm:px-6 flex flex-col items-center">
      
      {/* Eyebrow / Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E86F00] animate-ping" />
        <span className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${
          isDark ? 'text-neutral-400' : 'text-neutral-600'
        }`}>
          Featured Sponsor Showcase
        </span>
      </div>

      {/* Main Apple-Grade Interactive Ad Banner */}
      <div className="relative w-full perspective-1000">
        
        {/* Ambient Warm Orange / Obsidian Backlight Glow */}
        <div 
          className="absolute -inset-1 rounded-[36px] opacity-75 blur-2xl pointer-events-none transition-all duration-700 -z-10"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(232, 111, 0, 0.22), rgba(0, 0, 0, 0))'
              : 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(232, 111, 0, 0.16), rgba(255, 255, 255, 0))'
          }}
        />

        {/* 3D Motion Card Container */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: rotateXSpring,
            rotateY: rotateYSpring,
            transformStyle: 'preserve-3d',
          }}
          className={`relative w-full rounded-[30px] border p-6 sm:p-9 transition-all duration-300 overflow-hidden ${
            isDark
              ? 'bg-[#141416]/95 border-white/[0.08] text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)]'
              : 'bg-white/95 border-neutral-200/80 text-black shadow-[0_20px_50px_-12px_rgba(232,111,0,0.1),0_1px_3px_rgba(0,0,0,0.04)]'
          }`}
        >
          {/* Dynamic Spotlight that follows mouse */}
          <motion.div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: useTransform(
                [spotX, spotY],
                ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, ${isDark ? 'rgba(232, 111, 0, 0.14)' : 'rgba(232, 111, 0, 0.08)'}, transparent 80%)`
              ),
            }}
          />

          {/* Top Decorative Apple-style Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 pb-5 border-b border-white/[0.06] dark:border-white/[0.06] border-neutral-200/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-[#E86F00]/10 border border-[#E86F00]/25 text-[#E86F00] flex items-center justify-center shadow-inner">
                <MapleLogo className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[18px] tracking-tight font-sans">
                    Maple
                  </span>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#E86F00]/15 text-[#E86F00] border border-[#E86F00]/30">
                    maple.dev
                  </span>
                </div>
                <span className={`text-[11px] font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Official Tier 1 Partner
                </span>
              </div>
            </div>

            {/* Apple-style Pill Badges */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border backdrop-blur-md ${
                isDark 
                  ? 'bg-white/[0.05] border-white/10 text-emerald-400' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Sub-Second Observability</span>
              </span>

              <a
                href="https://maple.dev/"
                target="_blank"
                onClick={() => triggerHaptic('light')}
                className={`hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 group ${
                  isDark
                    ? 'bg-[#E86F00] hover:bg-[#d46500] text-white shadow-md shadow-[#E86F00]/20'
                    : 'bg-[#E86F00] hover:bg-[#d46500] text-white shadow-md shadow-[#E86F00]/25'
                }`}
              >
                <span>Visit Website</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Grid: Left Editorial & Right Interactive Apple Telemetry HUD */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col (6 Cols): Typography, Value Prop, Bento Badges */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase mb-3 bg-[#E86F00]/10 text-[#E86F00] border border-[#E86F00]/20">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Native to AI &middot; Powered by ClickHouse</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-3">
                  Open-source observability. <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-[#E86F00] via-[#ff9029] to-[#ffb870] bg-clip-text text-transparent">
                    Built for you. Native to AI.
                  </span>
                </h2>

                <p className={`text-[13.5px] sm:text-[14.5px] leading-relaxed mb-6 font-normal ${
                  isDark ? 'text-neutral-300' : 'text-neutral-700'
                }`}>
                  Open-source observability built for AI, with fast traces, logs, and metrics powered by OpenTelemetry and ClickHouse.
                </p>

                {/* Bento Specs / Highlight Badges */}
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  <div className={`p-3 rounded-2xl border transition-all ${
                    isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]' : 'bg-neutral-50 border-neutral-200/80 hover:bg-neutral-100/70'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-xs mb-1">
                      <Zap className="w-3.5 h-3.5 text-[#E86F00]" />
                      <span>Sub-Second Queries</span>
                    </div>
                    <span className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      Blazing ClickHouse column-store engine
                    </span>
                  </div>

                  <div className={`p-3 rounded-2xl border transition-all ${
                    isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]' : 'bg-neutral-50 border-neutral-200/80 hover:bg-neutral-100/70'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-xs mb-1">
                      <Bot className="w-3.5 h-3.5 text-[#E86F00]" />
                      <span>AI Agent Native</span>
                    </div>
                    <span className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      Autonomous trace analysis & debug
                    </span>
                  </div>

                  <div className={`p-3 rounded-2xl border transition-all ${
                    isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]' : 'bg-neutral-50 border-neutral-200/80 hover:bg-neutral-100/70'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-xs mb-1">
                      <Activity className="w-3.5 h-3.5 text-[#E86F00]" />
                      <span>OpenTelemetry</span>
                    </div>
                    <span className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      Traces, logs, metrics standardization
                    </span>
                  </div>

                  <div className={`p-3 rounded-2xl border transition-all ${
                    isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]' : 'bg-neutral-50 border-neutral-200/80 hover:bg-neutral-100/70'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-xs mb-1">
                      <Database className="w-3.5 h-3.5 text-[#E86F00]" />
                      <span>Scale to Billions</span>
                    </div>
                    <span className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      Effortless petabyte scale ingestion
                    </span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <motion.a
                  href="https://maple.dev/"
                  target="_blank"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => triggerHaptic('medium')}
                  className="inline-flex items-center justify-center gap-2 h-[44px] px-6 rounded-full font-semibold text-sm bg-[#E86F00] text-white shadow-lg shadow-[#E86F00]/25 hover:bg-[#d46500] transition-colors cursor-pointer"
                >
                  <MapleLogo className="w-4 h-4 text-white" />
                  <span>Get Started with Maple</span>
                  <ArrowUpRight className="w-4 h-4" />
                </motion.a>

                {onNavigateToSponsors && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      triggerHaptic('light');
                      onNavigateToSponsors();
                    }}
                    className={`inline-flex items-center justify-center gap-1.5 h-[44px] px-5 rounded-full font-semibold text-sm border cursor-pointer transition-colors ${
                      isDark
                        ? 'bg-white/[0.06] hover:bg-white/[0.1] border-white/10 text-white'
                        : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-black'
                    }`}
                  >
                    <span>Sponsor Amicro</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Right Col (6 Cols): Apple-Grade Interactive Observability & AI Telemetry Glass Canvas */}
            <div className="lg:col-span-6">
              <div className={`relative rounded-2xl border p-4 sm:p-5 overflow-hidden transition-all duration-300 ${
                isDark
                  ? 'bg-[#0f0f11] border-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_30px_rgba(0,0,0,0.5)]'
                  : 'bg-neutral-50/90 border-neutral-200/90 shadow-[0_10px_25px_rgba(0,0,0,0.03)]'
              }`}>
                
                {/* Visualizer Top Bar with Tab Switchers */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06] dark:border-white/[0.06] border-neutral-200">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-[10.5px] font-mono font-semibold ml-2 opacity-60">
                      maple-engine.clickhouse
                    </span>
                  </div>

                  {/* Interactive Switchers */}
                  <div className={`flex items-center p-0.5 rounded-full text-[11px] font-medium border ${
                    isDark ? 'bg-[#181818] border-white/10' : 'bg-neutral-200/70 border-neutral-300'
                  }`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('agent');
                        triggerHaptic('light');
                      }}
                      className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                        activeTab === 'agent'
                          ? (isDark ? 'bg-[#2a2a2a] text-white font-semibold shadow-xs' : 'bg-white text-black font-semibold shadow-xs')
                          : (isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                      }`}
                    >
                      AI Agent
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('traces');
                        triggerHaptic('light');
                      }}
                      className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                        activeTab === 'traces'
                          ? (isDark ? 'bg-[#2a2a2a] text-white font-semibold shadow-xs' : 'bg-white text-black font-semibold shadow-xs')
                          : (isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                      }`}
                    >
                      OTel Traces
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('clickhouse');
                        triggerHaptic('light');
                      }}
                      className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                        activeTab === 'clickhouse'
                          ? (isDark ? 'bg-[#2a2a2a] text-white font-semibold shadow-xs' : 'bg-white text-black font-semibold shadow-xs')
                          : (isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                      }`}
                    >
                      Metrics
                    </button>
                  </div>
                </div>

                {/* Real-time Telemetry Metrics Bar */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className={`p-2.5 rounded-xl border flex flex-col ${
                    isDark ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-white border-neutral-200/70'
                  }`}>
                    <span className="text-[10px] font-mono uppercase opacity-60">Query Latency</span>
                    <span className="text-sm font-bold font-mono text-emerald-400 mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {queryLatency}
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex flex-col ${
                    isDark ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-white border-neutral-200/70'
                  }`}>
                    <span className="text-[10px] font-mono uppercase opacity-60">Scanned Rows</span>
                    <span className="text-sm font-bold font-mono text-[#E86F00] mt-0.5">
                      {rowsScanned}
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex flex-col ${
                    isDark ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-white border-neutral-200/70'
                  }`}>
                    <span className="text-[10px] font-mono uppercase opacity-60">AI Queries</span>
                    <span className="text-sm font-bold font-mono text-indigo-400 mt-0.5">
                      {queryCount} done
                    </span>
                  </div>
                </div>

                {/* Tab Dynamic Content */}
                <div className={`p-3.5 rounded-xl border font-mono text-xs mb-4 min-h-[140px] flex flex-col justify-between ${
                  isDark ? 'bg-[#08080a] border-white/[0.05] text-neutral-300' : 'bg-white border-neutral-200/70 text-neutral-800'
                }`}>
                  <AnimatePresence mode="wait">
                    {activeTab === 'agent' ? (
                      <motion.div
                        key="agent"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-[11.5px]">
                          <Bot className="w-3.5 h-3.5" />
                          <span>AI Observability Agent &middot; Maple Core</span>
                        </div>
                        <p className="text-[11px] leading-relaxed opacity-85">
                          &gt; Prompt: <span className="text-[#E86F00]">&quot;Scan auth spike anomalies in last 15 min across cluster.&quot;</span>
                        </p>
                        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10.5px]">
                          &#10003; <strong>Instant Analysis</strong>: 4.8B logs indexed. Isolated 2 corrupted token refresh loops on pod <code className="text-indigo-200">auth-srv-9f2</code>. Root cause traced to upstream expired cert.
                        </div>
                      </motion.div>
                    ) : activeTab === 'traces' ? (
                      <motion.div
                        key="traces"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-1.5 text-[11px]"
                      >
                        <div className="flex items-center justify-between text-[#E86F00] font-semibold">
                          <span>GET /api/v2/checkout/process</span>
                          <span className="text-emerald-400 font-bold">14.2ms (OK 200)</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden flex">
                          <div className="bg-emerald-500 w-[40%]" />
                          <div className="bg-[#E86F00] w-[35%]" />
                          <div className="bg-indigo-500 w-[25%]" />
                        </div>
                        <div className="text-[10px] opacity-70 flex justify-between">
                          <span>postgres-pool (5.6ms)</span>
                          <span>redis-cache (4.9ms)</span>
                          <span>stripe-webhook (3.7ms)</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="clickhouse"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-1.5 text-[11px]"
                      >
                        <div className="text-emerald-400 font-semibold flex items-center justify-between">
                          <span>SELECT count(*), avg(duration_ms)</span>
                          <span className="text-xs">ClickHouse FastEngine</span>
                        </div>
                        <code className="text-[10px] block opacity-80">
                          FROM otel_traces PREWHERE timestamp &gt; now() - INTERVAL 1 HOUR GROUP BY service_name FORMAT JSON;
                        </code>
                        <div className="text-[10.5px] text-[#E86F00]">
                          Processed 4,821,900,000 rows in 0.0084 sec (574.03 GB/s)
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Interactive Button inside HUD */}
                  <div className="pt-2 mt-2 border-t border-white/[0.05] flex items-center justify-between">
                    <span className="text-[10px] opacity-60">Click below to test latency</span>
                    <button
                      onClick={handleRunAiQuery}
                      disabled={isQuerying}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer ${
                        isQuerying
                          ? 'bg-[#E86F00]/50 text-white cursor-wait'
                          : 'bg-[#E86F00] hover:bg-[#d46500] text-white shadow-sm'
                      }`}
                    >
                      <Sparkles className={`w-3 h-3 ${isQuerying ? 'animate-spin' : ''}`} />
                      <span>{isQuerying ? 'Executing...' : 'Run Sub-Second AI Query'}</span>
                    </button>
                  </div>
                </div>

                {/* Footer specs */}
                <div className="flex items-center justify-between text-[11px] font-medium opacity-70 px-1">
                  <span>Open-source repo: github.com/maple-dev/maple</span>
                  <a 
                    href="https://maple.dev/" 
                    target="_blank" 
                    className="text-[#E86F00] hover:underline font-semibold flex items-center gap-0.5"
                  >
                    <span>Read Docs</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>

              </div>
            </div>

          </div>

        </motion.div>
      </div>

      {/* Remaining Sponsorship Slots Strip (Apple-Grade Minimalist Grid) */}
      <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {remainingSlots.map((slot) => (
          <motion.button
            key={slot.id}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              triggerHaptic('medium');
              window.open(checkoutUrl, '_blank');
            }}
            className={`group relative p-4 rounded-2xl border border-dashed text-left flex items-center justify-between cursor-pointer transition-all duration-300 ${
              isDark
                ? 'bg-[#141416]/60 hover:bg-[#1a1a1e] border-white/10 hover:border-[#E86F00]/50 text-white'
                : 'bg-white/80 hover:bg-neutral-50 border-neutral-300 hover:border-[#E86F00]/50 text-black shadow-xs'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-xs font-bold text-[#E86F00] group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-tight">
                  Available Sponsor Slot #{slot.id}
                </span>
                <span className={`text-[10.5px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Instant logo + backlink placement
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xs font-mono font-bold text-emerald-400">
                $49/mo
              </span>
              <span className="text-[10px] font-semibold text-[#E86F00] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                <span>Reserve</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </motion.button>
        ))}
      </div>

    </section>
  );
};
