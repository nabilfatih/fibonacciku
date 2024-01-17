"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useScopedI18n } from "@/locales/client"
import type { User } from "@supabase/supabase-js"
import {
  IconCheck,
  IconCopy,
  IconDiscount2,
  IconGift
} from "@tabler/icons-react"
import { toast } from "sonner"
import useSWR from "swr"

import type { Subscription } from "@/types/types"
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard"
import {
  formatCurrency,
  getPrice,
  getUserCurrency,
  priceList
} from "@/lib/premium/helpers"
import { getStripe } from "@/lib/stripe/client"
import { postData } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { IconSpinner } from "@/components/ui/icons"

type Props = {
  user: User | null
  subscription: Subscription | null
}

export default function PremiumPrice({ user, subscription }: Props) {
  const { data } = useSWR("user-currency", getUserCurrency)
  const router = useRouter()
  const t = useScopedI18n("MarketingPricing")

  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const [priceIdLoading, setPriceIdLoading] = useState<string>()

  const currency = useMemo(() => data || "usd", [data])

  const onCopy = useCallback(
    (value: string) => {
      if (isCopied) return
      copyToClipboard(value)
    },
    [copyToClipboard, isCopied]
  )

  const redirectToCustomerPortal = useCallback(
    async (price: (typeof priceList)[0]) => {
      setPriceIdLoading(price.priceId)

      try {
        const { url, error } = await postData({
          url: "/api/payment/create-portal-link"
        })
        if (error) return toast.error((error as Error).message)
        window.location.assign(url)
      } catch (error) {
        if (error) return toast.error((error as Error).message)
      } finally {
        setPriceIdLoading(undefined)
      }
    },
    []
  )

  const handleChoosePlan = useCallback(
    async (price: (typeof priceList)[0]) => {
      if (price.redirect) return router.push("/contact")

      setPriceIdLoading(price.priceId)

      let url = "/api/payment/create-checkout-session"
      if (currency === "idr") {
        url = "/api/payment/xendit/checkout"
      }

      try {
        const response = await postData({
          url,
          data: {
            price,
            currency,
            quantity: 1
          }
        })
        if (response.provider === "stripe") {
          const sessionId = response.sessionId
          const stripe = await getStripe()
          stripe?.redirectToCheckout({ sessionId })
        } else if (response.provider === "xendit") {
          const invoiceUrl = response.invoiceUrl
          router.push(invoiceUrl)
        } else {
          throw new Error("Unknown payment provider")
        }
      } catch (error) {
        return alert((error as Error)?.message)
      } finally {
        setPriceIdLoading(undefined)
      }
    },
    [currency, router]
  )

  return (
    <section className="mx-auto max-w-4xl px-4">
      {!subscription && currency !== "idr" && (
        <div className="mx-auto mb-4 sm:max-w-xs">
          <div className="flex items-center justify-center gap-2 rounded-xl border py-2 shadow-sm">
            <IconDiscount2 className="h-5 w-5 min-w-5 text-primary" />
            <div className="flex items-center">
              <p className="text-sm leading-none">40% off for new comers</p>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-5 w-5 rounded-full p-0"
                onClick={() => onCopy("ILOVEFIBO")}
              >
                {isCopied ? (
                  <IconCheck className="h-4 w-4" />
                ) : (
                  <IconCopy className="h-4 w-4" />
                )}
                <span className="sr-only">Copy code</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {priceList.map((price, index) => {
          const plan = price.plan
          // get the price from the key of the price object, based on currency
          const priceData = getPrice(plan, currency, price.type)

          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="uppercase text-primary">
                  {price.type}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="inline-block whitespace-nowrap align-bottom">
                    <span className="align-bottom text-3xl font-semibold tabular-nums">
                      {formatCurrency(priceData, currency, price.type)}
                    </span>
                    <span className="leading-none">
                      {" "}
                      /{" "}
                      {t(
                        price.type === "yearly"
                          ? ("year" as never)
                          : ("month" as never)
                      )}
                    </span>
                  </div>

                  {currency !== "idr" && (
                    <p className="flex items-center gap-1 text-sm leading-none text-primary">
                      <IconGift className="h-4 w-4" />
                      {t("7-free-trial")}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    if (!user) return router.push("/auth/login?next=/premium")
                    if (subscription) {
                      return redirectToCustomerPortal(price)
                    }
                    handleChoosePlan(price)
                  }}
                  className="w-full"
                  disabled={typeof priceIdLoading === "string"}
                >
                  {priceIdLoading === price.priceId && (
                    <IconSpinner className="mr-2 animate-spin" />
                  )}
                  {t("get-started")}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
