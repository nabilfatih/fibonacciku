"use client"

import dynamic from "next/dynamic"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const ConfettiEffect = dynamic(() => import("react-confetti"), { ssr: false })

function Confetti() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const payment = searchParams.get("payment")
  const confetti = searchParams.get("confetti")

  if (payment && payment !== "success") return null

  if (confetti && confetti !== "true") return null

  // if no there are no both payment and confetti query params, return null
  if (!payment && !confetti) return null

  return (
    <ConfettiEffect
      width={window.innerWidth}
      height={window.innerHeight}
      numberOfPieces={1000}
      gravity={0.05}
      recycle={false}
      onConfettiComplete={() => {
        // get the pathname without the query string
        const path = pathname.split("?")[0]
        router.replace(path)
      }}
    />
  )
}

export default dynamic(() => Promise.resolve(Confetti), { ssr: false })
