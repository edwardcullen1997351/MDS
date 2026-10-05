import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from '@ds/react';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Feedback/Dialog',
  component: Dialog,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Dialog>;

export const ConfirmationDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '24px' }}>
        <Button variant="primary" onClick={() => setOpen(true)}>Open Calibration Confirmation</Button>
        <Dialog open={open} onOpenChange={(details) => setOpen(details.open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Metrology Calibration</DialogTitle>
              <DialogDescription>This will zero the digital dial indicator on Station 3. Ensure test artifact is loaded.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Confirm Zeroing</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};

export const DestructiveConfirm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '24px' }}>
        <Button variant="danger" onClick={() => setOpen(true)}>Purge Telemetry History</Button>
        <Dialog open={open} onOpenChange={(details) => setOpen(details.open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Purge Raw Telemetry Buffer?</DialogTitle>
              <DialogDescription>This action cannot be undone. All un-synchronized high-frequency logs will be permanently deleted.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)}>Keep Logs</Button>
              <Button variant="danger" onClick={() => setOpen(false)}>Purge Buffer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};

export const FormSubmissionDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '24px' }}>
        <Button variant="outline" onClick={() => setOpen(true)}>Log Tool Wear Event</Button>
        <Dialog open={open} onOpenChange={(details) => setOpen(details.open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Tool Insert Replacement</DialogTitle>
              <DialogDescription>Record serial and reason for replacement.</DialogDescription>
            </DialogHeader>
            <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="story-dialog-72" style={{ fontSize: '13px', fontWeight: 600 }}>Tool Identifier</label>
              <input id="story-dialog-72" type="text" defaultValue="TL-HSK-449" style={{ padding: '8px', border: '1px solid #CBD5E1', borderRadius: '4px' }} />
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Save Log</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};

export const LargeMultiStepDialog: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Button variant="outline">Shift Handover Wizard (Preview)</Button>
    </div>
  ),
};

export const ScrollableDialogContent: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Button variant="outline">View Full ISO Audit Trail (Scrollable)</Button>
    </div>
  ),
};
