import Image from "next/image";

export default function FundoDegradeBrancoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-2 px-4 items-center py-16 antialiased h-screen bg-gradient-to-b from-primary from-10% via-secondary via-20% to-gray-300 to-60%">
      <header>
        <Image
          src="https://pge-festival.s3.amazonaws.com/logotipo-pg-inova.png"
          alt="PG Inova logo"
          width={180}
          height={100}
          priority
        />
      </header>
      {children}
    </div>
  );
}
