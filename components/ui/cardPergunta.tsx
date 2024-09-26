import React from "react";
// import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "./icons";

export default function CardPergunta({
  children,
  title,
  className,
}: Readonly<{
  children: React.ReactNode;
  title: string;
  className?: string;
}>) {
  return (
    <Card className={`md:w-3/4 w-full ${className}`}>
      <CardHeader>
        <div className="flex justify-between pb-2 text-primary">
          <div className="flex items-center gap-x-2">
            <Icon name="Clock" />
            tempo
          </div>
          <div className="flex items-center gap-x-2">
            <Icon name="Trophy" />
            pontos
          </div>
        </div>
        <CardTitle className="font-semibold text-center text-xl text-primary bg-secondary py-4 rounded-lg shadow-md">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
