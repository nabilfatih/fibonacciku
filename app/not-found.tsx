import { redirect } from "next/navigation";

export default function NotFound() {
  // Add a locale prefix to show a localized not found page
  redirect("/");
}
