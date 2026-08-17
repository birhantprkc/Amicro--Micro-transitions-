import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Copy, Check, Terminal, Code, Layers, Info, RotateCcw, Sparkles } from 'lucide-react';
import { getComponentEntry, ComponentItem } from '../data/componentEntries';
import { IconSwap, IconSwapItem } from './IconSwap';

// Mono Charts imports
import { MonoActivityHeatmap } from './mono-charts/MonoActivityHeatmap';
import { MonoRoundedLineChart } from './mono-charts/MonoRoundedLineChart';
import { MonoRoundedBarChart } from './mono-charts/MonoRoundedBarChart';
import { MonoRoundedAreaChart } from './mono-charts/MonoRoundedAreaChart';
import { MonoRoundedDonutChart } from './mono-charts/MonoRoundedDonutChart';
import { MonoRoundedComposedChart } from './mono-charts/MonoRoundedComposedChart';
import { MonoRoundedScatterChart } from './mono-charts/MonoRoundedScatterChart';
import { MonoRoundedCandlestickChart } from './mono-charts/MonoRoundedCandlestickChart';
import { MonoRoundedKpiCardChart } from './mono-charts/MonoRoundedKpiCardChart';
import { MonoRoundedPyramidChart } from './mono-charts/MonoRoundedPyramidChart';
import { MonoRoundedRadialBarGroup } from './mono-charts/MonoRoundedRadialBarGroup';
import { MonoRoundedGaugeArc } from './mono-charts/MonoRoundedGaugeArc';
import { MonoRoundedBulletChart } from './mono-charts/MonoRoundedBulletChart';
import { MonoRoundedSankeyChart } from './mono-charts/MonoRoundedSankeyChart';
import { MonoRoundedStepChart } from './mono-charts/MonoRoundedStepChart';
import { MonoRoundedStackedBarChart } from './mono-charts/MonoRoundedStackedBarChart';
import { MonoRoundedRadarChart } from './mono-charts/MonoRoundedRadarChart';
import { MonoRoundedRadialGaugeChart } from './mono-charts/MonoRoundedRadialGaugeChart';
import { MonoRoundedFunnelChart } from './mono-charts/MonoRoundedFunnelChart';
import { MonoRoundedHeatmapChart } from './mono-charts/MonoRoundedHeatmapChart';
import { MonoRoundedSparklineChart } from './mono-charts/MonoRoundedSparklineChart';
import { MonoRoundedBubbleChart } from './mono-charts/MonoRoundedBubbleChart';
import { MonoRoundedTreemapChart } from './mono-charts/MonoRoundedTreemapChart';
import { MonoRoundedStreamChart } from './mono-charts/MonoRoundedStreamChart';
import { MonoRoundedMeterChart } from './mono-charts/MonoRoundedMeterChart';
import { MonoRoundedWaterfallChart } from './mono-charts/MonoRoundedWaterfallChart';
import { MonoRoundedPolarChart } from './mono-charts/MonoRoundedPolarChart';
import { MonoRoundedRangeChart } from './mono-charts/MonoRoundedRangeChart';

// Dither Charts imports
import { DitherDonutChart } from './dither-charts/DitherDonutChart';
import { DitherGrowthChart } from './dither-charts/DitherGrowthChart';
import { DitherStackedChart } from './dither-charts/DitherStackedChart';
import { DitherFunnelChart } from './dither-charts/DitherFunnelChart';
import { ActivityHeatmap } from './dither-charts/ActivityHeatmap';
import { ServerGauge } from './dither-charts/ServerGauge';
import { TrafficBubble } from './dither-charts/TrafficBubble';
import { DeviceUsageChart } from './dither-charts/DeviceUsageChart';
import { StorageUsageChart } from './dither-charts/StorageUsageChart';
import { RevenueLineChart } from './dither-charts/RevenueLineChart';
import { UptimeChart } from './dither-charts/UptimeChart';

// Cards & Carousels imports
import { CardArc5 } from './cards/CardArc5';
import { CardArc7 } from './cards/CardArc7';
import { CardLongArc5 } from './cards/CardLongArc5';
import { CardLinearSpread } from './cards/CardLinearSpread';
import { CardCornerFan } from './cards/CardCornerFan';
import { CardStampArc } from './cards/CardStampArc';
import { CardCascadeStagger } from './cards/CardCascadeStagger';
import { CardScatterSpread } from './cards/CardScatterSpread';
import { CardWheelFan } from './cards/CardWheelFan';
import { CardCarousel } from './cards/CardCarousel';
import { CardCoverFlow } from './cards/CardCoverFlow';
import { CardTimeMachine } from './cards/CardTimeMachine';

