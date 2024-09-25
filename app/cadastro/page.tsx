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

const formSchema = z.object({
  username: z.string().min(2, {
    message: "O campo de e-mail é obrigatório.",
  }),
  password: z.string().min(2, {
    message: "O campo de senha é obrigatório.",
  }),
});

export default function Cadastro() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const router = useRouter();

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);

    router.push("/");
  }

  return (
    <CardAuth
      title="Vamos começar!"
      description="Crie sua conta para acessar"
      textFooter="Já possui uma conta?"
      linkTextFooter="Clique aqui"
      hrefTextFooter="/"
    >
      <div className="flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Senha" {...field} />
                  </FormControl>
                  <FormMessage className="text-start ml-2" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full capitalize font-semibold">
              entrar
            </Button>
          </form>
        </Form>
      </div>
    </CardAuth>
  );
}
