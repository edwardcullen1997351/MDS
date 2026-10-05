import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Image } from '@ds/react';

const meta: Meta<typeof Image> = {
  title: 'Primitives/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Image provides tokenized border radii, object-fit scaling rules, and resilient fallback error states for media assets.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Image>;

const svgToDataUri = (svg: string) => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
};

const cncMachiningSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
    <linearGradient id="spindle" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#64748B"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>
    <linearGradient id="tool" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#334155" stroke-width="1" stroke-opacity="0.4"/>
    </pattern>
  </defs>
  <rect width="600" height="400" fill="url(#bg)"/>
  <rect width="600" height="400" fill="url(#grid)"/>

  <rect x="80" y="280" width="440" height="30" rx="4" fill="#334155" stroke="#475569" stroke-width="2"/>
  <rect x="120" y="310" width="40" height="60" fill="#1E293B" stroke="#475569" stroke-width="2"/>
  <rect x="440" y="310" width="40" height="60" fill="#1E293B" stroke="#475569" stroke-width="2"/>

  <rect x="220" y="210" width="160" height="70" rx="4" fill="#64748B" stroke="#64748B" stroke-width="2"/>
  <path d="M 240 210 L 260 240 L 340 240 L 360 210" fill="#475569" stroke="#38BDF8" stroke-width="2" stroke-dasharray="4"/>

  <rect x="270" y="40" width="60" height="90" rx="4" fill="url(#spindle)" stroke="#CBD5E1" stroke-width="2"/>
  <polygon points="275,130 325,130 310,165 290,165" fill="#64748B"/>
  <rect x="294" y="165" width="12" height="35" fill="url(#tool)"/>

  <path d="M 270 170 Q 250 190 290 200" fill="none" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" opacity="0.85"/>
  <path d="M 330 170 Q 350 190 310 200" fill="none" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" opacity="0.85"/>

  <rect x="24" y="24" width="220" height="54" rx="6" fill="#0F172A" fill-opacity="0.85" stroke="#38BDF8" stroke-width="1.5"/>
  <text x="36" y="46" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">CNC 5-AXIS MILLING ACTIVE</text>
  <text x="36" y="64" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">Spindle: 12,000 RPM &#183; 74.2&#176;C</text>

  <circle cx="300" cy="200" r="5" fill="#EF4444"/>
  <circle cx="300" cy="200" r="15" fill="none" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="4"/>
</svg>
`;

const roboticArmSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <rect width="600" height="400" fill="#090D16"/>
  <g stroke="#334155" stroke-width="1" opacity="0.3">
    <line x1="0" y1="100" x2="600" y2="100"/>
    <line x1="0" y1="200" x2="600" y2="200"/>
    <line x1="0" y1="300" x2="600" y2="300"/>
    <line x1="150" y1="0" x2="150" y2="400"/>
    <line x1="300" y1="0" x2="300" y2="400"/>
    <line x1="450" y1="0" x2="450" y2="400"/>
  </g>
  <path d="M 100 350 L 200 350 L 180 250 L 120 250 Z" fill="#2563EB"/>
  <circle cx="150" cy="240" r="25" fill="#1D4ED8" stroke="#60A5FA" stroke-width="2"/>
  <line x1="150" y1="240" x2="280" y2="150" stroke="#3B82F6" stroke-width="24" stroke-linecap="round"/>
  <circle cx="280" cy="150" r="20" fill="#1D4ED8" stroke="#60A5FA" stroke-width="2"/>
  <line x1="280" y1="150" x2="400" y2="220" stroke="#60A5FA" stroke-width="16" stroke-linecap="round"/>
  <polygon points="400,220 440,240 430,260 390,240" fill="#F59E0B"/>
  <polygon points="430,260 450,290 440,295 420,265" fill="#EF4444"/>
  <circle cx="450" cy="290" r="12" fill="#FDE047" opacity="0.9"/>
  <line x1="450" y1="290" x2="480" y2="260" stroke="#FBBF24" stroke-width="2"/>
  <line x1="450" y1="290" x2="490" y2="300" stroke="#FBBF24" stroke-width="2"/>
  <line x1="450" y1="290" x2="470" y2="320" stroke="#FBBF24" stroke-width="2"/>
  <rect x="360" y="320" width="180" height="30" fill="#334155" rx="4"/>
  <rect x="24" y="24" width="220" height="54" rx="6" fill="#0F172A" fill-opacity="0.9" stroke="#3B82F6" stroke-width="1.5"/>
  <text x="36" y="46" fill="#60A5FA" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">ROBOTIC WELD ARM #02</text>
  <text x="36" y="64" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">Arc Current: 220A &#183; 100% Argon</text>
</svg>
`;

const blueprintSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <pattern id="cadgrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#60A5FA" stroke-width="0.8" stroke-opacity="0.3"/>
    </pattern>
  </defs>
  <rect width="600" height="400" fill="#1E3A8A"/>
  <rect width="600" height="400" fill="url(#cadgrid)"/>

  <rect x="20" y="20" width="560" height="360" fill="none" stroke="#60A5FA" stroke-width="1.5" stroke-opacity="0.6"/>

  <rect x="140" y="100" width="320" height="200" fill="#172554" fill-opacity="0.6" stroke="#FFFFFF" stroke-width="2"/>
  <circle cx="300" cy="200" r="70" fill="#1E40AF" fill-opacity="0.4" stroke="#FFFFFF" stroke-width="2"/>
  <circle cx="300" cy="200" r="40" fill="none" stroke="#93C5FD" stroke-width="1.5" stroke-dasharray="6,4"/>
  <circle cx="300" cy="200" r="15" fill="#60A5FA" fill-opacity="0.3" stroke="#93C5FD" stroke-width="1.5"/>

  <line x1="100" y1="200" x2="500" y2="200" stroke="#93C5FD" stroke-width="1.2" stroke-dasharray="8,4,2,4"/>
  <line x1="300" y1="60" x2="300" y2="340" stroke="#93C5FD" stroke-width="1.2" stroke-dasharray="8,4,2,4"/>

  <circle cx="200" cy="150" r="8" fill="#1E3A8A" stroke="#FFFFFF" stroke-width="1.5"/>
  <circle cx="400" cy="150" r="8" fill="#1E3A8A" stroke="#FFFFFF" stroke-width="1.5"/>
  <circle cx="200" cy="250" r="8" fill="#1E3A8A" stroke="#FFFFFF" stroke-width="1.5"/>
  <circle cx="400" cy="250" r="8" fill="#1E3A8A" stroke="#FFFFFF" stroke-width="1.5"/>

  <line x1="140" y1="80" x2="460" y2="80" stroke="#93C5FD" stroke-width="1"/>
  <line x1="140" y1="75" x2="140" y2="85" stroke="#93C5FD" stroke-width="1"/>
  <line x1="460" y1="75" x2="460" y2="85" stroke="#93C5FD" stroke-width="1"/>
  <polygon points="140,80 148,77 148,83" fill="#93C5FD"/>
  <polygon points="460,80 452,77 452,83" fill="#93C5FD"/>
  <text x="300" y="74" text-anchor="middle" fill="#93C5FD" font-family="monospace" font-size="12" font-weight="bold">L = 320.00 mm &#177;0.05</text>

  <line x1="480" y1="100" x2="480" y2="300" stroke="#93C5FD" stroke-width="1"/>
  <line x1="475" y1="100" x2="485" y2="100" stroke="#93C5FD" stroke-width="1"/>
  <line x1="475" y1="300" x2="485" y2="300" stroke="#93C5FD" stroke-width="1"/>
  <polygon points="480,100 477,108 483,108" fill="#93C5FD"/>
  <polygon points="480,300 477,292 483,292" fill="#93C5FD"/>
  <text x="495" y="205" fill="#93C5FD" font-family="monospace" font-size="12" font-weight="bold">DIA 200.00 H7</text>

  <rect x="340" y="315" width="230" height="55" fill="#0F172A" fill-opacity="0.9" stroke="#60A5FA" stroke-width="1"/>
  <text x="352" y="334" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">SCHEMATIC: FLANGE ASSEMBLY</text>
  <text x="352" y="349" fill="#93C5FD" font-family="monospace" font-size="10">DWG NO: P&amp;ID-8842-REV-C</text>
  <text x="352" y="362" fill="#60A5FA" font-family="system-ui, sans-serif" font-size="9">SCALE: 1:1 &#183; METRIC TOLERANCE</text>

  <rect x="35" y="35" width="160" height="42" rx="4" fill="#0F172A" fill-opacity="0.85" stroke="#38BDF8" stroke-width="1"/>
  <text x="45" y="52" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">APPROVED ENGINEERING</text>
  <text x="45" y="66" fill="#64748B" font-family="monospace" font-size="9">ISO-2768-m TOLERANCE</text>
