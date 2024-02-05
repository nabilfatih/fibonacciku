"use client"

import dynamic from "next/dynamic"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const ConfettiEffect = dynamic(() => import("react-confetti"), { ssr: false })

function Confetti() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const payment = searchParams.get("payment")
  if (payment !== "success") return null

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
