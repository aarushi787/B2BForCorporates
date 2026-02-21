import React, { useEffect, useRef, useState } from 'react';
import { ResponsiveContainer } from 'recharts';

interface SafeResponsiveContainerProps {
  minHeight?: number;
  className?: string;
  children: React.ReactElement;
}

const SafeResponsiveContainer: React.FC<SafeResponsiveContainerProps> = ({
  minHeight = 240,
  className = 'h-full w-full min-w-0',
  children,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const measure = () => {
      const rect = host.getBoundingClientRect();
      setIsReady(rect.width > 0 && rect.height > 0);
    };

    measure();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure);
      observer.observe(host);
      return () => observer.disconnect();
    }

    const interval = window.setInterval(measure, 250);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div ref={hostRef} className={className} style={{ minHeight }}>
      {isReady ? (
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={minHeight}>
          {children}
        </ResponsiveContainer>
      ) : (
        <div className="h-full w-full animate-pulse rounded-2xl bg-gray-50" />
      )}
    </div>
  );
};

export default SafeResponsiveContainer;

