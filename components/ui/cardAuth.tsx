import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./button";

export default function CardAuth({
  children,
  title,
  description,
  textFooter,
  linkTextFooter,
  hrefTextFooter = "#",
  className,
  email,
}: Readonly<{
  children: React.ReactNode;
  title: string;
  description?: string;
  textFooter?: string;
  linkTextFooter?: string;
  hrefTextFooter?: string;
  className?: string;
  email?: string;
}>) {
  return (
    <Card
      className={`md:w-1/3 w-full ${
        title === "Email enviado!" ||
        title === "Parabéns, você finalizou o desafio!"
          ? "text-center"
          : "text-start"
      } ${className}`}
    >
      <CardHeader>
        <CardTitle className="font-semibold text-3xl text-primary">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground space-x-1">
          <span>{description}</span>
          <span className="font-bold">{email}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="text-muted-foreground text-sm justify-center">
        {description ===
        "Verifique sua caixa de entrada. Caso não encontre, verifique na caixa de span." ? (
          <Button asChild>
            <Link
              href={hrefTextFooter}
              className="text-end w-full text-xs font-semibold underline-offset-4"
            >
              Página inicial
            </Link>
          </Button>
        ) : (
          <div className=" flex items-center gap-x-1 justify-center">
            <p>{textFooter}</p>
            <Link
              href={hrefTextFooter}
              className="text-end text-xs font-medium text-ring underline-offset-4 hover:underline"
            >
              {linkTextFooter}
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
