/// <reference types="vite/client" />

declare module 'page-flip/dist/js/page-flip.module.js' {
  export class PageFlip {
    constructor(element: HTMLElement, settings: Record<string, unknown>);
    loadFromHTML(items: HTMLElement[] | NodeListOf<HTMLElement>): void;
    flipNext(): void;
    flipPrev(): void;
    destroy(): void;
    on(event: 'flip', handler: (event: { data: number }) => void): void;
  }
}

interface JQuery<TElement = HTMLElement> {
  summernote(options?: Record<string, unknown>): JQuery<TElement>;
  summernote(command: 'code'): string;
  summernote(command: 'code', value: string): JQuery<TElement>;
  summernote(command: 'destroy'): JQuery<TElement>;
}
