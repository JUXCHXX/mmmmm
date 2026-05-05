import React from 'react';
import { ExternalLink, Map, MapPin, Navigation } from 'lucide-react';

interface LocationButtonsProps {
  address: string;
  latitude?: number;
  longitude?: number;
  className?: string;
}

export const LocationButtons: React.FC<LocationButtonsProps> = ({
  address,
  latitude,
  longitude,
  className = '',
}) => {
  const googleMapsUrl =
    latitude && longitude
      ? `https://www.google.com/maps/?q=${latitude},${longitude}`
      : `https://www.google.com/maps/?q=${encodeURIComponent(address)}`;

  const wazeUrl =
    latitude && longitude
      ? `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`
      : `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F7FB] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#52627A]">
        <MapPin className="h-3.5 w-3.5" />
        {latitude && longitude ? `${latitude.toFixed(2)}, ${longitude.toFixed(2)}` : 'Direccion'}
      </span>

      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="maps-link-btn text-xs font-semibold"
      >
        <Map className="h-4 w-4" />
        <span>Google Maps</span>
        <ExternalLink className="h-3.5 w-3.5" />
      </a>

      <a
        href={wazeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="maps-link-btn text-xs font-semibold"
      >
        <Navigation className="h-4 w-4" />
        <span>Waze</span>
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
};

export default LocationButtons;
