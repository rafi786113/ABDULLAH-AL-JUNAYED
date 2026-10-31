/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CityData {
  city: string;
  cityBn: string;
  division?: string;
  country: string;
  countryBn: string;
  lat: number;
  lon: number;
  isBdDistrict?: boolean;
}

/**
 * Complete list of all 64 District headquarters / cities of Bangladesh
 * with precise geographic coordinates for accurate Islamic prayer times and Qibla calculation.
 */
export const BANGLADESH_CITIES: CityData[] = [
  // Dhaka Division
  { city: 'Dhaka', cityBn: 'ঢাকা', division: 'Dhaka', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.8103, lon: 90.4125, isBdDistrict: true },
  { city: 'Gazipur', cityBn: 'গাজীপুর', division: 'Dhaka', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.9999, lon: 90.4203, isBdDistrict: true },
  { city: 'Narayanganj', cityBn: 'নারায়ণগঞ্জ', division: 'Dhaka', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.6238, lon: 90.5000, isBdDistrict: true },
  { city: 'Tangail', cityBn: 'টাঙ্গাইল', division: 'Dhaka', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 24.2513, lon: 89.9167, isBdDistrict: true },
  { city: 'Faridpur', cityBn: 'ফরিদপুর', division: 'Dhaka', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.6071, lon: 89.8429, isBdDistrict: true },
  { city: 'Manikganj', cityBn: 'মানিকগঞ্জ', division: 'Dhaka', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.8617, lon: 90.0003, isBdDistrict: true },
  { city: 'Munshiganj', cityBn: 'মুন্সীগঞ্জ', division: 'Dhaka', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.5422, lon: 90.5305, isBdDistrict: true },
  { city: 'Narsingdi', cityBn: 'নরসিংদী', division: 'Dhaka', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.9322, lon: 90.7154, isBdDistrict: true },
  { city: 'Gopalganj', cityBn: 'গোপালগঞ্জ', division: 'Dhaka', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.0051, lon: 89.8266, isBdDistrict: true },
  { city: 'Madaripur', cityBn: 'মাদারীপুর', division: 'Dhaka', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.1641, lon: 90.1897, isBdDistrict: true },
  { city: 'Rajbari', cityBn: 'রাজবাড়ী', division: 'Dhaka', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.7574, lon: 89.6445, isBdDistrict: true },
  { city: 'Shariatpur', cityBn: 'শরীয়তপুর', division: 'Dhaka', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.2423, lon: 90.4348, isBdDistrict: true },
  { city: 'Kishoreganj', cityBn: 'কিশোরগঞ্জ', division: 'Dhaka', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 24.4449, lon: 90.7766, isBdDistrict: true },

  // Chattogram Division
  { city: 'Chattogram (Chittagong)', cityBn: 'চট্টগ্রাম', division: 'Chattogram', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 22.3569, lon: 91.7832, isBdDistrict: true },
  { city: "Cox's Bazar", cityBn: 'কক্সবাজার', division: 'Chattogram', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 21.4272, lon: 92.0058, isBdDistrict: true },
  { city: 'Cumilla (Comilla)', cityBn: 'কুমিল্লা', division: 'Chattogram', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.4607, lon: 91.1809, isBdDistrict: true },
  { city: 'Feni', cityBn: 'ফেনী', division: 'Chattogram', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.0186, lon: 91.3966, isBdDistrict: true },
  { city: 'Brahmanbaria', cityBn: 'ব্রাহ্মণবাড়িয়া', division: 'Chattogram', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.9571, lon: 91.1119, isBdDistrict: true },
  { city: 'Noakhali (Maijdee)', cityBn: 'নোয়াখালী', division: 'Chattogram', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 22.8696, lon: 91.0998, isBdDistrict: true },
  { city: 'Chandpur', cityBn: 'চাঁদপুর', division: 'Chattogram', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.2333, lon: 90.6667, isBdDistrict: true },
  { city: 'Lakshmipur', cityBn: 'লক্ষ্মীপুর', division: 'Chattogram', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 22.9425, lon: 90.8412, isBdDistrict: true },
  { city: 'Rangamati', cityBn: 'রাঙ্গামাটি', division: 'Chattogram', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 22.6533, lon: 92.1753, isBdDistrict: true },
  { city: 'Bandarban', cityBn: 'বান্দরবান', division: 'Chattogram', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 22.1953, lon: 92.2184, isBdDistrict: true },
  { city: 'Khagrachhari', cityBn: 'খাগড়াছড়ি', division: 'Chattogram', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.1193, lon: 91.9847, isBdDistrict: true },

  // Sylhet Division
  { city: 'Sylhet', cityBn: 'সিলেট', division: 'Sylhet', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 24.8949, lon: 91.8687, isBdDistrict: true },
  { city: 'Moulvibazar', cityBn: 'মৌলভীবাজার', division: 'Sylhet', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 24.4829, lon: 91.7774, isBdDistrict: true },
  { city: 'Habiganj', cityBn: 'হবিগঞ্জ', division: 'Sylhet', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 24.3749, lon: 91.4155, isBdDistrict: true },
  { city: 'Sunamganj', cityBn: 'সুনামগঞ্জ', division: 'Sylhet', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 25.0658, lon: 91.3950, isBdDistrict: true },

  // Rajshahi Division
  { city: 'Rajshahi', cityBn: 'রাজশাহী', division: 'Rajshahi', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 24.3745, lon: 88.6042, isBdDistrict: true },
  { city: 'Bogura (Bogra)', cityBn: 'বগুড়া', division: 'Rajshahi', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 24.8465, lon: 89.3770, isBdDistrict: true },
  { city: 'Pabna', cityBn: 'পাবনা', division: 'Rajshahi', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 24.0064, lon: 89.2372, isBdDistrict: true },
  { city: 'Sirajganj', cityBn: 'সিরাজগঞ্জ', division: 'Rajshahi', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 24.4534, lon: 89.7008, isBdDistrict: true },
  { city: 'Naogaon', cityBn: 'নওগাঁ', division: 'Rajshahi', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 24.7936, lon: 88.9318, isBdDistrict: true },
  { city: 'Natore', cityBn: 'নাটোর', division: 'Rajshahi', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 24.4206, lon: 89.0003, isBdDistrict: true },
  { city: 'Chapai Nawabganj', cityBn: 'চাঁপাইনবাবগঞ্জ', division: 'Rajshahi', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 24.5965, lon: 88.2775, isBdDistrict: true },
  { city: 'Joypurhat', cityBn: 'জয়পুরহাট', division: 'Rajshahi', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 25.1015, lon: 89.0270, isBdDistrict: true },

  // Khulna Division
  { city: 'Khulna', cityBn: 'খুলনা', division: 'Khulna', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 22.8456, lon: 89.5403, isBdDistrict: true },
  { city: 'Jashore (Jessore)', cityBn: 'যশোর', division: 'Khulna', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.1664, lon: 89.2137, isBdDistrict: true },
  { city: 'Kushtia', cityBn: 'কুষ্টিয়া', division: 'Khulna', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.9013, lon: 89.1205, isBdDistrict: true },
  { city: 'Satkhira', cityBn: 'সাতক্ষীরা', division: 'Khulna', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 22.7185, lon: 89.0705, isBdDistrict: true },
  { city: 'Bagerhat', cityBn: 'বাগেরহাট', division: 'Khulna', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 22.6516, lon: 89.7859, isBdDistrict: true },
  { city: 'Jhenaidah', cityBn: 'ঝিনাইদহ', division: 'Khulna', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.5450, lon: 89.1726, isBdDistrict: true },
  { city: 'Chuadanga', cityBn: 'চুয়াডাঙ্গা', division: 'Khulna', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.6402, lon: 88.8418, isBdDistrict: true },
  { city: 'Magura', cityBn: 'মাগুরা', division: 'Khulna', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.4873, lon: 89.4198, isBdDistrict: true },
  { city: 'Meherpur', cityBn: 'মেহেরপুর', division: 'Khulna', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.7622, lon: 88.6318, isBdDistrict: true },
  { city: 'Narail', cityBn: 'নড়াইল', division: 'Khulna', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 23.1725, lon: 89.5127, isBdDistrict: true },

  // Barishal Division
  { city: 'Barishal', cityBn: 'বরিশাল', division: 'Barishal', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 22.7010, lon: 90.3535, isBdDistrict: true },
  { city: 'Patuakhali', cityBn: 'পটুয়াখালী', division: 'Barishal', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 22.3596, lon: 90.3299, isBdDistrict: true },
  { city: 'Bhola', cityBn: 'ভোলা', division: 'Barishal', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 22.6859, lon: 90.6481, isBdDistrict: true },
  { city: 'Pirojpur', cityBn: 'পিরোজপুর', division: 'Barishal', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 22.5841, lon: 89.9720, isBdDistrict: true },
  { city: 'Barguna', cityBn: 'বরগুনা', division: 'Barishal', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 22.0953, lon: 90.1121, isBdDistrict: true },
  { city: 'Jhalokati', cityBn: 'ঝালকাঠি', division: 'Barishal', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 22.6406, lon: 90.1987, isBdDistrict: true },

  // Rangpur Division
  { city: 'Rangpur', cityBn: 'রংপুর', division: 'Rangpur', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 25.7439, lon: 89.2752, isBdDistrict: true },
  { city: 'Dinajpur', cityBn: 'দিনাজপুর', division: 'Rangpur', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 25.6217, lon: 88.6355, isBdDistrict: true },
  { city: 'Gaibandha', cityBn: 'গাইবান্ধা', division: 'Rangpur', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 25.3288, lon: 89.5403, isBdDistrict: true },
  { city: 'Kurigram', cityBn: 'কুড়িগ্রাম', division: 'Rangpur', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 25.8054, lon: 89.6362, isBdDistrict: true },
  { city: 'Lalmonirhat', cityBn: 'লালমনিরহাট', division: 'Rangpur', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 25.9923, lon: 89.2847, isBdDistrict: true },
  { city: 'Nilphamari (Saidpur)', cityBn: 'নীলফামারী', division: 'Rangpur', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 25.9318, lon: 88.8560, isBdDistrict: true },
  { city: 'Panchagarh', cityBn: 'পঞ্চগড়', division: 'Rangpur', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 26.3411, lon: 88.5542, isBdDistrict: true },
  { city: 'Thakurgaon', cityBn: 'ঠাকুরগাঁও', division: 'Rangpur', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 26.0337, lon: 88.4617, isBdDistrict: true },

  // Mymensingh Division
  { city: 'Mymensingh', cityBn: 'ময়মনসিংহ', division: 'Mymensingh', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 24.7471, lon: 90.4203, isBdDistrict: true },
  { city: 'Jamalpur', cityBn: 'জামালপুর', division: 'Mymensingh', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 24.9375, lon: 89.9378, isBdDistrict: true },
  { city: 'Netrokona', cityBn: 'নেত্রকোণা', division: 'Mymensingh', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 24.8709, lon: 90.7279, isBdDistrict: true },
  { city: 'Sherpur', cityBn: 'শেরপুর', division: 'Mymensingh', country: 'Bangladesh', countryBn: 'বাংলাদেশ', lat: 25.0205, lon: 90.0153, isBdDistrict: true },

  // Holy Islamic & Key International Cities
  { city: 'Makkah al-Mukarramah', cityBn: 'মক্কা মুকাররমা', country: 'Saudi Arabia', countryBn: 'সৌদি আরব', lat: 21.4225, lon: 39.8262 },
  { city: 'Madinah al-Munawwarah', cityBn: 'মদীনা মুনাওয়ারা', country: 'Saudi Arabia', countryBn: 'সৌদি আরব', lat: 24.4672, lon: 39.6111 },
  { city: 'Al-Quds (Jerusalem)', cityBn: 'বায়তুল মুকাদ্দাস (জেরুজালেম)', country: 'Palestine', countryBn: 'ফিলিস্তিন', lat: 31.7683, lon: 35.2137 },
  { city: 'London', cityBn: 'লন্ডন', country: 'United Kingdom', countryBn: 'যুক্তরাজ্য', lat: 51.5074, lon: -0.1278 },
  { city: 'New York', cityBn: 'নিউ ইয়র্ক', country: 'United States', countryBn: 'যুক্তরাষ্ট্র', lat: 40.7128, lon: -74.0060 },
  { city: 'Dubai', cityBn: 'দুবাই', country: 'United Arab Emirates', countryBn: 'সংযুক্ত আরব আমিরাত', lat: 25.2048, lon: 55.2708 },
  { city: 'Kuala Lumpur', cityBn: 'কুয়ালালামপুর', country: 'Malaysia', countryBn: 'মালয়েশিয়া', lat: 3.1390, lon: 101.6869 },
  { city: 'Istanbul', cityBn: 'ইস্তাম্বুল', country: 'Turkey', countryBn: 'তুরস্ক', lat: 41.0082, lon: 28.9784 },
  { city: 'Cairo', cityBn: 'কায়রো', country: 'Egypt', countryBn: 'মিশর', lat: 30.0444, lon: 31.2357 },
];

export const BD_DIVISIONS = [
  'All Divisions',
  'Dhaka',
  'Chattogram',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Rangpur',
  'Mymensingh',
];
