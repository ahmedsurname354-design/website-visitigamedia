/// <reference types="vite/client" />

declare module 'summernote/dist/summernote-lite.js';

interface JQuery<TElement = HTMLElement> {
  summernote(options?: Record<string, unknown>): JQuery<TElement>;
  summernote(command: 'code'): string;
  summernote(command: 'code', value: string): JQuery<TElement>;
  summernote(command: 'destroy'): JQuery<TElement>;
}

interface Window {
  $: JQueryStatic;
  jQuery: JQueryStatic;
}
