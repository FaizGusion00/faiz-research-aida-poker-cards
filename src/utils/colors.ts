
// AIDA stage fixed colors
export const AIDA_COLORS = {
  attention: "#ea384c", // Red
  interest: "#0EA5E9", // Blue
  desire: "#FCD34D", // Yellow
  action: "#10B981", // Green
  unassigned: "" // Will be random
};

// Array of colors for random assignment to unassigned cards
export const RANDOM_COLORS = [
  "#9b87f5", // Primary Purple
  "#7E69AB", // Secondary Purple
  "#6E59A5", // Tertiary Purple
  "#D6BCFA", // Light Purple
  "#F97316", // Bright Orange
  "#D946EF", // Magenta Pink
  "#33C3F0", // Sky Blue
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#14B8A6", // Teal
];

// Get a random color from the RANDOM_COLORS array
export const getRandomColor = (): string => {
  const randomIndex = Math.floor(Math.random() * RANDOM_COLORS.length);
  return RANDOM_COLORS[randomIndex];
};

// Get the color for a specific AIDA stage
export const getStageColor = (stage: string): string => {
  if (stage in AIDA_COLORS) {
    return AIDA_COLORS[stage as keyof typeof AIDA_COLORS];
  }
  return getRandomColor();
};
