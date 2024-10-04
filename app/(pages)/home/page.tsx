"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Icon from "@/components/ui/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PaginaCarregamento } from "@/components/ui/paginaCarregamento";
import { useUser } from "../../hook/UserProvider";
import { Ranking } from "@/components/ui/ranking";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const dataUser = localStorage.getItem("dataUser");
    if (!dataUser) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <PaginaCarregamento />;
  }

  const LogOut = () => {
    localStorage.removeItem("dataUser");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="bg-gray-200 h-screen">
      <nav className="bg-primary shadow-md text-white font-semibold text-2xl flex justify-between items-center p-4">
        <h2>PGames</h2>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-x-2">
            <Icon name="ChevronDown" />
            <Avatar>
              <AvatarImage
                src={user?.urlImage || "#"}
                alt="Imagem do usuário"
              />
              <AvatarFallback className="bg-secondary/60 text-base uppercase">
                {user?.primeiroNome?.charAt(0)}
                {user?.ultimoNome?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="text-primary">
              PGames
            </DropdownMenuLabel>
            <DropdownMenuItem className="p-0">
              <Link
                href={"/perfil"}
                className="text-muted-foreground p-2 w-full rounded flex items-center gap-x-2 transition-colors justify-between hover:bg-primary/80 hover:text-white"
              >
                Perfil
                <Icon name="User" size={15} />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Button
                onClick={LogOut}
                className="text-muted-foreground px-2 w-full bg-transparent rounded flex items-center gap-x-2 transition-colors justify-between hover:bg-primary/80 hover:text-white"
              >
                Sair
                <Icon name="LogOut" size={15} />
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
      <main>
        <Tabs defaultValue="jogos" className="w-full">
          <TabsList className="capitalize gird grid-cols-2 w-full bg-primary">
            <TabsTrigger className="cols-span-1 w-full" value="jogos">
              jogos
            </TabsTrigger>
            <TabsTrigger className="cols-span-1 w-full" value="ranking">
              ranking
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="jogos"
            className="flex px-6 gap-5 flex-col items-center"
          >
            <Card className="w-full mt-4">
              <CardContent className="flex py-6 justify-between items-center">
                <div className="w-1/3 rounded-md text-transparent h-16 bg-[url('https://pge-festival.s3.amazonaws.com/dia-do-servidor.jpeg')] bg-cover">
                  *
                </div>
                <RadioGroup defaultValue="option-one">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <Label
                        htmlFor="option-one"
                        className="uppercase text-primary font-semibold text-lg"
                      >
                        pge festival
                      </Label>
                      <p className="text-muted-foreground">
                        Dia do servidor 2024
                      </p>
                    </div>
                    <RadioGroupItem value="option-one" id="option-one" />
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            <Button className="font-semibold capitalize w-2/3" asChild>
              <Link href={"/regras"}>começar</Link>
            </Button>
          </TabsContent>
          <TabsContent value="ranking">
            <Ranking />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
