import { useEffect, useRef } from 'react';
import { CHART_COLORS } from '../../utils/constants';

interface NetworkNode { id: string; label: string; type: 'investor' | 'opportunity'; size: number }
interface NetworkEdge { source: string; target: string; weight: number }
interface Props { nodes: NetworkNode[]; edges: NetworkEdge[]; height?: number }

export default function SimilarityNetwork({ nodes, edges, height = 400 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = height;

    // Simple circular layout
    const positions: Record<string, { x: number; y: number }> = {};
    const investors = nodes.filter(n => n.type === 'investor');
    const opportunities = nodes.filter(n => n.type === 'opportunity');

    investors.forEach((node, i) => {
      const angle = (i / investors.length) * Math.PI * 2 - Math.PI / 2;
      positions[node.id] = { x: w / 2 + Math.cos(angle) * (w * 0.3), y: h / 2 + Math.sin(angle) * (h * 0.3) };
    });
    opportunities.forEach((node, i) => {
      const angle = (i / opportunities.length) * Math.PI * 2 - Math.PI / 2;
      positions[node.id] = { x: w / 2 + Math.cos(angle) * (w * 0.15), y: h / 2 + Math.sin(angle) * (h * 0.15) };
    });

    ctx.clearRect(0, 0, w, h);

    // Draw edges
    edges.forEach(edge => {
      const from = positions[edge.source];
      const to = positions[edge.target];
      if (!from || !to) return;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = `rgba(0, 151, 57, ${edge.weight * 0.5})`;
      ctx.lineWidth = edge.weight * 3;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(node => {
      const pos = positions[node.id];
      if (!pos) return;
      const radius = Math.max(8, node.size * 0.5);

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = node.type === 'investor' ? CHART_COLORS.green : CHART_COLORS.palette[3];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#374151';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, pos.x, pos.y + radius + 12);
    });
  }, [nodes, edges, height]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100%', height }} className="rounded-lg" />
      <div className="flex items-center justify-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.green }} />
          <span className="text-xs text-gray-500">Investors</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.palette[3] }} />
          <span className="text-xs text-gray-500">Opportunities</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-green-300" />
          <span className="text-xs text-gray-500">Match Strength</span>
        </div>
      </div>
    </div>
  );
}
