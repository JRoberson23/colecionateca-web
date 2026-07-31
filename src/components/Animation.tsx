"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";

interface AnimationProps {
  src: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  width?: number;
  height?: number;
}

export default function Animation({
  src,
  className = "w-12 h-12",
  loop = true,
  autoplay = true,
  width,
  height,
}: AnimationProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <DotLottieReact
      src={src}
      loop={loop}
      autoplay={autoplay}
      className={className}
      style={width && height ? { width, height } : undefined}
    />
  );
}