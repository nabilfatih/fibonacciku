"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { IconBriefcase, IconSchool, IconUser } from "@tabler/icons-react"
import axios from "axios"
import { toast } from "sonner"

import type { UserDetails, UserRole } from "@/types/types"
import { useCurrentUser } from "@/lib/context/use-current-user"
import {
  updateUserGeoLocation,
  updateUserIp,
  updateUserLang,
  updateUserRef,
  updateUserRole
} from "@/lib/supabase/client/users"
import { getGeoLocation, getIp } from "@/lib/utils"
import { useCurrentLocale, useScopedI18n } from "@/locales/client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export default function RoleDialog() {
  const t = useScopedI18n("ModalInitiateRole")
  const tBackend = useScopedI18n("BackendRouter")
  const locale = useCurrentLocale()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const ref = searchParams.get("ref") || ""

  const { userDetails, mutate } = useCurrentUser()

  const [isPending, setIsPending] = React.useState(false)

  const handleChooseRole = async (role: (typeof roles)[number]["query"]) => {
    if (!userDetails) return
    setIsPending(true)
    try {
      await Promise.all([
        updateUserRole(userDetails.id, role as UserRole),
        updateUserGeo(userDetails),
        updateUserIpAddress(userDetails),
        updateUserLang(userDetails.id, locale)
      ])
      toast.success(t("welcome"))
      await sendWelcomeEmail(role, userDetails)
      if (ref) {
        await updateUserRef(userDetails.id, ref)
        // remove ref from url
        router.replace(pathname)
      }
      router.refresh()
      mutate()
    } catch (error) {
      console.error(error)
      toast.error(tBackend("something-wrong"))
    } finally {
      setIsPending(false)
    }
  }

  if (!userDetails || userDetails.role) return null

  return (
    <AlertDialog open={!userDetails.role ? true : false}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("who-are-you")}</AlertDialogTitle>
          <AlertDialogDescription>{t("helper")}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-2">
          {roles.map(role => (
            <Button
              key={role.query}
              variant="outline"
              disabled={isPending}
              onClick={() => handleChooseRole(role.query)}
            >
              <role.icon className="mr-2 h-4 w-4" />
              {t(role.query as never)}
            </Button>
          ))}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

async function sendWelcomeEmail(
  role: (typeof roles)[number]["query"],
  userDetails: UserDetails
) {
  await axios.post("/api/email/welcome", {
    name: userDetails.full_name || userDetails.email || "Anonymous",
    email: userDetails.email,
    role
  })
}

async function updateUserGeo(userDetails: UserDetails) {
  const geoLocation = await getGeoLocation()
  await updateUserGeoLocation(userDetails.id, geoLocation)
}

async function updateUserIpAddress(userDetails: UserDetails) {
  const ip = await getIp()
  await updateUserIp(userDetails.id, ip)
}

const roles = [
  {
    query: "student",
    icon: IconUser
  },
  {
    query: "teacher",
    icon: IconSchool
  },
  {
    query: "professional",
    icon: IconBriefcase
  }
]
