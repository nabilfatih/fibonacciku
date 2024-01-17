import { getScopedI18n } from "@/locales/server"

type Props = {
  text: string
}

export default async function AccountHeader({ text }: Props) {
  const t = await getScopedI18n("Account")
  return (
    <header className="border-b py-4">
      <div className="relative mx-auto max-w-2xl px-4">
        <h2 className="text-2xl font-semibold">{t(text as never)}</h2>
      </div>
    </header>
  )
}
