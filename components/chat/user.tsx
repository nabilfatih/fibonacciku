type Props = {
  content: string;
};

export default function ChatUser({ content }: Props) {
  return (
    <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
      <div className="whitespace-pre-wrap">{content}</div>
    </div>
  );
}
