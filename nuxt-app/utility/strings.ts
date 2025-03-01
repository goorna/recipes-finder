import type { PrepTime } from "~/types/api/recipe";
/**
 * Returns the abbreviated form of a preparation time unit
 * 
 * @param {PrepTime["unit"]} timeUnit - The time unit to abbreviate
 * @returns {string} The abbreviated form of the time unit
 */
export const abbreviateTimeUnit = (timeUnit: PrepTime["unit"]): string => {
  const shortLabels: Record<string, string> = {
    minutes: "min",
    hours: "h"
  };
  
  return shortLabels[timeUnit] ?? "";
};
