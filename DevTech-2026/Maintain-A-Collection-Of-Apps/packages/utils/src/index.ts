export function hello(name: string = "world"): string {
  return `Hello, ${name}!`;
}

export { _calculateLocale, setLocaleFromPortal } from './portal-locale';
