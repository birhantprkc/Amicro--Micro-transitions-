import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

// Legacy Dither Visualizers
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

import { InViewRender } from './InViewRender';

interface DitherChartsPageProps {
  theme: 'dark' | 'light';
  showToast?: (message: string) => void;
  triggerHaptic?: (type: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy') => void;
  onNavigateHome?: () => void;
  onNavigate3D?: () => void;
  onSelectChart?: (id: string) => void;
}

export function DitherChartsPage({ theme, triggerHaptic, onNavigateHome, onSelectChart }: DitherChartsPageProps) {
  const isDark = theme === 'dark';

  const DITHER_ITEMS = [
    { id: 'dither-donut', comp: <DitherDonutChart theme={theme} /> },
    { id: 'dither-stacked', comp: <DitherStackedChart theme={theme} /> },
    { id: 'dither-growth', comp: <DitherGrowthChart theme={theme} /> },
    { id: 'activity-heatmap', comp: <ActivityHeatmap theme={theme} /> },
    { id: 'server-gauge', comp: <ServerGauge theme={theme} /> },
    { id: 'traffic-bubble', comp: <TrafficBubble theme={theme} /> },
    { id: 'dither-funnel', comp: <DitherFunnelChart theme={theme} /> },
    { id: 'device-usage', comp: <DeviceUsageChart theme={theme} /> },
    { id: 'storage-usage', comp: <StorageUsageChart theme={theme} /> },
    { id: 'revenue-line', comp: <RevenueLineChart theme={theme} /> },
    { id: 'uptime-chart', comp: <UptimeChart theme={theme} /> },
  ];

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 font-sans">
      
      {/* Top Header Navigation */}
      {onNavigateHome && (
        <div className="flex items-center justify-start w-full">
          <button
            onClick={() => {
              if (triggerHaptic) triggerHaptic('light');
              onNavigateHome();
            }}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              isDark 
                ? 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white' 
                : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200 hover:text-black'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase transition-all shadow-sm ${
          isDark ? 'bg-white/10 text-neutral-200 border border-white/20' : 'bg-neutral-900 text-white border border-neutral-700'
        }`}>
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>11 Dither Visualizers</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Dither Charts
        </h1>

        <p className={`text-sm sm:text-base max-w-lg ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          A collection of 11 retro 1-bit ordered Bayer matrix and dithered charts with canvas shaders.
        </p>
      </div>

      {/* Charts Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {DITHER_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (onSelectChart) {
                triggerHaptic?.('light');
                onSelectChart(item.id);
              }
            }}
            className="cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
          >
            <InViewRender>{item.comp}</InViewRender>
          </div>
        ))}
      </div>
    </div>
  );
}

export const SimpleCompPage = DitherChartsPage;
