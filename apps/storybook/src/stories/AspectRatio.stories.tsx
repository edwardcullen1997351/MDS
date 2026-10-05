import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio, Image } from '@ds/react';

const meta: Meta<typeof AspectRatio> = {
  title: 'Primitives/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'AspectRatio embeds media, maps, and camera feeds within strict proportional geometric ratios across fluid viewport widths.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof AspectRatio>;

const cncMachiningImage = "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20400%22%20width%3D%22600%22%20height%3D%22400%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22bg%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%230F172A%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%231E293B%22%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22spindle%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%220%25%22%20y2%3D%22100%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%2394A3B8%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23475569%22%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22tool%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%220%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F59E0B%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23D97706%22%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3Cpattern%20id%3D%22grid%22%20width%3D%2230%22%20height%3D%2230%22%20patternUnits%3D%22userSpaceOnUse%22%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M%2030%200%20L%200%200%200%2030%22%20fill%3D%22none%22%20stroke%3D%22%23334155%22%20stroke-width%3D%221%22%20stroke-opacity%3D%220.4%22%2F%3E%0A%20%20%20%20%3C%2Fpattern%3E%0A%20%20%3C%2Fdefs%3E%0A%20%20%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22url(%23bg)%22%2F%3E%0A%20%20%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22url(%23grid)%22%2F%3E%0A%20%20%0A%20%20%3Crect%20x%3D%2280%22%20y%3D%22280%22%20width%3D%22440%22%20height%3D%2230%22%20rx%3D%224%22%20fill%3D%22%23334155%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Crect%20x%3D%22120%22%20y%3D%22310%22%20width%3D%2240%22%20height%3D%2260%22%20fill%3D%22%231E293B%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Crect%20x%3D%22440%22%20y%3D%22310%22%20width%3D%2240%22%20height%3D%2260%22%20fill%3D%22%231E293B%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%0A%20%20%3Crect%20x%3D%22220%22%20y%3D%22210%22%20width%3D%22160%22%20height%3D%2270%22%20rx%3D%224%22%20fill%3D%22%2364748B%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Cpath%20d%3D%22M%20240%20210%20L%20260%20240%20L%20340%20240%20L%20360%20210%22%20fill%3D%22%23475569%22%20stroke%3D%22%2338BDF8%22%20stroke-width%3D%222%22%20stroke-dasharray%3D%224%22%2F%3E%0A%20%20%0A%20%20%3Crect%20x%3D%22270%22%20y%3D%2240%22%20width%3D%2260%22%20height%3D%2290%22%20rx%3D%224%22%20fill%3D%22url(%23spindle)%22%20stroke%3D%22%23CBD5E1%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Cpolygon%20points%3D%22275%2C130%20325%2C130%20310%2C165%20290%2C165%22%20fill%3D%22%2364748B%22%2F%3E%0A%20%20%3Crect%20x%3D%22294%22%20y%3D%22165%22%20width%3D%2212%22%20height%3D%2235%22%20fill%3D%22url(%23tool)%22%2F%3E%0A%20%20%0A%20%20%3Cpath%20d%3D%22M%20270%20170%20Q%20250%20190%20290%20200%22%20fill%3D%22none%22%20stroke%3D%22%2338BDF8%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20opacity%3D%220.85%22%2F%3E%0A%20%20%3Cpath%20d%3D%22M%20330%20170%20Q%20350%20190%20310%20200%22%20fill%3D%22none%22%20stroke%3D%22%2338BDF8%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20opacity%3D%220.85%22%2F%3E%0A%20%20%0A%20%20%3Crect%20x%3D%2224%22%20y%3D%2224%22%20width%3D%22220%22%20height%3D%2254%22%20rx%3D%226%22%20fill%3D%22%230F172A%22%20fill-opacity%3D%220.85%22%20stroke%3D%22%2338BDF8%22%20stroke-width%3D%221.5%22%2F%3E%0A%20%20%3Ctext%20x%3D%2236%22%20y%3D%2246%22%20fill%3D%22%2338BDF8%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2212%22%20font-weight%3D%22bold%22%3ECNC%205-AXIS%20MILLING%20ACTIVE%3C%2Ftext%3E%0A%20%20%3Ctext%20x%3D%2236%22%20y%3D%2264%22%20fill%3D%22%2394A3B8%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2211%22%3ESpindle%3A%2012%2C000%20RPM%20%C2%B7%2074.2%C2%B0C%3C%2Ftext%3E%0A%20%20%0A%20%20%3Ccircle%20cx%3D%22300%22%20cy%3D%22200%22%20r%3D%225%22%20fill%3D%22%23EF4444%22%2F%3E%0A%20%20%3Ccircle%20cx%3D%22300%22%20cy%3D%22200%22%20r%3D%2215%22%20fill%3D%22none%22%20stroke%3D%22%23EF4444%22%20stroke-width%3D%221.5%22%20stroke-dasharray%3D%224%22%2F%3E%0A%3C%2Fsvg%3E";
const roboticArmImage = "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20400%22%20width%3D%22600%22%20height%3D%22400%22%3E%0A%20%20%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23090D16%22%2F%3E%0A%20%20%3Cg%20stroke%3D%22%23334155%22%20stroke-width%3D%221%22%20opacity%3D%220.3%22%3E%0A%20%20%20%20%3Cline%20x1%3D%220%22%20y1%3D%22100%22%20x2%3D%22600%22%20y2%3D%22100%22%2F%3E%0A%20%20%20%20%3Cline%20x1%3D%220%22%20y1%3D%22200%22%20x2%3D%22600%22%20y2%3D%22200%22%2F%3E%0A%20%20%20%20%3Cline%20x1%3D%220%22%20y1%3D%22300%22%20x2%3D%22600%22%20y2%3D%22300%22%2F%3E%0A%20%20%20%20%3Cline%20x1%3D%22150%22%20y1%3D%220%22%20x2%3D%22150%22%20y2%3D%22400%22%2F%3E%0A%20%20%20%20%3Cline%20x1%3D%22300%22%20y1%3D%220%22%20x2%3D%22300%22%20y2%3D%22400%22%2F%3E%0A%20%20%20%20%3Cline%20x1%3D%22450%22%20y1%3D%220%22%20x2%3D%22450%22%20y2%3D%22400%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%20%20%3Cpath%20d%3D%22M%20100%20350%20L%20200%20350%20L%20180%20250%20L%20120%20250%20Z%22%20fill%3D%22%232563EB%22%2F%3E%0A%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%22240%22%20r%3D%2225%22%20fill%3D%22%231D4ED8%22%20stroke%3D%22%2360A5FA%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Cline%20x1%3D%22150%22%20y1%3D%22240%22%20x2%3D%22280%22%20y2%3D%22150%22%20stroke%3D%22%233B82F6%22%20stroke-width%3D%2224%22%20stroke-linecap%3D%22round%22%2F%3E%0A%20%20%3Ccircle%20cx%3D%22280%22%20cy%3D%22150%22%20r%3D%2220%22%20fill%3D%22%231D4ED8%22%20stroke%3D%22%2360A5FA%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Cline%20x1%3D%22280%22%20y1%3D%22150%22%20x2%3D%22400%22%20y2%3D%22220%22%20stroke%3D%22%2360A5FA%22%20stroke-width%3D%2216%22%20stroke-linecap%3D%22round%22%2F%3E%0A%20%20%3Cpolygon%20points%3D%22400%2C220%20440%2C240%20430%2C260%20390%2C240%22%20fill%3D%22%23F59E0B%22%2F%3E%0A%20%20%3Cpolygon%20points%3D%22430%2C260%20450%2C290%20440%2C295%20420%2C265%22%20fill%3D%22%23EF4444%22%2F%3E%0A%20%20%3Ccircle%20cx%3D%22450%22%20cy%3D%22290%22%20r%3D%2212%22%20fill%3D%22%23FDE047%22%20opacity%3D%220.9%22%2F%3E%0A%20%20%3Cline%20x1%3D%22450%22%20y1%3D%22290%22%20x2%3D%22480%22%20y2%3D%22260%22%20stroke%3D%22%23FBBF24%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Cline%20x1%3D%22450%22%20y1%3D%22290%22%20x2%3D%22490%22%20y2%3D%22300%22%20stroke%3D%22%23FBBF24%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Cline%20x1%3D%22450%22%20y1%3D%22290%22%20x2%3D%22470%22%20y2%3D%22320%22%20stroke%3D%22%23FBBF24%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Crect%20x%3D%22360%22%20y%3D%22320%22%20width%3D%22180%22%20height%3D%2230%22%20fill%3D%22%23334155%22%20rx%3D%224%22%2F%3E%0A%20%20%3Crect%20x%3D%2224%22%20y%3D%2224%22%20width%3D%22220%22%20height%3D%2254%22%20rx%3D%226%22%20fill%3D%22%230F172A%22%20fill-opacity%3D%220.9%22%20stroke%3D%22%233B82F6%22%20stroke-width%3D%221.5%22%2F%3E%0A%20%20%3Ctext%20x%3D%2236%22%20y%3D%2246%22%20fill%3D%22%2360A5FA%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2212%22%20font-weight%3D%22bold%22%3EROBOTIC%20WELD%20ARM%20%2302%3C%2Ftext%3E%0A%20%20%3Ctext%20x%3D%2236%22%20y%3D%2264%22%20fill%3D%22%2394A3B8%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2211%22%3EArc%20Current%3A%20220A%20%C2%B7%20100%25%20Argon%3C%2Ftext%3E%0A%3C%2Fsvg%3E";
const blueprintImage = "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20400%22%20width%3D%22600%22%20height%3D%22400%22%3E%0A%20%20%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%231E3A8A%22%2F%3E%0A%20%20%3Cg%20stroke%3D%22%233B82F6%22%20stroke-width%3D%221%22%20opacity%3D%220.4%22%3E%0A%20%20%20%20%3Cpattern%20id%3D%22cadgrid%22%20width%3D%2220%22%20height%3D%2220%22%20patternUnits%3D%22userSpaceOnUse%22%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M%2020%200%20L%200%200%200%2020%22%20fill%3D%22none%22%20stroke%3D%22%2360A5FA%22%20stroke-width%3D%220.8%22%20stroke-opacity%3D%220.3%22%2F%3E%0A%20%20%20%20%3C%2Fpattern%3E%0A%20%20%3C%2Fg%3E%0A%20%20%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22url(%23cadgrid)%22%2F%3E%0A%20%20%3Crect%20x%3D%22150%22%20y%3D%22100%22%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22none%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Ccircle%20cx%3D%22300%22%20cy%3D%22200%22%20r%3D%2260%22%20fill%3D%22none%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%222%22%2F%3E%0A%20%20%3Ccircle%20cx%3D%22300%22%20cy%3D%22200%22%20r%3D%2230%22%20fill%3D%22none%22%20stroke%3D%22%2393C5FD%22%20stroke-width%3D%221.5%22%20stroke-dasharray%3D%224%22%2F%3E%0A%20%20%3Cline%20x1%3D%22120%22%20y1%3D%22200%22%20x2%3D%22480%22%20y2%3D%22200%22%20stroke%3D%22%2393C5FD%22%20stroke-width%3D%221%22%20stroke-dasharray%3D%225%22%2F%3E%0A%20%20%3Cline%20x1%3D%22300%22%20y1%3D%2270%22%20x2%3D%22300%22%20y2%3D%22330%22%20stroke%3D%22%2393C5FD%22%20stroke-width%3D%221%22%20stroke-dasharray%3D%225%22%2F%3E%0A%20%20%3Ctext%20x%3D%22160%22%20y%3D%2290%22%20fill%3D%22%2393C5FD%22%20font-family%3D%22monospace%22%20font-size%3D%2212%22%3EL%20%3D%20300.000%20mm%20%C2%B10.02%3C%2Ftext%3E%0A%20%20%3Ctext%20x%3D%22460%22%20y%3D%22205%22%20fill%3D%22%2393C5FD%22%20font-family%3D%22monospace%22%20font-size%3D%2212%22%3E%C3%98%20120.00%20H7%3C%2Ftext%3E%0A%20%20%3Crect%20x%3D%2224%22%20y%3D%2224%22%20width%3D%22200%22%20height%3D%2248%22%20rx%3D%224%22%20fill%3D%22%23172554%22%20stroke%3D%22%2393C5FD%22%20stroke-width%3D%221%22%2F%3E%0A%20%20%3Ctext%20x%3D%2236%22%20y%3D%2244%22%20fill%3D%22%23FFFFFF%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2211%22%20font-weight%3D%22bold%22%3EISO-2768-m%20TOLERANCE%3C%2Ftext%3E%0A%20%20%3Ctext%20x%3D%2236%22%20y%3D%2260%22%20fill%3D%22%2393C5FD%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2210%22%3EP%26ID%20Flange%20Revision%204.2%3C%2Ftext%3E%0A%3C%2Fsvg%3E";

export const Video16By9: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '480px' }}>
      <AspectRatio ratio="16/9" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Image src={cncMachiningImage} alt="16:9 CNC Stream" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AspectRatio>
    </div>
  ),
};

export const Photo4By3: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '400px' }}>
      <AspectRatio ratio="4/3" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Image src={blueprintImage} alt="4:3 Blueprint" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AspectRatio>
    </div>
  ),
};

export const Square1By1: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '240px' }}>
      <AspectRatio ratio="1/1" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Image src={roboticArmImage} alt="1:1 Square Tool inspection" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AspectRatio>
    </div>
  ),
};

export const Ultrawide21By9: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '600px' }}>
      <AspectRatio ratio="21/9" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Image src={cncMachiningImage} alt="21:9 Ultrawide overview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AspectRatio>
    </div>
  ),
};

export const IndustrialSCADAMap: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '520px' }}>
      <AspectRatio ratio="16/9" style={{ border: '2px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden' }}>
        <Image src={blueprintImage} alt="Plant CAD Map" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AspectRatio>
    </div>
  ),
};

export const LiveCameraFeedContainer: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '440px' }}>
      <AspectRatio ratio="16/9" style={{ borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
        <Image src={roboticArmImage} alt="Live Robotic Cell" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#b91c1c', color: '#FFF', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
          LIVE FEED ● CELL 03
        </div>
      </AspectRatio>
    </div>
  ),
};
