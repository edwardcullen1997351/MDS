import {
Breadcrumb,
BreadcrumbItem,
BreadcrumbLink,
BreadcrumbPage,
BreadcrumbSeparator,
Text
} from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Navigation Systems/03 Breadcrumb Navigation',
  parameters: {
    docs: {
      description: {
        component:
          '**Ancestor Trail Navigation System (§01–§14)**\n\n' +
          'Provides parent hierarchy traversal, location awareness, and deep-link recovery.\n' +
          'Owns ancestor lineage resolution, overflow truncation, and current-page semantics.\n\n' +
          '**Composition Contract:**\n' +
          '- **Required:** `Breadcrumb`\n' +
          '- **Optional:** `Link`\n\n' +
          '*Scenario:* **Suryodaya Autocomp Ltd (PL-04 Chakan, Pune)** manufacturing plant hierarchy.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 1. Deep Plant Hierarchy
export const DeepPlantHierarchy: Story = {
  render: () => (
    <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
      <Text size="xs" color="secondary" weight="semibold" style={{ marginBottom: '10px', display: 'block' }}>
        PLANT ASSET TAXONOMY (L1 &gt; L2 &gt; L3 &gt; WORK CELL)
      </Text>
      <Breadcrumb>
        <BreadcrumbItem><BreadcrumbLink href="#corporate">Suryodaya Enterprise</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink href="#chakan">Chakan Plant (PL-04)</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink href="#press-shop">Press Shop Bay 2</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink href="#line-4">Stamping Line 4</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>Hydraulic Press 2000T (MC-2000-01)</BreadcrumbPage></BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
};

// 2. Lot Traceability Trail
export const LotTraceabilityTrail: Story = {
  render: () => (
    <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
      <Text size="xs" color="brand" weight="semibold" style={{ marginBottom: '10px', display: 'block' }}>
        SUPPLIER QA &amp; HEAT TRACEABILITY TRAIL
      </Text>
      <Breadcrumb>
        <BreadcrumbItem><BreadcrumbLink href="#stores">Stores &amp; Inward</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink href="#suppliers">Kalyani Steels (V-KSL-09)</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink href="#grades">Alloy Steel 20MnCr5</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>Lot LOT-2609-118 (Heat HT-89201-B)</BreadcrumbPage></BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
};

// 3. Truncated Middle Crumbs
export const TruncatedMiddleCrumbs: Story = {
  render: () => (
    <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
      <Text size="xs" color="secondary" weight="semibold" style={{ marginBottom: '10px', display: 'block' }}>
        COMPACT VIEW WITH OVERFLOW COLLAPSE
      </Text>
      <Breadcrumb>
        <BreadcrumbItem><BreadcrumbLink href="#root">PL-04 Plant Root</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem><span style={{ color: '#64748B', cursor: 'pointer' }}>...</span></BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem><BreadcrumbLink href="#sub">Tool Room Fixtures</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem><BreadcrumbPage>Die Set DS-4820-A</BreadcrumbPage></BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
};

// 4. Custom Separators
export const CustomSeparators: Story = {
  render: () => (
    <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <Text size="xs" color="secondary">Chevron Separator Mode (Default):</Text>
        <Breadcrumb aria-label="Quality management breadcrumb" style={{ marginTop: '6px' }}>
          <BreadcrumbItem><BreadcrumbLink href="#a">Quality Management</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="#b">Nonconformance Logs</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>NC-4081</BreadcrumbPage></BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div>
        <Text size="xs" color="secondary">Slash Separator Mode:</Text>
        <Breadcrumb aria-label="Quality management slash breadcrumb" style={{ marginTop: '6px' }}>
          <BreadcrumbItem><BreadcrumbLink href="#a">Quality Management</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem><BreadcrumbLink href="#b">Nonconformance Logs</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem><BreadcrumbPage>NC-4081</BreadcrumbPage></BreadcrumbItem>
        </Breadcrumb>
      </div>
    </div>
  ),
};

// 5. Work Order Routing Trail
export const WorkOrderRoutingTrail: Story = {
  render: () => (
    <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
      <Text size="xs" color="brand" weight="semibold" style={{ marginBottom: '10px', display: 'block' }}>
        SHOP FLOOR ROUTING WORKFLOW
      </Text>
      <Breadcrumb>
        <BreadcrumbItem><BreadcrumbLink href="#planning">Shift Planning (Shift A IST)</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator>→</BreadcrumbSeparator>
        <BreadcrumbItem><BreadcrumbLink href="#wo">Work Order WO-99124</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator>→</BreadcrumbSeparator>
        <BreadcrumbItem><BreadcrumbPage>Op 30: 5-Axis CNC Milling (Part BRK-4820-A)</BreadcrumbPage></BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
};

// 6. Accessible Page Landmark
export const AccessiblePageLandmark: Story = {
  render: () => (
    <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
      <nav aria-label="Breadcrumb Trail Landmark">
        <Breadcrumb>
          <BreadcrumbItem><BreadcrumbLink href="#home">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem><BreadcrumbLink href="#ops">Operations</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem><BreadcrumbPage>Shift Summary</BreadcrumbPage></BreadcrumbItem>
        </Breadcrumb>
      </nav>
      <Text size="xs" color="secondary" style={{ marginTop: '8px' }}>
        Complies with WCAG 2.4.8: Enclosed in <code>&lt;nav aria-label="Breadcrumb Trail Landmark"&gt;</code> with terminal crumb carrying <code>aria-current="page"</code>.
      </Text>
    </div>
  ),
};
