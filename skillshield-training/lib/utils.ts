import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useReducedMotion() {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
}