</svg>
`;

const fallbackSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <rect width="400" height="300" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
  <path d="M 0 0 L 400 300 M 400 0 L 0 300" stroke="#E2E8F0" stroke-width="2"/>
  <rect x="100" y="110" width="200" height="80" rx="8" fill="#FFFFFF" stroke="#64748B" stroke-width="1.5"/>
  <text x="200" y="145" text-anchor="middle" fill="#475569" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Telemetry Image Offline</text>
  <text x="200" y="168" text-anchor="middle" fill="#64748B" font-family="system-ui, sans-serif" font-size="11">Fallback asset engaged</text>
</svg>
`;

const cncMachiningImage = svgToDataUri(cncMachiningSvg);
const roboticArmImage = svgToDataUri(roboticArmSvg);
const blueprintImage = svgToDataUri(blueprintSvg);
const fallbackPlaceholder = svgToDataUri(fallbackSvg);

export const DefaultWithAlt: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '440px' }}>
      <Image
        src={cncMachiningImage}
        alt="Automated 5-Axis CNC Milling Spindle with Active Telemetry HUD"
        radius="lg"
      />
    </div>
  ),
};

export const ObjectFitModes: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', marginBottom: '6px' }}>fit="cover" (Fixed 180x140 box)</div>
        <div style={{ width: '180px', height: '140px', border: '1px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden' }}>
          <Image src={roboticArmImage} alt="Cover fit" fit="cover" radius="none" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', marginBottom: '6px' }}>fit="contain" (Preserve aspect)</div>
        <div style={{ width: '180px', height: '140px', border: '1px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#0F172A' }}>
          <Image src={cncMachiningImage} alt="Contain fit" fit="contain" radius="none" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  ),
};

export const RadiusScale: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      {(['none', 'sm', 'md', 'lg', 'full'] as const).map(r => (
        <div key={r} style={{ textAlign: 'center' }}>
          <Image src={cncMachiningImage} alt={`Radius ${r}`} radius={r} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>{r}</div>
        </div>
      ))}
    </div>
  ),
};

export const FallbackOnError: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px' }}>
      <Image
        src="https://invalid-non-existent-domain.com/offline-camera.png"
        alt="Camera sensor feed"
        fallbackSrc={fallbackPlaceholder}
        radius="md"
      />
    </div>
  ),
};

export const LazyLoadingPlaceholder: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '440px' }}>
      <Image src={roboticArmImage} alt="Robotic welder line" loading="lazy" radius="lg" />
    </div>
  ),
};

export const TechnicalSchematicDiagram: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '500px' }}>
      <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>P&ID Hydraulic Circuit Blueprint</div>
        <Image src={blueprintImage} alt="P&ID Circuit CAD schematic" radius="md" />
      </div>
    </div>
  ),
};
