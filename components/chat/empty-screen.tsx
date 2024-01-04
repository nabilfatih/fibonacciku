import { useCurrentUser } from "@/lib/context/use-current-user";
import EmptyScreenAssistant from "@/components/chat/empty-screen-assistant";
import EmptyScreenDocument from "@/components/chat/empty-screen-document";

type Props = {
  type: "assistant" | "document";
};

export default function EmptyScreen({ type }: Props) {
  const { userDetails } = useCurrentUser();
  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="mb-2 text-xl font-semibold sm:text-3xl">
        Hi{` ${userDetails?.full_name ?? ""}`} 👋
      </h1>
      {type === "assistant" ? (
        <EmptyScreenAssistant />
      ) : (
        <EmptyScreenDocument />
      )}
    </div>
  );
}
