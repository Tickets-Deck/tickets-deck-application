import { IBanner } from "./IBanner";

/**
 * Represents a generated Display Picture (DP).
 */
export interface IDp {
  id: string;
  generatedImageUrl: string;
  personalizationData: any; // JSON object
  isPublic: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  bannerId: string;
  ownerId: string | null;
}

/**
 * Represents a saved DP with its associated banner information,
 */
export interface ISavedDp extends IDp {
  banner: IBanner;
}
