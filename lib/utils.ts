import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import { nanoid } from "nanoid";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
