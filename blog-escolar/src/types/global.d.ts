export {};

declare global {
  interface Window {
    /**
     * Flag usada para habilitar/desabilitar a leitura por áudio na UI de acessibilidade.
     */
    __audioAccessibilityEnabled?: boolean;
  }
}
