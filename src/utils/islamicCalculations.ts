/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Coordinates of the Holy Kaaba in Makkah al-Mukarramah
export const KAABA_COORDS = {
  latitude: 21.422487,
  longitude: 39.826206,
};

export interface Coordinates {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  tahajjud: string;
  nextPrayer: {
    name: 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
    time: string;
    remainingMinutes: number;
  };
}

/**
 * Calculates the Qibla bearing (direction to the Kaaba) in degrees from True North (0°-360°)
 */
export function calculateQiblaBearing(lat: number, lon: number): number {
  const phi1 = (lat * Math.PI) / 180;
  const phi2 = (KAABA_COORDS.latitude * Math.PI) / 180;
  const deltaLambda = ((KAABA_COORDS.longitude - lon) * Math.PI) / 180;

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);

  let qiblaRad = Math.atan2(y, x);
  let qiblaDeg = (qiblaRad * 180) / Math.PI;

  return (qiblaDeg + 360) % 360;
}

/**
 * Calculates the great-circle distance to the Kaaba in kilometers
 */
export function calculateDistanceToKaaba(lat: number, lon: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((KAABA_COORDS.latitude - lat) * Math.PI) / 180;
  const dLon = ((KAABA_COORDS.longitude - lon) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((KAABA_COORDS.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Robust Astronomical Prayer Times Calculation
 */
export function calculatePrayerTimes(
  lat: number,
  lon: number,
  date: Date = new Date(),
  asrMethod: 'standard' | 'hanafi' = 'hanafi',
  fajrAngle: number = 18.0,
  ishaAngle: number = 17.5
): PrayerTimes {
  const dayOfYear = getDayOfYear(date);

  // Solar declination & Equation of Time
  const B = ((360 / 365) * (dayOfYear - 81) * Math.PI) / 180;
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B); // in minutes
  const declination = 23.45 * Math.sin(B); // in degrees

  const latRad = (lat * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;

  // Timezone offset in hours
  const timezoneOffsetHours = -date.getTimezoneOffset() / 60;

  // Solar Noon (Dhuhr) in local hours
  const solarNoonUtc = 12 - (lon / 15) - (eot / 60);
  const dhuhrHours = solarNoonUtc + timezoneOffsetHours;

  // Hour angle helper
  const hourAngle = (angle: number) => {
    const angleRad = (angle * Math.PI) / 180;
    const cosHA =
      (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(decRad)) /
      (Math.cos(latRad) * Math.cos(decRad));
    if (cosHA > 1 || cosHA < -1) return 0; // polar day/night handling
    return (Math.acos(cosHA) * 180) / Math.PI / 15;
  };

  // Sunrise / Sunset (Sun angle = -0.833° for refraction and semi-diameter)
  const sunriseSunsetHA = hourAngle(-0.833);
  const sunriseHours = dhuhrHours - sunriseSunsetHA;
  const sunsetHours = dhuhrHours + sunriseSunsetHA;

  // Fajr & Isha
  const fajrHA = hourAngle(-fajrAngle);
  const fajrHours = dhuhrHours - fajrHA;

  const ishaHA = hourAngle(-ishaAngle);
  const ishaHours = dhuhrHours + ishaHA;

  // Asr calculation
  const shadowFactor = asrMethod === 'hanafi' ? 2 : 1;
  const asrAltitude =
    (Math.atan(1 / (shadowFactor + Math.tan(Math.abs(latRad - decRad)))) * 180) / Math.PI;
  const asrHA = hourAngle(asrAltitude);
  const asrHours = dhuhrHours + asrHA;

  // Tahajjud (middle of last third of night: between Sunset and Fajr)
  const nightLength = (24 - sunsetHours + fajrHours) % 24;
  const tahajjudHours = (sunsetHours + (nightLength * 5) / 6) % 24;

  const formatTime = (hours: number) => {
    const totalMinutes = Math.round(hours * 60);
    const normalizedMinutes = ((totalMinutes % 1440) + 1440) % 1440;
    const h = Math.floor(normalizedMinutes / 60);
    const m = normalizedMinutes % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const toMinutes = (hours: number) => {
    return Math.round((((hours * 60) % 1440) + 1440) % 1440);
  };

  const nowMinutes = date.getHours() * 60 + date.getMinutes();

  const prayersList: Array<{ name: 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'; minutes: number; timeStr: string }> = [
    { name: 'Fajr', minutes: toMinutes(fajrHours), timeStr: formatTime(fajrHours) },
    { name: 'Sunrise', minutes: toMinutes(sunriseHours), timeStr: formatTime(sunriseHours) },
    { name: 'Dhuhr', minutes: toMinutes(dhuhrHours), timeStr: formatTime(dhuhrHours) },
    { name: 'Asr', minutes: toMinutes(asrHours), timeStr: formatTime(asrHours) },
    { name: 'Maghrib', minutes: toMinutes(sunsetHours), timeStr: formatTime(sunsetHours) },
    { name: 'Isha', minutes: toMinutes(ishaHours), timeStr: formatTime(ishaHours) },
  ];

  let nextPrayer = prayersList.find((p) => p.minutes > nowMinutes);
  let remainingMinutes = 0;

  if (!nextPrayer) {
    // Next is tomorrow's Fajr
    nextPrayer = prayersList[0];
    remainingMinutes = 1440 - nowMinutes + nextPrayer.minutes;
  } else {
    remainingMinutes = nextPrayer.minutes - nowMinutes;
  }

  return {
    fajr: formatTime(fajrHours),
    sunrise: formatTime(sunriseHours),
    dhuhr: formatTime(dhuhrHours),
    asr: formatTime(asrHours),
    maghrib: formatTime(sunsetHours),
    isha: formatTime(ishaHours),
    tahajjud: formatTime(tahajjudHours),
    nextPrayer: {
      name: nextPrayer.name,
      time: nextPrayer.timeStr,
      remainingMinutes,
    },
  };
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}
