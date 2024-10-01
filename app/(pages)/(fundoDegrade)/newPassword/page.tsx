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
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import CardAuth from "@/components/ui/cardAuth";
import axios, { AxiosError } from "axios";
import { useState, Suspense } from "react";
import Icon from "@/components/ui/icons";

// Schema de validação
const formSchema = z
  .object({
    senha: z.string().min(6, {
      message: "A senha deve ter no mínimo 6 caracteres.",
    }),
    confirmarSenha: z.string().min(6, {
      message: "A confirmação da senha deve ter no mínimo 6 caracteres.",
    }),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    path: ["confirmarSenha"],
    message: "As senhas precisam ser iguais.",
  });

interface ErrorResponse {
  error: string;
}

function NewPasswordForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [disabledForm, setDisabledForm] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senha: "",
      confirmarSenha: "",
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setDisabledForm(true);

    try {
      setErrorMessage(null);
      await axios.put(
        "https://5quazgdoai.execute-api.us-east-1.amazonaws.com/prod/new-password",
        {
          email: email,
          password: data.senha,
        }
      );

      router.push("/");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error ??
        "Erro ao realizar login. Tente novamente.";

      setErrorMessage(errorMessage);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    } finally {
      setDisabledForm(false);
    }
  }

  return (
    <CardAuth
      title="Nova senha"
      description="Crie uma nova senha para o e-mail"
      email={email || "Email não encontrado"}
    >
      <div className="flex flex-col">
        {errorMessage && (
          <div className="bg-red-500 text-sm rounded-md py-2 text-white justify-center flex items-center gap-x-2">
            <Icon name="TriangleAlert" />
            {errorMessage}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={disabledForm}
                      type="password"
                      placeholder="Senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-start ml-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmarSenha"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={disabledForm}
                      type="password"
                      placeholder="Confirme sua senha"
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
                "atualizar"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </CardAuth>
  );
}

export default function Cadastro() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <NewPasswordForm />
    </Suspense>
  );
}
