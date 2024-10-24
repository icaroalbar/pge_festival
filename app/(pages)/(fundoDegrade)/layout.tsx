import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-2 min-h-screen px-4 items-center py-16 justify-between antialiased bg-secondary bg-gradient-to-b from-primary to-secondary">
      <header>
        <Image
          src="https://pge-festival.s3.amazonaws.com/logotipo-pg-inova.png"
          alt="PG Inova logo"
          width={180}
          height={100}
          priority
        />
      </header>
      <main className="flex-grow flex w-full items-center justify-center">
        {children}
      </main>
      <footer>
        <Image
          src="https://pge-festival.s3.amazonaws.com/logo-pg-inova.png"
          alt="PG Inova logo"
          width={150}
          height={100}
          priority
        />
      </footer>
    </div>
  );
}
