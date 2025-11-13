/**
 * Runtime configuration loader with validation
 * Loads game-config.json and validates all required fields
 */

export interface GameConfig {
  version: string;
  gameParams: GameParams;
  categories: CategoryConfig[];
  challenges: ChallengeConfig[];
  domains: string[];
  strings: StringsConfig;
  brandAssets: BrandAssetsConfig;
}

export interface GameParams {
  timerSeconds: number;
  totalBudget: number;
  minCategoryThreshold: number;
  lateAudioSpeedupStart: number;
  enableDataCapture: boolean;
  inspectorateEvent: {
    firstAt: number;
    secondAt: number;
    penaltyFirst: number;
    penaltySecond: number;
  };
}

export interface CategoryConfig {
  id: string;
  label: string;
  colorBands: {
    red: [number, number];
    orange: [number, number];
    green: [number, number];
  };
}

export interface ChallengeConfig {
  id: string;
  title: string;
  shortDesc: string;
  cost: number;
  effects: Record<string, number>;
  iconKey?: string;
}

export interface StringsConfig {
  ro: LocalizedStrings;
  en?: LocalizedStrings;
}

export interface LocalizedStrings {
  start: Record<string, string>;
  instructions: Record<string, string>;
  game: Record<string, string>;
  phoneCall: Record<string, string>;
  result: Record<string, string>;
}

export interface BrandAssetsConfig {
  logo: {
    gradientOnDark: string;
    white: string;
    dark: string;
    minSize: {
      width: number;
      height: number;
    };
    clearspace: number;
  };
  eyeGraphic: string;
  fonts: {
    primary: string;
    weights: string[];
  };
}

class ConfigValidationError extends Error {
  field: string;

  constructor(field: string, message: string) {
    super(`Config validation error at '${field}': ${message}`);
    this.name = 'ConfigValidationError';
    this.field = field;
  }
}

/**
 * Validate game configuration
 */
function validateConfig(config: any): GameConfig {
  // Validate gameParams
  if (!config.gameParams) {
    throw new ConfigValidationError('gameParams', 'Missing gameParams object');
  }

  const params = config.gameParams;

  if (typeof params.timerSeconds !== 'number' || params.timerSeconds <= 0) {
    throw new ConfigValidationError(
      'gameParams.timerSeconds',
      'Must be a positive number'
    );
  }

  if (typeof params.totalBudget !== 'number' || params.totalBudget <= 0) {
    throw new ConfigValidationError(
      'gameParams.totalBudget',
      'Must be a positive number'
    );
  }

  if (
    typeof params.minCategoryThreshold !== 'number' ||
    params.minCategoryThreshold < 0 ||
    params.minCategoryThreshold > 100
  ) {
    throw new ConfigValidationError(
      'gameParams.minCategoryThreshold',
      'Must be between 0 and 100'
    );
  }

  // Validate categories
  if (!Array.isArray(config.categories) || config.categories.length === 0) {
    throw new ConfigValidationError('categories', 'Must be a non-empty array');
  }

  const categoryIds = new Set<string>();
  for (const cat of config.categories) {
    if (!cat.id || typeof cat.id !== 'string') {
      throw new ConfigValidationError(
        'categories[].id',
        'Each category must have a string id'
      );
    }
    if (categoryIds.has(cat.id)) {
      throw new ConfigValidationError(
        'categories[].id',
        `Duplicate category id: ${cat.id}`
      );
    }
    categoryIds.add(cat.id);

    if (!cat.label || typeof cat.label !== 'string') {
      throw new ConfigValidationError(
        `categories[${cat.id}].label`,
        'Must have a label'
      );
    }
  }

  // Validate challenges
  if (!Array.isArray(config.challenges) || config.challenges.length === 0) {
    throw new ConfigValidationError('challenges', 'Must be a non-empty array');
  }

  for (const challenge of config.challenges) {
    if (!challenge.id || typeof challenge.id !== 'string') {
      throw new ConfigValidationError(
        'challenges[].id',
        'Each challenge must have a string id'
      );
    }

    if (typeof challenge.cost !== 'number' || challenge.cost < 0) {
      throw new ConfigValidationError(
        `challenges[${challenge.id}].cost`,
        'Cost must be a non-negative number'
      );
    }

    if (!challenge.effects || typeof challenge.effects !== 'object') {
      throw new ConfigValidationError(
        `challenges[${challenge.id}].effects`,
        'Must have effects object'
      );
    }

    // Validate that all effect category IDs exist
    for (const categoryId of Object.keys(challenge.effects)) {
      if (!categoryIds.has(categoryId)) {
        throw new ConfigValidationError(
          `challenges[${challenge.id}].effects`,
          `Unknown category id: ${categoryId}`
        );
      }

      const value = challenge.effects[categoryId];
      if (typeof value !== 'number' || value < 0) {
        throw new ConfigValidationError(
          `challenges[${challenge.id}].effects.${categoryId}`,
          'Effect value must be a non-negative number'
        );
      }
    }
  }

  // Validate domains
  if (!Array.isArray(config.domains) || config.domains.length === 0) {
    throw new ConfigValidationError('domains', 'Must be a non-empty array');
  }

  // Validate strings
  if (!config.strings || !config.strings.ro) {
    throw new ConfigValidationError(
      'strings.ro',
      'Romanian strings are required'
    );
  }

  // Validate brand assets
  if (!config.brandAssets) {
    throw new ConfigValidationError('brandAssets', 'Missing brandAssets object');
  }

  if (!config.brandAssets.logo) {
    throw new ConfigValidationError('brandAssets.logo', 'Missing logo config');
  }

  return config as GameConfig;
}

let cachedConfig: GameConfig | null = null;

/**
 * Load and cache game configuration
 */
export async function loadGameConfig(): Promise<GameConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const response = await fetch('/game-config.json');

    if (!response.ok) {
      throw new Error(
        `Failed to load game-config.json: ${response.status} ${response.statusText}`
      );
    }

    const rawConfig = await response.json();
    const validatedConfig = validateConfig(rawConfig);

    cachedConfig = validatedConfig;
    console.log('✅ Game configuration loaded successfully', validatedConfig);

    return validatedConfig;
  } catch (error) {
    if (error instanceof ConfigValidationError) {
      console.error('❌ Config validation failed:', error.field, error.message);
      throw error;
    }

    console.error('❌ Failed to load game configuration:', error);
    throw new Error(
      'Failed to load game configuration. Please check the console for details.'
    );
  }
}

/**
 * Get cached config (must call loadGameConfig first)
 */
export function getConfig(): GameConfig {
  if (!cachedConfig) {
    throw new Error('Config not loaded. Call loadGameConfig() first.');
  }
  return cachedConfig;
}

/**
 * Clear cached config (useful for testing)
 */
export function clearConfigCache(): void {
  cachedConfig = null;
}
