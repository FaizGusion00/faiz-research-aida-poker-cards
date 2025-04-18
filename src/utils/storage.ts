
import { BoardState } from '../types';

const STORAGE_KEY = 'fgresearch-poker-cards';

// Save board state to localStorage
export const saveBoardState = (state: BoardState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Load board state from localStorage
export const loadBoardState = (): BoardState | null => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return null;
};

// Clear board state from localStorage
export const clearBoardState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Generate a unique ID for new cards
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
