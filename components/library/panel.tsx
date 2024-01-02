import LibraryForm from "./form";

export default function LibraryPanel() {
  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-transparent via-muted/50 to-muted duration-300 ease-in-out animate-in peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px] dark:from-transparent dark:via-background/50 dark:to-background">
      <div className="mx-auto sm:max-w-2xl sm:px-2">
        <div className="space-y-2 border-t bg-background p-2 sm:border-none sm:bg-transparent">
          <LibraryForm />
        </div>
      </div>
    </div>
  );
}
