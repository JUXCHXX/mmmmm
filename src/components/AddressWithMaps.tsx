import { Map, Navigation } from 'lucide-react';

export interface AddressWithMapsProps {
  address: string;
  placeName?: string;
  className?: string;
  compactMode?: boolean;
}

export const AddressWithMaps = ({
  address,
  placeName,
  className = '',
  compactMode = false,
}: AddressWithMapsProps) => {
  const query = encodeURIComponent(placeName || address);
  const googleMapsUrl = `https://maps.google.com/maps/search/${query}`;
  const wazeUrl = `https://waze.com/ul?q=${query}`;

  if (compactMode) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="maps-link-btn"
          title="Abrir en Google Maps"
        >
          <Map className="h-4 w-4" />
        </a>
        <a
          href={wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="maps-link-btn"
          title="Abrir en Waze"
        >
          <Navigation className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <div className={`surface-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#52627A]">Ubicacion</p>
        <p className="mt-1 truncate text-sm font-medium text-[#0D2654]">{address}</p>
      </div>

      <div className="flex items-center gap-2">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="maps-link-btn text-xs font-semibold"
          title="Abrir en Google Maps"
        >
          <Map className="h-4 w-4" />
          <span>Google Maps</span>
        </a>
        <a
          href={wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="maps-link-btn text-xs font-semibold"
          title="Abrir en Waze"
        >
          <Navigation className="h-4 w-4" />
          <span>Waze</span>
        </a>
      </div>
    </div>
  );
};

export default AddressWithMaps;
