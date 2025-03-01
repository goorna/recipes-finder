export interface Ingredient {
  name: string;
  quantity: number | null;
  unit: "grams" | "liters" | "milliliters" | "tablespoon" | "unit" | null;
}

export interface PrepTime {
  unit: "minutes" | "hours";
  quantity: number;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  thumb: string;
  ingredients: Ingredient[];
  allergens: string[];
  preparation: string[];
  prep_time: PrepTime;
  servings: number;
  curiosity: string;
}
