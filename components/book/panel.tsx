import BookForm from "@/components/book/form";
import FooterText from "@/components/chat/footer";

export default function BookPanel() {
  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-transparent via-muted/50 to-muted duration-300 ease-in-out animate-in dark:from-transparent dark:via-background/50 dark:to-background peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <div className="mx-auto sm:max-w-2xl sm:px-2">
        <div className="space-y-2 border-t bg-background p-2 sm:border-none sm:bg-transparent">
          <BookForm />
          <FooterText
            className="hidden sm:block"
            text="FibonacciKu will give relevant resources"
          />
        </div>
      </div>
    </div>
  );
}
