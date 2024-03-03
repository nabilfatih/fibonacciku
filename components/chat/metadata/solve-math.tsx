import { memo } from "react"
import { IconCheck, IconMath } from "@tabler/icons-react"

import type { SolveMath } from "@/types/types"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"

import { Badge } from "@/components/ui/badge"

type Props = {
  metadata: SolveMath[]
}

function ChatMetadataSolveMath({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat")

  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center gap-1">
        <IconMath className="h-5 w-5" />
        <p className="font-medium">{t("solve-math")}:</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {metadata.map((math, index) => {
          return (
            <div key={index} className="group rounded-xl border p-2 shadow">
              <div className="flex h-full w-full flex-col items-start justify-between gap-3">
                <Badge>
                  <IconCheck className="mr-1 h-4 w-4" />
                  {t("solved")}
                </Badge>

                {math.derivative && (
                  <div className="grid">
                    <Paragraph className="font-medium">
                      {t("derivative")}
                    </Paragraph>
                    <Paragraph>{math.derivative}</Paragraph>
                  </div>
                )}

                {math.partialDerivatives && (
                  <div className="grid">
                    <Paragraph className="font-medium">
                      {t("partial-derivatives")}
                    </Paragraph>
                    <Paragraph>{math.partialDerivatives}</Paragraph>
                  </div>
                )}

                {math.partialDerivatives && (
                  <div className="grid">
                    <Paragraph className="font-medium">
                      {t("differential")}
                    </Paragraph>
                    <Paragraph>{math.differential}</Paragraph>
                  </div>
                )}

                {math.indefiniteIntegral && (
                  <div className="grid">
                    <Paragraph className="font-medium">
                      {t("indefinite-integral")}
                    </Paragraph>
                    <Paragraph>{math.indefiniteIntegral}</Paragraph>
                  </div>
                )}

                {math.alternateFormOfIntegral && (
                  <div className="grid">
                    <Paragraph className="font-medium">
                      {t("alternate-form-of-integral")}
                    </Paragraph>
                    <Paragraph>{math.alternateFormOfIntegral}</Paragraph>
                  </div>
                )}

                {(math.scientificNotation ||
                  math.numberName ||
                  math.numberLength) && (
                  <div className="flex flex-col gap-1">
                    {math.scientificNotation && (
                      <Paragraph className="font-medium">
                        {math.scientificNotation}
                      </Paragraph>
                    )}

                    {math.numberName && (
                      <Paragraph>{math.numberName}</Paragraph>
                    )}
                    {math.numberLength && (
                      <Paragraph>{math.numberLength}</Paragraph>
                    )}
                  </div>
                )}

                {math.alternateForm && (
                  <Paragraph className="italic">{math.alternateForm}</Paragraph>
                )}
                {math.comparisons && (
                  <Paragraph className="italic">{math.comparisons}</Paragraph>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Paragraph({
  className,
  children
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <p
      className={cn(
        "whitespace-pre-wrap break-words text-sm first-letter:uppercase",
        className
      )}
    >
      {children}
    </p>
  )
}

export default memo(ChatMetadataSolveMath)
