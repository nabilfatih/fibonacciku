import { createI18nClient } from "next-international/client";

export const {
  useI18n,
  useScopedI18n,
  useChangeLocale,
  useCurrentLocale,
  I18nProviderClient,
} = createI18nClient({
  en: () => import("./translations/en"),
  id: () => import("./translations/id"),
  de: () => import("./translations/de"),
});
