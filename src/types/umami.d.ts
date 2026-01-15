/**
 * Umami Analytics type declarations
 * Privacy-focused analytics window object
 */

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, payload?: Record<string, unknown>) => void;
      identify: (properties: Record<string, unknown>) => void;
      reset: () => void;
    };
  }
}

export {};
