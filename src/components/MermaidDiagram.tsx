'use client';

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  id?: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, id = 'mermaid-chart' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#0d1322',
        primaryColor: '#0891b2',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#06b6d4',
        lineColor: '#38bdf8',
        secondaryColor: '#1e293b',
        tertiaryColor: '#0f172a'
      }
    });

    if (containerRef.current) {
      containerRef.current.removeAttribute('data-processed');
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div className="w-full overflow-x-auto flex justify-center py-4 bg-[#0a0f1d] rounded-lg border border-slate-800">
      <div ref={containerRef} className="mermaid">
        {chart}
      </div>
    </div>
  );
};
