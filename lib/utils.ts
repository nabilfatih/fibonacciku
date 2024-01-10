import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import { nanoid } from "nanoid";
import axios from "axios";
import type { CurrencyType } from "@/lib/premium/type";
import { priceList } from "@/lib/premium/helpers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  return url;
};

export const postData = async ({
  url,
  data,
}: {
  url: string;
  data?: {
    price: (typeof priceList)[0];
    currency: CurrencyType;
    quantity: number;
  };
}) => {
  const res: Response = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.error("Error in postData", { url, data, res });

    throw Error(res.statusText);
  }

  return res.json();
};

export const getGeoLocation = async () => {
  const { data } = await axios.get("https://geolocation-db.com/json/");
  return data;
};

export const getIp = async () => {
  const { data } = await axios.get("/api/info/ip");
  return data.ip;
};

export const toDateTime = (secs: number) => {
  var t = new Date("1970-01-01T00:30:00Z"); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export const capitalizeFirstLetter = (word: string) => {
  var splitStr = word.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
};

export const capitalizeOnlyFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const getCurrentDate = () => {
  return new Date().toISOString();
};

export const generateUUID = () => {
  return uuidv4();
};

export const generateNanoID = (number = 21) => {
  return nanoid(number);
};