// Buttons import
import { AnimatedButton } from './AnimatedButton';
import { buttonsData } from '../data/buttons';

// Loaders import
import { loaderGroups } from '../data/loaders';

interface ChartDetailPageProps {
  chartId: string;
  theme: 'dark' | 'light';
  onBack: () => void;
  showToast?: (message: string) => void;
  triggerHaptic?: (type: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy') => void;
}

type TabType = 'preview' | 'code' | 'install' | 'props';

export function ChartDetailPage({
  chartId,
  theme: appTheme,
  onBack,
  showToast,
  triggerHaptic,
}: ChartDetailPageProps) {
  const isAppDark = appTheme === 'dark';
  const entry: ComponentItem = getComponentEntry(chartId);

  const [activeTab, setActiveTab] = useState<TabType>('preview');
  const [stageTheme, setStageTheme] = useState<'dark' | 'light'>(appTheme);
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedUsage, setCopiedUsage] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const isStageDark = stageTheme === 'dark';
  const cliCommand = `npx @subhanhq/amicro@latest add ${entry.registry}`;

  const handleCopyCli = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopiedCli(true);
    if (triggerHaptic) triggerHaptic('success');
    if (showToast) showToast('Copied CLI command to clipboard!');
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleCopyUsage = () => {
    navigator.clipboard.writeText(entry.usage);
    setCopiedUsage(true);
    if (triggerHaptic) triggerHaptic('success');
    if (showToast) showToast('Copied code snippet!');
    setTimeout(() => setCopiedUsage(false), 2000);
  };

  const handleResetStage = () => {
    if (triggerHaptic) triggerHaptic('light');
    setResetKey((prev) => prev + 1);
  };

