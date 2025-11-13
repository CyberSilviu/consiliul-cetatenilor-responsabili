import type { Category, Challenge } from './types';

export const INITIAL_BUDGET = 450000; // EUR
export const GAME_DURATION = 120; // seconds (2 minutes)
export const PHONE_CALL_1_TIME = 90; // seconds remaining (30s elapsed - early disruption)
export const PHONE_CALL_2_TIME = 60; // seconds remaining (60s elapsed - mid-game pressure, only if first call ignored)
export const WIN_THRESHOLD = 50; // 50% minimum for each category

export const categories: Category[] = [
  { id: 'ddiv', name: 'Dezvoltare durabilă și infrastructură vitală', color: '#10B981' }, // green
  { id: 'cec', name: 'Comunitate, educație și cultură', color: '#A855F7' }, // purple
  { id: 'cvcs', name: 'Calitatea vieții și coeziunea socială', color: '#3B82F6' }, // blue
];

export const challenges: Challenge[] = [
  // Dezvoltare durabilă și infrastructură vitală - Balanced costs and contributions (25-25% range)
  {
    id: 'a1',
    name: 'Reabilitarea rețelei de apă și canalizare',
    description: '',
    cost: 45000,
    category: 'ddiv',
    contribution: 20,
  },
  {
    id: 'a2',
    name: 'Stație nouă de tratare a apei și bazin de rezervă ',
    description: '',
    cost: 70000,
    category: 'ddiv',
    contribution: 25,
  },
  {
    id: 'a3',
    name: 'Modernizarea spitalelor și a policlinicilor',
    description: '',
    cost: 60000,
    category: 'ddiv',
    contribution: 20,
  },
  {
    id: 'a4',
    name: 'Extinderea și modernizarea infrastructurii rutiere și de acces la parcul industrial',
    description: '',
    cost: 65000,
    category: 'ddiv',
    contribution: 25,
  },
  {
    id: 'a5',
    name: 'Implementarea unui sistem inteligent de gestionare a deșeurilor',
    description: '',
    cost: 50000,
    category: 'ddiv',
    contribution: 20,
  },
  {
    id: 'a6',
    name: 'Construirea unui centru logistic intermodal (rutier-feroviar)',
    description: '',
    cost: 55000,
    category: 'ddiv',
    contribution: 22,
  },
  {
    id: 'a7',
    name: 'Piste pentru biciclete',
    description: '',
    cost: 25000,
    category: 'ddiv',
    contribution: 25,
  },
  {
    id: 'a8',
    name: 'Reîmpădurirea zonei periurbane',
    description: '',
    cost: 20000,
    category: 'ddiv',
    contribution: 25,
  },
  {
    id: 'a9',
    name: 'Panouri solare pe clădirile publice',
    description: '',
    cost: 40000,
    category: 'ddiv',
    contribution: 18,
  },

  // CVCS - Balanced costs and contributions (25-25% range)
  {
    id: 'i1',
    name: 'Modernizarea liceelor și dotarea cu laboratoare STEM',
    description: '',
    cost: 65000,
    category: 'cvcs',
    contribution: 24,
  },
  {
    id: 'i2',
    name: 'Extinderea și modernizarea grădinițelor și a creșelor',
    description: '',
    cost: 70000,
    category: 'cvcs',
    contribution: 25,
  },
  {
    id: 'i3',
    name: 'Crearea unui Centru cultural multifuncțional (cinema, expoziții, bibliotecă, muzeu)',
    description: '',
    cost: 40000,
    category: 'cvcs',
    contribution: 18,
  },
  {
    id: 'i4',
    name: 'Amenajarea centrului social pentru tineri și ONG-uri locale',
    description: '',
    cost: 45000,
    category: 'cvcs',
    contribution: 25,
  },
  {
    id: 'i5',
    name: 'Burse și programe de mentorat pentru elevi din medii vulnerabile și a celor merituoși',
    description: '',
    cost: 25000,
    category: 'cvcs',
    contribution: 20,
  },
  {
    id: 'i6',
    name: 'Organizarea „Zilei Orașului”',
    description: '',
    cost: 65000,
    category: 'cvcs',
    contribution: 17,
  },
  {
    id: 'i7',
    name: 'Dezvoltarea unui parc tehnologic pentru start-up-uri locale și tineri antreprenori',
    description: '',
    cost: 30000,
    category: 'cvcs',
    contribution: 25,
  },
  {
    id: 'i8',
    name: 'Reabilitarea spațiilor verzi și crearea de zone de recreere moderne pentru comunitate',
    description: '',
    cost: 58000,
    category: 'cvcs',
    contribution: 25,
  },
  {
    id: 'i9',
    name: 'Implementarea unui program de educație ecologică și digitală în școli',
    description: '',
    cost: 22000,
    category: 'cvcs',
    contribution: 22,
  },
  {
    id: 'i10',
    name: 'Calamitate naturală',
    description: 'O inundație a distrus infrastructura școlii',
    cost: 50000,
    category: 'cvcs',
    contribution: 30,
  },

  // CEC - Balanced costs and contributions (25-25% range)
  {
    id: 'e1',
    name: 'Extinderea parcului central și zone de agrement, crearea unui centru pentru tineret',
    description: '',
    cost: 48000,
    category: 'cec',
    contribution: 20,
  },
  {
    id: 'e2',
    name: 'Amenajare terenuri sportive',
    description: '',
    cost: 40000,
    category: 'cec',
    contribution: 22,
  },
  {
    id: 'e3',
    name: 'Program de îngrijire la domiciliu pentru vârstnici singuri',
    description: '',
    cost: 45000,
    category: 'cec',
    contribution: 17,
  },
  {
    id: 'e4',
    name: 'Locuințe pentru tineri specialiști (profesori, medici)',
    description: '',
    cost: 100000,
    category: 'cec',
    contribution: 45,
  },
  {
    id: 'e5',
    name: 'Crearea unei rețele de transport public electric',
    description: '',
    cost: 65000,
    category: 'cec',
    contribution: 24,
  },
  {
    id: 'e6',
    name: 'Sprijin pentru familiile vulnerabile',
    description: '',
    cost: 35000,
    category: 'cec',
    contribution: 20,
  },
  {
    id: 'e7',
    name: '7.	Reabilitarea centrului social și crearea unui centru pentru persoane cu dizabilități',
    description: '',
    cost: 38000,
    category: 'cec',
    contribution: 18,
  },
  {
    id: 'e8',
    name: 'Implementarea unui program de eficiență energetică pentru clădirile publice și locuințe (Anvelopare Clădiri)',
    description: '',
    cost: 60000,
    category: 'cec',
    contribution: 20,
  },
  {
    id: 'e9',
    name: 'Dezvoltarea unui incubator de afaceri locale și programe de formare profesională pentru tineri',
    description: '',
    cost: 45000,
    category: 'cec',
    contribution: 19,
  },
];

// Helper function to get category by id
export const getCategoryById = (id: string): Category | undefined => {
  return categories.find((cat) => cat.id === id);
};

// Helper function to get challenge by id
export const getChallengeById = (id: string): Challenge | undefined => {
  return challenges.find((ch) => ch.id === id);
};
