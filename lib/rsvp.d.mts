export type GuestResponse = {
  name: string;
  attendance: "yes" | "no";
  guests: number;
  comment: string;
};
export type RsvpErrors = Partial<Record<keyof GuestResponse, string>>;
export type ValidationResult = { ok: true; value: GuestResponse } | { ok: false; errors: RsvpErrors };
export type RsvpStorage = Pick<Storage, "getItem" | "setItem">;
export function validateRsvp(input: unknown, maxGuests?: number): ValidationResult;
export function readRsvp(storage: RsvpStorage, key: string, maxGuests?: number): GuestResponse | null;
export function saveRsvp(storage: RsvpStorage, key: string, input: unknown, maxGuests?: number): ValidationResult;
