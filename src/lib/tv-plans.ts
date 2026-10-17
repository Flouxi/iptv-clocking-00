export const TV_PLANS = {
  '3m': { name: 'IPTVNORD4K — 3 meses / 1 pantalla', label: '3 meses', months: 3, screens: 1, amount: 2900 },
  '1y': { name: 'IPTVNORD4K — 1 año / 2 pantallas', label: '1 año', months: 12, screens: 2, amount: 6500 },
  '3y': { name: 'IPTVNORD4K — 3 años + 6 meses / 3 pantallas', label: '3 años + 6 meses gratis', months: 42, screens: 3, amount: 11900 },
} as const;

export type TvPlanKey = keyof typeof TV_PLANS;
export const isTvPlan = (value: unknown): value is TvPlanKey => typeof value === 'string' && Object.hasOwn(TV_PLANS, value);
export const tvPrice = (amount: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount / 100);
