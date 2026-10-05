import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@ds/react';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Core/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Breadcrumb>
        <BreadcrumbItem><BreadcrumbLink href="#plant">Austin Plant</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink href="#hall">Fab Hall 2</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>CNC Milling Cell 01</BreadcrumbPage></BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
};

export const WithChevronSeparator: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Breadcrumb>
        <BreadcrumbItem><BreadcrumbLink href="#root">Telemetry</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink href="#sensors">Sensors</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>Vibration Spectrum</BreadcrumbPage></BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
};

export const WithSlashSeparator: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Breadcrumb>
        <BreadcrumbItem><BreadcrumbLink href="#mes">MES</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem><BreadcrumbLink href="#wo">Work Orders</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem><BreadcrumbPage>WO-99124</BreadcrumbPage></BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
};

export const CollapsedEllipsis: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Breadcrumb>
        <BreadcrumbItem><BreadcrumbLink href="#global">Enterprise Global</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem><span style={{ color: '#64748B' }}>...</span></BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem><BreadcrumbPage>Station 4 Telemetry</BreadcrumbPage></BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Breadcrumb>
        <BreadcrumbItem><BreadcrumbLink href="#home">🏭 Plant</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator>›</BreadcrumbSeparator>
        <BreadcrumbItem><BreadcrumbPage>⚙️ Line 1</BreadcrumbPage></BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
};
