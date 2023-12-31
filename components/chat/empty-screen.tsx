import { useCurrentUser } from "@/lib/context/use-current-user";
import EmptyScreenAssistant from "./empty-screen-assistant";

type Props = {
  type: "assistant" | "document";
};

export function EmptyScreen({ type }: Props) {
  const { userDetails } = useCurrentUser();
  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="mb-2 text-xl font-semibold sm:text-3xl">
        Hi {userDetails?.full_name ?? "there"} 👋
      </h1>
      {type === "assistant" ? <EmptyScreenAssistant /> : null}
    </div>
  );
}
