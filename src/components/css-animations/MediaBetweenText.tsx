import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from "react";
import { motion, useInView, Variants, UseInViewOptions } from "motion/react";

export interface MediaBetweenTextRef {
  animate: () => void;
  reset: () => void;
}

export interface MediaBetweenTextProps {
  firstText: string;
  secondText: string;
  mediaUrl: string;
  mediaType?: "image" | "video";
  mediaContainerClassName?: string;
  fallbackUrl?: string;
  as?: React.ElementType;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  alt?: string;
  triggerType?: "hover" | "ref" | "inView";
  containerRef?: React.RefObject<Element>;
  useInViewOptionsProp?: UseInViewOptions;
  animationVariants?: {
    initial: any;
    animate: any;
  };
  className?: string;
  leftTextClassName?: string;
  rightTextClassName?: string;
}

export const MediaBetweenText = forwardRef<MediaBetweenTextRef, MediaBetweenTextProps>(
  (
    {
      firstText,
      secondText,
      mediaUrl,
      mediaType = "image",
      mediaContainerClassName = "h-[32px] sm:h-[40px] rounded-xl mx-2 shadow-md inline-block",
      fallbackUrl,
      as: Component = "div",
      autoPlay = true,
      loop = true,
      muted = true,
      playsInline = true,
      alt,
      triggerType = "hover",
      containerRef,
      useInViewOptionsProp,
      animationVariants = {
        initial: { width: 0, opacity: 0, scale: 0.8 },
        animate: {
          width: "auto",
          opacity: 1,
          scale: 1,
          transition: { duration: 0.35, type: "spring", bounce: 0.15 },
        },
      },
      className = "inline-flex items-center cursor-pointer select-none",
      leftTextClassName = "",
      rightTextClassName = "",
    },
    ref
  ) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(elementRef, useInViewOptionsProp || { once: true, amount: 0.5, root: containerRef });

    useImperativeHandle(ref, () => ({
      animate: () => setIsAnimating(true),
      reset: () => setIsAnimating(false),
    }));

    useEffect(() => {
      if (triggerType === "inView") {
        setIsAnimating(isInView);
      }
    }, [triggerType, isInView]);

    const handleMouseEnter = () => {
      if (triggerType === "hover") setIsAnimating(true);
    };

    const handleMouseLeave = () => {
      if (triggerType === "hover") setIsAnimating(false);
    };

    return (
      <Component
        ref={elementRef}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.span layout className={leftTextClassName}>
          {firstText}
        </motion.span>
        <motion.div
          initial="initial"
          animate={isAnimating ? "animate" : "initial"}
          variants={animationVariants as Variants}
          className={mediaContainerClassName}
          style={{ overflow: "hidden", display: "inline-flex", justifyContent: "center", alignItems: "center", verticalAlign: "middle" }}
        >
          {mediaType === "image" ? (
            <img src={mediaUrl} alt={alt || ""} className="h-full w-[54px] sm:w-[70px] object-cover rounded-[inherit]" />
          ) : (
            <video
              src={mediaUrl}
              autoPlay={autoPlay}
              loop={loop}
              muted={muted}
              playsInline={playsInline}
              poster={fallbackUrl}
              className="h-full w-[54px] sm:w-[70px] object-cover rounded-[inherit]"
            />
          )}
        </motion.div>
        <motion.span layout className={rightTextClassName}>
          {secondText}
        </motion.span>
      </Component>
    );
  }
);

MediaBetweenText.displayName = "MediaBetweenText";

export function MediaBetweenTextDemo({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center text-xl sm:text-2xl font-bold tracking-tight ${
      theme === 'dark' ? 'text-white' : 'text-neutral-900'
    }`}>
      <div className="flex flex-wrap items-center justify-center gap-y-2">
        <MediaBetweenText
          firstText="Crafting"
          secondText="delightful"
          mediaUrl="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80"
          className="inline-flex items-center mr-2"
          leftTextClassName="mr-1"
          rightTextClassName="ml-1"
        />
        <MediaBetweenText
          firstText="user"
          secondText="experiences"
          mediaUrl="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=160&auto=format&fit=crop&q=80"
          className="inline-flex items-center"
          leftTextClassName="mr-1"
          rightTextClassName="ml-1"
        />
      </div>
      <p className={`text-xs font-normal mt-3 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
        Hover across the words above to reveal inline visual media.
      </p>
    </div>
  );
}
