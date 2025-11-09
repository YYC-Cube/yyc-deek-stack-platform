import "server-only"
import type { Locale } from "@/i18n/config"

const dictionaries = {
  zh: () => import("@/messages/zh.json").then((module) => module.default),
  en: () => import("@/messages/en.json").then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries.zh()
}
