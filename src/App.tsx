import React, { useState, useMemo, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence, animate } from 'motion/react';
import { 
  LayoutGrid, List, LayoutTemplate, ArrowDownAZ, Copy, Sun, Moon, Github, 
  Terminal, Check, Cpu, Zap, Code, ShieldCheck, Sparkles, RefreshCw, Smartphone, 
  ChevronRight, ChevronDown, Shield, Layers, HelpCircle, Palette, Activity, Menu, X,
  Heart, Box, BarChart2
} from 'lucide-react';
import { buttonsData } from './data/buttons';
import { AnimatedButton } from './components/AnimatedButton';
import { getComponentCode, ThemeToggleCode, getCardComponentCode } from './utils/codeGenerator';
import { MapleLogo } from './components/MapleLogo';
import { AppleSponsorShowcase } from './components/AppleSponsorShowcase';
import { useWebHaptics } from './hooks/useWebHaptics';
import { getComponentEntry } from './data/componentEntries';
import { Analytics } from '@vercel/analytics/react';

// Loaders imports
import { loaderGroups, LoaderConfig } from './data/loaders';
import { loadersCode } from './utils/loadersCode';
import { InViewRender } from './components/InViewRender';
import { IconSwap, IconSwapItem } from './components/IconSwap';

// Card layouts imports
import { cardsData, CardConfig } from './data/cards';
import { CardArc5 } from './components/cards/CardArc5';
import { CardArc7 } from './components/cards/CardArc7';
import { CardLongArc5 } from './components/cards/CardLongArc5';
import { CardLinearSpread } from './components/cards/CardLinearSpread';
import { CardCornerFan } from './components/cards/CardCornerFan';
import { CardStampArc } from './components/cards/CardStampArc';
import { CardCascadeStagger } from './components/cards/CardCascadeStagger';
import { CardScatterSpread } from './components/cards/CardScatterSpread';
import { CardWheelFan } from './components/cards/CardWheelFan';
import { CardCarousel } from './components/cards/CardCarousel';
import { CardCoverFlow } from './components/cards/CardCoverFlow';
import { CardTimeMachine } from './components/cards/CardTimeMachine';
import { DitherChartsGrid } from './components/dither-charts/DitherChartsGrid';

// Lazy load secondary subpages for optimal initial bundle performance
const CliPage = lazy(() => import('./components/CliPage').then(m => ({ default: m.CliPage })));
const SkillsPage = lazy(() => import('./components/SkillsPage').then(m => ({ default: m.SkillsPage })));
const DitherChartsPage = lazy(() => import('./components/DitherChartsPage').then(m => ({ default: m.DitherChartsPage })));
const MonoChartsPage = lazy(() => import('./components/MonoChartsPage').then(m => ({ default: m.MonoChartsPage })));
const ThreeDPage = lazy(() => import('./components/ThreeDPage').then(m => ({ default: m.ThreeDPage })));
const CssAnimationsPage = lazy(() => import('./components/CssAnimationsPage').then(m => ({ default: m.CssAnimationsPage })));
const TextAnimationsPage = lazy(() => import('./components/TextAnimationsPage').then(m => ({ default: m.TextAnimationsPage })));
const SponsorsPage = lazy(() => import('./components/SponsorsPage').then(m => ({ default: m.SponsorsPage })));
const ChartDetailPage = lazy(() => import('./components/ChartDetailPage').then(m => ({ default: m.ChartDetailPage })));

type LayoutMode = 'list' | 'grid' | 'matrix';
type SortMode = 'default' | 'alphabetical';
type PageMode = 'home' | 'cli' | 'skills' | 'dither-charts' | '3d-page' | 'simple-comp' | 'mono-charts' | 'sponsors' | 'chart-detail' | 'css-animations' | 'text-animations';
type CatalogTabType = 'buttons' | 'cards' | 'carousels' | 'loaders' | 'dither-charts' | 'simple-comp';

interface SponsorSlot {
  id: number;
  companyName: string;
  description: string;
  logoType?: string;
  siteUrl?: string;
  isAvailable: boolean;
}

const tabLabels: Record<CatalogTabType, string> = {
  buttons: 'Buttons',
  cards: 'Card Spreads',
  carousels: '3D Carousels',
  loaders: 'Loaders',
  'dither-charts': 'Dither Charts',
  'simple-comp': 'Dither Charts',
};

const routeMap: Record<CatalogTabType, string> = {
  buttons: '/buttons',
  cards: '/cards',
  carousels: '/carousels',
  loaders: '/loaders',
  'dither-charts': '/dither-charts',
  'simple-comp': '/dither-charts',
};

function LoadingFallback() {
  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-3">
      <div className="w-7 h-7 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs text-neutral-500 font-medium">Loading view...</span>
    </div>
  );
}

function AnimatedNumber({ value }: { value: number | null }) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValueRef = useRef(0);

  useEffect(() => {
    if (value === null) return;
    const startVal = prevValueRef.current;
    const controls = animate(startVal, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
      onComplete: () => { prevValueRef.current = value; }
    });
    return () => controls.stop();
  }, [value]);

  if (value === null) return null;
  return <span className="tabular-nums">{displayValue.toLocaleString('en-US')}</span>;
}

