import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  Copy, Check, ArrowLeft, RefreshCw, Terminal 
} from 'lucide-react';
import { IconSwap, IconSwapItem } from './IconSwap';
import { cssAnimationsData, CSS_ANIMATION_CATEGORIES, CssAnimationItem } from '../data/cssAnimationsData';

// Import Motion kit components
import { Dock } from './css-animations/Dock';

// Import Whimsical animations
import { KineticTensionCapsule } from './css-animations/whimsical/KineticTensionCapsule';
import { MatrixGridLoader } from './css-animations/whimsical/MatrixGridLoader';
import { AppleRadialSpinner, PulseOrbitDots } from './css-animations/whimsical/AppleLoaders';

// Import Concept Trios 1
import { 
  BookmarkCornerPeel, ShutterSlide, StickyNotePeel, ReceiptTapePrint 
} from './css-animations/whimsical/ConceptTrios1';

// Import Concept Trios 2
import { 
  StrokeWaveform, PyramidBlockBuild, ScrollCanvasUnroll 
} from './css-animations/whimsical/ConceptTrios2';

// Import Concept Trios 3
import { 
  DropletSquish, SegmentedLinkStretch, RotatingLouvers, 
  SlinkyCoil, SquashStretchSphere, CardDeckCascade, GearToothStep 
} from './css-animations/whimsical/ConceptTrios3';

// Import Yui Pure CSS Physics Experiments
import { 
  NeonSignDraw, SuddenBrake, RollingTumble, PageTurnCurl, 
  ShutterStepBlocks, InertiaSkidStop 
} from './css-animations/whimsical/YuiPhysicsExperiments';

// Import Redesigned Physics Trios (Replacements)
import { 
  CardStackPeel, ElasticTagSnap, SplitGateReveal, OrigamiEnvelopeUnfold, 
  SmartCardDispenser, CircuitTraceDraw, HexagonLatticeDraw, PrismBlockStack, 
  ModularTileSnap, RollerBlindDrop, RibbonBannerSlide, GeometricIrisShutter, 
  PendulumBubbleLevel, KineticTickingMetronome, NestedOrbitalGimbal, 
  DualMagnetDipole, CompassNeedleDeflect 
} from './css-animations/whimsical/RedesignedPhysicsTrios';

// Import Redesigned UI Trios (Replacements)
import { 
  SegmentedArcMeter, SegmentedStepperDots, CardGlancePreview, 
  VerticalWheelCounter, PerspectiveLayoutSwitcher, BookmarkSavePill 
} from './css-animations/yui-components/RedesignedUiTrios';

// Import Authentic Whimsical & Physics Variations
import { 
  BlindPull, GelatinWobble, DominoChain, MagneticDisks 
} from './css-animations/whimsical/WhimsicalVariations';

// Import UI Kit Trios
import { 
  FilterTagPill, SubmenuFlyout, MagneticIconButton, MorphActionPill, 
  SegmentedStepBar 
} from './css-animations/yui-components/UiKitTrios';

// Import 19 UI Micro-Components
import { 
  CategorySelect, HoverLinkCard, PlusMinusToggle, LightDarkMorphToggle, 
  ProgressStepper, MultiTabCloseBar, DatePositionSelector 
} from './css-animations/yui-components/YuiUiKit1';

import { 
  ContextMenuEditDelete, DownloadAnimatedIcons, SegmentedABTabs 
} from './css-animations/yui-components/YuiUiKit2';

