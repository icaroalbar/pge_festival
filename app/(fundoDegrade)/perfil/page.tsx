"use client";

import { Button } from "@/components/ui/button";
import CardAuth from "@/components/ui/cardAuth";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Perfil() {
  const [isChecking, setIsChecking] = useState<boolean>(true);
  // const router = useRouter();

  useEffect(() => {
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return null;
  }

  return (
    <CardAuth
      title="[Nome Usuário]"
      description="[email do usuario]"
      linkTextFooter="voltar"
      hrefTextFooter="/home"
      className="border border-primary/70 shadow-xl"
    >
      <div className="flex flex-col">
        <p className="text-end text-sm text-muted-foreground">pontuação: 500</p>
        <ul>
          <li>primeiro nome</li>
          <li>ultimo nome</li>
        </ul>
        <Button className="font-semibold w-full lg:w-2/4 my-2" asChild>
          <Link href="/editarPerfil">Editar perfil</Link>
        </Button>
      </div>
    </CardAuth>
  );
}
