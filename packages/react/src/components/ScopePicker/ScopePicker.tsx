import React, { forwardRef, useState } from 'react';
import { Select, SelectItem } from '../Select/index.js';
import { Button } from '../Button/index.js';
import { Badge } from '../Badge/index.js';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from '../Breadcrumb/index.js';
import { HStack } from '../Layout/index.js';
import { Text } from '../Typography/index.js';
import './ScopePicker.css';

export interface ScopeSelection {
  plant?: string;
  area?: string;
  unit?: string;
}

export interface ScopePickerProps {
  value?: ScopeSelection;
  defaultValue?: ScopeSelection;
  onChange?: (scope: ScopeSelection) => void;
  onClear?: () => void;
  className?: string;
}

const plantOptions: SelectItem[] = [
  { label: 'Plant 01 - Pune HQ', value: 'plant-01' },
  { label: 'Plant 04 - Chakan Press Shop', value: 'plant-04' },
  { label: 'Plant 07 - Sanand Assembly', value: 'plant-07' },
];

const areaOptions: Record<string, SelectItem[]> = {
  'plant-04': [
    { label: 'Turbine Hall Bay 1', value: 'bay-1' },
    { label: 'Heavy Stamping Line 4', value: 'stamping-4' },
    { label: 'Auxiliary Boiler House', value: 'boiler-house' },
  ],
  'plant-01': [
    { label: 'CNC Machining Bay', value: 'cnc-bay' },
    { label: 'Inspection Cleanroom', value: 'cleanroom' },
  ],
  'plant-07': [
    { label: 'Final Robotic Chassis Line', value: 'robotics' },
    { label: 'Battery Pack Testing Cell', value: 'battery-cell' },
  ],
};

const unitOptions: Record<string, SelectItem[]> = {
  // Plant 04 - Chakan Press Shop
  'bay-1': [
    { label: 'Turbine Generator TG-401', value: 'tg-401' },
    { label: 'Steam Manifold Valve V-12', value: 'v-12' },
  ],
  'stamping-4': [
    { label: 'Hydraulic Press 2000T', value: 'press-2000' },
    { label: 'Blank Feeder F-08', value: 'feeder-08' },
  ],
  'boiler-house': [
    { label: 'High-Pressure Steam Boiler B-01', value: 'boiler-01' },
    { label: 'Feedwater Pump Set P-03', value: 'pump-03' },
  ],

  // Plant 01 - Pune HQ
  'cnc-bay': [
    { label: '5-Axis CNC Milling Center MC-01', value: 'cnc-01' },
    { label: 'Precision CNC Lathe L-04', value: 'lathe-04' },
    { label: 'Horizontal Boring Mill HB-02', value: 'boring-02' },
  ],
  'cleanroom': [
    { label: 'Coordinate Measuring Machine CMM-01', value: 'cmm-01' },
    { label: 'Optical Profile Projector OPP-02', value: 'opp-02' },
    { label: 'Surface Roughness Tester SRT-01', value: 'srt-01' },
  ],

  // Plant 07 - Sanand Assembly
  'robotics': [
    { label: 'Spot Welding Robot Arm R-101', value: 'robot-101' },
    { label: 'Automated Guided Vehicle AGV-04', value: 'agv-04' },
    { label: 'Chassis Transfer Conveyor TC-02', value: 'conveyor-02' },
  ],
  'battery-cell': [
    { label: 'High-Voltage Discharge Cycler DC-01', value: 'cycler-01' },
    { label: 'Thermal Chamber TC-80', value: 'thermal-80' },
    { label: 'Pack Insulation Tester IT-02', value: 'tester-02' },
  ],
};

export const ScopePicker = forwardRef<HTMLDivElement, ScopePickerProps>(
  (
    {
      value: controlledValue,
      defaultValue = { plant: 'plant-04', area: 'bay-1', unit: 'tg-401' },
      onChange,
      onClear,
      className = '',
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalScope, setInternalScope] = useState<ScopeSelection>(defaultValue);
    const currentScope = isControlled ? controlledValue : internalScope;

    const handlePlantChange = (val: string[]) => {
      const plant = val?.[0];
      const newScope = { plant, area: undefined, unit: undefined };
      if (!isControlled) setInternalScope(newScope);
      onChange?.(newScope);
    };

    const handleAreaChange = (val: string[]) => {
      const area = val?.[0];
      const newScope = { ...currentScope, area, unit: undefined };
      if (!isControlled) setInternalScope(newScope);
      onChange?.(newScope);
    };

    const handleUnitChange = (val: string[]) => {
      const unit = val?.[0];
      const newScope = { ...currentScope, unit };
      if (!isControlled) setInternalScope(newScope);
      onChange?.(newScope);
    };

    const handleClear = () => {
      const emptyScope = { plant: undefined, area: undefined, unit: undefined };
      if (!isControlled) setInternalScope(emptyScope);
      onChange?.(emptyScope);
      onClear?.();
    };

    const currentPlantLabel = plantOptions.find((p) => p.value === currentScope.plant)?.label;
    const availableAreas = currentScope.plant ? areaOptions[currentScope.plant] || [] : [];
    const currentAreaLabel = availableAreas.find((a) => a.value === currentScope.area)?.label;
    const availableUnits = currentScope.area ? unitOptions[currentScope.area] || [] : [];
    const currentUnitLabel = availableUnits.find((u) => u.value === currentScope.unit)?.label;

    return (
      <div ref={ref} className={`ds-scope-picker ${className}`}>
        <div className="ds-scope-picker-controls">
          <Select
            label="Enterprise Plant Site"
            items={plantOptions}
            placeholder="Select Plant..."
            value={currentScope.plant ? [currentScope.plant] : []}
            onValueChange={(d) => handlePlantChange(d.value)}
          />

          <Select
            key={`area-${currentScope.plant || 'none'}`}
            label="Manufacturing Area / Hall"
            items={availableAreas}
            placeholder={currentScope.plant ? 'Select Area...' : 'Select Plant first'}
            disabled={!currentScope.plant || availableAreas.length === 0}
            value={currentScope.area ? [currentScope.area] : []}
            onValueChange={(d) => handleAreaChange(d.value)}
          />

          <Select
            key={`unit-${currentScope.plant || 'none'}-${currentScope.area || 'none'}`}
            label="Machine / Asset Unit"
            items={availableUnits}
            placeholder={currentScope.area ? 'Select Unit...' : 'Select Area first'}
            disabled={!currentScope.area || availableUnits.length === 0}
            value={currentScope.unit ? [currentScope.unit] : []}
            onValueChange={(d) => handleUnitChange(d.value)}
          />
        </div>

        {(currentPlantLabel || currentAreaLabel || currentUnitLabel) && (
          <div className="ds-scope-picker-summary">
            <HStack gap={2} align="center">
              <Text size="xs" color="secondary" weight="medium">
                Active Scope:
              </Text>
              <Breadcrumb>
                <BreadcrumbList>
                  {currentPlantLabel && (
                    <BreadcrumbItem>
                      <BreadcrumbPage>{currentPlantLabel}</BreadcrumbPage>
                    </BreadcrumbItem>
                  )}
                  {currentAreaLabel && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{currentAreaLabel}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                  {currentUnitLabel && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <Badge variant="brand">{currentUnitLabel}</Badge>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </HStack>

            <Button variant="ghost" size="sm" onClick={handleClear}>
              Clear Filter
            </Button>
          </div>
        )}
      </div>
    );
  }
);

ScopePicker.displayName = 'ScopePicker';
