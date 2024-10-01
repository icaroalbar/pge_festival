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
import { useState } from "react";
import Icon from "@/components/ui/icons";
import axios from "axios";

const formSchema = z.object({
  email: z
    .string()
    .min(2, { message: "O campo de e-mail é obrigatório." })
    .email({ message: "E-mail inválido." })
    .refine((email) => email.endsWith("@pge.rj.gov.br"), {
      message: "O e-mail deve ser do domínio @pge.rj.gov.br.",
    }),
});

export default function RecuperarSenha() {
  const [disabledForm, setDisabledForm] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setDisabledForm(true);

    try {
      await axios.post(
        "https://5quazgdoai.execute-api.us-east-1.amazonaws.com/prod/forgot-password",
        data
      );
      router.push("/emailEnviado");
    } catch (error) {
      console.error(error);
    } finally {
      setDisabledForm(false);
    }
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={disabledForm}
                      placeholder="E-mail"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-start ml-2" />
                </FormItem>
              )}
            />
            <Button
              disabled={disabledForm}
              type="submit"
              className="w-full capitalize font-semibold"
            >
              {disabledForm ? (
                <Icon name="LoaderCircle" className="animate-spin" />
              ) : (
                "enviar"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </CardAuth>
  );
}
