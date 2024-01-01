import "katex/dist/katex.min.css";
import remarkMath from "remark-math";
import emoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import Link from "next/link";
import ImageMarkdown from "@/components/chat/image";
import MemoizedReactMarkdown from "@/components/markdown";
import CodeBlock from "@/components/ui/codeblock";
import type { Element } from "hast";
import { useMessage } from "@/lib/context/use-message";
import type { IndexMessage } from "@/types/types";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  index: number;
  content: string[];
  currentIndex: IndexMessage;
  type: "assistant" | "document";
};

export default function ChatAssistant({
  index,
  content,
  currentIndex,
  type,
}: Props) {
  const { state, indexMessage } = useMessage();
  const contentIndex = currentIndex.currentMessage - 1;

  const checkFeature =
    type === "document"
      ? index === indexMessage.length - 1
      : index === indexMessage.length - 2;

  const isCursorDisplayed =
    state.isGenerating &&
    checkFeature &&
    currentIndex.currentMessage === content.length;

  const message = `${content[contentIndex]}${
    isCursorDisplayed ? ". . . ▌" : ""
  }`;

  if (message === "" || message === "undefined" || message === "null") {
    return <div className="animate-pulse">▌</div>;
  }

  return (
    <MemoizedReactMarkdown
      className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
      remarkPlugins={[
        remarkBreaks,
        remarkMath,
        remarkGfm,
        emoji,
        remarkParse,
        remarkRehype,
      ]}
      rehypePlugins={[rehypeKatex, rehypeRaw, rehypeStringify]}
      components={{
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>;
        },
        hr() {
          return <hr className="my-6 border-foreground/30" />;
        },
        pre(props) {
          const { children, className, node, ...rest } = props;

          const childrenNode = node?.children[0] as Element;
          // handle code block without properties (language)
          const noProperties =
            childrenNode?.properties?.className === undefined;

          return noProperties ? (
            <div className={cn("codeblock relative font-sans")}>
              <pre
                className={cn(
                  className,
                  "no-before no-after rounded-xl bg-muted"
                )}
                {...props}
              >
                <div className="p-4">{children}</div>
              </pre>
            </div>
          ) : (
            <pre
              className={cn(
                className,
                "no-before no-after rounded-xl bg-muted font-sans"
              )}
              {...props}
            >
              {children}
            </pre>
          );
        },
        code(props) {
          const { children, className, node, ...rest } = props;

          const match = /language-(\w+)/.exec(className || "");

          return match ? (
            <CodeBlock
              key={Math.random()}
              language={(match && match[1]) || ""}
              value={String(children).replace(/\n$/, "")}
              {...props}
            />
          ) : (
            <code
              className={cn(
                className,
                "no-before no-after rounded-xl bg-muted px-2 py-0.5 font-mono text-muted-foreground"
              )}
              {...props}
            >
              {children}
            </code>
          );
        },
        table({ children }) {
          return (
            <div className={cn("overflow-x-auto")}>
              <table className="my-0 border-separate border-spacing-0 border-0">
                {children}
              </table>
            </div>
          );
        },
        th({ children }) {
          return <th className="break-words border-b">{children}</th>;
        },
        td({ children }) {
          return <td className="break-words border-b">{children}</td>;
        },
        a({ children, href }) {
          const DynamicTag = href ? Link : "button";
          return (
            <DynamicTag
              name="link"
              href={String(href)}
              target="_blank"
              className="text-primary transition-colors duration-200 hover:text-primary/90"
            >
              {children}
            </DynamicTag>
          );
        },
        img({ src, alt }) {
          return <ImageMarkdown src={src} alt={alt} />;
        },
      }}
    >
      {message}
    </MemoizedReactMarkdown>
  );
}
