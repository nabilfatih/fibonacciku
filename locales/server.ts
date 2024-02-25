import { createI18nServer } from "next-international/server"

export const { getI18n, getScopedI18n, getCurrentLocale, getStaticParams } =
  createI18nServer({
    en: () => import("./translations/en"),
    id: () => import("./translations/id"),
    de: () => import("./translations/de"),
    ru: () => import("./translations/ru"),
    nl: () => import("./translations/nl")
  })
