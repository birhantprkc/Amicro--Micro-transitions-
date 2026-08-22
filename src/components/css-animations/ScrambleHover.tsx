import React, { useState, useEffect, useRef, useCallback } from "react";

export interface ScrambleHoverProps {
  text: string;
  scrambleSpeed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  className?: string;
  characters?: string;
  scrambledClassName?: string;
}

export function ScrambleHover({
  text,
  scrambleSpeed = 40,
  maxIterations = 10,
  sequential = false,
  revealDirection = "start",
  useOriginalCharsOnly = true,
  className = "",
  characters = "ABCDEFGHIJKLMNO PQRSTUVWXYZ abcdefghijklmno pqrstuvwxyz 0123456789 !@#$%^&*()_+",
  scrambledClassName = "",
}: ScrambleHoverProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const triggerScramble = useCallback(() => {
    let iteration = 0;
    const maxIterationsTotal = sequential 
      ? (revealDirection === "center" ? Math.ceil(text.length / 2) : text.length) 
      : maxIterations;
      
    setIsScrambling(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setDisplayText(() => {
        const nextText = text.split("").map((char, index) => {
          if (char === " ") return " ";
          
          if (sequential) {
            let revealed = false;
            if (revealDirection === "start") {
              revealed = index < iteration;
            } else if (revealDirection === "end") {
              revealed = index >= text.length - iteration;
            } else if (revealDirection === "center") {
              const center = Math.floor(text.length / 2);
              revealed = Math.abs(index - center) <= iteration;
            }
            if (revealed) return text[index];
          } else {
            if (iteration >= maxIterations) {
              return text[index];
            }
          }

          if (useOriginalCharsOnly) {
            const availableChars = text.replace(/\s/g, "");
            const randomChar = availableChars[Math.floor(Math.random() * availableChars.length)];
            return randomChar || text[index];
          } else {
            return characters[Math.floor(Math.random() * characters.length)];
          }
        }).join("");

        return nextText;
      });

      iteration++;

      if (
        (!sequential && iteration > maxIterations) || 
        (sequential && iteration >= maxIterationsTotal)
      ) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, scrambleSpeed);
  }, [text, scrambleSpeed, maxIterations, sequential, revealDirection, useOriginalCharsOnly, characters]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span
      className={`cursor-pointer transition-colors duration-150 ${isScrambling && scrambledClassName ? scrambledClassName : className}`}
      onMouseEnter={triggerScramble}
    >
      {displayText}
    </span>
  );
}

export function ScrambleHoverDemo({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center select-none">
      <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
        <ScrambleHover 
          text="DECODE THE UNIVERSE" 
          characters="!<>-_\\/[]{}—=+*^?#________" 
          useOriginalCharsOnly={false}
          scrambleSpeed={35}
          scrambledClassName="text-indigo-400 font-mono"
        />
      </div>
      <div className={`flex flex-wrap justify-center gap-3 text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
        <span className={`px-3 py-1.5 rounded-full border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'}`}>
          <ScrambleHover text="Hover to scramble" />
        </span>
        <span className={`px-3 py-1.5 rounded-full border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'}`}>
          <ScrambleHover text="Sequential reveal" sequential={true} />
        </span>
        <span className={`px-3 py-1.5 rounded-full border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'}`}>
          <ScrambleHover text="Center expansion" sequential={true} revealDirection="center" />
        </span>
      </div>
    </div>
  );
}
