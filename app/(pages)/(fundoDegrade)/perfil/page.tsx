"use client";

import { useUser } from "@/app/hook/UserProvider";
import { Button } from "@/components/ui/button";
import CardAuth from "@/components/ui/cardAuth";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Perfil() {
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const { user } = useUser();

  useEffect(() => {
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return null;
  }

  return (
    <CardAuth
      title={`${user?.primeiroNome} ${user?.ultimoNome}`}
      description={user?.email}
      linkTextFooter="voltar"
      hrefTextFooter="/home"
      className="border border-primary/70 shadow-xl"
    >
      <div className="flex flex-col">
        <p className="text-end text-sm text-muted-foreground">
          Pontuação: {user?.score}
        </p>
        <ul className="text-muted-foreground">
          <li>Nome: {`${user?.primeiroNome} ${user?.ultimoNome}`}</li>
          <li>Setor: {user?.setor}</li>
        </ul>
        <Button className="font-semibold w-full lg:w-2/4 my-2" asChild>
          <Link href="/editarPerfil">Editar perfil</Link>
        </Button>
      </div>
    </CardAuth>
  );
}