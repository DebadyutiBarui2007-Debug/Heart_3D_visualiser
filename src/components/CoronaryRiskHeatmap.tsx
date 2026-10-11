import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { PatientData } from '../types/cardio';
import { Activity, Info, ZoomIn, Eye } from 'lucide-react';

interface CoronaryRiskHeatmapProps {
  patient: PatientData;
  onSelectSegment?: (vessel: 'LAD' | 'LCX' | 'RCA', segmentName: string) => void;
}

interface SegmentData {
  vessel: 'LAD' | 'LCX' | 'RCA' | 'LM';
  segmentName: string;
  segmentId: string;
  depth: 'Ostial' | 'Proximal' | 'Mid' | 'Distal' | 'Branch';
  stenosis: number; // 0 - 100%
  ffr: number;
  perfusionTerritory: string;
  plaqueType: string;
}

export const CoronaryRiskHeatmap: React.FC<CoronaryRiskHeatmapProps> = ({
  patient,
  onSelectSegment,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<SegmentData | null>(null);
  const [viewMode, setViewMode] = useState<'matrix' | 'anatomical'>('matrix');

  // Derive anatomically realistic segment-level stenosis from patient's vessel probabilities
  const segments: SegmentData[] = React.useMemo(() => {
    const ladBase = patient.ladStenosis;
    const lcxBase = patient.lcxStenosis;
    const rcaBase = patient.rcaStenosis;

    return [
      // Left Main Trunk
      {
        vessel: 'LM',
        segmentName: 'Left Main Trunk (LM)',
        segmentId: 'Seg-5',
        depth: 'Ostial',
        stenosis: Math.round(Math.min(95, Math.max(5, (ladBase * 0.45 + lcxBase * 0.35)))),
        ffr: Number((0.95 - (ladBase * 0.45 + lcxBase * 0.35) * 0.003).toFixed(2)),
        perfusionTerritory: 'Entire Left Ventricular Mass',
        plaqueType: 'Fibrocalcific',
      },
      // LAD Segments (Anterior wall)
      {
        vessel: 'LAD',
        segmentName: 'Proximal LAD (Seg 6)',
        segmentId: 'Seg-6',
        depth: 'Proximal',
        stenosis: ladBase,
        ffr: patient.ffrEstimate,
        perfusionTerritory: 'Anterior Septum & LV Apex',
        plaqueType: ladBase >= 50 ? 'Necrotic Core / Soft Plaque' : 'Fibrous',
      },
      {
        vessel: 'LAD',
        segmentName: 'Mid LAD (Seg 7)',
        segmentId: 'Seg-7',
        depth: 'Mid',
        stenosis: Math.round(Math.max(5, ladBase * 0.78)),
        ffr: Number(Math.min(1.0, patient.ffrEstimate + 0.08).toFixed(2)),
        perfusionTerritory: 'Mid-Anterior Wall',
        plaqueType: 'Fibro-fatty',
      },
      {
        vessel: 'LAD',
        segmentName: 'Distal LAD (Seg 8)',
        segmentId: 'Seg-8',
        depth: 'Distal',
        stenosis: Math.round(Math.max(5, ladBase * 0.52)),
        ffr: Number(Math.min(1.0, patient.ffrEstimate + 0.16).toFixed(2)),
        perfusionTerritory: 'Apical Cap Perfusion',
        plaqueType: 'Intimal Thickening',
      },
      {
        vessel: 'LAD',
        segmentName: 'First Diagonal D1 (Seg 9)',
        segmentId: 'Seg-9',
        depth: 'Branch',
        stenosis: Math.round(Math.max(5, ladBase * 0.68)),
        ffr: Number(Math.min(1.0, patient.ffrEstimate + 0.11).toFixed(2)),
        perfusionTerritory: 'High Anterolateral Wall',
        plaqueType: 'Calcified Bifurcation',
      },
      // LCX Segments (Lateral and posterior walls)
      {
        vessel: 'LCX',
        segmentName: 'Proximal LCX (Seg 11)',
        segmentId: 'Seg-11',
        depth: 'Proximal',
        stenosis: lcxBase,
        ffr: Number((0.98 - lcxBase * 0.0035).toFixed(2)),
        perfusionTerritory: 'Posterolateral Myocardium',
        plaqueType: lcxBase >= 50 ? 'Complex Stenosis' : 'Fibrocalcific',
      },
      {
        vessel: 'LCX',
        segmentName: 'Obtuse Marginal 1 OM1 (Seg 12)',
        segmentId: 'Seg-12',
        depth: 'Branch',
        stenosis: Math.round(Math.max(5, lcxBase * 0.88)),
        ffr: Number((0.98 - lcxBase * 0.003).toFixed(2)),
        perfusionTerritory: 'Lateral Free Wall',
        plaqueType: 'Eccentric Plaque',
      },
      {
        vessel: 'LCX',
        segmentName: 'Mid/Distal LCX (Seg 13)',
        segmentId: 'Seg-13',
        depth: 'Mid',
        stenosis: Math.round(Math.max(5, lcxBase * 0.65)),
        ffr: Number((0.99 - lcxBase * 0.002).toFixed(2)),
        perfusionTerritory: 'Inferolateral Segment',
        plaqueType: 'Fibrous',
      },
      {
        vessel: 'LCX',
        segmentName: 'Obtuse Marginal 2 OM2 (Seg 14)',
        segmentId: 'Seg-14',
        depth: 'Distal',
        stenosis: Math.round(Math.max(5, lcxBase * 0.45)),
        ffr: 0.92,
        perfusionTerritory: 'Distal Lateral Basal Wall',
        plaqueType: 'Mild Intimal',
      },
      // RCA Segments (Right and inferior walls)
      {
        vessel: 'RCA',
        segmentName: 'Proximal RCA (Seg 1)',
        segmentId: 'Seg-1',
        depth: 'Proximal',
        stenosis: rcaBase,
        ffr: Number((0.98 - rcaBase * 0.0036).toFixed(2)),
        perfusionTerritory: 'Right Ventricle & Ostium',
        plaqueType: rcaBase >= 50 ? 'Ulcerated Plaque' : 'Fibroatheroma',
      },
      {
        vessel: 'RCA',
        segmentName: 'Mid RCA (Seg 2)',
        segmentId: 'Seg-2',
        depth: 'Mid',
        stenosis: Math.round(Math.max(5, rcaBase * 0.85)),
        ffr: Number((0.98 - rcaBase * 0.0028).toFixed(2)),
        perfusionTerritory: 'Acute Marginal RV Zone',
        plaqueType: 'Concentric Fibrous',
      },
      {
        vessel: 'RCA',
        segmentName: 'Distal RCA (Seg 3)',
        segmentId: 'Seg-3',
        depth: 'Distal',
        stenosis: Math.round(Math.max(5, rcaBase * 0.62)),
        ffr: Number((0.99 - rcaBase * 0.002).toFixed(2)),
        perfusionTerritory: 'Crux Cordis Region',
        plaqueType: 'Calcified',
      },
      {
        vessel: 'RCA',
        segmentName: 'Posterior Descending PDA (Seg 4)',
        segmentId: 'Seg-4',
        depth: 'Branch',
        stenosis: Math.round(Math.max(5, rcaBase * 0.72)),
        ffr: Number((0.98 - rcaBase * 0.0025).toFixed(2)),
        perfusionTerritory: 'Inferior Septum & Base',
        plaqueType: 'Bifurcation Core',
      },
    ];
  }, [patient]);

  // D3 Color Scale adhering strictly to Blueprint Page 4:
  // <30% Low Risk (Green), 30%-49% Moderate (Yellow), >=50% Stenosis (Red)
  const colorScale = (val: number) => {
    if (val < 30) {
      return d3.interpolateRgb('#0a3d31', '#10b981')(val / 30);
    } else if (val < 50) {
      return d3.interpolateRgb('#5c3b00', '#ffb95f')((val - 30) / 20);
    } else {
      return d3.interpolateRgb('#8b0014', '#ff1744')((val - 50) / 50);
    }
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth || 600;
    const margin = { top: 32, right: 28, bottom: 44, left: 68 };
    const width = containerWidth - margin.left - margin.right;
    const height = 190 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .attr('width', containerWidth)
      .attr('height', 190)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const vessels: ('LM' | 'LAD' | 'LCX' | 'RCA')[] = ['LM', 'LAD', 'LCX', 'RCA'];
    const depths: ('Ostial' | 'Proximal' | 'Mid' | 'Distal' | 'Branch')[] = [
      'Ostial',
      'Proximal',
      'Mid',
      'Distal',
      'Branch',
    ];

    const x = d3.scaleBand().domain(depths).range([0, width]).padding(0.08);
    const y = d3.scaleBand().domain(vessels).range([0, height]).padding(0.12);

    // X Axis (Depth / Branch Level)
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call((axis) => axis.select('.domain').attr('stroke', '#3d494c'))
      .selectAll('text')
      .attr('fill', '#bcc9cd')
      .attr('font-size', '10px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('dy', '10px');

    // Y Axis (Vessel Trunk)
    g.append('g')
      .call(d3.axisLeft(y).tickSize(0))
      .call((axis) => axis.select('.domain').attr('stroke', '#3d494c'))
      .selectAll('text')
      .attr('fill', '#dae2fd')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('font-family', 'Plus Jakarta Sans, sans-serif')
      .attr('dx', '-6px');

    // Create a matrix mapping: each (vessel, depth) cell
    const cellData: { vessel: 'LM' | 'LAD' | 'LCX' | 'RCA'; depth: SegmentData['depth']; segment?: SegmentData }[] = [];
    vessels.forEach((v) => {
      depths.forEach((d) => {
        const seg = segments.find((s) => s.vessel === v && s.depth === d);
        cellData.push({ vessel: v, depth: d, segment: seg });
      });
    });

    // Heatmap Cells
    const cells = g
      .selectAll('.heatmap-cell')
      .data(cellData)
      .enter()
      .append('g')
      .attr('class', 'heatmap-cell')
      .attr('transform', (d) => `translate(${x(d.depth) || 0}, ${y(d.vessel) || 0})`);

    // Rectangles with rounded corners & D3 color interpolation
    cells
      .append('rect')
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', (d) => (d.segment ? colorScale(d.segment.stenosis) : '#131b2e'))
      .attr('stroke', (d) =>
        d.segment && d.segment.stenosis >= 50
          ? 'rgba(255, 23, 68, 0.7)'
          : d.segment && d.segment.stenosis >= 30
          ? 'rgba(255, 185, 95, 0.4)'
          : 'rgba(76, 215, 246, 0.25)'
      )
      .attr('stroke-width', (d) => (d.segment && d.segment.stenosis >= 50 ? 1.5 : 1))
      .attr('cursor', (d) => (d.segment ? 'pointer' : 'default'))
      .style('transition', 'all 0.2s ease')
      .on('mouseenter', function (event, d) {
        if (!d.segment) return;
        d3.select(this)
          .attr('stroke', '#4cd7f6')
          .attr('stroke-width', 2)
          .style('filter', 'drop-shadow(0 0 8px rgba(76, 215, 246, 0.6))');
        setSelectedSegment(d.segment);
      })
      .on('mouseleave', function (event, d) {
        if (!d.segment) return;
        d3.select(this)
          .attr('stroke', (d.segment.stenosis >= 50 ? 'rgba(255, 23, 68, 0.7)' : d.segment.stenosis >= 30 ? 'rgba(255, 185, 95, 0.4)' : 'rgba(76, 215, 246, 0.25)'))
          .attr('stroke-width', (d.segment.stenosis >= 50 ? 1.5 : 1))
          .style('filter', 'none');
      })
      .on('click', (event, d) => {
        if (d.segment && onSelectSegment) {
          onSelectSegment(d.segment.vessel === 'LM' ? 'LAD' : d.segment.vessel, d.segment.segmentName);
        }
      });

    // Inner Text labels showing Stenosis %
    cells
      .append('text')
      .attr('x', x.bandwidth() / 2)
      .attr('y', y.bandwidth() / 2 + 4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '11px')
      .attr('font-weight', '700')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('pointer-events', 'none')
      .text((d) => (d.segment ? `${d.segment.stenosis}%` : '—'));

    // Critical lesion pulsing ring indicator for segments >= 50%
    cells
      .filter((d) => Boolean(d.segment && d.segment.stenosis >= 50))
      .append('circle')
      .attr('cx', x.bandwidth() - 8)
      .attr('cy', 8)
      .attr('r', 3)
      .attr('fill', '#ff1744')
      .style('filter', 'drop-shadow(0 0 4px #ff1744)')
      .attr('pointer-events', 'none');
  }, [segments, patient]);

  // Set default selected segment to the most severe segment in the patient
  useEffect(() => {
    const highest = [...segments].sort((a, b) => b.stenosis - a.stenosis)[0];
    if (highest) setSelectedSegment(highest);
  }, [segments]);

  return (
    <div className="w-full rounded-2xl bg-[#060E20]/85 backdrop-blur-xl shadow-xl overflow-hidden border border-cyan-500/25 p-4 flex flex-col gap-3">
      {/* Heatmap Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/15 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#171f33] flex items-center justify-center text-[#4cd7f6] border border-[#4cd7f6]/30 shadow-[0_0_10px_rgba(76,215,246,0.3)]">
            <Activity className="w-4 h-4 text-[#4cd7f6]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#dae2fd] tracking-tight">
              D3.js Arterial Stenosis Risk Heatmap
            </h3>
            <p className="text-[10px] text-[#869397] font-mono uppercase tracking-wider">
              Anatomical 14-Segment Hemodynamic Gradient & Spatial Risk Matrix
            </p>
          </div>
        </div>

        {/* Legend strip */}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#10b981]" />
            <span className="text-[#bcc9cd]">&lt; 30% Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#ffb95f]" />
            <span className="text-[#bcc9cd]">30% - 49% Mod</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#ff1744]" />
            <span className="text-[#bcc9cd]">≥ 50% Severe</span>
          </div>
        </div>
      </div>

      {/* D3 Heatmap SVG Container */}
      <div ref={containerRef} className="w-full overflow-x-auto select-none">
        <svg ref={svgRef} className="w-full block" />
      </div>

      {/* Selected Segment Inspection Telemetry Banner */}
      {selectedSegment && (
        <div className="p-3 rounded-xl bg-[#131b2e]/80 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className={`px-2 py-1 rounded font-mono font-bold text-xs ${
              selectedSegment.stenosis >= 50
                ? 'bg-[#ff1744]/20 text-[#ffb4ab] border border-[#ff1744]/40'
                : selectedSegment.stenosis >= 30
                ? 'bg-[#ffb95f]/20 text-[#ffb95f] border border-[#ffb95f]/40'
                : 'bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40'
            }`}>
              {selectedSegment.segmentId}: {selectedSegment.stenosis}%
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#dae2fd]">{selectedSegment.segmentName}</span>
              <span className="text-[10px] text-[#869397] font-mono">
                Territory: {selectedSegment.perfusionTerritory} • Morphology: {selectedSegment.plaqueType}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-[#869397]">Segment FFR:</span>
              <span className={`font-bold ${selectedSegment.ffr < 0.8 ? 'text-[#ff1744]' : 'text-[#4cd7f6]'}`}>
                {selectedSegment.ffr} {selectedSegment.ffr < 0.8 ? '(Ischemic)' : '(Patent)'}
              </span>
            </div>

            <button
              onClick={() => {
                if (onSelectSegment) {
                  onSelectSegment(
                    selectedSegment.vessel === 'LM' ? 'LAD' : selectedSegment.vessel,
                    selectedSegment.segmentName
                  );
                }
              }}
              className="px-2.5 py-1 rounded bg-[#171f33] hover:bg-[#222a3d] text-[#4cd7f6] border border-[#4cd7f6]/30 flex items-center gap-1 text-[10px] transition-colors"
            >
              <Eye className="w-3 h-3" />
              <span>Highlight in 3D</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
