/**
 * Eye Graphic Band - Bottom ⅓ fixed element
 * Non-interactive edition graphic for Gala 2025
 */

import { useConfig } from '../../config/ConfigContext';
import { Eye } from 'lucide-react';

export const EyeGraphicBand = () => {
  const { config } = useConfig();

  if (!config) return null;

  const eyeGraphicPath = config.brandAssets.eyeGraphic;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[33vh] pointer-events-none z-0 flex items-center justify-center">
      {/* Gradient overlay for better content contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#0e0513]/30 to-[#0e0513]/80" />

      {/* Eye graphic */}
      <div className="relative w-full h-full flex items-center justify-center opacity-15">
        {/* Try to load actual asset, fallback to Lucide icon */}
        <img
          src={eyeGraphicPath}
          alt="Gala 2025"
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            // If image fails to load, hide it and show placeholder
            e.currentTarget.style.display = 'none';
            const placeholder = e.currentTarget.nextElementSibling;
            if (placeholder) {
              (placeholder as HTMLElement).style.display = 'flex';
            }
          }}
        />

        {/* Placeholder (Lucide Eye icon) - hidden by default */}
        <div
          className="absolute inset-0 items-center justify-center"
          style={{ display: 'none' }}
        >
          <Eye className="w-64 h-64 text-[#b5f351ff]" strokeWidth={0.5} />
          <p className="absolute bottom-8 text-[#b5f351ff] text-sm opacity-50 italic">
            "Privim viitorul educației în ochi"
          </p>
        </div>
      </div>

      {/* Bottom branding text (optional, always visible) */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-[#b5f351ff]/40 tracking-wider">
          Gala Premiilor Directorilor Anului 2025
        </p>
      </div>
    </div>
  );
};
