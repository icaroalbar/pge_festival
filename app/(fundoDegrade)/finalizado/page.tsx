"use client";

import { Button } from "@/components/ui/button";
import CardAuth from "@/components/ui/cardAuth";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

export default function Finalizado() {
  const [isChecking, setIsChecking] = useState<boolean>(true);
  // const router = useRouter();

  useEffect(() => {
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return null;
  }

  return (
    <CardAuth title="Parabéns! Você finalizou o desafio!">
      <div className="flex flex-col justify-center items-center">
        <Image
          src="https://pge-festival.s3.amazonaws.com/game-finalizado.jpeg"
          alt="PG Inova logo"
          width={300}
          height={100}
          priority
        />
        <h4 className="text-muted-foreground text-xl">
          Até a próxima aventura!
        </h4>
        <Button className="font-semibold w-full lg:w-2/4 my-2" asChild>
          <Link href={"/home"}>Página inicial</Link>
        </Button>
      </div>
    </CardAuth>
  );
}
