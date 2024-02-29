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
          <TableCell className="pt-8 font-semibold">Essentials</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="align-top">Messages and interactions</TableCell>
          <TableCell>Limited on bandwidth & availability</TableCell>
          <TableCell>Unlimited</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Chat history</TableCell>
          <TableCell>Unlimited</TableCell>
          <TableCell>Unlimited</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Document upload</TableCell>
          <TableCell>Unlimited</TableCell>
          <TableCell>Unlimited</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Access on web</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-transparent">
          <TableCell className="pt-8 font-semibold">Model Quality</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Advanced AI model (GPT-4)</TableCell>
          <TableCell>
            <IconX className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Priority access</TableCell>
          <TableCell>
            <IconX className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Regular quality & speed updates as models improve
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-transparent">
          <TableCell className="pt-8 font-semibold">Features</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Share chat</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Voice output</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Image input</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Image generation</TableCell>
          <TableCell>Limited</TableCell>
          <TableCell>Unlimited</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Internet access</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Youtube videos</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Academic research</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Solve math</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Wikipedia</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Website scraping</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Weather</TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <IconCheck className="h-5 w-5" />
          </TableCell>
        </TableRow>

        <TableRow className="hover:bg-transparent">
          <TableCell className="pt-8 font-semibold">Customer Service</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Priority support</TableCell>
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