  // Live Component Renderer matching app design system
  const renderLiveComponent = () => {
    // 1. Mono Charts
    switch (chartId) {
      case 'mono-rounded-line':
        return <MonoRoundedLineChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-bar':
        return <MonoRoundedBarChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-area':
        return <MonoRoundedAreaChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-donut':
        return <MonoRoundedDonutChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-composed':
        return <MonoRoundedComposedChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-scatter':
        return <MonoRoundedScatterChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-candlestick':
        return <MonoRoundedCandlestickChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-kpi':
        return <MonoRoundedKpiCardChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-pyramid':
        return <MonoRoundedPyramidChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-radial-group':
        return <MonoRoundedRadialBarGroup theme={stageTheme} compact={false} />;
      case 'mono-rounded-gauge-arc':
        return <MonoRoundedGaugeArc theme={stageTheme} compact={false} />;
      case 'mono-rounded-bullet':
        return <MonoRoundedBulletChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-sankey':
        return <MonoRoundedSankeyChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-step':
        return <MonoRoundedStepChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-stacked-bar':
        return <MonoRoundedStackedBarChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-radar':
        return <MonoRoundedRadarChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-radial-gauge':
        return <MonoRoundedRadialGaugeChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-funnel':
        return <MonoRoundedFunnelChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-heatmap':
        return <MonoRoundedHeatmapChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-sparkline':
        return <MonoRoundedSparklineChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-bubble':
        return <MonoRoundedBubbleChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-treemap':
        return <MonoRoundedTreemapChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-stream':
        return <MonoRoundedStreamChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-meter':
        return <MonoRoundedMeterChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-waterfall':
        return <MonoRoundedWaterfallChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-polar':
        return <MonoRoundedPolarChart theme={stageTheme} compact={false} />;
      case 'mono-rounded-range':
        return <MonoRoundedRangeChart theme={stageTheme} compact={false} />;
      case 'mono-activity-green':
        return <MonoActivityHeatmap theme={stageTheme} accentColor="green" />;
      case 'mono-activity-blue':
        return <MonoActivityHeatmap theme={stageTheme} accentColor="blue" />;
      case 'mono-activity-purple':
        return <MonoActivityHeatmap theme={stageTheme} accentColor="purple" />;

      // 2. Dither Visualizers
      case 'dither-donut':
        return <DitherDonutChart theme={stageTheme} compact={false} />;
      case 'dither-growth':
        return <DitherGrowthChart theme={stageTheme} compact={false} />;
      case 'dither-stacked':
        return <DitherStackedChart theme={stageTheme} compact={false} />;
      case 'dither-funnel':
        return <DitherFunnelChart theme={stageTheme} compact={false} />;
      case 'activity-heatmap':
        return <ActivityHeatmap theme={stageTheme} />;
      case 'server-gauge':
        return <ServerGauge theme={stageTheme} />;
      case 'traffic-bubble':
        return <TrafficBubble theme={stageTheme} />;
      case 'device-usage':
        return <DeviceUsageChart theme={stageTheme} />;
      case 'storage-usage':
        return <StorageUsageChart theme={stageTheme} />;
      case 'revenue-line':
        return <RevenueLineChart theme={stageTheme} />;
      case 'uptime-chart':
        return <UptimeChart theme={stageTheme} />;

      // 3. Cards & Carousels
      case 'card-arc-5':
      case 'c1':
        return <CardArc5 hovered={true} />;
      case 'card-arc-7':
      case 'c2':
        return <CardArc7 hovered={true} />;
      case 'card-long-arc-5':
      case 'c3':
        return <CardLongArc5 hovered={true} />;
      case 'card-linear-spread':
      case 'c4':
        return <CardLinearSpread hovered={true} />;
      case 'card-corner-fan':
      case 'c5':
        return <CardCornerFan hovered={true} />;
      case 'card-stamp-arc':
      case 'c6':
        return <CardStampArc hovered={true} />;
      case 'card-cascade-stagger':
      case 'c8':
        return <CardCascadeStagger hovered={true} />;
      case 'card-scatter-spread':
      case 'c9':
        return <CardScatterSpread hovered={true} />;
      case 'card-wheel-fan':
      case 'c10':
        return <CardWheelFan hovered={true} />;
      case 'card-carousel':
      case 'c11':
        return <CardCarousel hovered={true} />;
      case 'card-cover-flow':
      case 'c12':
        return <CardCoverFlow hovered={true} />;
      case 'card-time-machine':
      case 'c13':
        return <CardTimeMachine hovered={true} />;
      case 'card-carousel-mono':
        return <CardCarousel hovered={true} isMonochrome={true} />;
      case 'card-cover-flow-mono':
        return <CardCoverFlow hovered={true} isMonochrome={true} />;
      case 'card-time-machine-mono':
        return <CardTimeMachine hovered={true} isMonochrome={true} />;
    }

    // 4. Buttons
    const foundBtn = buttonsData.find((b) => b.id === chartId || `btn-${b.id}` === chartId);
    if (foundBtn) {
      return <AnimatedButton config={foundBtn} layoutMode="grid" theme={stageTheme} />;
    }

    // 5. Loaders
    for (const group of loaderGroups) {
      const foundLoader = group.loaders.find((l) => l.kebabName === chartId || l.name.toLowerCase().replace(/\s+/g, '-') === chartId);
      if (foundLoader) {
        const LoaderComponent = foundLoader.component;
        return <LoaderComponent theme={stageTheme} />;
      }
    }

    // Fallback default
    return <MonoRoundedLineChart theme={stageTheme} compact={false} />;
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-8 font-sans">
      
      {/* Top Header Navigation & Breadcrumb */}
      <div className="flex items-center justify-between w-full flex-wrap gap-4">
        <button
          onClick={() => {
            if (triggerHaptic) triggerHaptic('light');
            onBack();
          }}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
            isAppDark
              ? 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white'
              : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200 hover:text-black'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </button>

        {/* Breadcrumbs */}
        <div className={`text-xs font-normal tracking-tight ${isAppDark ? 'text-[#767676]' : 'text-neutral-500'}`}>
          <span>Catalog</span> <span className="opacity-40">/</span> <span>{entry.categoryLabel}</span>{' '}
          <span className="opacity-40">/</span>{' '}
          <span className={isAppDark ? 'text-[#ededed] font-medium' : 'text-black font-medium'}>{entry.name}</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase transition-all ${
              isAppDark
                ? 'bg-white/10 text-neutral-200 border border-white/20'
                : 'bg-neutral-900 text-white border border-neutral-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>{entry.categoryLabel}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h1 className={`text-3xl sm:text-[44px] font-medium leading-[1.1] tracking-[-0.01em] transition-colors ${
              isAppDark ? 'text-[#ededed]' : 'text-black'
            }`}>
              {entry.name}
            </h1>
            <p className={`text-sm sm:text-[15px] leading-relaxed ${
              isAppDark ? 'text-[#767676]' : 'text-neutral-600'
            }`}>
              {entry.description}
            </p>
          </div>

          {/* CLI Installation Bar */}
          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <div
              className={`flex-1 md:flex-initial flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-mono overflow-x-auto ${
                isAppDark
                  ? 'bg-white/[0.04] border-white/10 text-neutral-300'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="truncate max-w-[240px]">{cliCommand}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyCli}
              className={`p-2.5 rounded-full border transition-all cursor-pointer shrink-0 ${
                copiedCli
                  ? isAppDark
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-emerald-100 text-emerald-600 border-emerald-300'
                  : isAppDark
                  ? 'bg-white/10 border-white/10 text-neutral-300 hover:text-white hover:bg-white/15'
                  : 'bg-neutral-200 border-neutral-300 text-neutral-700 hover:text-black hover:bg-neutral-300'
              }`}
              title="Copy CLI command"
            >
              <IconSwap>
                <IconSwapItem key={copiedCli ? 'check' : 'copy'}>
                  {copiedCli ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </IconSwapItem>
              </IconSwap>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Pill Tab Switcher */}
      <div className={`p-1 rounded-full border inline-flex items-center gap-1 self-start ${
        isAppDark ? 'bg-[#181818] border-white/5' : 'bg-neutral-200/50 border-neutral-300/30'
      }`}>
        {[
          { id: 'preview', label: 'Preview Stage', icon: Code },
          { id: 'code', label: 'Code Snippet', icon: Code },
          { id: 'install', label: 'CLI Install', icon: Terminal },
          { id: 'props', label: 'Props API', icon: Layers },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (triggerHaptic) triggerHaptic('light');
                setActiveTab(tab.id as TabType);
              }}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer border-0 ${
                isActive
                  ? isAppDark
                    ? 'bg-[#2a2a2a] text-white shadow-sm font-semibold'
                    : 'bg-white text-black shadow-sm font-semibold'
                  : isAppDark
                  ? 'text-[#767676] hover:text-white'
                  : 'text-black opacity-70 hover:opacity-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 w-full"
            >
              {/* Stage Outer Card Architecture */}
              <div
                className={`relative w-full rounded-[24px] transition-all duration-300 flex flex-col justify-between p-4 sm:p-6 ${
                  isAppDark
                    ? 'bg-[#181818] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] border border-white/5'
                    : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-neutral-100 text-black'
                }`}
              >
                {/* Stage Header Action Bar */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[13px] font-semibold ${isAppDark ? 'text-white' : 'text-black'}`}>
                      Interactive Stage Preview
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Reset Button */}
                    <button
                      onClick={handleResetStage}
                      title="Reset Stage"
                      className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                        isAppDark
                          ? 'bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'
                          : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:text-black hover:bg-neutral-200'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    {/* Stage Theme Toggle Pills */}
                    <div
                      className={`p-0.5 rounded-full border flex items-center gap-0.5 ${
                        isAppDark ? 'bg-white/5 border-white/10' : 'bg-neutral-200/60 border-neutral-300/40'
                      }`}
                    >
                      {(['dark', 'light'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            if (triggerHaptic) triggerHaptic('light');
                            setStageTheme(t);
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all cursor-pointer ${
                            stageTheme === t
                              ? isAppDark
                                ? 'bg-white text-black font-semibold shadow-sm'
                                : 'bg-black text-white font-semibold shadow-sm'
                              : isAppDark
                              ? 'text-neutral-400 hover:text-white'
                              : 'text-neutral-600 hover:text-black'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Inner Stage Canvas */}
                <div
                  key={resetKey}
                  className={`w-full min-h-[380px] sm:min-h-[460px] rounded-[14px] flex items-center justify-center relative overflow-hidden transition-colors duration-300 ${
                    isStageDark
                      ? 'bg-[#131313] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]'
                      : 'bg-[#f4f4f6] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]'
                  }`}
                >
                  <div className="w-full max-w-[640px] flex items-center justify-center p-6">
                    {renderLiveComponent()}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 w-full"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[13px] font-semibold ${isAppDark ? 'text-white' : 'text-black'}`}>
                  React Usage Snippet
                </span>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyUsage}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    copiedUsage
                      ? isAppDark
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-emerald-100 text-emerald-600 border-emerald-300'
                      : isAppDark
                      ? 'bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'
                      : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:text-black hover:bg-neutral-200'
                  }`}
                >
                  {copiedUsage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUsage ? 'Copied' : 'Copy Code'}</span>
                </motion.button>
              </div>

              <div
                className={`w-full rounded-[14px] p-5 border font-mono text-xs overflow-x-auto leading-relaxed ${
                  isAppDark
                    ? 'bg-[#131313] border-white/10 text-neutral-200'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-100 shadow-md'
                }`}
              >
                <pre>{entry.usage}</pre>
              </div>
            </motion.div>
          )}

          {activeTab === 'install' && (
            <motion.div
              key="install"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6 w-full max-w-3xl"
            >
              <div className="flex flex-col gap-3">
                <span className={`text-[13px] font-semibold ${isAppDark ? 'text-white' : 'text-black'}`}>
                  1. Amicro CLI Installation
                </span>

                <div
                  className={`flex items-center gap-2 p-4 rounded-[14px] border font-mono text-xs ${
                    isAppDark
                      ? 'bg-[#131313] border-white/10 text-neutral-300'
                      : 'bg-neutral-100 border-neutral-200 text-neutral-800'
                  }`}
                >
                  <Terminal className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span className="flex-1">{cliCommand}</span>
                  <button
                    onClick={handleCopyCli}
                    className={`p-2 rounded-full border transition-all cursor-pointer ${
                      isAppDark ? 'bg-white/10 border-white/10 hover:bg-white/15' : 'bg-neutral-200 border-neutral-300'
                    }`}
                  >
                    {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className={`text-[13px] font-semibold ${isAppDark ? 'text-white' : 'text-black'}`}>
                  2. Peer Dependencies
                </span>

                <div className="flex items-center gap-2 flex-wrap">
                  {entry.dependencies.map((dep) => (
                    <span
                      key={dep}
                      className={`px-3 py-1 rounded-full text-xs font-mono border ${
                        isAppDark
                          ? 'bg-white/5 border-white/10 text-neutral-300'
                          : 'bg-neutral-100 border-neutral-200 text-neutral-700'
                      }`}
                    >
                      npm install {dep}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'props' && (
            <motion.div
              key="props"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 w-full"
            >
              <span className={`text-[13px] font-semibold ${isAppDark ? 'text-white' : 'text-black'}`}>
                Component API Specification
              </span>

              <div
                className={`w-full rounded-[14px] overflow-hidden border transition-colors ${
                  isAppDark
                    ? 'bg-[#181818] border-white/10 text-neutral-200'
                    : 'bg-white border-neutral-200 text-neutral-900 shadow-sm'
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead
                      className={`border-b text-[11px] font-semibold tracking-wider uppercase ${
                        isAppDark
                          ? 'bg-white/5 border-white/10 text-neutral-400'
                          : 'bg-neutral-100 border-neutral-200 text-neutral-500'
                      }`}
                    >
                      <tr>
                        <th className="py-3 px-4">Prop</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Default</th>
                        <th className="py-3 px-4">Description</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isAppDark ? 'divide-white/5' : 'divide-neutral-100'}`}>
                      {entry.props.map((prop, idx) => (
                        <tr key={idx} className={isAppDark ? 'hover:bg-white/[0.02]' : 'hover:bg-neutral-50'}>
                          <td className="py-3 px-4 font-mono font-semibold text-emerald-400">{prop.name}</td>
                          <td className="py-3 px-4 font-mono text-purple-400">{prop.type}</td>
                          <td className="py-3 px-4 font-mono opacity-80">{prop.default}</td>
                          <td
                            className={`py-3 px-4 leading-relaxed ${
                              isAppDark ? 'text-neutral-400' : 'text-neutral-600'
                            }`}
                          >
                            {prop.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Details Note */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs">
        <div className={`flex items-center gap-1.5 ${isAppDark ? 'text-[#767676]' : 'text-neutral-500'}`}>
          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{entry.interaction}</span>
        </div>
      </div>
    </div>
  );
}
