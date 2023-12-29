import { useCurrentUser } from "@/lib/context/use-current-user";
import Image from "next/image";
import Avatar, { genConfig } from "react-nice-avatar";

type Props = {
  role: string;
};

export default function ChatAvatar({ role }: Props) {
  const { userDetails } = useCurrentUser();

  const config = genConfig(userDetails?.full_name || "Avatar");

  if (role === "assistant") {
    return (
      <div className="relative h-8 w-8 rounded-full">
        <Image
          title="FibonacciKu"
          src="/logo.webp"
          fill
          sizes="32px"
          className="rounded-full"
          priority
          alt="FibonacciKu Avatar"
        />
      </div>
    );
  }

  return (
    <div className="relative h-8 w-8 rounded-full">
      {userDetails?.avatar_url ? (
        <Image
          title={userDetails?.full_name || "Avatar"}
          src={userDetails?.avatar_url}
          fill
          sizes="32px"
          className="rounded-full"
          priority
          alt={`${userDetails?.full_name || "User"} Avatar`}
        />
      ) : (
        <Avatar className="h-8 w-8 rounded-full object-cover" {...config} />
      )}
    </div>
  );
}
