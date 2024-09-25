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

export default function CardAuth({
  children,
  title,
  description,
  textFooter,
  linkTextFooter,
  hrefTextFooter = "#",
  className,
}: Readonly<{
  children: React.ReactNode;
  title: string;
  description?: string;
  textFooter?: string;
  linkTextFooter?: string;
  hrefTextFooter?: string;
  className?: string;
}>) {
  return (
    <Card className={`md:w-3/4 w-full text-start ${className}`}>
      <CardHeader>
        <CardTitle className="font-semibold text-3xl text-primary">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="text-muted-foreground text-sm justify-center">
        <div className=" flex items-center gap-x-1 justify-center">
          <p>{textFooter}</p>
          <Link
            href={hrefTextFooter}
            className="text-end text-xs font-medium text-ring underline-offset-4 hover:underline"
          >
            {linkTextFooter}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
