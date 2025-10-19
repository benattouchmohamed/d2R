export interface Offer {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy';
  timeEstimate: string;
  icon: string;
  url: string;
  image?: string;
  type?: string;
  epc?: number;
  payout?: number;
}

interface ApiOffer {
  offerid?: string;
  name?: string;
  name_short?: string;
  description?: string;
  adcopy?: string;
  picture?: string;
  payout?: string;
  country?: string;
  device?: string;
  link?: string;
  epc?: string;
  category?: string;
}

interface ApiOfferResponse {
  success?: boolean;
  error?: string | null;
  offers?: ApiOffer[];
}

const API_BASE_URL = 'https://unlockcontent.net/api/v2';
const API_TOKEN = '32448|19Qy5BpANljlYzaK2NZLyV2WjChiAMUXR28Zd6lqb4757085';

const getOfferIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
    game: 'game',
    survey: 'survey',
    app: 'app',
    video: 'video',
    social: 'social',
    default: 'gift',
  };
  return iconMap[category.toLowerCase()] || iconMap.default;
};

const inferCategory = (name: string, description: string): string => {
  const lowerName = (name || '').toLowerCase();
  const lowerDesc = (description || '').toLowerCase();
  if (lowerName.includes('game') || lowerDesc.includes('game')) return 'game';
  if (lowerName.includes('survey') || lowerDesc.includes('survey')) return 'survey';
  if (lowerName.includes('app') || lowerDesc.includes('install')) return 'app';
  if (lowerName.includes('video') || lowerDesc.includes('video')) return 'video';
  if (lowerName.includes('social') || lowerDesc.includes('social')) return 'social';
  return 'default';
};

const getVisitorIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) throw new Error('IP fetch failed');
    const data = await response.json();
    return data.ip || '127.0.0.1';
  } catch {
    return '127.0.0.1';
  }
};

const mapApiOfferToOffer = (apiOffer: ApiOffer, index: number): Offer => {
  const category = apiOffer.category ?? inferCategory(apiOffer.name ?? '', apiOffer.description ?? '');
  return {
    id: apiOffer.offerid ?? `offer-${index}`,
    title: apiOffer.name_short ?? apiOffer.name ?? 'Special Offer',
    description: apiOffer.adcopy ?? apiOffer.description ?? 'Complete this offer',
    difficulty: 'Easy',
    timeEstimate: apiOffer.device?.includes('Android') ? '5 min' : '3 min',
    icon: getOfferIcon(category),
    url: apiOffer.link ?? 'https://areyourealhuman.com/cl/i/g6pqp2',
    image: apiOffer.picture,
    type: category,
    epc: apiOffer.epc ? parseFloat(apiOffer.epc) : 0,
    payout: apiOffer.payout ? parseFloat(apiOffer.payout) : 0,
  };
};

export async function fetchOffers(): Promise<Offer[]> {
  try {
    const visitorIP = await getVisitorIP();
    const userAgent = navigator.userAgent;

    const params = new URLSearchParams({
      ip: visitorIP,
      user_agent: userAgent,
      max: '6',
      min: '3',
      ctype: '7',
    });

    const response = await fetch(`${API_BASE_URL}?${params}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const apiData: ApiOfferResponse = await response.json();
    if (!apiData.success) {
      throw new Error(apiData.error || 'API returned unsuccessful response');
    }

    // Map API offers and store payout/epc for sorting
    const offerWithMeta = (apiData.offers ?? []).map((offer, index) => ({
      offer: mapApiOfferToOffer(offer, index),
      payout: parseFloat(offer.payout || '0'),
      epc: parseFloat(offer.epc || '0'),
    }));

    // Sort by payout desc, then EPC desc
    offerWithMeta.sort((a, b) => {
      if (a.payout !== b.payout) {
        return b.payout - a.payout;
      }
      return b.epc - a.epc;
    });

    return offerWithMeta.map(o => o.offer);
  } catch (error) {
    console.error('Offer fetch failed:', error);
    return [];
  }
}

export async function displayTopPayoutOffer(): Promise<string> {
  const offers = await fetchOffers();
  if (offers.length === 0) {
    return 'No offers available.';
  }

  const topOffer = offers[0];

  return `Top Payout Offer:
Title: ${topOffer.title}
Payout: $${topOffer.payout?.toFixed(2) || 'N/A'}
EPC: $${topOffer.epc?.toFixed(4) || 'N/A'}
Category: ${topOffer.type || 'Unknown'}
Time Estimate: ${topOffer.timeEstimate}
Description: ${topOffer.description}
URL: ${topOffer.url}`;
}
