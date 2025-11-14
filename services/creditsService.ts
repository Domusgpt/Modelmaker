// Credits management service
// Using localStorage for now, easily upgradable to backend API

const CREDITS_KEY = 'aiModelStudio_credits';
const GENERATION_HISTORY_KEY = 'aiModelStudio_history';
const FREE_CREDIT_USED_KEY = 'aiModelStudio_freeUsed';

export interface GenerationHistory {
  id: string;
  timestamp: number;
  imageUrl: string;
  prompt: string;
  creditsUsed: number;
}

// Initialize user with free credit
export const initializeCredits = (): void => {
  const existing = getCredits();
  if (existing === null) {
    // First time user - give them 1 free credit
    setCredits(1);
    setFreeUsed(false);
  }
};

// Get current credit balance
export const getCredits = (): number => {
  const stored = localStorage.getItem(CREDITS_KEY);
  return stored ? parseInt(stored, 10) : 0;
};

// Set credit balance
export const setCredits = (amount: number): void => {
  localStorage.setItem(CREDITS_KEY, amount.toString());
};

// Add credits (after purchase)
export const addCredits = (amount: number): void => {
  const current = getCredits();
  setCredits(current + amount);
};

// Use a credit for generation
export const useCredit = (): boolean => {
  const current = getCredits();
  if (current >= 1) {
    setCredits(current - 1);
    return true;
  }
  return false;
};

// Check if user has used their free credit
export const hasFreeUsed = (): boolean => {
  return localStorage.getItem(FREE_CREDIT_USED_KEY) === 'true';
};

// Mark free credit as used
export const setFreeUsed = (used: boolean): void => {
  localStorage.setItem(FREE_CREDIT_USED_KEY, used.toString());
};

// Save generation to history
export const saveGeneration = (generation: Omit<GenerationHistory, 'id' | 'timestamp'>): void => {
  const history = getHistory();
  const newGeneration: GenerationHistory = {
    ...generation,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };

  history.unshift(newGeneration); // Add to beginning

  // Keep only last 50 generations
  const trimmed = history.slice(0, 50);

  localStorage.setItem(GENERATION_HISTORY_KEY, JSON.stringify(trimmed));
};

// Get generation history
export const getHistory = (): GenerationHistory[] => {
  const stored = localStorage.getItem(GENERATION_HISTORY_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

// Clear all history
export const clearHistory = (): void => {
  localStorage.removeItem(GENERATION_HISTORY_KEY);
};

// Check if user needs to purchase
export const needsToPurchase = (): boolean => {
  return getCredits() < 1;
};
