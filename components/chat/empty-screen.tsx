import {
  IconArrowRight,
  IconChevronDown,
  IconMessageCircle2,
} from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  type: "assistant" | "document";
};

const exampleMessages = [
  {
    heading: "Explain technical concepts",
    message: `What is a "serverless function"?`,
  },
  {
    heading: "Summarize an article",
    message: "Summarize the following article for a 2nd grader: \n",
  },
  {
    heading: "Draft an email",
    message: `Draft an email to my boss about the following: \n`,
  },
];

export function EmptyScreen({ type }: Props) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-xl border bg-background p-8">
        <h1 className="mb-2 text-2xl font-semibold">Welcome to FibonacciKu!</h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This is an open source AI chatbot app template.
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button key={index} variant="link" className="h-auto p-0 text-base">
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
