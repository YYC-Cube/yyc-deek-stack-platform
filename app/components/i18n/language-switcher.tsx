"use client"

import { usePathname, useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()

  const currentLocale = pathname.startsWith("/en") ? "en" : "zh"

  const switchLanguage = (locale: string) => {
    if (locale === currentLocale) return

    const newPathname = pathname.replace(/^\/(zh|en)/, `/${locale}`)
    router.push(locale === "zh" && !pathname.startsWith("/en") ? pathname : newPathname)

    localStorage.setItem("preferred-locale", locale)
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={currentLocale} onValueChange={switchLanguage}>
        <SelectTrigger className="w-[100px] h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="zh">中文</SelectItem>
          <SelectItem value="en">English</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
