// Define types
export type PlanType = "premium"
export type CurrencyType = "usd" | "eur" | "idr"
export type PlanDetailsType = Record<PlanType, string[]>
export type PriceListType = Array<{
  plan: PlanType
  type: "monthly" | "yearly"
  redirect: boolean
  priceId: string
  price: Record<CurrencyType, number>
}>
