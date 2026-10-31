/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';

export interface UserLocation {
  latitude: number;
  longitude: number;
  cityName: string;
  countryName: string;
  displayName: string;
}

const STORAGE_KEY = 'noor_user_location';

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDenied, setIsDenied] = useState<boolean>(false);

  const reverseGeocode = async (lat: number, lon: number): Promise<{ city: string; country: string }> => {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      if (res.ok) {
        const data = await res.json();
        const city = data.city || data.locality || data.principalSubdivision || 'Current Location';
        const country = data.countryName || '';
        return { city, country };
      }
    } catch {
      // Fallback reverse geocoding via Open-Meteo
    }
    return { city: `${lat.toFixed(2)}°N`, country: `${lon.toFixed(2)}°E` };
  };

  const requestLocation = useCallback((): Promise<UserLocation | null> => {
    return new Promise((resolve) => {
      setIsRequesting(true);
      setError(null);
      setIsDenied(false);

      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser or device.');
        setIsRequesting(false);
        setIsDenied(true);
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const geo = await reverseGeocode(lat, lon);

          const newLoc: UserLocation = {
            latitude: lat,
            longitude: lon,
            cityName: geo.city,
            countryName: geo.country,
            displayName: geo.country ? `${geo.city}, ${geo.country}` : geo.city,
          };

          setLocation(newLoc);
          setIsRequesting(false);
          setIsDenied(false);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newLoc));
          } catch {
            // ignore
          }
          resolve(newLoc);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setIsRequesting(false);
          setIsDenied(true);
          if (err.code === err.PERMISSION_DENIED) {
            setError('Location permission was denied. Please allow location in your browser settings to continue.');
          } else {
            setError('Could not retrieve your location. Please check GPS settings and try again.');
          }
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000,
        }
      );
    });
  }, []);

  const setManualLocation = useCallback((lat: number, lon: number, cityName: string, countryName: string = '') => {
    const newLoc: UserLocation = {
      latitude: lat,
      longitude: lon,
      cityName,
      countryName,
      displayName: countryName ? `${cityName}, ${countryName}` : cityName,
    };
    setLocation(newLoc);
    setIsDenied(false);
    setError(null);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLoc));
    } catch {
      // ignore
    }
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    location,
    isRequesting,
    error,
    isDenied,
    requestLocation,
    setManualLocation,
    clearLocation,
  };
}