interface CssAnimationsPageProps {
  theme: 'dark' | 'light';
  showToast?: (message: string) => void;
  triggerHaptic?: (type: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy') => void;
  onNavigateHome?: () => void;
}

export function CssAnimationsPage({
  theme,
  showToast,
  triggerHaptic,
  onNavigateHome,
}: CssAnimationsPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCli, setCopiedCli] = useState(false);
  const [previewLoopTrigger, setPreviewLoopTrigger] = useState<number>(0);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return cssAnimationsData;
    return cssAnimationsData.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleCopyCode = useCallback(
    (item: CssAnimationItem) => {
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
          setCopiedCli(true);
          setTimeout(() => setCopiedCli(false), 2000);
          if (showToast) showToast(`Copied ${name} CLI command!`);
        })
        .catch(() => {
          if (triggerHaptic) triggerHaptic('error');
          if (showToast) showToast('Failed to copy CLI command.');
        });
    },
    [showToast, triggerHaptic]
  );

  const renderLiveComponent = (id: string) => {
    switch (id) {
      case 'dock':
        return (
          <div className="w-full flex items-center justify-center py-2 origin-center">
            <Dock theme="dark" />
          </div>
        );
      
      // ROW 1: CARD & RIBBON PEEL (3 VARIATIONS)
      case 'anim-card-peel':
        return <div key={`cp-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><CardStackPeel loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-bookmark-corner':
        return <div key={`bmc-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><BookmarkCornerPeel loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-elastic-tag':
        return <div key={`et-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><ElasticTagSnap loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 2: SPLIT GATES & SHUTTERS (3 VARIATIONS)
      case 'anim-split-gate':
        return <div key={`sg-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><SplitGateReveal loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-shutter-slide':
        return <div key={`ss-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><ShutterSlide loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-origami-envelope':
        return <div key={`oe-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><OrigamiEnvelopeUnfold loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 3: DISPENSERS & CARDS (3 VARIATIONS)
      case 'anim-card-dispenser':
        return <div key={`cd-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><SmartCardDispenser loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-sticky-note':
        return <div key={`sn-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><StickyNotePeel loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-receipt-tape':
        return <div key={`rt-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><ReceiptTapePrint loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 4: CIRCUIT & LATTICE DRAWING (3 VARIATIONS)
      case 'anim-circuit-trace':
        return <div key={`ct-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><CircuitTraceDraw loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-hex-lattice':
        return <div key={`hl-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><HexagonLatticeDraw loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-stroke-waveform':
        return <div key={`sw-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><StrokeWaveform loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 5: PRISM & MODULAR BLOCKS (3 VARIATIONS)
      case 'anim-prism-stack':
        return <div key={`ps-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><PrismBlockStack loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-modular-tile':
        return <div key={`mt-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><ModularTileSnap loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-pyramid-build':
        return <div key={`pb-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><PyramidBlockBuild loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 6: ROLLERS & SCROLLS (3 VARIATIONS)
      case 'anim-roller-blind':
        return <div key={`rb-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><RollerBlindDrop loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-scroll-canvas':
        return <div key={`sc-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><ScrollCanvasUnroll loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-ribbon-banner':
        return <div key={`rbs-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><RibbonBannerSlide loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 7: ELASTICITY & MORPHING (3 VARIATIONS)
      case 'anim-tension-capsule':
        return <div key={`tc-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><KineticTensionCapsule loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-droplet-squish':
        return <div key={`ds-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><DropletSquish loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-segmented-link':
        return <div key={`sl-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><SegmentedLinkStretch loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 8: BLINDS & IRIS SHUTTERS (3 VARIATIONS)
      case 'anim-blind-pull':
        return <div key={`bp-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><BlindPull loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-rotating-louvers':
        return <div key={`rl-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><RotatingLouvers loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-iris-shutter':
        return <div key={`is-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><GeometricIrisShutter loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 9: BUBBLE LEVELS & METRONOMES (3 VARIATIONS)
      case 'anim-bubble-level':
        return <div key={`bl-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><PendulumBubbleLevel loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-kinetic-metronome':
        return <div key={`km-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><KineticTickingMetronome loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-orbital-gimbal':
        return <div key={`og-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><NestedOrbitalGimbal loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 10: HARMONIC SPRINGS (3 VARIATIONS)
      case 'anim-gelatin-wobble':
        return <div key={`gw-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><GelatinWobble loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-slinky-coil':
        return <div key={`sc-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><SlinkyCoil loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-squash-sphere':
        return <div key={`sqs-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><SquashStretchSphere loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 11: CASCADES & DOMINOES (3 VARIATIONS)
      case 'anim-domino-chain':
        return <div key={`dc-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><DominoChain loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-card-cascade':
        return <div key={`cdc-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><CardDeckCascade loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-gear-step':
        return <div key={`gs-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><GearToothStep loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 12: MAGNETICS & COMPASS (3 VARIATIONS)
      case 'anim-magnetic-disks':
        return <div key={`md-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><MagneticDisks loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-dual-magnet':
        return <div key={`dmd-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><DualMagnetDipole loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-compass-deflect':
        return <div key={`cnd-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><CompassNeedleDeflect loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 13: KINETIC SPEED & INERTIA (3 VARIATIONS) - NEW
      case 'anim-sudden-brake':
        return <div key={`sb-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><SuddenBrake loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-rolling-tumble':
        return <div key={`rtb-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><RollingTumble loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-inertia-skid':
        return <div key={`iss-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><InertiaSkidStop loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 14: NEON & PAGE MECHANICS (3 VARIATIONS) - NEW
      case 'anim-neon-sign':
        return <div key={`ns-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><NeonSignDraw loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-page-turn':
        return <div key={`ptc-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><PageTurnCurl loop={true} trigger="hover" theme="dark" /></div>;
      case 'anim-shutter-blocks':
        return <div key={`ssb-${previewLoopTrigger}`} className="w-full h-full flex items-center justify-center"><ShutterStepBlocks loop={true} trigger="hover" theme="dark" /></div>;

      // ROW 15: LOADERS & SPINNERS (3 VARIATIONS)
      case 'anim-matrix-loader':
        return <MatrixGridLoader theme="dark" />;
      case 'anim-apple-spinner':
        return <AppleRadialSpinner theme="dark" />;
      case 'anim-pulse-dots':
        return <PulseOrbitDots theme="dark" />;

      // ROW 16: SELECTS & MENUS (3 VARIATIONS)
      case 'yui-category-select':
        return <CategorySelect theme="dark" />;
      case 'yui-filter-tag-pill':
        return <FilterTagPill theme="dark" />;
      case 'yui-submenu-flyout':
        return <SubmenuFlyout theme="dark" />;

      // ROW 17: BUTTONS & LINKS (3 VARIATIONS)
      case 'yui-hover-link':
        return <HoverLinkCard theme="dark" />;
      case 'yui-magnetic-icon-btn':
        return <MagneticIconButton theme="dark" />;
      case 'yui-morph-action-pill':
        return <MorphActionPill theme="dark" />;

      // ROW 18: TOGGLES & MODIFIERS (3 VARIATIONS)
      case 'yui-plus-minus-toggle':
        return <PlusMinusToggle theme="dark" />;
      case 'yui-light-dark-toggle':
        return <LightDarkMorphToggle theme="dark" />;
      case 'yui-ab-tabs':
        return <SegmentedABTabs theme="dark" />;

      // ROW 19: PROGRESS & STEPPERS (3 VARIATIONS)
      case 'yui-progress-stepper':
        return <ProgressStepper theme="dark" />;
      case 'yui-segmented-arc-meter':
        return <SegmentedArcMeter theme="dark" />;
      case 'yui-segmented-step-bar':
        return <SegmentedStepBar theme="dark" />;

      // ROW 20: TABS & STEPPERS (3 VARIATIONS)
      case 'yui-multi-tab-close':
        return <MultiTabCloseBar theme="dark" />;
      case 'yui-date-position':
        return <DatePositionSelector theme="dark" />;
      case 'yui-stepper-dots':
        return <SegmentedStepperDots theme="dark" />;

      // ROW 21: ACTION FEEDBACK & GLANCES (3 VARIATIONS)
      case 'yui-context-menu':
        return <ContextMenuEditDelete theme="dark" />;
      case 'yui-glance-preview':
        return <CardGlancePreview theme="dark" />;
      case 'yui-download-icons':
        return <DownloadAnimatedIcons theme="dark" />;

      // ROW 22: CONTROLS & SWITCHERS (3 VARIATIONS)
      case 'yui-wheel-counter':
        return <VerticalWheelCounter theme="dark" />;
      case 'yui-perspective-layout':
        return <PerspectiveLayoutSwitcher theme="dark" />;
      case 'yui-save-pill':
        return <BookmarkSavePill theme="dark" />;

      default:
        return null;
    }
  };

  return (
    <div className={`w-full max-w-[1120px] mx-auto px-4 sm:px-6 py-5 sm:py-6 flex flex-col gap-6 font-[-apple-system,BlinkMacSystemFont,"SF_Pro_Display","SF_Pro_Text","Helvetica_Neue",sans-serif] transition-colors duration-300 ${
      theme === 'dark' ? 'text-[#f5f5f7]' : 'text-[#1d1d1f]'
    }`}>
      
      {/* Top Bar with Buttons Spanning the Outer Edges of the Container */}
      <div className="relative w-full flex flex-col items-center">
        {/* Left & Right Edge Actions Bar */}
        <div className="w-full flex items-center justify-between z-10">
          {onNavigateHome ? (
            <button
              onClick={onNavigateHome}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] sm:text-[13px] font-medium transition-all cursor-pointer border ${
                theme === 'dark' 
                  ? 'bg-[#1c1c1e] border-[#2c2c2e] text-[#a1a1a6] hover:bg-[#2c2c2e] hover:text-white' 
                  : 'bg-[#e5e5ea] border-[#d1d1d6] text-[#636366] hover:bg-[#d1d1d6] hover:text-black'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          ) : <div />}

          <button
            onClick={() => setPreviewLoopTrigger((k) => k + 1)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] sm:text-[13px] font-medium transition-all cursor-pointer border ${
              theme === 'dark'
                ? 'bg-[#1c1c1e] border-[#2c2c2e] text-[#a1a1a6] hover:bg-[#2c2c2e] hover:text-white'
                : 'bg-[#e5e5ea] border-[#d1d1d6] text-[#636366] hover:bg-[#d1d1d6] hover:text-black'
            }`}
            title="Replay all animations"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Replay Animations</span>
          </button>
        </div>

        {/* Center Hero Section Content (Refined & Compact Font Size) */}
        <div className="flex flex-col items-center text-center gap-2.5 max-w-3xl w-full mx-auto -mt-7 sm:-mt-8">
          <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-bold sm:font-extrabold tracking-[-0.035em] leading-[1.12]">
            Claim <span className="text-[#0071e3]">Micro-Motion</span> for<br />your Web UI
          </h1>

          <p className={`max-w-[580px] text-[13px] sm:text-[14.5px] leading-relaxed font-normal tracking-[-0.01em] ${
            theme === 'dark' ? 'text-[#86868b]' : 'text-[#6e6e73]'
          }`}>
            Refined physics springs, skids, and fluid UI micro-interactions grouped in 3-variation suites. Built with vanilla CSS & zero bloated dependencies.
          </p>

          {/* Apple Segmented Filter Pill Bar */}
          <div className={`flex flex-wrap items-center justify-center p-1 rounded-full border transition-colors duration-200 gap-1 mt-1 ${
            theme === 'dark' ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-[#e5e5ea] border-[#d1d1d6]'
          }`}>
            {CSS_ANIMATION_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (triggerHaptic) triggerHaptic('light');
                    setActiveCategory(cat.id);
                  }}
                  className={`px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] font-medium transition-all cursor-pointer border-0 ${
                    isActive
                      ? (theme === 'dark' ? 'bg-[#2c2c2e] text-white shadow-sm font-semibold' : 'bg-white text-[#1d1d1f] shadow-sm font-semibold')
                      : (theme === 'dark' ? 'text-[#86868b] hover:text-white bg-transparent' : 'text-[#6e6e73] hover:text-black bg-transparent')
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Component Library Grid */}
      <div className="flex flex-col gap-6 w-full mt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-[-0.02em]">
            Components ({filteredItems.length})
          </h2>
          <span className={`text-[13px] ${theme === 'dark' ? 'text-[#86868b]' : 'text-[#6e6e73]'}`}>
            Hover to trigger animations
          </span>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center sm:place-items-stretch">
          {filteredItems.map((item) => {
            const isCopied = copiedId === item.id;
            const isDock = item.id === 'dock';

            // 1. FIRST ROW FULL-WIDTH COMPONENT: macOS Spring Dock (Restructured & Consistent)
            if (isDock) {
              return (
                <div
                  key={item.id}
                  className={`col-span-1 md:col-span-2 lg:col-span-3 w-full rounded-[24px] p-3 sm:p-4 border flex flex-col gap-3 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-[#161617] border-[#2c2c2e]'
                      : 'bg-white border-[#d2d2d7] shadow-sm'
                  }`}
                >
                  {/* Top Interactive Dock Playground Canvas (Black Background) */}
                  <div className="w-full flex items-center justify-center h-[96px] sm:h-[105px] rounded-[18px] bg-[#000000] border border-neutral-800/80 shadow-inner overflow-visible">
                    <Dock theme="dark" />
                  </div>

                  {/* Bottom Info & CLI Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] sm:text-[15px] font-semibold tracking-[-0.01em]">
                          Physics-Based macOS Spring Dock
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          theme === 'dark' ? 'bg-[#2c2c2e] border-neutral-700 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'
                        }`}>
                          Interactive
                        </span>
                      </div>
                      <p className={`text-[11px] sm:text-[12px] font-normal leading-normal mt-0.5 ${
                        theme === 'dark' ? 'text-[#86868b]' : 'text-[#6e6e73]'
                      }`}>
                        Dynamic cursor proximity magnification, smooth spring damping, and drag-and-drop item reordering.
                      </p>
                    </div>

                    {/* CLI Command Bar */}
                    <div className={`flex items-center gap-2 pl-3 pr-1.5 py-1 rounded-full border text-[11px] font-mono shrink-0 transition-all ${
                      theme === 'dark' ? 'bg-[#111111] border-neutral-800 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                    }`}>
                      <Terminal className="w-3.5 h-3.5 text-[#0071e3] shrink-0" />
                      <span className="select-all">npx @subhanhq/amicro@latest add physics-dock</span>
                      <button
                        onClick={() => handleCopyCli('npx @subhanhq/amicro@latest add physics-dock', 'Physics Spring Dock')}
                        className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center border shrink-0 ${
                          copiedCli
                            ? (theme === 'dark' ? 'bg-[#30d158]/20 border-[#30d158]/40 text-[#30d158]' : 'bg-[#34c759]/20 border-[#34c759]/40 text-[#34c759]')
                            : (theme === 'dark' ? 'bg-[#222222] border-neutral-700 text-white hover:bg-[#333333]' : 'bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-100')
                        }`}
                        title="Copy CLI command"
                      >
                        {copiedCli ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // 2. STANDARD 3-IN-A-ROW APPLE STYLE CARDS (Grouped into Trios)
            return (
              <div
                key={item.id}
                className={`relative w-full max-w-[340px] sm:max-w-none h-[240px] sm:h-[270px] rounded-[24px] transition-all duration-300 group border ${
                  theme === 'dark'
                    ? 'bg-[#161617] border-[#2c2c2e] hover:border-[#3a3a3c]'
                    : 'bg-white border-[#d2d2d7] hover:border-[#b0b0b8] shadow-sm'
                }`}
              >
                {/* Inner Playground Canvas (Strictly Solid Black Background) */}
                <div className="absolute left-[12px] top-[12px] right-[12px] h-[160px] sm:h-[188px] rounded-[18px] flex items-center justify-center bg-[#000000] border border-neutral-800/80 shadow-inner transition-colors duration-300">
                  {/* Live Component Interactive Render */}
                  {renderLiveComponent(item.id)}
                </div>

                {/* Card Footer Bar */}
                <div className="absolute left-[18px] bottom-[14px] right-[18px] flex items-center justify-between">
                  <div className="flex flex-col truncate pr-2">
                    <span className="text-[13px] font-semibold tracking-[-0.01em] truncate">
                      {item.name}
                    </span>
                    <span className={`text-[11px] font-normal capitalize truncate ${
                      theme === 'dark' ? 'text-[#86868b]' : 'text-[#86868b]'
                    }`}>
                      {item.category.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Action Copy Button */}
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleCopyCode(item)}
                    className={`p-2 rounded-xl transition-all cursor-pointer border flex items-center justify-center shrink-0 ${
                      isCopied
                        ? (theme === 'dark'
                            ? 'bg-[#30d158]/20 border-[#30d158]/40 text-[#30d158]'
                            : 'bg-[#34c759]/20 border-[#34c759]/40 text-[#34c759]')
                        : (theme === 'dark'
                            ? 'bg-[#2c2c2e] border-[#3a3a3c] text-[#a1a1a6] hover:text-white'
                            : 'bg-[#f5f5f7] border-[#e5e5ea] text-[#636366] hover:text-black')
                    }`}
                    title="Copy component code"
                  >
                    <IconSwap>
                      <IconSwapItem key={isCopied ? 'check' : 'copy'}>
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
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
