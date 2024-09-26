import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icons";
import Link from "next/link";

export default function FundoDegradeBrancoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gray-300 h-screen">
      <header className="flex justify-between gap-2 items-center px-2 py-3 bg-primary shadow-md">
        <Button
          className="text-white shadow-none hover:bg-transparent hover:text-white"
          size="icon"
          asChild
        >
          <Link href={"/"}>
            <Icon name="House" />
          </Link>
        </Button>
        <h2 className="uppercase font-bold text-white text-xl">pge festival</h2>
        <Button
          className="text-white shadow-none hover:bg-transparent hover:text-white"
          size="icon"
          asChild
        >
          <Link href={"/"}>
            <Icon name="LogOut" />
          </Link>
        </Button>
      </header>
      <div className="p-4">{children}</div>
    </div>
  );
}
