import { useScopedI18n } from "@/locales/client";
import type { ImageResult } from "@/types/types";
import { IconPhoto } from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type Props = {
  metadata: ImageResult[];
};

export default function ChatMetadataImage({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat");
  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center gap-2">
        <IconPhoto className="h-5 w-5" />
        <span className="font-medium">{t("generated-image")}:</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
            >
              <Link href={item.image.split("?")[0]} passHref target="_blank">
                <Image
                  src={item.image}
                  alt={item.prompt || "Image"}
                  sizes="100%"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "28rem",
                  }}
                  priority
                  width={256}
                  height={256}
                  className="m-0 cursor-pointer rounded-xl border bg-muted/90 object-cover shadow-sm"
                />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
