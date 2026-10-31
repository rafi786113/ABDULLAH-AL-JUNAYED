/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExplanationLanguage } from '../types/grammar';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  language?: ExplanationLanguage;
  className?: string;
  onClick?: () => void;
}

/**
 * Custom Circular Emblem Logo for "نُور (knowledge)"
 * Uses the user's uploaded circular logo featuring:
 * - Deep plum background with celestial stars
 * - Elegant Arabic calligraphy "نور" with stylized loop and dots
 * - "knowledge" subtitle in refined typography
 */
export const AppLogoIcon: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const dimension = size === 'sm' ? 36 : size === 'lg' ? 56 : 44;

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      {/* Ambient plum/champagne soft glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#3f2137]/70 via-[#5a2e4e]/40 to-amber-400/20 blur-[6px] transform scale-110 pointer-events-none" />

      {/* Circular Emblem Container */}
      <div className="relative w-full h-full rounded-full overflow-hidden border border-amber-300/40 shadow-[0_2px_10px_rgba(0,0,0,0.65)] bg-[#2c1d29] flex items-center justify-center">
        <img
          src="/assets/aistudio/20261031_171524_0000_798e640e.png"
          alt="نور Knowledge Logo"
          className="w-full h-full object-cover scale-[1.38] rounded-full select-none"
          loading="eager"
        />
      </div>
    </div>
  );
};

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  className = '',
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center select-none cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95 ${className}`}
      title="نور"
      aria-label="نور Logo"
    >
      <AppLogoIcon size={size} />
    </button>
  );
};
