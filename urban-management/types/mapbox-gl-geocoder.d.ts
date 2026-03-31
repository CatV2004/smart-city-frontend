declare module '@mapbox/mapbox-gl-geocoder' {
  import mapboxgl from 'mapbox-gl';
  
  export interface GeocoderOptions {
    accessToken: string;
    mapboxgl: typeof mapboxgl;
    marker?: boolean | {
      color?: string;
      draggable?: boolean;
    };
    placeholder?: string;
    flyTo?: boolean | FlyToOptions;
    zoom?: number;
    bbox?: number[];
    countries?: string;
    types?: string;
    language?: string;
    proximity?: {
      longitude: number;
      latitude: number;
    };
    trackProximity?: boolean;
    enableEventLogging?: boolean;
    limit?: number;
    reverseGeocode?: boolean;
    reverseMode?: 'distance' | 'score';
    localGeocoder?: (query: string) => any[];
    localGeocoderOnly?: boolean;
    render?: (item: any) => string;
    getItemValue?: (item: any) => string;
    filter?: (item: any) => boolean;
    sort?: (a: any, b: any) => number;
    autocomplete?: boolean;
    clearAndBlurOnEsc?: boolean;
    clearOnBlur?: boolean;
    collapsed?: boolean;
    minLength?: number;
    debounceSearch?: number;
    flipCoordinates?: boolean;
    enableGeolocation?: boolean;
    geolocation?: any;
  }

  export default class MapboxGeocoder {
    constructor(options?: GeocoderOptions);
    onAdd(map: mapboxgl.Map): HTMLElement;
    onRemove(): void;
    query(searchText: string): void;
    clear(): void;
    setInput(value: string): void;
    setProximity(proximity: { longitude: number; latitude: number }): void;
    setRenderFunction(fn: (item: any) => string): void;
    setLanguage(language: string): void;
    getProximity(): { longitude: number; latitude: number };
    getLanguage(): string;
    getValue(): string;
    on(type: string, fn: (...args: any[]) => void): void;
    off(type: string, fn: (...args: any[]) => void): void;
  }
}