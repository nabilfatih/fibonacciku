import { IconCheck, IconX } from "@tabler/icons-react"

import { getScopedI18n } from "@/locales/server"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

export default async function PremiumCompare() {
  const t = await getScopedI18n("MarketingPricing")

  return (
    <Table className="text-base tracking-tight">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-1/2"></TableHead>
          <TableHead className="w-1/4 font-semibold">{t("free")}</TableHead>
          <TableHead className="w-1/4 font-semibold">{t("premium")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableCell className="pt-8 font-semibold">
            {t("essentials")}
          </TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="align-top">
            {t("message-and-interactions")}
          </TableCell>
          <TableCell>{t("limited-on-bandwidth-and-availability")}</TableCell>
          <TableCell>{t("unlimited")}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("chat-history")}</TableCell>
          <TableCell>{t("unlimited")}</TableCell>
          <TableCell>{t("unlimited")}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("document-upload")}</TableCell>
          <TableCell>{t("unlimited")}</TableCell>
          <TableCell>{t("unlimited")}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("access-on-web")}</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-transparent">
          <TableCell className="pt-8 font-semibold">
            {t("model-quality")}
          </TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("advanced-ai-model-gpt-4")}</TableCell>
          <TableCell>
            <IconX className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("priority-access")}</TableCell>
          <TableCell>
            <IconX className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            {t("regular-quality-and-speed-updates-as-models-improve")}
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-transparent">
          <TableCell className="pt-8 font-semibold">{t("features")}</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("share-chat")}</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("voice-output")}</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("image-input")}</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("image-generation")}</TableCell>
          <TableCell>{t("limited")}</TableCell>
          <TableCell>{t("unlimited")}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("internet-access")}</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("youtube-videos")}</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("academic-research")}</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("solve-math")}</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("wikipedia")}</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("website-scraping")}</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("weather")}</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>

        <TableRow className="hover:bg-transparent">
          <TableCell className="pt-8 font-semibold">
            {t("customer-service")}
          </TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("priority-support")}</TableCell>
          <TableCell>
            <IconX className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
