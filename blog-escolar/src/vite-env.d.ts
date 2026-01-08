/// <reference types="vite/client" />

export {};

declare global {
  interface Window {
    __audioAccessibilityEnabled?: boolean;
  }
}
