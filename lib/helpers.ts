import axios from "axios";
import type {
  CurrencyType,
  PlanDetailsType,
  PlanType,
  PriceListType,
} from "@/types/types";
import { countriesList } from "@/lib/data/countries";
import type { Geo } from "@vercel/edge";

export const planOptions: PlanType[] = ["starter", "hobby", "premium"];

export const planDetails: PlanDetailsType = {
  starter: ["unlimited-use", "internet-access", "plugin-support"],
  hobby: [
    "all-features-in-starter",
    "unlimited-document-upload",
    "library-access",
    "document-analysis",
  ],
  premium: [
    "all-features-in-hobby",
    "you-can-do-anything",
    "download-book",
    "image-analysis",
    "image-generation",
    "gpt-4-support",
    "priority-access",
    "dedicated-support",
  ],
};

export const priceList: PriceListType = [
  {
    plan: "starter",
    redirect: false,
    priceId: "price_1O4gvJApEKbNyVi655JjtKse",
    price: {
      usd: 5,
      eur: 5,
      idr: 50000,
    },
  },
  {
    plan: "hobby",
    redirect: false,
    priceId: "price_1O4gxlApEKbNyVi6aQLu2dNA",
    price: {
      usd: 10,
      eur: 10,
      idr: 100000,
    },
  },
  {
    plan: "premium",
    redirect: false,
    priceId: "price_1O4h0CApEKbNyVi6Tf1DTZGV",
    price: {
      usd: 18,
      eur: 18,
      idr: 200000,
    },
  },
];

// Helper function to get price based on plan and currency
export const getPrice = (plan: PlanType, currency: CurrencyType): number => {
  const planDetails = priceList.find((p) => p.plan === plan);
  return planDetails ? planDetails.price[currency] : 0;
};

// Helper functions
export const formatCurrency = (amount: number, currency: string) => {
  if (currency === "idr") {
    // Convert to 'K' format for IDR
    const amountInK = Math.round(amount / 1000);
    return `IDR ${amountInK}K`;
  } else {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  }
};

export const validCurrencies = ["usd", "eur", "idr"];

export const getUserCurrency = async (): Promise<CurrencyType> => {
  const { data } = await axios.get("/api/info/location");
  if (!data) return "usd";
  const location: Geo = data.location;
  const countryCode = location.country;
  if (!countryCode) return "usd";
  const countryInfo = countriesList.find(
    (country) => country.cca2.toLowerCase() === countryCode.toLowerCase()
  );
  if (!countryInfo) return "usd";
  const currency: CurrencyType = Object.keys(
    countryInfo.currencies
  )[0].toLowerCase() as CurrencyType;
  return validCurrencies.includes(currency) ? currency : "usd";
};
