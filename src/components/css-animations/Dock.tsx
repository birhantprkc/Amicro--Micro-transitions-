import React, { useState, useRef } from "react";
import { Reorder, useMotionValue, useSpring, useTransform, MotionValue } from "motion/react";

const SOLID_COLORS = [
  "#2563eb", // Blue 600
  "#3b82f6", // Blue 500
  "#60a5fa", // Blue 400
  "#1d4ed8", // Blue 700
  "#0284c7", // Sky 600
  "#4f46e5", // Indigo 600
  "#6366f1", // Indigo 500
];

function DockItem({ 
  index,
  color,
  mouseX,
  theme = 'dark'
}: { 
  key?: React.Key;
  index: number;
  color: string; 
  mouseX: MotionValue<number>; 
  theme?: 'dark' | 'light';
}) {
  const ref = useRef<HTMLDivElement>(null);
  
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeSync = useTransform(distance, [-80, 0, 80], [28, 44, 28]);
  const size = useSpring(sizeSync, { mass: 0.1, stiffness: 220, damping: 16 });

  return (
    <Reorder.Item 
      value={color} 
      id={color}
      className="rounded-lg cursor-grab active:cursor-grabbing origin-bottom shrink-0 select-none"
      style={{ width: size, height: size }}
    >
      <div 
        ref={ref}
        className={`flex h-full w-full items-center justify-center rounded-[10px] p-0.5 shadow-sm transition-all duration-300 ${
          theme === 'dark'
            ? 'border border-neutral-700/80 bg-neutral-800 hover:bg-neutral-700'
            : 'border border-neutral-200 bg-white hover:bg-neutral-50 shadow-sm'
        }`}
      >
        <div 
          className="h-full w-full rounded-[8px] pointer-events-none transition-transform duration-200"
          style={{ backgroundColor: color }} 
        />
      </div>
    </Reorder.Item>
  );
}

export interface DockProps {
  theme?: 'dark' | 'light';
  className?: string;
}

export function Dock({ theme = 'dark', className = '' }: DockProps) {
  const [items, setItems] = useState(SOLID_COLORS);
  const mouseX = useMotionValue(Infinity);

  return (
    <div 
      className={`box-content flex h-[32px] w-fit items-end gap-1 rounded-xl p-1.5 transition-all duration-300 ${
        theme === 'dark' 
          ? 'border border-neutral-800 bg-[#141414] shadow-md shadow-black/30' 
          : 'border border-neutral-200 bg-neutral-100 shadow-sm'
      } ${className}`}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      <Reorder.Group 
        axis="x" 
        values={items} 
        onReorder={setItems}
        className="flex h-full items-end gap-[5px]"
      >
        {items.map((color, idx) => (
          <DockItem 
            key={color} 
            index={idx}
            color={color} 
            mouseX={mouseX} 
            theme={theme}
          />
        ))}
      </Reorder.Group>
    </div>
  );
}
