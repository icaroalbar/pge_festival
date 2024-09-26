"use client";

import { Button } from "@/components/ui/button";
import CardAuth from "@/components/ui/cardAuth";
import Link from "next/link";

export default function Perfil() {
  return (
    <CardAuth
      title="[Nome Usuário]"
      description="[email do usuario]"
      linkTextFooter="voltar"
      hrefTextFooter="/"
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
