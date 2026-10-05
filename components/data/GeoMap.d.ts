import * as React from 'react';

export type GeoVariant = 'hybrid' | 'choropleth' | 'bubble' | 'route';
export type GeoProjectionType = 'mercator' | 'equirectangular';

export interface GeoCoordinate {
  lon: number;
  lat: number;
}

export interface GeoRegion {
  id: string;
  name: string;
  code?: string;
  value?: number;
  formattedValue?: string;
  status?: 'nominal' | 'warning' | 'critical' | 'info';
  category?: string;
  d?: string; // SVG path data
  fill?: string;
  stroke?: string;
  metadata?: Record<string, any>;
}

export interface GeoHub {
  id: string;
  name: string;
  type: 'plant' | 'vendor' | 'oem' | 'port' | 'warehouse' | 'station';
  coordinates: [number, number]; // [lon, lat]
  value?: number;
  unit?: string;
  formattedValue?: string;
  status: 'nominal' | 'warning' | 'critical' | 'info';
  tier?: string;
  state?: string;
  city?: string;
  fill?: string;
  metadata?: Record<string, any>;
}

export interface GeoRoute {
  id: string;
  source: string; // Hub id
  target: string; // Hub id
  flow: number; // Volume / weight
  unit?: string;
  status: 'nominal' | 'warning' | 'critical' | 'info';
  mode: 'road' | 'rail' | 'sea' | 'air';
  transitHours?: number;
  curved?: boolean;
  curvature?: number;
  dashPattern?: string;
  metadata?: Record<string, any>;
}

export interface GeoMapData {
  regions?: GeoRegion[];
  hubs?: GeoHub[];
  routes?: GeoRoute[];
}

export interface GeoMapProps {
  data: GeoMapData;
  variant?: GeoVariant;
  projection?: GeoProjectionType;
  width?: number;
  height?: number;
  className?: string;
  title?: string;
  subtitle?: string;
  center?: [number, number]; // [lon, lat]
  scale?: number;
  showLayerControls?: boolean;
  showSearch?: boolean;
  showMinimap?: boolean;
  showScaleBar?: boolean;
  interactive?: boolean;
  colorScale?: {
    nominal?: string;
    warning?: string;
    critical?: string;
    info?: string;
  };
  onRegionClick?: (region: GeoRegion, event: React.MouseEvent) => void;
  onHubClick?: (hub: GeoHub, event: React.MouseEvent) => void;
  onRouteClick?: (route: GeoRoute, event: React.MouseEvent) => void;
  renderTooltip?: (item: { type: 'region' | 'hub' | 'route'; data: any }) => React.ReactNode;
  ariaLabel?: string;
}

export declare const GeoMap: React.FC<GeoMapProps>;
export default GeoMap;
