import { AgriculturalOfficer, SupportedLanguage } from '../types';

/**
 * Agricultural Officer Directory
 * Indian agricultural extension services database
 * This is a starter database - can be expanded with more officers
 */

export const AGRICULTURAL_OFFICERS: AgriculturalOfficer[] = [
  // Maharashtra - Nashik District
  {
    id: 'ag_mh_nashik_001',
    name: 'राज कुमार शर्मा',
    designation: 'जिला कृषि अधिकारी',
    phone: '0253-2570100',
    email: 'nashik.agriculture@maharashtra.gov.in',
    office: 'District Agriculture Office, Nashik',
    district: 'Nashik',
    state: 'Maharashtra',
    expertise: ['sugarcane', 'wheat', 'onion', 'potato', 'cotton'],
    languages: ['hi', 'mr', 'en'],
    availability: 'available',
    ratings: 4.5,
  },
  {
    id: 'ag_mh_nashik_002',
    name: 'सीता देशमुख',
    designation: 'सहायक कृषि अधिकारी',
    phone: '0253-2570101',
    email: 'nashik.aaao@maharashtra.gov.in',
    office: 'Block Agriculture Office, Nashik',
    district: 'Nashik',
    state: 'Maharashtra',
    expertise: ['vegetables', 'horticulture', 'fruits', 'organic farming'],
    languages: ['hi', 'mr', 'en'],
    availability: 'available',
    ratings: 4.7,
  },

  // Karnataka - Belgaum District
  {
    id: 'ag_ka_belgaum_001',
    name: 'Dr. Ramesh Kumar',
    designation: 'Deputy Director of Agriculture',
    phone: '0831-2402223',
    email: 'belgaum.agri@karnataka.gov.in',
    office: 'District Agriculture Office, Belgaum',
    district: 'Belgaum',
    state: 'Karnataka',
    expertise: ['sugarcane', 'sorghum', 'cotton', 'jowar'],
    languages: ['kn', 'hi', 'en'],
    availability: 'available',
    ratings: 4.6,
  },

  // Uttar Pradesh - Lucknow District
  {
    id: 'ag_up_lucknow_001',
    name: 'विकास कुमार सिंह',
    designation: 'जिला कृषि अधिकारी',
    phone: '0522-2618100',
    email: 'lucknow.agriculture@up.gov.in',
    office: 'District Agriculture Office, Lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    expertise: ['rice', 'wheat', 'sugarcane', 'potato', 'vegetables'],
    languages: ['hi', 'en', 'pa'],
    availability: 'available',
    ratings: 4.4,
  },

  // Tamil Nadu - Coimbatore District
  {
    id: 'ag_tn_coimbatore_001',
    name: 'K. Senthil Kumar',
    designation: 'District Agriculture Officer',
    phone: '0422-2414888',
    email: 'coimbatore.agri@tnau.ac.in',
    office: 'District Agriculture Office, Coimbatore',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    expertise: ['cotton', 'sugarcane', 'spices', 'coconut', 'fruits'],
    languages: ['ta', 'en', 'hi'],
    availability: 'available',
    ratings: 4.8,
  },

  // Punjab - Ludhiana District
  {
    id: 'ag_pb_ludhiana_001',
    name: 'हरप्रीत सिंह',
    designation: 'District Agriculture Officer',
    phone: '0161-5030013',
    email: 'ludhiana.agri@punjab.gov.in',
    office: 'District Agriculture Office, Ludhiana',
    district: 'Ludhiana',
    state: 'Punjab',
    expertise: ['wheat', 'rice', 'maize', 'cotton', 'vegetables'],
    languages: ['pa', 'hi', 'en'],
    availability: 'available',
    ratings: 4.5,
  },

  // Telangana - Hyderabad District
  {
    id: 'ag_tg_hyderabad_001',
    name: 'డా. సుధీర్ కుమార్',
    designation: 'Principal Agriculture Officer',
    phone: '040-23420111',
    email: 'hyderabad.agri@telangana.gov.in',
    office: 'ZilaKrishiKaryalayam, Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    expertise: ['rice', 'cotton', 'chilly', 'turmeric', 'mango'],
    languages: ['te', 'en', 'hi'],
    availability: 'available',
    ratings: 4.3,
  },

  // Gujarat - Ahmedabad District
  {
    id: 'ag_gu_ahmedabad_001',
    name: 'જયેશ પટેલ',
    designation: 'District Agriculture Officer',
    phone: '079-22941234',
    email: 'ahmedabad.agri@gujarat.gov.in',
    office: 'District Agriculture Office, Ahmedabad',
    district: 'Ahmedabad',
    state: 'Gujarat',
    expertise: ['cotton', 'groundnut', 'soybean', 'vegetables'],
    languages: ['gu', 'en', 'hi'],
    availability: 'available',
    ratings: 4.2,
  },

  // West Bengal - Kolkata District
  {
    id: 'ag_wb_kolkata_001',
    name: 'রহিম আহমেদ',
    designation: 'District Agriculture Officer',
    phone: '033-22151234',
    email: 'kolkata.agri@wbagri.gov.in',
    office: 'District Agriculture Office, Kolkata',
    district: 'Kolkata',
    state: 'West Bengal',
    expertise: ['rice', 'vegetables', 'fish farming', 'jute'],
    languages: ['bn', 'en', 'hi'],
    availability: 'available',
    ratings: 4.1,
  },

  // Andhra Pradesh - Visakhapatnam District
  {
    id: 'ag_ap_visakhapatnam_001',
    name: 'చక్రవర్తి నారాయణ',
    designation: 'District Agriculture Officer',
    phone: '0891-2842222',
    email: 'visakhapatnam.agri@apagric.gov.in',
    office: 'District Agriculture Office, Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    expertise: ['rice', 'groundnut', 'vegetables', 'spices', 'fruits'],
    languages: ['te', 'en', 'hi'],
    availability: 'available',
    ratings: 4.4,
  },

  // Haryana - Hisar District
  {
    id: 'ag_hr_hisar_001',
    name: 'विजय शर्मा',
    designation: 'District Agriculture Officer',
    phone: '01662-246234',
    email: 'hisar.agri@haryana.gov.in',
    office: 'District Agriculture Office, Hisar',
    district: 'Hisar',
    state: 'Haryana',
    expertise: ['wheat', 'cotton', 'groundnut', 'vegetables'],
    languages: ['hi', 'en', 'pa'],
    availability: 'available',
    ratings: 4.3,
  },
];

