import { useScopedI18n } from "@/locales/client";
import type { SearchResult } from "@/types/types";
import { IconWorldWww } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import he from "he";
import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  metadata: SearchResult[];
};

export default function ChatMetadataGoogle({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat");

  const [imgSrc, setImgSrc] = useState<{ [key: string]: string }>({});

  const handleImageError = (link: string) => {
    setImgSrc(prevState => ({
      ...prevState,
      [link]: "/logo-google.png",
    }));
  };

  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center gap-1">
        <IconWorldWww className="h-5 w-5" />
        <span className="font-semibold">{t("related-links")}:</span>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {metadata.map((item, index) => {
          return (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
              initial="hidden"
              animate="visible"
              transition={{
                delay: index * 0.1,
                ease: "easeInOut",
                duration: 0.5,
              }}
              viewport={{ amount: 0 }}
              className="group min-h-[82px] rounded-xl border p-2 shadow-sm transition-colors hover:bg-muted/50"
            >
              <Link
                title={he.decode(item.title)}
                href={item.link}
                className="no-underline hover:no-underline"
                target="_blank"
              >
                <div className="flex h-full w-full flex-col items-start justify-between gap-2">
                  <span
                    className="line-clamp-2 whitespace-pre-wrap break-all text-sm font-semibold"
                    title={he.decode(item.title)}
                  >
                    {he.decode(item.title)}
                  </span>
                  <div className="flex flex-row items-center gap-1">
                    <div
                      className="relative overflow-hidden"
                      style={{ minWidth: "16px" }}
                    >
                      <Image
                        title={he.decode(item.title)}
                        className="m-0 block rounded-full bg-transparent object-contain"
                        src={
                          imgSrc[item.link] ||
                          `https://www.google.com/s2/favicons?domain=${item.displayLink}&sz=512`
                        }
                        width={16}
                        height={16}
                        priority
                        onError={() => handleImageError(item.link)}
                        alt={he.decode(item.title)}
                      />
                    </div>

                    <span className="line-clamp-1 text-xs font-medium text-muted-foreground">
                      {item.displayLink.split(".").length > 2
                        ? item.displayLink.split(".")[1]
                        : item.displayLink.split(".")[0]}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
