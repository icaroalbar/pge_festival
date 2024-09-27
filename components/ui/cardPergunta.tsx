import React from "react";
import { Card } from "@/components/ui/card";

export default function CardPergunta({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  title: string;
  className?: string;
}>) {
  return <Card className={`md:w-3/4 w-full ${className}`}>{children}</Card>;
}
