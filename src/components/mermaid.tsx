'use client';

import { useEffect, useId, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
});

export function Mermaid({ chart }: MermaidProps) {
  const id = useId().replace(/:/g, '');
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    mermaid.render(`mermaid-${id}`, chart).then(({ svg }) => {
      setSvg(svg);
    });
  }, [chart, id]);

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}
