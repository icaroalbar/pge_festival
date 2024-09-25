import { Button } from "@/components/ui/button";
import CardAuth from "@/components/ui/cardAuth";
import Link from "next/link";
import Image from "next/image";

export default function Finalizado() {
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
          <Link href={"#"}>Página inicial</Link>
        </Button>
      </div>
    </CardAuth>
  );
}