export default function App() {
  const [layout, setLayout] = useState<LayoutMode>('grid');
  const [sortBy, setSortBy] = useState<SortMode>('default');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [stars, setStars] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<PageMode>('home');
  const [catalogTab, setCatalogTab] = useState<CatalogTabType>('buttons');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const POLAR_CHECKOUT_URL = "https://buy.polar.sh/polar_cl_kgaC0fUqnLvTlW7A7RrvGQRaHzmTKjezxWNaA19AyV4" as string;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navMoreDropdownOpen, setNavMoreDropdownOpen] = useState(false);
  const [componentsMenuOpen, setComponentsMenuOpen] = useState(false);
  const componentsMenuRef = useRef<HTMLDivElement>(null);
  const componentsCloseTimer = useRef<number | null>(null);

  const openComponentsMenu = useCallback(() => {
    if (componentsCloseTimer.current) window.clearTimeout(componentsCloseTimer.current);
    setComponentsMenuOpen(true);
    setNavMoreDropdownOpen(false);
  }, []);

  const scheduleCloseComponentsMenu = useCallback(() => {
    if (componentsCloseTimer.current) window.clearTimeout(componentsCloseTimer.current);
    componentsCloseTimer.current = window.setTimeout(() => setComponentsMenuOpen(false), 140);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (!componentsMenuRef.current?.contains(e.target as Node)) {
        setComponentsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, []);
  const { trigger: triggerHaptic } = useWebHaptics();

  const [sponsors, setSponsors] = useState<SponsorSlot[]>(() => {
    const defaultSponsors: SponsorSlot[] = [
      {
        id: 1,
        companyName: 'Maple',
        description: 'Open-source observability built for AI, with fast traces, logs, and metrics powered by OpenTelemetry and ClickHouse.',
        logoType: 'maple',
        siteUrl: 'https://maple.dev/',
        isAvailable: false,
      },
      { id: 2, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true },
      { id: 3, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true },
      { id: 4, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true },
    ];

    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('amicro_sponsors');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.length > 0) {
            parsed[0] = defaultSponsors[0];
          }
          return parsed;
        } catch (e) {
          console.error('Error parsing cached sponsors:', e);
        }
      }
    }
    return defaultSponsors;
  });

  // Sync sponsors list to localStorage whenever state updates
  useEffect(() => {
    localStorage.setItem('amicro_sponsors', JSON.stringify(sponsors));
  }, [sponsors]);

  const [selectedChartId, setSelectedChartId] = useState<string | null>(null);

  const navigateToChartDetail = useCallback((chartId: string, customCategory?: string) => {
    setSelectedChartId(chartId);
    setCurrentPage('chart-detail');

    const entry = getComponentEntry(chartId);
    let catPath = customCategory || (entry ? entry.category : '');
    if (!catPath) {
      if (chartId.startsWith('btn-') || !isNaN(Number(chartId))) catPath = 'buttons';
      else if (chartId.startsWith('card-') || chartId.startsWith('c')) catPath = 'cards';
      else if (chartId.startsWith('mono-')) catPath = 'mono-charts';
      else if (chartId.startsWith('dither-')) catPath = 'dither-charts';
      else catPath = 'components';
    }

    const targetUrl = `/${catPath}/${chartId}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
  }, []);

  // Clean Path Router (Without # hash)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      const route = path || hash;

      if (hash) {
        const cleanPath = hash === 'home' || hash === '' ? '/' : `/${hash}`;
        window.history.replaceState(null, '', cleanPath);
      }

      if (route.includes('/')) {
        const parts = route.split('/').filter(Boolean);
        if (parts.length >= 2) {
          const idPart = parts.slice(1).join('/');
          if (idPart) {
            setSelectedChartId(idPart);
            setCurrentPage('chart-detail');
            return;
          }
        }
      }

      setSelectedChartId(null);
      if (route.startsWith('cli')) {
        setCurrentPage('cli');
      } else if (route.startsWith('skills')) {
        setCurrentPage('skills');
      } else if (route.startsWith('anime') || route.startsWith('css-animations') || route.startsWith('animations')) {
        setCurrentPage('css-animations');
      } else if (route.startsWith('mono-charts')) {
        setCurrentPage('mono-charts');
      } else if (route.startsWith('dither-charts') || route.startsWith('simple-comp')) {
        setCurrentPage('dither-charts');
      } else if (route.startsWith('3d')) {
        setCurrentPage('3d-page');
      } else if (route.startsWith('sponsors')) {
        setCurrentPage('sponsors');
      } else if (route.startsWith('text-animations')) {
        setCurrentPage('text-animations');
      } else if (route.startsWith('buttons')) {
        setCurrentPage('home');
        setCatalogTab('buttons');
      } else if (route.startsWith('cards') || route.startsWith('card-spreads')) {
        setCurrentPage('home');
        setCatalogTab('cards');
      } else if (route.startsWith('carousels') || route.startsWith('3d-carousels')) {
        setCurrentPage('home');
        setCatalogTab('carousels');
      } else if (route.startsWith('loaders')) {
        setCurrentPage('home');
        setCatalogTab('loaders');
      } else {
        setCurrentPage('home');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    fetch('https://api.github.com/repos/Subhan-code/Amicro--Micro-transitions-')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (typeof data.stargazers_count === 'number') {
          setStars(data.stargazers_count);
        } else {
          throw new Error('Invalid stargazers_count');
        }
      })
      .catch(() => {
        fetch('https://img.shields.io/github/stars/Subhan-code/Amicro--Micro-transitions-.json')
          .then(res => res.json())
          .then(data => {
            if (data.value) {
              const raw = String(data.value).replace(/k/i, '00').replace(/\./g, '');
              const parsed = parseInt(raw, 10);
              if (!isNaN(parsed) && parsed > 0) {
                setStars(parsed);
              }
            }
          })
          .catch(err => console.error('Error fetching fallback stars:', err));
      });
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  // Listen for Polar checkout redirect parameter to dynamically apply paid sponsor slots
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentSuccess = params.get('payment_success');
    const checkoutId = params.get('checkout_id');

    if (paymentSuccess === 'true' && checkoutId) {
      fetch(`/api/checkout-status?checkout_id=${checkoutId}`)
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            if (data.payment_success) {
              setSponsors(prev => {
                const firstAvailableIdx = prev.findIndex(s => s.isAvailable);
                if (firstAvailableIdx !== -1) {
                  const nextSponsors = [...prev];
                  nextSponsors[firstAvailableIdx] = {
                    id: prev[firstAvailableIdx].id,
                    companyName: data.companyName,
                    description: data.description,
                    siteUrl: data.siteUrl.startsWith('http://') || data.siteUrl.startsWith('https://')
                      ? data.siteUrl
                      : `https://${data.siteUrl}`,
                    isAvailable: false
                  };
                  return nextSponsors;
                }
                return prev;
              });
              showToast(`Sponsorship confirmed for ${data.companyName}!`);
            }
          }
        })
        .catch(err => console.error('Error fetching checkout status:', err))
        .finally(() => {
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    }
  }, [showToast]);

  const handleCopyCode = useCallback((button: typeof buttonsData[0]) => {
    const code = getComponentCode(button);
    navigator.clipboard.writeText(code)
      .then(() => {
        triggerHaptic('success');
        showToast(`Copied ${button.label} component code!`);
      })
      .catch(() => {
        triggerHaptic('error');
        showToast("Failed to copy code.");
      });
  }, [showToast, triggerHaptic]);

  const handleCopyCardCode = useCallback((card: CardConfig) => {
    const code = getCardComponentCode(card);
    navigator.clipboard.writeText(code)
      .then(() => {
        triggerHaptic('success');
        showToast(`Copied ${card.label} component code!`);
      })
      .catch(() => {
        triggerHaptic('error');
        showToast("Failed to copy code.");
      });
  }, [showToast, triggerHaptic]);

  const handleCopyLoaderCode = useCallback((loader: LoaderConfig | string, fallbackName?: string) => {
    let code: string | undefined;
    let name: string;
    let copyId: string;

    if (typeof loader === 'string') {
      name = fallbackName || loader;
      copyId = loader;
      code = loadersCode[loader] || (fallbackName ? loadersCode[fallbackName] : undefined);
    } else if (loader && typeof loader === 'object') {
      name = loader.name;
      copyId = loader.kebabName || loader.name;
      code = loadersCode[loader.kebabName] ||
             (loader.component?.name ? loadersCode[loader.component.name] : undefined) ||
             (loader.component?.displayName ? loadersCode[loader.component.displayName] : undefined) ||
             loadersCode[loader.name];
    } else {
      name = 'Unknown';
      copyId = 'unknown';
    }

    if (!code) {
      code = `// Loader ${name} code not found`;
    }

    navigator.clipboard.writeText(code)
      .then(() => {
        triggerHaptic('success');
        setCopiedText(copyId);
        setTimeout(() => setCopiedText(null), 2000);
        showToast(`Copied ${name} loader code!`);
      })
      .catch(() => {
        triggerHaptic('error');
        showToast("Failed to copy code.");
      });
  }, [showToast, triggerHaptic]);

  const handleThemeToggle = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    navigator.clipboard.writeText(ThemeToggleCode)
      .then(() => {
        triggerHaptic('medium');
        showToast("Theme toggled & ThemeToggle code copied!");
      })
      .catch(() => {
        triggerHaptic('error');
        showToast("Failed to copy theme code.");
      });
  }, [theme, showToast, triggerHaptic]);

  const displayedButtons = useMemo(() => {
    let sorted = [...buttonsData];
    if (sortBy === 'alphabetical') {
      sorted.sort((a, b) => a.label.localeCompare(b.label));
    }
    return sorted;
  }, [sortBy]);

  const displayedCards = useMemo(() => {
    const targetCategory = catalogTab === 'cards' ? 'spreads' : 'carousels';
    let filtered = cardsData.filter(card => (card.category || 'spreads') === targetCategory);
    if (sortBy === 'alphabetical') {
      filtered.sort((a, b) => a.label.localeCompare(b.label));
    }
    return filtered;
  }, [catalogTab, sortBy]);

  const navigateTo = useCallback((page: PageMode, tab?: CatalogTabType) => {
    triggerHaptic('light');
    let targetPath = '/';
    if (page === 'cli') {
      targetPath = '/cli';
    } else if (page === 'skills') {
      targetPath = '/skills';
    } else if (page === 'css-animations') {
      targetPath = '/Anime';
    } else if (page === 'text-animations') {
      targetPath = '/text-animations';
    } else if (page === 'dither-charts' || page === 'simple-comp') {
      targetPath = '/dither-charts';
    } else if (page === '3d-page') {
      targetPath = '/3d';
    } else if (page === 'mono-charts') {
      targetPath = '/mono-charts';
    } else if (page === 'sponsors') {
      targetPath = '/sponsors';
    } else {
      const activeTab = tab || catalogTab;
      targetPath = routeMap[activeTab] || '/';
    }

    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState(null, '', targetPath);
    }
    if (tab) {
      setCatalogTab(tab);
    }
    setCurrentPage(page === 'simple-comp' ? 'dither-charts' : page);
    setMobileMenuOpen(false);
    setNavMoreDropdownOpen(false);
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [catalogTab, triggerHaptic]);

  const handleTabChange = useCallback((tab: CatalogTabType) => {
    triggerHaptic('light');
    setCatalogTab(tab);
    const targetPath = routeMap[tab] || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  }, [triggerHaptic]);

  const handleLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, page: PageMode, tab?: CatalogTabType) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      navigateTo(page, tab);
    }
  }, [navigateTo]);

  const handleTabLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, tab: CatalogTabType) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      if (currentPage !== 'home') {
        navigateTo('home', tab);
      } else {
        handleTabChange(tab);
      }
    }
  }, [currentPage, handleTabChange, navigateTo]);

  const componentGroups = [
    { id: 'buttons', label: 'Buttons', desc: 'Micro-interaction buttons', href: '/buttons', page: 'home' as PageMode, tab: 'buttons' as CatalogTabType, icon: Zap, tint: 'bg-amber-500/15 text-amber-400' },
    { id: 'cards', label: 'Card Spreads', desc: 'Arc, fan, and scatter layouts', href: '/cards', page: 'home' as PageMode, tab: 'cards' as CatalogTabType, icon: Layers, tint: 'bg-sky-500/15 text-sky-400' },
    { id: 'carousels', label: '3D Carousels', desc: 'Cover flow and time machine', href: '/carousels', page: 'home' as PageMode, tab: 'carousels' as CatalogTabType, icon: Box, tint: 'bg-violet-500/15 text-violet-400' },
    { id: 'loaders', label: 'Loaders', desc: 'Physics and loop loaders', href: '/loaders', page: 'home' as PageMode, tab: 'loaders' as CatalogTabType, icon: RefreshCw, tint: 'bg-emerald-500/15 text-emerald-400' },
    { id: 'dither-charts', label: 'Dither Charts', desc: 'Halftone data visuals', href: '/dither-charts', page: 'dither-charts' as PageMode, tab: 'dither-charts' as CatalogTabType, icon: BarChart2, tint: 'bg-rose-500/15 text-rose-400' },
    { id: 'mono-charts', label: 'Mono Charts', desc: 'Single-ink chart system', href: '/mono-charts', page: 'mono-charts' as PageMode, icon: Activity, tint: 'bg-neutral-500/20 text-neutral-300' },
    { id: 'text-animations', label: 'Text Animations', desc: 'Kinetic type sequences', href: '/text-animations', page: 'text-animations' as PageMode, icon: Sparkles, tint: 'bg-fuchsia-500/15 text-fuchsia-400' },
    { id: '3d-page', label: '3D Page', desc: 'Spatial component demos', href: '/3d', page: '3d-page' as PageMode, icon: Cpu, tint: 'bg-cyan-500/15 text-cyan-400' },
  ];

  const isComponentsActive =
    (currentPage === 'home' && catalogTab !== 'buttons' ? true : currentPage === 'home') ||
    ['dither-charts', 'simple-comp', 'mono-charts', 'text-animations', '3d-page'].includes(currentPage);

  return (
    <div className={`relative w-full min-h-dvh flex flex-col font-sans antialiased transition-colors duration-300 ${theme === 'dark' ? 'dark bg-[#121212] text-[#ffffff] selection:bg-neutral-850' : 'bg-[#f8f9fa] text-black selection:bg-neutral-200'}`}>
      
      {/* Site Navbar */}
      <header className="sticky top-0 z-50 w-full pt-4 pb-4 px-6 border-b border-transparent pointer-events-none">
        <div className="relative z-[3] flex items-center justify-between gap-4 max-w-[1240px] mx-auto pointer-events-auto">

          {/* Logo Pill Island */}
          <motion.a
            href="/"
            onClick={(e) => handleLinkClick(e, 'home')}
            whileHover="hover"
            initial="initial"
            whileTap={{ scale: 0.96 }}
            variants={{
              hover: { scale: 1.03 }
            }}
            className={`inline-flex items-center gap-[7px] h-[40px] px-[10px] pr-[14px] rounded-full no-underline shrink-0 group cursor-pointer border transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-[#181818] border-white/[0.07] text-white hover:bg-[#1f1f1f] hover:border-white/20 shadow-xs'
                : 'bg-white border-neutral-200/80 text-black shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.09)] hover:border-neutral-300'
            }`}
          >
            <motion.span 
              variants={{
                hover: { rotate: [0, -18, 18, -8, 0], scale: 1.1 }
              }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center justify-center w-[24px] h-[24px] rounded-full overflow-hidden shrink-0"
            >
              <img src="/favicon.jpg" alt="Amicro" className="w-full h-full object-cover" />
            </motion.span>
            <motion.span 
              variants={{
                hover: { letterSpacing: '-0.012em' }
              }}
              transition={{ duration: 0.25 }}
              className="text-[15px] font-bold leading-none tracking-[-0.019em] transition-colors"
            >
              Amicro
            </motion.span>
          </motion.a>

          {/* Nav Links Pill Island — exactly mathematically centered */}
          <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center justify-center pointer-events-auto">
            <nav
              className={`flex items-center p-[3px] rounded-full border transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-[#181818] border-white/[0.07] shadow-inner'
                  : 'bg-white/95 border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
              }`}
            >
              {/* Components hub — same 36px action-pill language */}
              <div
                ref={componentsMenuRef}
                className="relative"
                onMouseEnter={openComponentsMenu}
                onMouseLeave={scheduleCloseComponentsMenu}
              >
                <motion.button
                  whileHover="hover"
                  initial="initial"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    triggerHaptic('light');
                    setComponentsMenuOpen((v) => !v);
                  }}
                  className={`inline-flex items-center justify-center gap-1.5 h-[34px] px-[12px] rounded-full text-[13px] font-medium leading-[16px] cursor-pointer whitespace-nowrap transition-all duration-200 border-0 ${
                    isComponentsActive || componentsMenuOpen
                      ? theme === 'dark'
                        ? 'bg-[#2a2a2a] text-white font-semibold shadow-sm'
                        : 'bg-neutral-100 text-black font-semibold shadow-sm'
                      : theme === 'dark'
                        ? 'text-[rgba(202,202,202,0.7)] hover:text-white hover:bg-white/[0.06]'
                        : 'text-neutral-600 hover:text-black hover:bg-neutral-100/70'
                  }`}
                >
                  <motion.span
                    variants={{
                      hover: { y: -1 }
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  >
                    Components
                  </motion.span>
                  <motion.span
                    animate={{ rotate: componentsMenuOpen ? 180 : 0 }}
                    variants={{
                      hover: { y: [0, -1, 1, 0] }
                    }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </motion.span>
                </motion.button>

                <AnimatePresence>
                  {componentsMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.92, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 10, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: 8, scale: 0.94, filter: 'blur(4px)' }}
                      transition={{ type: 'spring', stiffness: 420, damping: 28, mass: 0.7 }}
                      style={{ originX: 0.2, originY: 0 }}
                      className={`absolute left-0 top-[38px] w-[380px] sm:w-[440px] p-2 rounded-[22px] border shadow-2xl backdrop-blur-xl z-50 overflow-hidden ${
                        theme === 'dark'
                          ? 'bg-[#161616]/96 border-white/[0.08] shadow-black/60'
                          : 'bg-white/96 border-neutral-200 shadow-neutral-300/50'
                      }`}
                    >
                      <motion.div
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        variants={{
                          hidden: {},
                          show: { transition: { staggerChildren: 0.025, delayChildren: 0.03 } },
                        }}
                        className="grid grid-cols-2 gap-1"
                      >
                        {componentGroups.map((item) => {
                          const active =
                            (item.tab && currentPage === 'home' && catalogTab === item.tab) ||
                            currentPage === item.page;
                          return (
                            <motion.a
                              key={item.id}
                              href={item.href}
                              variants={{
                                hidden: { opacity: 0, y: 6, scale: 0.98 },
                                show: { opacity: 1, y: 0, scale: 1 },
                              }}
                              whileHover={{ scale: 1.02, x: 2 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                              onClick={(e) => {
                                if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                                  e.preventDefault();
                                  if (item.tab) navigateTo(item.page, item.tab);
                                  else navigateTo(item.page);
                                  setComponentsMenuOpen(false);
                                }
                              }}
                              className={`flex flex-col justify-center px-3 py-2 rounded-[14px] no-underline transition-colors group ${
                                active
                                  ? theme === 'dark'
                                    ? 'bg-white/[0.08]'
                                    : 'bg-neutral-100 shadow-xs'
                                  : theme === 'dark'
                                    ? 'hover:bg-white/[0.05]'
                                    : 'hover:bg-neutral-100/70'
                              }`}
                            >
                              <span className={`text-[13px] font-semibold leading-[17px] transition-colors ${
                                theme === 'dark' ? 'text-white group-hover:text-white' : 'text-neutral-900 group-hover:text-black'
                              }`}>
                                {item.label}
                              </span>
                              <span className={`text-[11.5px] leading-[15px] mt-0.5 transition-colors ${
                                theme === 'dark' ? 'text-neutral-400 group-hover:text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-700'
                              }`}>
                                {item.desc}
                              </span>
                            </motion.a>
                          );
                        })}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.a
                href="/Anime"
                onClick={(e) => handleLinkClick(e, 'css-animations')}
                whileHover="hover"
                initial="initial"
                whileTap={{ scale: 0.96 }}
                className={`inline-flex items-center justify-center h-[34px] px-[12px] rounded-full text-[13px] font-medium leading-[16px] cursor-pointer no-underline whitespace-nowrap transition-all duration-200 border-0 ${
                  currentPage === 'css-animations'
                    ? theme === 'dark'
                      ? 'bg-[#2a2a2a] text-white font-semibold shadow-sm'
                      : 'bg-neutral-100 text-black font-semibold shadow-sm'
                    : theme === 'dark'
                      ? 'text-[rgba(202,202,202,0.7)] hover:text-white hover:bg-white/[0.06]'
                      : 'text-neutral-600 hover:text-black hover:bg-neutral-100/70'
                }`}
              >
                <motion.span
                  variants={{ hover: { y: -1 } }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  Anime
                </motion.span>
              </motion.a>

              <motion.a
                href="/cli"
                onClick={(e) => handleLinkClick(e, 'cli')}
                whileHover="hover"
                initial="initial"
                whileTap={{ scale: 0.96 }}
                className={`inline-flex items-center justify-center h-[34px] px-[12px] rounded-full text-[13px] font-medium leading-[16px] cursor-pointer no-underline whitespace-nowrap transition-all duration-200 border-0 ${
                  currentPage === 'cli'
                    ? theme === 'dark'
                      ? 'bg-[#2a2a2a] text-white font-semibold shadow-sm'
                      : 'bg-neutral-100 text-black font-semibold shadow-sm'
                    : theme === 'dark'
                      ? 'text-[rgba(202,202,202,0.7)] hover:text-white hover:bg-white/[0.06]'
                      : 'text-neutral-600 hover:text-black hover:bg-neutral-100/70'
                }`}
              >
                <motion.span
                  variants={{ hover: { y: -1 } }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  CLI
                </motion.span>
              </motion.a>

              <motion.a
                href="/skills"
                onClick={(e) => handleLinkClick(e, 'skills')}
                whileHover="hover"
                initial="initial"
                whileTap={{ scale: 0.96 }}
                className={`hidden md:inline-flex items-center justify-center h-[34px] px-[12px] rounded-full text-[13px] font-medium leading-[16px] cursor-pointer no-underline whitespace-nowrap transition-all duration-200 border-0 ${
                  currentPage === 'skills'
                    ? theme === 'dark'
                      ? 'bg-[#2a2a2a] text-white font-semibold shadow-sm'
                      : 'bg-neutral-100 text-black font-semibold shadow-sm'
                    : theme === 'dark'
                      ? 'text-[rgba(202,202,202,0.7)] hover:text-white hover:bg-white/[0.06]'
                      : 'text-neutral-600 hover:text-black hover:bg-neutral-100/70'
                }`}
              >
                <motion.span
                  variants={{ hover: { y: -1 } }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  Skills
                </motion.span>
              </motion.a>

              {/* Sponsors link */}
              <motion.a
                href="/sponsors"
                onClick={(e) => handleLinkClick(e, 'sponsors')}
                whileHover="hover"
                initial="initial"
                whileTap={{ scale: 0.96 }}
                className={`inline-flex items-center justify-center gap-1.5 h-[34px] px-[12px] rounded-full text-[13px] font-medium leading-[16px] cursor-pointer no-underline whitespace-nowrap transition-all duration-200 border-0 ${
                  currentPage === 'sponsors'
                    ? theme === 'dark'
                      ? 'bg-[#2a2a2a] text-white font-semibold shadow-sm'
                      : 'bg-neutral-100 text-black font-semibold shadow-sm'
                    : theme === 'dark'
                      ? 'text-[rgba(202,202,202,0.7)] hover:text-white hover:bg-white/[0.06]'
                      : 'text-neutral-600 hover:text-black hover:bg-neutral-100/70'
                }`}
              >
                <motion.span
                  variants={{ hover: { y: -1 } }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  Sponsors
                </motion.span>
              </motion.a>
            </nav>
          </div>

          {/* Navbar Actions with Theme Toggle */}
          <div className="flex items-center gap-[8px]">
            <motion.a
              href="https://github.com/Subhan-code/Amicro--Micro-transitions-"
              target="_blank"
              rel="noopener noreferrer"
              whileHover="hover"
              initial="initial"
              whileTap={{ scale: 0.95 }}
              variants={{
                hover: { scale: 1.05 }
              }}
              className={`inline-flex items-center justify-center gap-1.5 h-[36px] px-[13px] rounded-full font-sans text-[13px] font-medium leading-[16px] no-underline transition-all duration-200 group border cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#181818] hover:bg-[#202020] border-white/[0.07] text-[rgba(237,237,237,0.7)] hover:text-white hover:border-white/20 shadow-xs'
                  : 'bg-white hover:bg-neutral-50 border-neutral-200/80 text-black shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-neutral-300'
              }`}
            >
              <motion.div
                variants={{
                  hover: { rotate: [0, -18, 18, -10, 0], scale: 1.2 }
                }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="flex items-center shrink-0"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-auto h-[16px] max-w-[16px] block">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
              </motion.div>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                <AnimatedNumber value={stars} />
              </span>
            </motion.a>
            <motion.a
              href="https://x.com/SubhanHQ"
              target="_blank"
              rel="noopener noreferrer"
              whileHover="hover"
              initial="initial"
              whileTap={{ scale: 0.92 }}
              variants={{
                hover: { scale: 1.08 }
              }}
              className={`hidden sm:inline-flex items-center justify-center w-[36px] h-[36px] rounded-full transition-all duration-150 border ${
                theme === 'dark'
                  ? 'bg-[#181818] hover:bg-[#1f1f1f] border-white/[0.07] text-[rgba(237,237,237,0.7)] hover:text-white hover:border-white/20'
                  : 'bg-white hover:bg-neutral-50 border-neutral-200/80 text-black shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-neutral-300'
              }`}
            >
              <motion.div
                variants={{
                  hover: { rotate: [0, -10, 10, -5, 0], scale: 1.15 }
                }}
                transition={{ duration: 0.4 }}
                className="flex items-center shrink-0"
              >
                <svg viewBox="0 0 16 17" fill="currentColor" className="w-[15px] h-[16px] block">
                  <path d="M12.4041 1.39726H14.6953L9.69087 7.2591L15.5781 15.2368H10.9696L7.35741 10.3996L3.22921 15.2368H0.934687L6.28641 8.96575L0.642598 1.39726H5.36795L8.62962 5.81859L12.4041 1.39726ZM11.5992 13.8329H12.8682L4.67667 2.72798H3.31359L11.5992 13.8329Z"></path>
                </svg>
              </motion.div>
            </motion.a>

            {/* Theme Toggle Button */}
            <motion.button
              onClick={handleThemeToggle}
              whileHover="hover"
              initial="initial"
              whileTap={{ scale: 0.9, rotate: 180 }}
              variants={{
                hover: { scale: 1.08 }
              }}
              className={`inline-flex items-center justify-center w-[36px] h-[36px] rounded-full transition-all duration-150 cursor-pointer border ${
                theme === 'dark'
                  ? 'bg-[#181818] hover:bg-[#1f1f1f] border-white/[0.07] text-[rgba(237,237,237,0.7)] hover:text-white hover:border-white/20'
                  : 'bg-white hover:bg-neutral-50 border-neutral-200/80 text-black shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-neutral-300'
              }`}
              title="Toggle Theme (Copies ThemeToggle code)"
            >
              <motion.div
                variants={{
                  hover: { rotate: [0, 45, 90], scale: 1.15 }
                }}
                transition={{ duration: 0.35 }}
                className="flex items-center shrink-0"
              >
                {theme === 'dark' ? <Sun className="w-[16px] h-[16px]" /> : <Moon className="w-[16px] h-[16px]" />}
              </motion.div>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className={`inline-flex sm:hidden items-center justify-center w-[36px] h-[36px] rounded-full transition-all duration-150 cursor-pointer border ${
                theme === 'dark'
                  ? 'bg-[#181818] hover:bg-[#1f1f1f] border-white/[0.07] text-[rgba(237,237,237,0.7)] hover:text-white'
                  : 'bg-white hover:bg-neutral-50 border-neutral-200/80 text-black shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
              }`}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-[64px] left-6 right-6 p-4 rounded-2xl border flex flex-col gap-2 z-[999] shadow-2xl sm:hidden backdrop-blur-xl ${
                theme === 'dark' 
                  ? 'bg-zinc-950/95 border-white/10 text-white' 
                  : 'bg-white/95 border-neutral-200 text-black'
              }`}
            >
              <a 
                href="/buttons"
                onClick={(e) => handleLinkClick(e, 'home', 'buttons')}
                className={`flex items-center justify-start h-[40px] px-4 rounded-xl text-[14px] font-semibold cursor-pointer border-0 text-left bg-transparent no-underline ${
                  currentPage === 'home' && catalogTab === 'buttons'
                    ? (theme === 'dark' ? 'text-white bg-white/10' : 'text-black bg-neutral-100 font-bold')
                    : (theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                }`}
              >
                Buttons
              </a>
              <a 
                href="/cards"
                onClick={(e) => handleLinkClick(e, 'home', 'cards')}
                className={`flex items-center justify-start h-[40px] px-4 rounded-xl text-[14px] font-semibold cursor-pointer border-0 text-left bg-transparent no-underline ${
                  currentPage === 'home' && catalogTab !== 'buttons'
                    ? (theme === 'dark' ? 'text-white bg-white/10' : 'text-black bg-neutral-100 font-bold')
                    : (theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                }`}
              >
                Components
              </a>
              <a 
                href="/cli"
                onClick={(e) => handleLinkClick(e, 'cli')}
                className={`flex items-center justify-start h-[40px] px-4 rounded-xl text-[14px] font-semibold cursor-pointer border-0 text-left bg-transparent no-underline ${
                  currentPage === 'cli'
                    ? (theme === 'dark' ? 'text-white bg-white/10' : 'text-black bg-neutral-100 font-bold')
                    : (theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                }`}
              >
                CLI Install
              </a>
              <a 
                href="/skills"
                onClick={(e) => handleLinkClick(e, 'skills')}
                className={`flex items-center justify-start h-[40px] px-4 rounded-xl text-[14px] font-semibold cursor-pointer border-0 text-left bg-transparent no-underline ${
                  currentPage === 'skills'
                    ? (theme === 'dark' ? 'text-white bg-white/10' : 'text-black bg-neutral-100 font-bold')
                    : (theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                }`}
              >
                Skills
              </a>
              <a 
                href="/Anime"
                onClick={(e) => handleLinkClick(e, 'css-animations')}
                className={`flex items-center justify-start h-[40px] px-4 rounded-xl text-[14px] font-semibold cursor-pointer border-0 text-left bg-transparent no-underline ${
                  currentPage === 'css-animations'
                    ? (theme === 'dark' ? 'text-white bg-white/10' : 'text-black bg-neutral-100 font-bold')
                    : (theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                }`}
              >
                Anime
              </a>
              <a 
                href="/text-animations"
                onClick={(e) => handleLinkClick(e, 'text-animations')}
                className={`flex items-center justify-start h-[40px] px-4 rounded-xl text-[14px] font-semibold cursor-pointer border-0 text-left bg-transparent no-underline ${
                  currentPage === 'text-animations'
                    ? (theme === 'dark' ? 'text-white bg-white/10' : 'text-black bg-neutral-100 font-bold')
                    : (theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                }`}
              >
                Text Animations
              </a>
              <a 
                href="/mono-charts"
                onClick={(e) => handleLinkClick(e, 'mono-charts')}
                className={`flex items-center justify-start h-[40px] px-4 rounded-xl text-[14px] font-semibold cursor-pointer border-0 text-left bg-transparent no-underline ${
                  currentPage === 'mono-charts'
                    ? (theme === 'dark' ? 'text-white bg-white/10' : 'text-black bg-neutral-100 font-bold')
                    : (theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                }`}
              >
                Mono Charts
              </a>
              <a 
                href="/dither-charts"
                onClick={(e) => handleLinkClick(e, 'dither-charts')}
                className={`flex items-center justify-start h-[40px] px-4 rounded-xl text-[14px] font-semibold cursor-pointer border-0 text-left bg-transparent no-underline ${
                  currentPage === 'dither-charts' || currentPage === 'simple-comp'
                    ? (theme === 'dark' ? 'text-white bg-white/10' : 'text-black bg-neutral-100 font-bold')
                    : (theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                }`}
              >
                Dither Charts
              </a>
              <a 
                href="/3d"
                onClick={(e) => handleLinkClick(e, '3d-page')}
                className={`flex items-center justify-start h-[40px] px-4 rounded-xl text-[14px] font-semibold cursor-pointer border-0 text-left bg-transparent no-underline ${
                  currentPage === '3d-page'
                    ? (theme === 'dark' ? 'text-white bg-white/10' : 'text-black bg-neutral-100 font-bold')
                    : (theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                }`}
              >
                3D Page
              </a>
              <a 
                href="/sponsors"
                onClick={(e) => handleLinkClick(e, 'sponsors')}
                className={`flex items-center justify-start h-[40px] px-4 rounded-xl text-[14px] font-semibold cursor-pointer border-0 text-left bg-transparent no-underline ${
                  currentPage === 'sponsors'
                    ? (theme === 'dark' ? 'text-white bg-white/10' : 'text-black bg-neutral-100 font-bold')
                    : (theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                }`}
              >
                <span>Sponsors</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Render subpages or HomePage */}
      <AnimatePresence mode="wait">
        {currentPage === 'cli' ? (
          <motion.div
            key="cli-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <CliPage theme={theme} onNavigateHome={() => navigateTo('home')} />
            </Suspense>
          </motion.div>
        ) : currentPage === 'skills' ? (
          <motion.div
            key="skills-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <SkillsPage theme={theme} onNavigateHome={() => navigateTo('home')} />
            </Suspense>
          </motion.div>
        ) : currentPage === 'sponsors' ? (
          <motion.div
            key="sponsors-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <SponsorsPage
                theme={theme}
                sponsors={sponsors}
                checkoutUrl={POLAR_CHECKOUT_URL}
                onNavigateHome={() => navigateTo('home')}
                showToast={showToast}
              />
            </Suspense>
          </motion.div>
        ) : currentPage === 'chart-detail' && selectedChartId ? (
          <motion.div
            key="chart-detail-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <ChartDetailPage
                chartId={selectedChartId}
                theme={theme}
                showToast={showToast}
                triggerHaptic={triggerHaptic}
                onBack={() => {
                  const entry = getComponentEntry(selectedChartId);
                  const cat = entry ? entry.category : catalogTab;
                  setSelectedChartId(null);
                  if (cat === 'mono-charts') {
                    navigateTo('mono-charts');
                  } else if (cat === 'dither-charts') {
                    navigateTo('dither-charts');
                  } else {
                    handleTabChange(cat as CatalogTabType);
                    setCurrentPage('home');
                  }
                }}
              />
            </Suspense>
          </motion.div>
        ) : currentPage === 'mono-charts' ? (
          <motion.div
            key="mono-charts-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <MonoChartsPage
                theme={theme}
                sponsors={sponsors}
                checkoutUrl={POLAR_CHECKOUT_URL}
                showToast={showToast}
                triggerHaptic={triggerHaptic}
                onNavigateHome={() => navigateTo('home')}
                onSelectChart={(id) => navigateToChartDetail(id)}
              />
            </Suspense>
          </motion.div>
        ) : currentPage === 'dither-charts' || currentPage === 'simple-comp' ? (
          <motion.div
            key="dither-charts-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <DitherChartsPage 
                theme={theme} 
                showToast={showToast} 
                triggerHaptic={triggerHaptic} 
                onNavigateHome={() => navigateTo('home')} 
                onNavigate3D={() => navigateTo('3d-page')} 
                onSelectChart={(id) => navigateToChartDetail(id)} 
              />
            </Suspense>
          </motion.div>
        ) : currentPage === '3d-page' ? (
          <motion.div
            key="3d-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <ThreeDPage theme={theme} showToast={showToast} triggerHaptic={triggerHaptic} onNavigateHome={() => navigateTo('home')} />
            </Suspense>
          </motion.div>
        ) : currentPage === 'css-animations' ? (
          <motion.div
            key="css-animations-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <CssAnimationsPage
                theme={theme}
                showToast={showToast}
                triggerHaptic={triggerHaptic}
                onNavigateHome={() => navigateTo('home')}
              />
            </Suspense>
          </motion.div>
        ) : currentPage === 'text-animations' ? (
          <motion.div
            key="text-animations-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <TextAnimationsPage
                theme={theme}
                showToast={showToast}
                triggerHaptic={triggerHaptic}
                onNavigateHome={() => navigateTo('home')}
              />
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            key="home-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full flex flex-col"
          >
            {/* Main Content */}
            <div className="relative z-10 flex-1 w-full max-w-[1240px] mx-auto px-6 flex flex-col items-center">
              
              <div className="mt-8 sm:mt-12 mb-16 sm:mb-20 text-center w-full flex flex-col items-center">
                
                {/* Hero Speech Bubble Attribution Badge (Subtle & Low Priority) */}
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -1.5 }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  className={`relative inline-flex items-center gap-2 py-1 pl-3 pr-1.5 mb-6 rounded-[11px] text-[12.5px] font-medium border transition-all select-none ${
                    theme === 'dark'
                      ? 'bg-[#151515]/70 border-white/[0.05] shadow-[0_4px_16px_rgba(0,0,0,0.3)] text-neutral-400'
                      : 'bg-neutral-100/70 border-neutral-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-neutral-500'
                  }`}
                >
                  <span className="text-[12px] tracking-tight opacity-75">Layout from</span>

                  {/* Inner secondary chip */}
                  <a
                    href="https://transition.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11.5px] font-medium transition-colors no-underline ${
                      theme === 'dark'
                        ? 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/[0.03]'
                        : 'bg-black/[0.03] hover:bg-black/[0.06] text-neutral-600 hover:text-neutral-900 border border-black/[0.03]'
                    }`}
                  >
                    transition.dev
                  </a>

                  <ChevronRight className="w-3 h-3 opacity-30 shrink-0 -mx-1 text-current" />

                  {/* Inner muted accent badge */}
                  <a
                    href="https://x.com/Jakubantalik"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11.5px] font-medium transition-colors no-underline ${
                      theme === 'dark'
                        ? 'bg-white/[0.08] hover:bg-white/[0.14] text-neutral-200 hover:text-white border border-white/[0.06]'
                        : 'bg-black/[0.06] hover:bg-black/[0.1] text-neutral-700 hover:text-black border border-black/[0.06]'
                    }`}
                  >
                    @Jakubantalik
                  </a>

                  {/* Downward speech bubble tail */}
                  <div className="absolute -bottom-[5.5px] left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center">
                    <svg
                      width="11"
                      height="6"
                      viewBox="0 0 11 6"
                      fill="none"
                      className="block"
                    >
                      <path
                        d="M0 0 C2.5 0, 4 4.5, 5.5 5.5 C7 4.5, 8.5 0, 11 0 Z"
                        fill={theme === 'dark' ? '#151515' : '#f5f5f5'}
                        stroke={theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)'}
                        strokeWidth="1"
                        strokeLinejoin="round"
                      />
                      <line
                        x1="0.5"
                        y1="0"
                        x2="10.5"
                        y2="0"
                        stroke={theme === 'dark' ? '#151515' : '#f5f5f5'}
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </motion.div>

                <h1 className={`text-[32px] sm:text-[46px] font-medium leading-[38px] sm:leading-[52px] tracking-[-0.01em] mb-4 sm:mb-5 font-sans transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Amicro — Micro-transitions
                </h1>
                <p className={`text-[14px] sm:text-[17px] leading-[20px] sm:leading-[25px] max-w-[530px] transition-colors duration-300 ${theme === 'dark' ? 'text-[#767676]' : 'text-black'}`}>
                  A curated library of premium micro-interactions and transition components. Built with React and Motion.
                </p>

                {/* Hero CTAs */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-9 sm:mt-10">
                  <motion.a 
                    href="https://github.com/Subhan-code/Amicro--Micro-transitions-" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover="hover"
                    initial="initial"
                    whileTap={{ scale: 0.98 }}
                    variants={{
                      hover: { 
                        scale: 1.04,
                        boxShadow: theme === 'dark' ? '0 10px 25px -5px rgba(255,255,255,0.1)' : '0 10px 25px -5px rgba(0,0,0,0.15)'
                      }
                    }}
                    className={`inline-flex items-center justify-center gap-1.5 h-[36px] px-[16px] rounded-full text-[13px] font-medium no-underline transition-colors cursor-pointer border-0 ${theme === 'dark' ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-950 text-white hover:bg-neutral-800'}`}
                  >
                    <motion.div 
                      variants={{
                        hover: { rotate: [0, -15, 15, -15, 0], scale: 1.15 }
                      }}
                      transition={{ duration: 0.4 }}
                      className="flex items-center shrink-0"
                    >
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 block">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                      </svg>
                    </motion.div>
                    <span>GitHub Repo</span>
                    {stars !== null && (
                      <span className={`text-[10.5px] px-1.5 py-0.5 rounded-full font-semibold ml-1 ${theme === 'dark' ? 'bg-black/10 text-black/70' : 'bg-white/20 text-white/90'}`}>
                        <AnimatedNumber value={stars} />
                      </span>
                    )}
                  </motion.a>
                  
                  <motion.button 
                    onClick={() => {
                      const element = document.getElementById('component-grid');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    whileHover="hover"
                    initial="initial"
                    whileTap={{ scale: 0.98 }}
                    variants={{
                      hover: { 
                        scale: 1.04,
                        boxShadow: theme === 'dark' ? '0 10px 25px -5px rgba(0,0,0,0.3)' : '0 10px 25px -5px rgba(0,0,0,0.05)'
                      }
                    }}
                    className={`inline-flex items-center justify-center h-[36px] px-[16px] rounded-full text-[13px] font-medium border cursor-pointer transition-colors ${theme === 'dark' ? 'bg-[#181818] border-neutral-800 text-white hover:bg-neutral-800' : 'bg-white border-neutral-200 text-black hover:bg-neutral-50 shadow-sm'}`}
                  >
                    <motion.div
                      variants={{
                        hover: { rotate: [0, -8, 8, 0], scale: 1.15 }
                      }}
                      transition={{ duration: 0.45 }}
                      className="flex items-center shrink-0 mr-1.5"
                    >
                      <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] block shrink-0" fill="currentColor" aria-hidden="true">
                        <mask id="browse-components-mask">
                          <rect width="24" height="24" rx="6.5" fill="white" />
                          <rect x="5.5" y="6" width="7" height="2.5" rx="1.25" fill="black" />
                          <rect x="5.5" y="10.75" width="13" height="2.5" rx="1.25" fill="black" />
                          <rect x="5.5" y="15.5" width="7" height="2.5" rx="1.25" fill="black" />
                        </mask>
                        <rect width="24" height="24" rx="6.5" mask="url(#browse-components-mask)" fill="currentColor" />
                      </svg>
                    </motion.div>
                    <span>Browse Components</span>
                  </motion.button>
                </div>

                {/* Sponsor Ad Grid */}
                <div className="w-full max-w-3xl mx-auto mt-10 px-4 sm:px-0 flex flex-col items-center">
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-3.5 ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Sponsored by
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
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
                            className={`group relative flex flex-col items-center justify-center text-center p-3 sm:p-3.5 min-h-[78px] rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                              isMaple
                                ? (theme === 'dark'
                                    ? 'bg-[#1a1410] border-[#E86F00]/30 hover:border-[#E86F00]/50 hover:bg-[#231a14] text-white shadow-[inset_0_1px_0_rgba(232,111,0,0.15)]'
                                    : 'bg-[#FFF7ED] border-[#FDBA74]/80 hover:border-[#FB923C] hover:bg-[#FFEDD5] text-[#7C2D12] shadow-[0_2px_12px_rgba(232,111,0,0.06)]')
                                : (theme === 'dark'
                                    ? 'bg-[#181818] border-neutral-800/80 hover:bg-[#1e1e1e] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                                    : 'bg-white border-neutral-200 hover:shadow-xs text-black shadow-2xs')
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center w-full">
                              {isMaple ? (
                                <div className="flex items-center gap-2 font-bold tracking-tight text-[13.5px] text-neutral-900 dark:text-orange-200">
                                  <MapleLogo className="w-5 h-5 shrink-0" />
                                  <span>Maple</span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center font-bold tracking-tight text-[13.5px] text-emerald-500 w-full px-1">
                                  <span className="truncate max-w-[120px]">{slot.companyName}</span>
                                </div>
                              )}
                              <p className={`text-[10.5px] sm:text-[11px] leading-[14px] sm:leading-[15px] mt-1 font-medium line-clamp-2 w-full px-0.5 transition-colors ${
                                isMaple
                                    ? (theme === 'dark' ? 'text-orange-200/80 group-hover:text-orange-100' : 'text-[#9A3412] group-hover:text-[#7C2D12]')
                                    : (theme === 'dark' ? 'text-neutral-400 group-hover:text-neutral-300' : 'text-neutral-600 group-hover:text-neutral-800')
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
                              window.open(POLAR_CHECKOUT_URL, '_blank');
                            }}
                            className={`group flex flex-col items-center justify-center text-center p-3 sm:p-3.5 rounded-xl border border-dashed transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-transparent min-h-[78px] ${
                              theme === 'dark'
                                ? 'border-neutral-800 hover:border-neutral-700 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/10'
                                : 'border-neutral-300 hover:border-neutral-400 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50/30'
                            }`}
                          >
                            <span className="text-[12px] font-bold tracking-tight flex items-center gap-1">
                              <span>+</span> Sponsor
                            </span>
                            <span className={`text-[9.5px] mt-1 transition-colors ${theme === 'dark' ? 'text-neutral-500 group-hover:text-neutral-400' : 'text-neutral-500 group-hover:text-neutral-600'}`}>
                              $49/mo
                            </span>
                          </button>
                        );
                      }
                    })}
                  </div>
                </div>

                {/* Filter and layout controls */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 w-full max-w-xl mx-auto px-4 sm:px-0">
                  {/* Category Switcher: Dropdown on Mobile */}
                  <div className="relative block sm:hidden w-full max-w-[260px] mx-auto z-40">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`w-full flex items-center justify-between px-5 py-2.5 rounded-full border text-[13px] font-semibold cursor-pointer transition-all duration-300 shadow-sm border-0 focus-visible:outline-none ${
                        theme === 'dark' 
                          ? 'bg-[#181818] border-white/5 text-white hover:bg-[#222]' 
                          : 'bg-white border-neutral-200 text-black hover:bg-neutral-50'
                      }`}
                    >
                      <span>
                        {tabLabels[catalogTab]}
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-90 text-white' : 'text-neutral-400'}`} />
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40 bg-transparent" 
                            onClick={() => setDropdownOpen(false)} 
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 6, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className={`absolute top-full left-0 right-0 z-50 rounded-[20px] border p-1.5 shadow-xl flex flex-col gap-0.5 max-h-[300px] overflow-y-auto backdrop-blur-xl ${
                              theme === 'dark' 
                                ? 'bg-[#181818]/95 border-white/5 text-[#ededed] shadow-black/50' 
                                : 'bg-white/95 border-neutral-200 text-black shadow-neutral-200/50'
                            }`}
                          >
                            {[
                              { id: 'buttons', label: 'Buttons', href: '/buttons' },
                              { id: 'cards', label: 'Card Spreads', href: '/cards' },
                              { id: 'carousels', label: '3D Carousels', href: '/carousels' },
                              { id: 'loaders', label: 'Loaders', href: '/loaders' },
                              { id: 'dither-charts', label: 'Dither Charts', href: '/dither-charts' }
                            ].map((tab) => (
                              <a
                                key={tab.id}
                                href={tab.href}
                                onClick={(e) => {
                                  handleTabLinkClick(e, tab.id as CatalogTabType);
                                  setDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer border-0 transition-colors no-underline block ${
                                  catalogTab === tab.id
                                    ? (theme === 'dark' ? 'bg-white/10 text-white font-semibold' : 'bg-neutral-100 text-black font-semibold')
                                    : (theme === 'dark' ? 'text-neutral-400 hover:text-white hover:bg-white/[0.04]' : 'text-neutral-600 hover:text-black hover:bg-neutral-50')
                                }`}
                              >
                                {tab.label}
                              </a>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Desktop Category Switcher (Pills) */}
                  <div className={`hidden sm:flex items-center p-1.5 rounded-full border shadow-inner transition-colors duration-300 max-w-full overflow-x-visible ${theme === 'dark' ? 'bg-[#181818] border-white/5' : 'bg-neutral-200/50 border-neutral-300/30'}`}>
                    <div className="flex items-center gap-2 pr-1">
                      <a
                        href="/buttons"
                        onClick={(e) => handleTabLinkClick(e, 'buttons')}
                        className={`flex-none flex items-center justify-center h-[36px] px-4.5 sm:px-5 rounded-full text-[13px] font-medium leading-none transition-colors cursor-pointer border-0 whitespace-nowrap no-underline ${
                          catalogTab === 'buttons' 
                            ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                            : `${theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                        }`}
                      >
                        Buttons
                      </a>
                      <a
                        href="/cards"
                        onClick={(e) => handleTabLinkClick(e, 'cards')}
                        className={`flex-none flex items-center justify-center h-[36px] px-4.5 sm:px-5 rounded-full text-[13px] font-medium leading-none transition-colors cursor-pointer border-0 whitespace-nowrap no-underline ${
                          catalogTab === 'cards' 
                            ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                            : `${theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                        }`}
                      >
                        Card Spreads
                      </a>
                      <a
                        href="/carousels"
                        onClick={(e) => handleTabLinkClick(e, 'carousels')}
                        className={`flex-none flex items-center justify-center h-[36px] px-4.5 sm:px-5 rounded-full text-[13px] font-medium leading-none transition-colors cursor-pointer border-0 whitespace-nowrap no-underline ${
                          catalogTab === 'carousels' 
                            ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                            : `${theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                        }`}
                      >
                        3D Carousels
                      </a>
                      <a
                        href="/loaders"
                        onClick={(e) => handleTabLinkClick(e, 'loaders')}
                        className={`flex-none flex items-center justify-center h-[36px] px-4.5 sm:px-5 rounded-full text-[13px] font-medium leading-none transition-colors cursor-pointer border-0 whitespace-nowrap no-underline ${
                          catalogTab === 'loaders' 
                            ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                            : `${theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                        }`}
                      >
                        Loaders
                      </a>
                      <a
                        href="/dither-charts"
                        onClick={(e) => handleTabLinkClick(e, 'dither-charts')}
                        className={`flex-none flex items-center justify-center h-[36px] px-4.5 sm:px-5 rounded-full text-[13px] font-medium leading-none transition-colors cursor-pointer border-0 whitespace-nowrap no-underline ${
                          catalogTab === 'dither-charts' || catalogTab === 'simple-comp'
                            ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                            : `${theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                        }`}
                      >
                        Dither Charts
                      </a>
                    </div>
                  </div>

                  {/* Secondary controls row */}
                  {catalogTab !== 'loaders' && (
                    <div className="flex items-center justify-center gap-3 shrink-0">
                      {/* Sort */}
                      <div className={`flex items-center p-1 rounded-full border shadow-inner transition-colors duration-300 ${theme === 'dark' ? 'bg-[#181818] border-white/5' : 'bg-neutral-200/50 border-neutral-300/30'}`}>
                        <button
                          onClick={() => setSortBy(sortBy === 'default' ? 'alphabetical' : 'default')}
                          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer border-0 ${
                            sortBy === 'alphabetical' 
                              ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                              : `${theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                          }`}
                        >
                          <ArrowDownAZ className="w-3.5 h-3.5" />
                          <span>A-Z</span>
                        </button>
                      </div>

                      {/* Layout */}
                      <div className={`hidden sm:flex items-center p-1 rounded-full border shadow-inner transition-colors duration-300 ${theme === 'dark' ? 'bg-[#181818] border-white/5' : 'bg-neutral-200/50 border-neutral-300/30'}`}>
                        <button
                          onClick={() => setLayout('list')}
                          className={`p-1.5 rounded-full transition-colors cursor-pointer border-0 ${
                            layout === 'list' 
                              ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                              : `${theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                          }`}
                          aria-label="List layout"
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setLayout('grid')}
                          className={`p-1.5 rounded-full transition-colors cursor-pointer border-0 ${
                            layout === 'grid' 
                              ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                              : `${theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                          }`}
                          aria-label="Grid layout"
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setLayout('matrix')}
                          className={`p-1.5 rounded-full transition-colors cursor-pointer border-0 ${
                            layout === 'matrix' 
                              ? (theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black shadow-sm') 
                              : `${theme === 'dark' ? 'text-[#767676] hover:text-white' : 'text-black opacity-70 hover:opacity-100'}`
                          }`}
                          aria-label="Matrix layout"
                        >
                          <LayoutTemplate className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div 
                id="component-grid"
                className={`
                  w-full mb-16 mx-auto scroll-mt-24 px-4 sm:px-0
                  ${catalogTab === 'loaders' ? 'flex flex-col items-center w-full max-w-[1060px]' : `
                    ${layout === 'list' ? 'flex flex-col items-center gap-4 max-w-md' : ''}
                    ${layout === 'grid' ? (
                      catalogTab === 'buttons' 
                        ? 'flex flex-col items-center gap-6 w-full sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-10 lg:gap-12 max-w-[1060px] sm:justify-items-center' 
                        : 'flex flex-col items-center gap-6 w-full sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6 sm:max-w-6xl'
                    ) : ''}
                    ${layout === 'matrix' ? (
                      catalogTab === 'buttons'
                        ? 'flex flex-wrap justify-center gap-3 w-full max-w-[1400px] sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-2 sm:justify-items-center'
                        : 'flex flex-col items-center gap-4 w-full sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 sm:max-w-6xl'
                    ) : ''}
                  `}
                `}
              >
                <AnimatePresence mode="popLayout">
                  {catalogTab === 'buttons' ? (
                    displayedButtons.map((button) => (
                      <motion.div 
                        layout 
                        key={button.id}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={`${layout === 'list' ? 'w-full' : ''} ${layout === 'grid' ? 'w-full flex justify-center sm:w-auto sm:block' : ''}`}
                      >
                        {layout === 'grid' ? (
                          <div 
                            onClick={() => {
                              if (triggerHaptic) triggerHaptic('light');
                              navigateToChartDetail(`btn-${button.id}`, 'buttons');
                            }}
                            className={`relative w-full max-w-[320px] sm:w-[320px] h-[220px] sm:h-[268px] rounded-[24px] transition-all duration-300 group cursor-pointer ${theme === 'dark' ? 'bg-[#181818] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-[#202020]' : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100/85 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] text-black'}`}
                          >
                            <div className={`absolute left-[12px] top-[12px] right-[12px] bottom-[68px] rounded-[14px] overflow-hidden flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f4f4f6]'}`}>
                              <div className={`absolute inset-0 rounded-[14px] pointer-events-none z-10 ${theme === 'dark' ? 'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]' : 'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]'}`} />
                              <AnimatedButton config={button} layoutMode={layout} theme={theme} />
                            </div>
                            <div className="absolute left-[20px] bottom-[14px] w-[calc(100%-80px)] flex flex-col gap-[2px]">
                              <a 
                                href={`/buttons/btn-${button.id}`}
                                onClick={(e) => {
                                  if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                                    e.preventDefault();
                                    navigateToChartDetail(`btn-${button.id}`, 'buttons');
                                  }
                                }}
                                className={`text-[13px] font-semibold leading-[18px] transition-colors no-underline ${theme === 'dark' ? 'text-[#ededed] hover:text-white' : 'text-black hover:text-neutral-700'}`}
                              >
                                {button.label}
                              </a>
                              <div className={`text-[11px] font-normal leading-[13px] transition-colors ${theme === 'dark' ? 'text-[#767676]' : 'text-black opacity-70'} capitalize`}>{button.interactionType.replace('-', ' ')} interaction</div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyCode(button);
                              }}
                              type="button" 
                              className={`absolute right-[20px] bottom-[12px] w-[32px] h-[32px] rounded-full flex items-center justify-center transition-colors cursor-pointer border-0 focus-visible:outline focus-visible:outline-2 ${theme === 'dark' ? 'bg-white/[0.08] hover:bg-white/[0.12] text-[#ededed]/60 hover:text-[#ededed]' : 'bg-neutral-100 hover:bg-neutral-200 text-black hover:text-black'}`} 
                              aria-label="Copy interaction code"
                            >
                              <Copy className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                            </button>
                          </div>
                        ) : (
                          <AnimatedButton config={button} layoutMode={layout} theme={theme} />
                        )}
                      </motion.div>
                    ))
                  ) : catalogTab === 'loaders' ? (
                    <div className="w-full flex flex-col gap-16 max-w-[1060px] mx-auto text-left">
                      {loaderGroups.map((group, groupIdx) => {
                        const isPhysicsGroup = group.title === 'Physics & Simulation';
                        return (
                          <div key={groupIdx} className="flex flex-col gap-6 w-full">
                            <div className="flex items-center gap-3 px-2">
                              <h2 className={`text-[17px] font-semibold tracking-tight transition-colors ${theme === 'dark' ? 'text-[#ededed]' : 'text-black'}`}>
                                {group.title}
                              </h2>
                              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${theme === 'dark' ? 'bg-white/[0.06] text-neutral-400' : 'bg-neutral-200/60 text-neutral-600'}`}>
                                {group.loaders.length} items
                              </span>
                            </div>
                            
                            {isPhysicsGroup ? (
                              <div className="w-full">
                                {group.loaders.map((loader, loaderIdx) => {
                                  const LoaderComponent = loader.component;
                                  const isCopied = copiedText === loader.kebabName || copiedText === loader.name;
                                  return (
                                    <div 
                                      key={loaderIdx} 
                                      onClick={() => {
                                        if (triggerHaptic) triggerHaptic('light');
                                        navigateToChartDetail(loader.kebabName, 'loaders');
                                      }}
                                      className={`relative group rounded-[24px] flex flex-col items-center justify-center p-6 md:p-8 transition-all duration-300 border h-64 md:h-80 w-full overflow-hidden cursor-pointer ${
                                        theme === 'dark' 
                                          ? 'bg-[#181818] border-white/5 hover:bg-[#1f1f1f] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]' 
                                          : 'bg-white border-neutral-100 hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
                                      }`}
                                    >
                                      <div className="flex-1 flex items-center justify-center w-full">
                                        <InViewRender>
                                          <LoaderComponent theme={theme} />
                                        </InViewRender>
                                      </div>

                                      <div className="w-full flex items-center justify-between mt-4 px-2">
                                        <span className={`text-[13px] font-semibold transition-colors ${
                                          theme === 'dark' ? 'text-neutral-350' : 'text-neutral-700'
                                        }`}>
                                          {loader.name}
                                        </span>
                                        
                                        <motion.button
                                          whileHover={{ scale: 1.08 }}
                                          whileTap={{ scale: 0.92 }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopyLoaderCode(loader);
                                          }}
                                          className={`p-2 rounded-xl transition-all cursor-pointer border flex items-center justify-center ${
                                            isCopied
                                              ? (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-600 border-emerald-300')
                                              : (theme === 'dark' ? 'bg-white/[0.08] border-transparent hover:bg-white/[0.14] text-neutral-300 hover:text-white' : 'bg-neutral-100 border-transparent hover:bg-neutral-200 text-neutral-650 hover:text-black')
                                          }`}
                                          title="Copy loader code"
                                        >
                                          <IconSwap>
                                            <IconSwapItem key={isCopied ? "check" : "copy"}>
                                              {isCopied ? (
                                                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
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
                            ) : (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
                                {group.loaders.map((loader, loaderIdx) => {
                                  const LoaderComponent = loader.component;
                                  const isCopied = copiedText === loader.kebabName || copiedText === loader.name;
                                  return (
                                    <div 
                                      key={loaderIdx} 
                                      onClick={() => {
                                        if (triggerHaptic) triggerHaptic('light');
                                        navigateToChartDetail(loader.kebabName, 'loaders');
                                      }}
                                      className={`relative group aspect-square rounded-2xl flex flex-col items-center justify-center p-4 transition-all duration-300 border cursor-pointer ${
                                        theme === 'dark' 
                                          ? 'bg-[#181818] border-white/5 hover:bg-[#1f1f1f] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]' 
                                          : 'bg-white border-neutral-100 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:border-neutral-200/50'
                                      }`}
                                    >
                                      <div className="flex-1 flex items-center justify-center w-full min-h-[64px]">
                                        <InViewRender>
                                          <LoaderComponent theme={theme} />
                                        </InViewRender>
                                      </div>

                                      <div className="w-full flex items-center justify-between mt-3 px-1 gap-1">
                                        <span className={`text-[12px] font-medium truncate transition-colors ${
                                          theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                                        }`} title={loader.name}>
                                          {loader.name}
                                        </span>
                                        
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopyLoaderCode(loader);
                                          }}
                                          className={`p-1.5 rounded-lg transition-all cursor-pointer border flex items-center justify-center ${
                                            isCopied
                                              ? (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-600 border-emerald-300')
                                              : (theme === 'dark' ? 'bg-white/[0.08] border-transparent text-neutral-300 hover:text-white hover:bg-white/[0.14]' : 'bg-neutral-100/90 border-transparent text-neutral-600 hover:text-black hover:bg-neutral-200')
                                          }`}
                                          title="Copy loader code"
                                        >
                                          <IconSwap>
                                            <IconSwapItem key={isCopied ? "check" : "copy"}>
                                              {isCopied ? (
                                                <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
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
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : catalogTab === 'dither-charts' || catalogTab === 'simple-comp' ? (
                    <DitherChartsGrid theme={theme} showToast={showToast} triggerHaptic={triggerHaptic} />
                  ) : (
                    displayedCards.map((card) => (
                      <motion.div 
                        layout 
                        key={card.id}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={`${layout === 'list' ? 'w-full' : ''} ${layout === 'grid' || layout === 'matrix' ? 'w-full flex justify-center sm:w-auto sm:block' : ''}`}
                      >
                        {layout === 'grid' || layout === 'matrix' ? (
                          <div 
                            onClick={() => {
                              if (triggerHaptic) triggerHaptic('light');
                              navigateToChartDetail(card.interactionType || card.id, card.category === 'carousels' ? 'carousels' : 'cards');
                            }}
                            onMouseEnter={() => setHoveredCardId(card.id)}
                            onMouseLeave={() => setHoveredCardId(null)}
                            className={`relative w-full max-w-[480px] sm:w-[480px] h-[300px] sm:h-[390px] rounded-[24px] transition-all duration-300 group cursor-pointer ${hoveredCardId === card.id ? 'overflow-visible z-20' : 'overflow-hidden z-1'} ${theme === 'dark' ? 'bg-[#181818] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-[#202020]' : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100/85 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] text-black'}`}
                          >
                            <div className={`absolute left-[12px] top-[12px] right-[12px] h-[200px] sm:h-[290px] rounded-[14px] flex items-center justify-center ${hoveredCardId === card.id ? 'overflow-visible' : 'overflow-hidden'} transition-colors duration-300 ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f4f4f6]'}`}>
                              <div className={`absolute inset-0 rounded-[14px] pointer-events-none z-10 ${theme === 'dark' ? 'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]' : 'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]'}`} />
                              {card.interactionType === 'card-arc-5' && <CardArc5 hovered={hoveredCardId === card.id} className="scale-[0.55] sm:scale-[1.2] origin-center" />}
                              {card.interactionType === 'card-arc-7' && <CardArc7 hovered={hoveredCardId === card.id} className="scale-[0.5] sm:scale-[1.2] origin-center" />}
                              {card.interactionType === 'card-long-arc-5' && <CardLongArc5 hovered={hoveredCardId === card.id} className="scale-[0.5] sm:scale-[1.2] origin-center" />}
                              {card.interactionType === 'card-linear-spread' && <CardLinearSpread hovered={hoveredCardId === card.id} className="scale-[0.55] sm:scale-[1.2] origin-center" />}
                              {card.interactionType === 'card-corner-fan' && <CardCornerFan hovered={hoveredCardId === card.id} className="scale-[0.55] sm:scale-[1.2] origin-center" />}
                              {card.interactionType === 'card-stamp-arc' && <CardStampArc hovered={hoveredCardId === card.id} className="scale-[0.55] sm:scale-[1.2] origin-center" />}
                              {card.interactionType === 'card-cascade-stagger' && <CardCascadeStagger hovered={hoveredCardId === card.id} className="scale-[0.55] sm:scale-[1.2] origin-center" />}
                              {card.interactionType === 'card-scatter-spread' && <CardScatterSpread hovered={hoveredCardId === card.id} className="scale-[0.55] sm:scale-[1.2] origin-center" />}
                              {card.interactionType === 'card-wheel-fan' && <CardWheelFan hovered={hoveredCardId === card.id} className="scale-[0.55] sm:scale-[1.2] origin-center" />}
                              {card.interactionType === 'card-carousel' && <CardCarousel hovered={hoveredCardId === card.id} className="scale-[0.45] sm:scale-[1.0] origin-center" />}
                              {card.interactionType === 'card-cover-flow' && <CardCoverFlow hovered={hoveredCardId === card.id} className="scale-[0.45] sm:scale-[1.0] origin-center" />}
                              {card.interactionType === 'card-time-machine' && <CardTimeMachine hovered={hoveredCardId === card.id} className="scale-[0.45] sm:scale-[1.0] origin-center" />}
                              {card.interactionType === 'card-carousel-mono' && <CardCarousel hovered={hoveredCardId === card.id} isMonochrome={true} className="scale-[0.45] sm:scale-[1.0] origin-center" />}
                              {card.interactionType === 'card-cover-flow-mono' && <CardCoverFlow hovered={hoveredCardId === card.id} isMonochrome={true} className="scale-[0.45] sm:scale-[1.0] origin-center" />}
                              {card.interactionType === 'card-time-machine-mono' && <CardTimeMachine hovered={hoveredCardId === card.id} isMonochrome={true} className="scale-[0.45] sm:scale-[1.0] origin-center" />}
                            </div>
                            <div className="absolute left-[20px] bottom-[12px] right-[65px] flex flex-col justify-end gap-[3px]">
                              <div className="flex items-center gap-2 flex-wrap">
                                <a 
                                  href={`/${card.category === 'carousels' ? 'carousels' : 'cards'}/${card.interactionType || card.id}`}
                                  onClick={(e) => {
                                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                                      e.preventDefault();
                                      navigateToChartDetail(card.interactionType || card.id, card.category === 'carousels' ? 'carousels' : 'cards');
                                    }
                                  }}
                                  className={`text-[13px] font-semibold leading-[18px] transition-colors no-underline ${theme === 'dark' ? 'text-[#ededed] hover:text-white' : 'text-black hover:text-neutral-700'}`}
                                >
                                  {card.label}
                                </a>
                                {card.inspiration && (
                                  <a
                                    href={card.inspiration.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors font-medium whitespace-nowrap"
                                  >
                                    by {card.inspiration.name}
                                  </a>
                                )}
                              </div>
                              <div className={`text-[11px] font-normal leading-[14px] line-clamp-2 transition-colors ${theme === 'dark' ? 'text-[#767676]' : 'text-black opacity-70'}`}>
                                {card.description}
                              </div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyCardCode(card);
                              }}
                              type="button" 
                              className={`absolute right-[20px] bottom-[14px] w-[32px] h-[32px] rounded-full flex items-center justify-center transition-colors cursor-pointer border-0 focus-visible:outline focus-visible:outline-2 ${theme === 'dark' ? 'bg-white/[0.08] hover:bg-white/[0.12] text-[#ededed]/60 hover:text-[#ededed]' : 'bg-neutral-100 hover:bg-neutral-200 text-black hover:text-black'}`} 
                              aria-label="Copy card code"
                            >
                              <Copy className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                            </button>
                          </div>
                        ) : (
                          // List view for cards
                          <div className={`w-full max-w-[500px] flex items-center justify-between p-4 rounded-xl border transition-colors ${theme === 'dark' ? 'bg-[#181818] border-neutral-850 text-white' : 'bg-white border-neutral-200 shadow-sm text-black'}`}>
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${theme === 'dark' ? 'bg-[#131313]' : 'bg-neutral-100'}`}>
                                <LayoutTemplate className="w-5 h-5 text-neutral-400" />
                              </div>
                              <div>
                                <a 
                                  href={`/${card.category === 'carousels' ? 'carousels' : 'cards'}/${card.interactionType || card.id}`}
                                  onClick={(e) => {
                                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                                      e.preventDefault();
                                      navigateToChartDetail(card.interactionType || card.id, card.category === 'carousels' ? 'carousels' : 'cards');
                                    }
                                  }}
                                  className={`text-[14px] font-semibold no-underline ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                                >
                                  {card.label}
                                </a>
                                <div className={`text-[11px] ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>{card.description}</div>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleCopyCardCode(card)}
                              className={`p-2 rounded-lg cursor-pointer border-0 ${theme === 'dark' ? 'bg-white/[0.06] text-neutral-300 hover:bg-white/[0.1]' : 'bg-neutral-150 text-neutral-750 hover:bg-neutral-200'}`}
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Recommended Partner Card */}
            <div className="relative z-10 w-full max-w-[1240px] mx-auto mt-8 mb-14 px-4 sm:px-6">
              <div
                className={`relative w-full rounded-[24px] sm:rounded-[28px] p-6 sm:p-8 transition-all duration-300 border ${
                  theme === 'dark'
                    ? 'bg-[#181818] border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-white'
                    : 'bg-white border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] text-black'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1 min-w-0 flex flex-col gap-2 max-w-[700px]">
                    <p className={`m-0 text-[15px] sm:text-[16px] leading-[25px] font-normal transition-colors ${
                      theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'
                    }`}>
                      If you want to use beautiful ready-to-use UI components, I highly recommend{' '}
                      <a
                        href="https://oxygen-ui.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-semibold underline underline-offset-4 decoration-current transition-opacity hover:opacity-80 ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}
                      >
                        Oxygen UI
                      </a>
                      .
                    </p>

                    <div className="flex items-center gap-2 text-[13px] leading-[18px]">
                      <a
                        href="https://x.com/SubhanHQ"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-semibold hover:underline no-underline transition-colors ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}
                      >
                        Syed Subhan
                      </a>
                      <span className={theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}>·</span>
                      <span className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}>
                        Creator of Oxygen UI
                      </span>
                    </div>
                  </div>

                  <motion.a
                    href="https://oxygen-ui.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className={`inline-flex items-center justify-center gap-2 h-[42px] px-6 rounded-full font-medium text-[13px] leading-none no-underline transition-all duration-200 shrink-0 self-start md:self-center group cursor-pointer border ${
                      theme === 'dark'
                        ? 'bg-white text-black hover:bg-neutral-200 border-white/10 shadow-sm'
                        : 'bg-neutral-950 text-white hover:bg-neutral-800 border-neutral-800 shadow-sm'
                    }`}
                  >
                    <span>Get Oxygen UI</span>
                    <span className="inline-flex w-[14px] h-[14px]">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                        <path d="M7.5 2.5H4.5C3.39543 2.5 2.5 3.39543 2.5 4.5V11.5C2.5 12.6046 3.39543 13.5 4.5 13.5H11.5C12.6046 13.5 13.5 12.6046 13.5 11.5V8.5"></path>
                        <g className="transition-transform duration-250 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
                          <path d="M8.5 7.5L13.5 2.5M10 2.5H13.5V6"></path>
                        </g>
                      </svg>
                    </span>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crawlable Semantic Footer Hub as a Rounded Floating Card */}
      <footer className="relative z-10 w-full px-4 sm:px-6 mt-auto pb-8 pt-4">
        <div
          className={`w-full max-w-[1240px] mx-auto rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 transition-all duration-300 border ${
            theme === 'dark'
              ? 'bg-[#181818] border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_12px_40px_rgba(0,0,0,0.36)] text-white'
              : 'bg-white border-neutral-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] text-black'
          }`}
        >
          {/* Top 3-Column Info Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {/* Column 1: Navigation / Directory */}
            <div className="flex flex-col gap-3">
              <span className={`text-[11px] font-bold uppercase tracking-[0.14em] ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                Directory
              </span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] font-medium">
                <a href="/buttons" onClick={(e) => handleLinkClick(e, 'home', 'buttons')} className={`no-underline hover:underline transition-colors ${theme === 'dark' ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'}`}>Buttons</a>
                <a href="/cards" onClick={(e) => handleLinkClick(e, 'home', 'cards')} className={`no-underline hover:underline transition-colors ${theme === 'dark' ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'}`}>Card Spreads</a>
                <a href="/carousels" onClick={(e) => handleLinkClick(e, 'home', 'carousels')} className={`no-underline hover:underline transition-colors ${theme === 'dark' ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'}`}>3D Carousels</a>
                <a href="/loaders" onClick={(e) => handleLinkClick(e, 'home', 'loaders')} className={`no-underline hover:underline transition-colors ${theme === 'dark' ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'}`}>Loaders</a>
                <a href="/Anime" onClick={(e) => handleLinkClick(e, 'css-animations')} className={`no-underline hover:underline transition-colors ${theme === 'dark' ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'}`}>Anime</a>
                <a href="/text-animations" onClick={(e) => handleLinkClick(e, 'text-animations')} className={`no-underline hover:underline transition-colors ${theme === 'dark' ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'}`}>Text</a>
                <a href="/mono-charts" onClick={(e) => handleLinkClick(e, 'mono-charts')} className={`no-underline hover:underline transition-colors ${theme === 'dark' ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'}`}>Mono Charts</a>
                <a href="/dither-charts" onClick={(e) => handleLinkClick(e, 'dither-charts')} className={`no-underline hover:underline transition-colors ${theme === 'dark' ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'}`}>Dither Charts</a>
                <a href="/3d" onClick={(e) => handleLinkClick(e, '3d-page')} className={`no-underline hover:underline transition-colors ${theme === 'dark' ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'}`}>3D Spatial</a>
                <a href="/cli" onClick={(e) => handleLinkClick(e, 'cli')} className={`no-underline hover:underline transition-colors ${theme === 'dark' ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'}`}>CLI</a>
                <a href="/skills" onClick={(e) => handleLinkClick(e, 'skills')} className={`no-underline hover:underline transition-colors ${theme === 'dark' ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'}`}>Skills</a>
                <a href="/sponsors" onClick={(e) => handleLinkClick(e, 'sponsors')} className={`no-underline hover:underline transition-colors ${theme === 'dark' ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'}`}>Sponsors</a>
              </div>
            </div>

            {/* Column 2: Credits & Craft */}
            <div className="flex flex-col gap-3">
              <span className={`text-[11px] font-bold uppercase tracking-[0.14em] ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                Craft & Credits
              </span>
              <div className="flex flex-col gap-2 text-[13px] leading-[22px]">
                <p className="m-0">
                  <span className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}>Created by </span>
                  <a href="https://x.com/SubhanHQ" target="_blank" rel="noopener noreferrer" className={`font-semibold no-underline hover:underline ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Syed Subhan</a>
                </p>
                <p className="m-0">
                  <span className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}>Layout from </span>
                  <a href="https://transition.dev" target="_blank" rel="noopener noreferrer" className={`font-semibold no-underline hover:underline ${theme === 'dark' ? 'text-white' : 'text-black'}`}>transition.dev</a>
                  <span className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}> by </span>
                  <a href="https://x.com/Jakubantalik" target="_blank" rel="noopener noreferrer" className={`font-semibold no-underline hover:underline ${theme === 'dark' ? 'text-white' : 'text-black'}`}>@Jakubantalik</a>
                </p>
                <div className="flex items-center gap-2.5 pt-2">
                  <a
                    href="https://x.com/SubhanHQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center w-[34px] h-[34px] rounded-full border transition-all ${
                      theme === 'dark' ? 'border-white/10 hover:border-white/30 text-white hover:bg-white/[0.06]' : 'border-neutral-200 hover:border-black text-black hover:bg-black/[0.04]'
                    }`}
                    title="Twitter / X"
                  >
                    <svg viewBox="0 0 16 17" fill="currentColor" className="w-[13px] h-[14px]">
                      <path d="M12.4041 1.39726H14.6953L9.69087 7.2591L15.5781 15.2368H10.9696L7.35741 10.3996L3.22921 15.2368H0.934687L6.28641 8.96575L0.642598 1.39726H5.36795L8.62962 5.81859L12.4041 1.39726ZM11.5992 13.8329H12.8682L4.67667 2.72798H3.31359L11.5992 13.8329Z"></path>
                    </svg>
                  </a>
                  <a
                    href="https://github.com/Subhan-code/Amicro--Micro-transitions-"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center w-[34px] h-[34px] rounded-full border transition-all ${
                      theme === 'dark' ? 'border-white/10 hover:border-white/30 text-white hover:bg-white/[0.06]' : 'border-neutral-200 hover:border-black text-black hover:bg-black/[0.04]'
                    }`}
                    title="GitHub Repository"
                  >
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-[14px] h-[14px]">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 3: CLI Install Quick-Copy */}
            <div className="flex flex-col gap-3">
              <span className={`text-[11px] font-bold uppercase tracking-[0.14em] ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                Command Line
              </span>
              <p className={`m-0 text-[13px] leading-[21px] ${
                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
              }`}>
                Add any micro-interaction or transition directly to your React project with a single command.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('npx @subhanhq/amicro@latest add');
                    triggerHaptic('success');
                    showToast('Copied CLI command: npx @subhanhq/amicro@latest add');
                  }}
                  className={`group flex items-center justify-between w-full h-[40px] px-3.5 rounded-xl border text-[12px] font-mono cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'bg-[#121212] border-white/10 hover:border-white/20 text-neutral-300 hover:text-white'
                      : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300 text-neutral-800'
                  }`}
                  title="Click to copy CLI command"
                >
                  <span className="truncate">npx @subhanhq/amicro add</span>
                  <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 shrink-0 ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Giant Wordmark Display matching reference layout */}
          <div className="w-full overflow-hidden select-none pointer-events-none mt-10 sm:mt-14 pt-6 border-t border-black/[0.06] dark:border-white/[0.07]">
            <div className={`w-full text-center font-black tracking-[-0.04em] leading-[0.78] transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-black'
            } text-[20vw] sm:text-[18vw] md:text-[160px] lg:text-[200px]`}>
              AMICRO
            </div>
          </div>

          {/* Bottom Sub-bar */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 mt-2 text-[12px] transition-colors border-t border-black/[0.04] dark:border-white/[0.05]">
            <span className={theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}>
              © {new Date().getFullYear()} Amicro. All rights reserved.
            </span>
            <div className="flex items-center gap-3 text-[12px]">
              <a
                href="https://github.com/Subhan-code/Amicro--Micro-transitions-#readme"
                target="_blank"
                rel="noopener noreferrer"
                className={`no-underline hover:underline transition-colors ${
                  theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Terms & License
              </a>
              <span className={theme === 'dark' ? 'text-neutral-600' : 'text-neutral-300'}>·</span>
              <a
                href="https://x.com/SubhanHQ"
                target="_blank"
                rel="noopener noreferrer"
                className={`no-underline hover:underline transition-colors ${
                  theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
                }`}
              >
                @SubhanHQ
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Copy-Success Toast Alert */}
      <div className="fixed bottom-6 right-6 z-[100] pointer-events-none">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`px-4 py-3 rounded-xl border flex items-center gap-2.5 text-[13px] font-medium shadow-lg pointer-events-auto ${
                theme === 'dark' 
                  ? 'bg-[#181818] border-neutral-800 text-white shadow-black/20' 
                  : 'bg-white border-neutral-200 text-black shadow-neutral-200/50'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Analytics />
    </div>
  );
}
