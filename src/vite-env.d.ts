/// <reference types="vite/client" />

// Google Analytics gtag
declare function gtag(command: 'event', action: string, params?: Record<string, unknown>): void;
declare function gtag(command: 'config', targetId: string, params?: Record<string, unknown>): void;
declare function gtag(command: 'js', date: Date): void;
