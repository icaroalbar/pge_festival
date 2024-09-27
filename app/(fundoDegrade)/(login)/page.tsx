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
import { useState } from "react"; // Import para o estado de erro

const formSchema = z.object({
  email: z.string().min(2, {
    message: "O campo de e-mail é obrigatório.",
  }),
  senha: z.string().min(2, {
    message: "O campo de senha é obrigatório.",
  }),
});

export default function Login() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [disabledForm, setDisabledForm] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  interface ErrorResponse {
    error: string;
  }

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setDisabledForm(true);
    try {
      setErrorMessage(null); // Reseta a mensagem de erro
      const user = await axios.post(
        "https://5quazgdoai.execute-api.us-east-1.amazonaws.com/prod/login",
        data
      );
      if (user) {
        localStorage.setItem("dataUser", JSON.stringify(true));
        router.push("/home");
      }
    } catch (error: unknown) {
      // Verifica se o erro é do tipo AxiosError
      const axiosError = error as AxiosError<ErrorResponse>;

      // Verifica se a resposta contém a propriedade 'error'
      const errorMessage =
        axiosError.response?.data?.error ??
        "Erro ao realizar login. Tente novamente.";

      // Captura o erro e atualiza o estado
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

            {/* Div para exibir o erro */}
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
