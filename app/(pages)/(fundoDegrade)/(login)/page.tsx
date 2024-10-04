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
import axios, { AxiosError } from "axios";
import Icon from "@/components/ui/icons";
import { useState } from "react";
import { useUser } from "@/app/hook/UserProvider";

const formSchema = z.object({
  email: z.string().min(2, { message: "O campo de e-mail é obrigatório." }),
  // .email({ message: "E-mail inválido." })
  // .refine((email) => email.endsWith("@pge.rj.gov.br"), {
  //   message: "O e-mail deve ser do domínio @pge.rj.gov.br.",
  // }),
  senha: z.string().min(2, {
    message: "O campo de senha é obrigatório.",
  }),
});

export default function Login() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [disabledForm, setDisabledForm] = useState<boolean>(false);
  const { setUser } = useUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setDisabledForm(true);
    try {
      setErrorMessage(null);
      const response = await axios.post(
        "https://5quazgdoai.execute-api.us-east-1.amazonaws.com/prod/login",
        data
      );

      if (Array.isArray(response.data) && response.data.length > 0) {
        const userData = response.data[0];
        setUser(userData);

        localStorage.setItem("dataUser", JSON.stringify(true));

        router.push("/home");
      } else {
        throw new Error("Nenhum usuário encontrado na resposta.");
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error: string }>;
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
            {errorMessage && (
              <div className="bg-red-500 rounded-md py-2 text-white justify-center flex items-center gap-x-2">
                <Icon name="TriangleAlert" />
                {errorMessage}
              </div>
            )}

            <Button
              disabled={disabledForm}
              type="submit"
              className="w-full capitalize font-semibold"
            >
              {disabledForm ? (
                <Icon name="LoaderCircle" className="animate-spin" />
              ) : (
                "entrar"
              )}
            </Button>
          </form>
        </Form>
        <div>
          <Link
            href="/recuperarSenha"
            className="text-start text-xs my-2 font-medium text-ring underline-offset-4 hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>
      </div>
    </CardAuth>
  );
}
