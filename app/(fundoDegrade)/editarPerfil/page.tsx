"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import CardAuth from "@/components/ui/cardAuth";
import { useEffect, useState } from "react";

const formSchema = z.object({
  username: z.optional(
    z.string().min(2, {
      message: "O campo de e-mail é obrigatório.",
    })
  ),
  primeronome: z.string().min(2, {
    message: "O campo de e-mail é obrigatório.",
  }),
  ultimonome: z.string().min(2, {
    message: "O campo de senha é obrigatório.",
  }),
  setor: z.string().min(2, {
    message: "O campo de senha é obrigatório.",
  }),
});

export default function Cadastro() {
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      primeronome: "",
      ultimonome: "",
      setor: "",
    },
  });

  useEffect(() => {
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return null;
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);

    router.push("/");
  }

  return (
    <CardAuth
      title="Editar perfil"
      description="Atualize seus dados acessar"
      linkTextFooter="Sair"
      hrefTextFooter="/"
      className="border border-primary/70 shadow-xl"
    >
      <div className="flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              disabled
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="E-mail" {...field} />
                  </FormControl>
                  <FormMessage className="text-start ml-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="primeronome"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Primeiro nome" {...field} />
                  </FormControl>
                  <FormMessage className="text-start ml-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ultimonome"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Último nome" {...field} />
                  </FormControl>
                  <FormMessage className="text-start ml-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="setor"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Setor" {...field} />
                  </FormControl>
                  <FormMessage className="text-start ml-2" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full capitalize font-semibold">
              salvar
            </Button>
          </form>
        </Form>
      </div>
    </CardAuth>
  );
}
