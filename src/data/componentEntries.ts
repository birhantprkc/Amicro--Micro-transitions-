export interface ComponentProp {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface ComponentItem {
  id: string;
  name: string;
  href: string;
  registry: string;
  category: 'buttons' | 'cards' | 'loaders' | 'dither-charts' | 'mono-charts';
  categoryLabel: string;
  description: string;
  source: string;
  dependencies: string[];
  interaction: string;
  usage: string;
  props: ComponentProp[];
}

export const KNOWN_COMPONENT_ENTRIES: Record<string, ComponentItem> = {
  // Buttons
  'btn-1': {
    id: 'btn-1',
    name: 'Mac Slide Arrow Button',
    href: '/components/btn-1',
    registry: 'button-slide-arrow',
    category: 'buttons',
    categoryLabel: 'Button Interaction',
    description: 'Apple Mac inspired call-to-action button featuring smooth arrow slide transition on hover.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/AnimatedButton.tsx',
    dependencies: ['motion', 'lucide-react'],
    interaction: 'Hover to observe smooth arrow displacement and background color pulse.',
    usage: `import { AnimatedButton } from "@/components/ui/animated-button";\n\nexport default function Demo() {\n  return (\n    <AnimatedButton\n      config={{\n        id: '1',\n        label: 'Download for Mac',\n        interactionType: 'slide-arrow',\n      }}\n      layoutMode="grid"\n    />\n  );\n}`,
    props: [
      { name: 'config', type: 'ButtonConfig', default: 'required', description: 'Button configuration object detailing label and interaction type.' },
      { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Visual color theme mode for button container.' },
      { name: 'layoutMode', type: "'grid' | 'list' | 'matrix'", default: "'grid'", description: 'Sizing scale mode matching catalog grid layout.' },
    ],
  },

  // Cards
  'card-arc-5': {
    id: 'card-arc-5',
    name: 'Arc 5-Card Fan',
    href: '/components/card-arc-5',
    registry: 'card-arc-5',
    category: 'cards',
    categoryLabel: 'Card Spread Layout',
    description: 'Fanned card layout forming a neat curved arc with 5 layered elements.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/cards/CardArc5.tsx',
    dependencies: ['motion'],
    interaction: 'Hover over card container to trigger radial arc spread animation.',
    usage: `import { CardArc5 } from "@/components/cards/CardArc5";\n\nexport default function Demo() {\n  return <CardArc5 hovered={true} />;\n}`,
    props: [
      { name: 'hovered', type: 'boolean', default: 'false', description: 'Toggles spread animation state on hover.' },
      { name: 'className', type: 'string', default: '""', description: 'Additional CSS Tailwind utility classes.' },
    ],
  },
  'card-carousel': {
    id: 'card-carousel',
    name: '3D Cylinder Carousel',
    href: '/components/card-carousel',
    registry: 'card-carousel',
    category: 'cards',
    categoryLabel: '3D Carousel',
    description: 'Interactive 3D cylindrical carousel card stack with depth perspective rotation.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/cards/CardCarousel.tsx',
    dependencies: ['motion'],
    interaction: 'Hover or swipe to rotate cylinder cards in 3D space.',
    usage: `import { CardCarousel } from "@/components/cards/CardCarousel";\n\nexport default function Demo() {\n  return <CardCarousel hovered={true} />;\n}`,
    props: [
      { name: 'hovered', type: 'boolean', default: 'false', description: 'Triggers 3D carousel spin and spread perspective.' },
      { name: 'isMonochrome', type: 'boolean', default: 'false', description: 'Renders high-contrast monochrome card style.' },
    ],
  },
  'card-cover-flow': {
    id: 'card-cover-flow',
    name: '3D Cover Flow',
    href: '/components/card-cover-flow',
    registry: 'card-cover-flow',
    category: 'cards',
    categoryLabel: '3D Cover Flow',
    description: 'Classic iTunes cover flow 3D album art stack featuring depth perspective angles.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/cards/CardCoverFlow.tsx',
    dependencies: ['motion'],
    interaction: 'Hover to slide cover flow stack and shift perspective angles.',
    usage: `import { CardCoverFlow } from "@/components/cards/CardCoverFlow";\n\nexport default function Demo() {\n  return <CardCoverFlow hovered={true} />;\n}`,
    props: [
      { name: 'hovered', type: 'boolean', default: 'false', description: 'Triggers cover flow perspective shift.' },
      { name: 'isMonochrome', type: 'boolean', default: 'false', description: 'Renders sleek monochrome card styling.' },
    ],
  },

  // Mono Charts
  'mono-rounded-line': {
    id: 'mono-rounded-line',
    name: 'Mono Rounded Spline Line',
    href: '/components/mono-rounded-line',
    registry: 'mono-rounded-line',
    category: 'mono-charts',
    categoryLabel: 'Mono Chart',
    description: 'Minimalist monochromatic line chart with smooth rounded spline curves and rounded stroke caps.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/mono-charts/MonoRoundedLineChart.tsx',
    dependencies: ['motion', 'recharts', 'lucide-react'],
    interaction: 'Toggle between Dual and Single series baseline filters to observe spline curves.',
    usage: `import { MonoRoundedLineChart } from "@/components/ui/mono-rounded-line";\n\nexport default function Demo() {\n  return <MonoRoundedLineChart theme="dark" />;\n}`,
    props: [
      { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color palette mode matching the Amicro theme.' },
      { name: 'compact', type: 'boolean', default: 'false', description: 'Renders condensed 220px height for grid showcase cards.' },
    ],
  },
  'mono-rounded-bar': {
    id: 'mono-rounded-bar',
    name: 'Mono Rounded Pill Pillars',
    href: '/components/mono-rounded-bar',
    registry: 'mono-rounded-bar',
    category: 'mono-charts',
    categoryLabel: 'Mono Chart',
    description: 'Minimalist monochromatic bar chart with full corner radii pill columns and vertical/horizontal layout switches.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/mono-charts/MonoRoundedBarChart.tsx',
    dependencies: ['motion', 'recharts', 'lucide-react'],
    interaction: 'Click Col / Row buttons to toggle column pillar layout direction dynamically.',
    usage: `import { MonoRoundedBarChart } from "@/components/ui/mono-rounded-bar";\n\nexport default function Demo() {\n  return <MonoRoundedBarChart theme="dark" />;\n}`,
    props: [
      { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color palette mode matching the Amicro theme.' },
      { name: 'compact', type: 'boolean', default: 'false', description: 'Renders condensed 220px height for grid showcase cards.' },
    ],
  },
  'mono-rounded-donut': {
    id: 'mono-rounded-donut',
    name: 'Mono Rounded Donut Ring',
    href: '/components/mono-rounded-donut',
    registry: 'mono-rounded-donut',
    category: 'mono-charts',
    categoryLabel: 'Mono Chart',
    description: 'Minimalist monochromatic donut chart with rounded segment endcaps, generous spacing, and center metric numbers.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/mono-charts/MonoRoundedDonutChart.tsx',
    dependencies: ['motion', 'recharts', 'lucide-react'],
    interaction: 'Hover over segment arcs to scale segment radii and inspect center values.',
    usage: `import { MonoRoundedDonutChart } from "@/components/ui/mono-rounded-donut";\n\nexport default function Demo() {\n  return <MonoRoundedDonutChart theme="dark" />;\n}`,
    props: [
      { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color palette mode matching the Amicro theme.' },
      { name: 'compact', type: 'boolean', default: 'false', description: 'Renders condensed 220px height for grid showcase cards.' },
    ],
  },

  // Dither Charts
  'dither-donut': {
    id: 'dither-donut',
    name: 'Dither Donut Chart',
    href: '/components/dither-donut',
    registry: 'dither-donut',
    category: 'dither-charts',
    categoryLabel: 'Dither Visualizer',
    description: 'Retro 1-bit ordered Bayer matrix dithered donut ring with canvas dithering shaders and hover segment callouts.',
    source: 'https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/dither-charts/DitherDonutChart.tsx',
    dependencies: ['motion', 'lucide-react'],
    interaction: 'Click time period pills (Week, Month, Quarter, Year) to animate segment data.',
    usage: `import { DitherDonutChart } from "@/components/ui/dither-donut";\n\nexport default function Demo() {\n  return <DitherDonutChart theme="dark" />;\n}`,
    props: [
      { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color palette mode matching the Amicro theme.' },
      { name: 'compact', type: 'boolean', default: 'false', description: 'Renders condensed 220px height for grid showcase cards.' },
    ],
  },
};

export function getComponentEntry(id: string): ComponentItem {
  if (KNOWN_COMPONENT_ENTRIES[id]) {
    return KNOWN_COMPONENT_ENTRIES[id];
  }

  // Fallback metadata generator for any component ID across the app
  const isDither = id.includes('dither') || id.includes('gauge') || id.includes('heatmap') || id.includes('bubble');
  const isMono = id.startsWith('mono-');
  const isCard = id.startsWith('card-') || id.startsWith('c');
  const isButton = id.startsWith('btn-') || !isNaN(Number(id));

  let category: ComponentItem['category'] = 'mono-charts';
  let categoryLabel = 'Mono Chart';

  if (isDither) {
    category = 'dither-charts';
    categoryLabel = 'Dither Visualizer';
  } else if (isCard) {
    category = 'cards';
    categoryLabel = 'Card Spread';
  } else if (isButton) {
    category = 'buttons';
    categoryLabel = 'Button Micro-Interaction';
  } else if (id.includes('loader') || id.includes('dot') || id.includes('spinner')) {
    category = 'loaders';
    categoryLabel = 'Loader Animation';
  }

  const name = id
    .replace(/^(c|btn|loader|mono|dither)-/, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    id,
    name: name || 'Micro Component',
    href: `/components/${id}`,
    registry: id,
    category,
    categoryLabel,
    description: `A curated ${categoryLabel.toLowerCase()} component built with React, Motion, and tailored physics parameters.`,
    source: `https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/${id}.tsx`,
    dependencies: ['motion', 'lucide-react'],
    interaction: 'Interact with controls, hover over elements, and toggle themes to observe visual motion states.',
    usage: `import { ${name.replace(/\s+/g, '')} } from "@/components/ui/${id}";\n\nexport default function Demo() {\n  return <${name.replace(/\s+/g, '')} theme="dark" />;\n}`,
    props: [
      { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color palette theme mode.' },
      { name: 'className', type: 'string', default: '""', description: 'Additional custom Tailwind CSS utility classes.' },
    ],
  };
}
