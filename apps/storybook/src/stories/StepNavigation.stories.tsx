import {
Button,
Text
} from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Navigation Systems/09 Step Navigation',
  parameters: {
    docs: {
      description: {
        component:
          '**Multi-Stage Process Step Navigation System (§01–§14)**\n\n' +
          'Provides step-by-step wizard progression for multi-stage transactional workflows.\n' +
          'Owns stage progression, completion tracking, validation gates, and linear/non-linear routing.\n\n' +
          '**Composition Contract:**\n' +
          '- **Required:** `Progress`, `Button`\n' +
          '- **Optional:** `Text`, `Link`, `Stack`, `Divider`\n\n' +
          '*Scenario:* **Purchase Requisition (PR-2026-89) for ₹2,50,000 Tooling Steel** at **Suryodaya Autocomp Ltd (PL-04 Chakan, Pune)**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const STEPS = [
  { id: 1, title: 'Item & Vendor', desc: 'Alloy Steel 20MnCr5 (Kalyani)' },
  { id: 2, title: 'Cost-Centre & Budget', desc: 'CC-CHAKAN-04 (₹2,50,000)' },
  { id: 3, title: 'HOD Sign-Off', desc: 'Meera Nair / Shalini Rao' },
  { id: 4, title: 'Dispatch PR', desc: 'Transmit to SAP / MES' },
];

// 1. Purchase Requisition Wizard
export const PurchaseRequisitionWizard: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(2);

    return (
      <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', maxWidth: '780px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Text size="xs" color="secondary" weight="semibold">PURCHASE REQUISITION WIZARD (PR-2026-89)</Text>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0 0' }}>Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}</h2>
        </div>

        {/* Stepper Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '16px', left: '24px', right: '24px', height: '2px', background: '#E2E8F0', zIndex: 0 }} />
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <button
                key={step.id}
                type="button"
                disabled={!isCompleted}
                aria-current={isCurrent ? 'step' : undefined}
                onClick={() => setCurrentStep(step.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 1,
                  cursor: isCompleted ? 'pointer' : 'default',
                  border: 0,
                  padding: 0,
                  background: 'transparent',
                  font: 'inherit',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isCompleted ? '#15803D' : isCurrent ? '#1D4ED8' : '#FFFFFF',
                    border: isCompleted ? '2px solid #15803D' : isCurrent ? '2px solid #1D4ED8' : '2px solid #CBD5E1',
                    color: isCompleted || isCurrent ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  {isCompleted ? '✓' : step.id}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#1D4ED8' : '#0F172A' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>{step.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Step Body */}
        <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
          {currentStep === 1 && <Text size="sm">Select item code from Suryodaya Item Master and link Chakan plant supplier.</Text>}
          {currentStep === 2 && (
            <div>
              <Text size="sm" weight="semibold">Allocated Spend: ₹2,50,000 (Two Lakh Fifty Thousand Rupees)</Text>
              <Text size="xs" color="secondary" style={{ marginTop: '4px' }}>
                Chargeable to Press Shop Bay 4 cost-centre. Requires Level 2 Approval.
              </Text>
            </div>
          )}
          {currentStep === 3 && <Text size="sm">Pending approval signature from Plant Quality Head Meera Nair.</Text>}
          {currentStep === 4 && <Text size="sm">Ready for transmission to ERP production server.</Text>}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            size="sm"
            variant="outline"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(s => s - 1)}
          >
            ← Back
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setCurrentStep(s => Math.min(STEPS.length, s + 1))}
          >
            {currentStep === STEPS.length ? 'Finalize & Submit PR' : 'Next Step →'}
          </Button>
        </div>
      </div>
    );
  },
};

// 2. Linear Validation Gate
export const LinearValidationGate: Story = {
  render: () => (
    <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', maxWidth: '500px' }}>
      <Text size="xs" color="danger" weight="bold" style={{ marginBottom: '8px', display: 'block' }}>
        VALIDATION GATE: STEP 2 INCOMPLETE
      </Text>
      <Text size="sm">
        You cannot proceed to <strong>Step 3: Sign-Off</strong> until the PO threshold ledger is validated for ₹2,50,000.
      </Text>
      <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
        <Button size="sm" variant="outline">Back to Step 1</Button>
        <Button size="sm" variant="primary" disabled>Proceed to Step 3 (Locked)</Button>
      </div>
    </div>
  ),
};

// 3. Compact Step Pills
export const CompactStepPills: Story = {
  render: () => (
    <div style={{ padding: '16px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'inline-flex', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#15803D', fontWeight: 600 }}>
        <span>✓ 1. Item Picked</span>
      </div>
      <span style={{ color: '#CBD5E1' }}>→</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#1D4ED8', fontWeight: 700 }}>
        <span>2. Budget Auth (Active)</span>
      </div>
      <span style={{ color: '#CBD5E1' }}>→</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748B' }}>
        <span>3. Release</span>
      </div>
    </div>
  ),
};
