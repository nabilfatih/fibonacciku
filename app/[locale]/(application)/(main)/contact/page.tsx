import AccountHeader from "@/components/account/header";

export default async function AccountPage() {
  return (
    <>
      <AccountHeader text="contact" />

      <main className="h-[calc(100%-81px)] space-y-4 overflow-y-auto overflow-x-hidden py-6"></main>
    </>
  );
}
