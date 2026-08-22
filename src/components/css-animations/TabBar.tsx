import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Calendar, Bell } from "lucide-react";

const TABS = [
  { id: "inbox", label: "Inbox", icon: Mail, colorDark: "text-blue-400", colorLight: "text-blue-600", activeBgDark: "bg-blue-500/15 border-blue-500/30", activeBgLight: "bg-blue-50 border-blue-200" },
  { id: "calendar", label: "Calendar", icon: Calendar, colorDark: "text-purple-400", colorLight: "text-purple-600", activeBgDark: "bg-purple-500/15 border-purple-500/30", activeBgLight: "bg-purple-50 border-purple-200" },
  { id: "notifications", label: "Alerts", icon: Bell, colorDark: "text-rose-400", colorLight: "text-rose-600", activeBgDark: "bg-rose-500/15 border-rose-500/30", activeBgLight: "bg-rose-50 border-rose-200" },
];

export interface TabBarProps {
  theme?: "dark" | "light";
  className?: string;
}

export function TabBar({ theme = "dark", className = "" }: TabBarProps) {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="group relative flex h-fit w-fit items-center gap-2 outline-none cursor-pointer border-0 bg-transparent p-0"
          >
            <motion.div
              layout
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              className={`flex items-center justify-center overflow-hidden py-[8px] transition-all duration-200 ease-in-out border ${
                isActive 
                  ? (theme === "dark" 
                      ? `${tab.colorDark} ${tab.activeBgDark} shadow-[0_4px_16px_rgba(0,0,0,0.3)]` 
                      : `${tab.colorLight} ${tab.activeBgLight} shadow-sm`)
                  : (theme === "dark"
                      ? "text-neutral-400 border-transparent bg-neutral-900/60 hover:bg-neutral-800/80 hover:text-white"
                      : "text-neutral-500 border-transparent bg-neutral-100 hover:bg-white hover:text-neutral-800 shadow-sm")
              }`}
              style={{
                borderRadius: 24,
                paddingLeft: isActive ? 16 : 12,
                paddingRight: isActive ? 16 : 12,
              }}
            >
              <motion.div layout className="flex shrink-0 items-center justify-center">
                <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: "auto", marginLeft: 8 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex items-center overflow-hidden"
                >
                  <span className="whitespace-nowrap text-[13px] font-semibold">
                    {tab.label}
                  </span>
                </motion.div>
              )}
            </motion.div>
          </button>
        );
      })}
    </div>
  );
}