/**
 * Find officers by district
 */
export function getOfficersByDistrict(district: string): AgriculturalOfficer[] {
  return AGRICULTURAL_OFFICERS.filter(
    officer => officer.district.toLowerCase() === district.toLowerCase()
  );
}

/**
 * Find officers by state
 */
export function getOfficersByState(state: string): AgriculturalOfficer[] {
  return AGRICULTURAL_OFFICERS.filter(
    officer => officer.state.toLowerCase() === state.toLowerCase()
  );
}

/**
 * Find officers by expertise (crop type)
 */
export function getOfficersByExpertise(crop: string): AgriculturalOfficer[] {
  return AGRICULTURAL_OFFICERS.filter(officer =>
    officer.expertise.some(
      exp => exp.toLowerCase() === crop.toLowerCase()
    )
  );
}

/**
 * Find officers by language capability
 */
export function getOfficersByLanguage(
  language: SupportedLanguage
): AgriculturalOfficer[] {
  return AGRICULTURAL_OFFICERS.filter(officer =>
    officer.languages.includes(language)
  );
}

/**
 * Search officers by multiple criteria
 */
export function searchOfficers(criteria: {
  district?: string;
  state?: string;
  crop?: string;
  language?: SupportedLanguage;
}): AgriculturalOfficer[] {
  let results = AGRICULTURAL_OFFICERS;

  if (criteria.district) {
    results = results.filter(
      o => o.district.toLowerCase() === criteria.district!.toLowerCase()
    );
  }

  if (criteria.state) {
    results = results.filter(
      o => o.state.toLowerCase() === criteria.state!.toLowerCase()
    );
  }

  if (criteria.crop) {
    results = results.filter(o =>
      o.expertise.some(
        exp => exp.toLowerCase() === criteria.crop!.toLowerCase()
      )
    );
  }

  if (criteria.language) {
    results = results.filter(o => o.languages.includes(criteria.language!));
  }

  return results;
}

/**
 * Get top-rated officers
 */
export function getTopRatedOfficers(limit: number = 5): AgriculturalOfficer[] {
  return AGRICULTURAL_OFFICERS.sort(
    (a, b) => (b.ratings || 0) - (a.ratings || 0)
  ).slice(0, limit);
}

/**
 * Format officer info for display
 */
export function formatOfficerInfo(officer: AgriculturalOfficer): string {
  return `
📞 ${officer.name}
🏢 ${officer.designation}
🏛️ ${officer.office}
📍 ${officer.district}, ${officer.state}
📱 ${officer.phone}${officer.email ? `\n📧 ${officer.email}` : ''}
🌾 Expertise: ${officer.expertise.join(', ')}
🌍 Languages: ${officer.languages.map(l => (l === 'hi' ? 'हिंदी' : l === 'mr' ? 'मराठी' : l === 'en' ? 'English' : l)).join(', ')}
⭐ Rating: ${officer.ratings ? `${officer.ratings}/5` : 'Not rated'}
`.trim();
}

/**
 * Cache officers locally for offline access
 */
export function cacheOfficers(): void {
  try {
    localStorage.setItem('cachedOfficers', JSON.stringify({
      data: AGRICULTURAL_OFFICERS,
      cachedAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.warn('Could not cache officers:', error);
  }
}

/**
 * Get cached officers
 */
export function getCachedOfficers(): AgriculturalOfficer[] | null {
  try {
    const cached = localStorage.getItem('cachedOfficers');
    if (cached) {
      const data = JSON.parse(cached);
      // Cache valid for 24 hours
      const cacheAge = Date.now() - new Date(data.cachedAt).getTime();
      if (cacheAge < 24 * 60 * 60 * 1000) {
        return data.data;
      }
    }
  } catch (error) {
    console.warn('Could not retrieve cached officers:', error);
  }
  return null;
}

// Cache officers on service load
cacheOfficers();
