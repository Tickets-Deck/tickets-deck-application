export enum DefaultFormResponseStatus {
    Failed = 1,
    Success = 2,
};

export type FormFieldResponse = {
  message: string;
  // Create a new propetry called "status" of a generic type CustomResponseStatus or DefaultFormResponseStatus
  status: (<T>() => T) | DefaultFormResponseStatus;
};
