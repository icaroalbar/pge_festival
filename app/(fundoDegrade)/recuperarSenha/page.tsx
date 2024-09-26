"use client";

import CardAuth from "@/components/ui/cardAuth";
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
});

export default function RecuperarSenha() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const router = useRouter();

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);

    router.push("/");
  }

  return (
    <CardAuth
      title="Xiii... Esqueceu sua senha?"
      description="Preencha seu e-mail cadastrado e verifique sua caixa de entrada e segue as instruções."
      linkTextFooter="Página inicial"
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
            <Button type="submit" className="w-full capitalize font-semibold">
              enviar
            </Button>
          </form>
        </Form>
      </div>
    </CardAuth>
  );
}
