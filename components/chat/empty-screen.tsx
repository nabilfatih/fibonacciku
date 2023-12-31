import {
  IconArrowRight,
  IconChevronDown,
  IconMessageCircle2,
} from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/context/use-current-user";
import EmptyScreenAssistant from "./empty-screen-assistant";

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
  const { userDetails } = useCurrentUser();
  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="mb-2 text-2xl font-semibold">
        Hi {userDetails?.full_name ?? "there"} 👋
      </h1>
      {type === "assistant" ? <EmptyScreenAssistant /> : null}
    </div>
  );
}
