"use client";

import CardAuth from "@/components/ui/cardAuth";
import Link from "next/link";
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

const formSchema = z.object({
  username: z.string().min(2, {
    message: "O campo de e-mail é obrigatório.",
  }),
  password: z.string().min(2, {
    message: "O campo de senha é obrigatório.",
  }),
});

export default function Login() {
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

    router.push("/home");
  }

  return (
    <CardAuth
      title="PGames"
      description="Acesse ou crie sua conta"
      textFooter="Não possui conta?"
      linkTextFooter="Clique aqui"
      hrefTextFooter="/cadastro"
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
        <Link
          href="/recuperarSenha"
          className="text-start text-xs my-2 font-medium text-ring underline-offset-4 hover:underline"
        >
          Esqueci minha senha
        </Link>
      </div>
    </CardAuth>
  );
}
