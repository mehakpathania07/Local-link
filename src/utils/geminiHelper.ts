import { GoogleGenAI } from '@google/genai';
import { PROVIDERS, CATEGORIES } from '../data/mockData';
import { Provider } from '../types';

export interface AssistantMatchResult {
  suggestedCategoryId?: string;
  recommendedProviders: Provider[];
  adviceSummary: string;
  suggestedQuestions: string[];
  estimatedCostRange: string;
}

export async function matchServiceWithAI(query: string, townFilter: string = 'Oakridge'): Promise<AssistantMatchResult> {
  const lowerQuery = query.toLowerCase();

  // Keyword heuristic scoring
  let matchedCategoryId: string | undefined = undefined;
  for (const cat of CATEGORIES) {
    if (
      lowerQuery.includes(cat.id) ||
      lowerQuery.includes(cat.name.toLowerCase()) ||
      cat.popularServices.some((s) => lowerQuery.includes(s.toLowerCase()))
    ) {
      matchedCategoryId = cat.id;
      break;
    }
  }

  if (!matchedCategoryId) {
    if (lowerQuery.includes('leak') || lowerQuery.includes('sink') || lowerQuery.includes('drain') || lowerQuery.includes('pipe') || lowerQuery.includes('water heater') || lowerQuery.includes('clog')) {
      matchedCategoryId = 'plumber';
    } else if (lowerQuery.includes('outlet') || lowerQuery.includes('wire') || lowerQuery.includes('ev charger') || lowerQuery.includes('breaker') || lowerQuery.includes('light') || lowerQuery.includes('electric')) {
      matchedCategoryId = 'electrician';
    } else if (lowerQuery.includes('wood') || lowerQuery.includes('shelf') || lowerQuery.includes('door') || lowerQuery.includes('cabinet') || lowerQuery.includes('table') || lowerQuery.includes('deck')) {
      matchedCategoryId = 'carpenter';
    } else if (lowerQuery.includes('clean') || lowerQuery.includes('dust') || lowerQuery.includes('mop') || lowerQuery.includes('move out') || lowerQuery.includes('maid')) {
      matchedCategoryId = 'cleaner';
    } else if (lowerQuery.includes('math') || lowerQuery.includes('sat') || lowerQuery.includes('physics') || lowerQuery.includes('tutor') || lowerQuery.includes('homework') || lowerQuery.includes('calculus')) {
      matchedCategoryId = 'tutor';
    } else if (lowerQuery.includes('paint') || lowerQuery.includes('drywall') || lowerQuery.includes('stain') || lowerQuery.includes('wall')) {
      matchedCategoryId = 'painter';
    } else if (lowerQuery.includes('photo') || lowerQuery.includes('portrait') || lowerQuery.includes('camera') || lowerQuery.includes('shoot') || lowerQuery.includes('wedding')) {
      matchedCategoryId = 'photographer';
    } else if (lowerQuery.includes('fridge') || lowerQuery.includes('washer') || lowerQuery.includes('dryer') || lowerQuery.includes('appliance') || lowerQuery.includes('oven')) {
      matchedCategoryId = 'repair';
    }
  }

  // Filter relevant providers
  let matchedProviders = PROVIDERS.filter((p) => {
    if (matchedCategoryId && p.category === matchedCategoryId) return true;
    return (
      p.skills.some((sk) => lowerQuery.includes(sk.toLowerCase())) ||
      p.shortBio.toLowerCase().includes(lowerQuery)
    );
  });

  if (matchedProviders.length === 0) {
    matchedProviders = PROVIDERS.slice(0, 3);
  }

  // Generate customized advice
  let advice = '';
  let cost = '$50 - $120 / hr';
  let questions = [
    'Are you looking for emergency service or scheduled visit?',
    'Do you already have the replacement parts or materials?',
    'What town or neighborhood are you located in?',
  ];

  if (matchedCategoryId === 'plumber') {
    advice = `Based on your description, this is a plumbing concern. For sudden leaks, first locate your main water shutoff valve under the sink or in the basement. Our verified plumbers in ${townFilter} can inspect the line and replace damaged fittings with copper or PEX connections.`;
    cost = '$65 - $140 typical fix';
    questions = ['Is water currently active or shut off?', 'Is it in the kitchen, bath, or main basement line?', 'Do you notice low water pressure elsewhere?'];
  } else if (matchedCategoryId === 'electrician') {
    advice = `Electrical issues should always be handled by licensed professionals to comply with local building code. Our local electricians in ${townFilter} carry specialized diagnostic equipment and breaker testers.`;
    cost = '$58 - $110 / hr + materials';
    questions = ['Is the breaker tripping immediately upon reset?', 'Are other outlets on the same circuit affected?', 'Is this for a new appliance or existing fixture?'];
  } else if (matchedCategoryId === 'carpenter') {
    advice = `Custom carpentry and alignment requires precise measuring and material matching. Our neighborhood craftsmen offer free on-site consultations to assess wood grain, structural studs, and finish coats.`;
    cost = '$55 - $75 / hr';
    questions = ['What type of wood finish do you prefer?', 'What are the approximate dimensions?', 'Is this for a new installation or repairing existing woodwork?'];
  } else if (matchedCategoryId === 'cleaner') {
    advice = `Our botanical and deep cleaning teams specialize in allergen-free, pet-safe products with HEPA filtration. You can choose single room deep cleans or complete home seasonal resets.`;
    cost = '$45 - $60 / hr or $140+ fixed flat rate';
    questions = ['How many bedrooms and bathrooms?', 'Are there pets in the home?', 'Do you need interior appliances (oven/fridge) cleaned?'];
  } else if (matchedCategoryId === 'tutor') {
    advice = `For academic coaching, our certified local tutors offer an initial diagnostic session to identify root conceptual gaps and build a personalized weekly study schedule.`;
    cost = '$50 - $70 / hr';
    questions = ['What grade level or course?', 'Do you prefer in-person at home/library or virtual?', 'Is there an upcoming exam or test date?'];
  } else {
    advice = `We found great local craftspeople and technicians ready to assist with your request in ${townFilter}. You can review their verified credentials, real neighbor reviews, and book directly.`;
    cost = '$50 - $100 typical range';
  }

  return {
    suggestedCategoryId: matchedCategoryId,
    recommendedProviders: matchedProviders,
    adviceSummary: advice,
    suggestedQuestions: questions,
    estimatedCostRange: cost,
  };
}
