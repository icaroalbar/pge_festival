"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listaRegras } from "./regras";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  confirmacao: z.boolean().default(false),
});

export default function Regras() {
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      confirmacao: false,
    },
  });

  const isConfirmed = form.watch("confirmacao");

  useEffect(() => {
    const confirmacaoRegras = localStorage.getItem("confirmacaoRegras");
    const dataUser = localStorage.getItem("dataUser");

    if (confirmacaoRegras && JSON.parse(confirmacaoRegras)) {
      router.push("/perguntas");
    } else if (!dataUser) {
      router.push("/");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return null;
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    localStorage.setItem("confirmacaoRegras", JSON.stringify(data.confirmacao));

    router.push("/perguntas");
  }

  return (
    <Card className="md:w-3/4 w-full">
      <CardHeader>
        <CardTitle className="uppercase text-primary underline underline-offset-2 text-center">
          regras do jogo
        </CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        <ol className="list-decimal space-y-3 m-5">
          {listaRegras.map((regra, index) => (
            <li key={index}>
              <p className="text-justify">{regra}</p>
            </li>
          ))}
        </ol>
      </CardContent>
      <CardFooter className="flex flex-col gap-y-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="confirmacao"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      Eu compreendo as regras e estou pronto para começar!
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full font-semibold"
              disabled={!isConfirmed}
            >
              Começar
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}
