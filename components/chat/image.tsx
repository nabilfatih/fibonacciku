import Image from "next/image";
import { memo } from "react";
import Link from "next/link";

type Props = {
  src: string | undefined;
  alt: string | undefined;
};

function ImageMarkdown({ src, alt }: Props) {
  if (!src) return null;

  const dataSrc = src.trim();

  if (dataSrc.includes("i.ytimg.com")) {
    return (
      <Link href={dataSrc} passHref target="_blank">
        <Image
          src={src}
          alt={alt || "Thumbnail YouTube"}
          priority
          width={337}
          height={192}
          className="relative my-4 h-[8rem] w-full cursor-pointer rounded-xl bg-muted/50 object-cover transition-all duration-200 hover:scale-[1.02] hover:transform sm:h-48 sm:w-[337px]"
        />
      </Link>
    );
  }

  return (
    <Link href={dataSrc} passHref target="_blank">
      <Image
        src={dataSrc}
        alt={alt || "Image"}
        sizes="100%"
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "28rem",
        }}
        priority
        width={256}
        height={256}
        className="my-4 max-w-[256px] cursor-pointer rounded-xl bg-muted/50 object-cover transition-all duration-200 hover:scale-[1.02] hover:transform"
      />
    </Link>
  );
}

// custom memo based on src
export default memo(ImageMarkdown, (prevProps, nextProps) => {
  return prevProps.src === nextProps.src;
});
