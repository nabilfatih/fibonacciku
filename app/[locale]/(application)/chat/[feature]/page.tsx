import { ThemeToggle } from "@/components/theme/toggle";

type Props = {
  params: { feature: string };
};

export default function ChatFeaturePage({ params }: Props) {
  return (
    <main>
      <ThemeToggle />
    </main>
  );
}
