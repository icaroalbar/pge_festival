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
import axios, { AxiosError } from "axios";
import { useState } from "react";
import Icon from "@/components/ui/icons";
import { Label } from "@/components/ui/label";

const formSchema = z
  .object({
    email: z
      .string()
      .min(2, { message: "O campo de e-mail é obrigatório." })
      .email({ message: "E-mail inválido." })
      .refine((email) => email.endsWith("@pge.rj.gov.br"), {
        message: "O e-mail deve ser do domínio @pge.rj.gov.br.",
      }),

    primeiroNome: z.string().min(2, {
      message: "O campo primeiro nome é obrigatório.",
    }),

    ultimoNome: z.string().min(2, {
      message: "O campo de último nome é obrigatório.",
    }),

    senha: z.string().min(6, {
      message: "A senha deve ter no mínimo 6 caracteres.",
    }),

    confirmarSenha: z.string().min(6, {
      message: "A confirmação da senha deve ter no mínimo 6 caracteres.",
    }),

    setor: z.optional(z.string()),
    files: z
      .any()
      // .refine((file) => file.size <= 10 * 1024 * 1024, {
      //   message: "O arquivo deve ter no máximo 10 MB",
      // })
      // .refine(
      //   (file) => {
      //     const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      //     return validTypes.includes(file.type);
      //   },
      //   {
      //     message: "Apenas arquivos de imagem (JPEG, PNG, JPG) são permitidos",
      //   }
      // )
      .optional(),
  })

  .refine((data) => data.senha === data.confirmarSenha, {
    path: ["confirmarSenha"],
    message: "As senhas precisam ser iguais.",
  });

interface ErrorResponse {
  error: string;
}

export default function Cadastro() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [disabledForm, setDisabledForm] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      senha: "",
      confirmarSenha: "",
      primeiroNome: "",
      ultimoNome: "",
      setor: "",
      files: undefined,
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setDisabledForm(true);

    // Criação do FormData para envio de arquivos e dados
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("senha", data.senha);
    formData.append("primeiroNome", data.primeiroNome);
    formData.append("ultimoNome", data.ultimoNome);
    formData.append("setor", data.setor || "");

    // Adiciona o arquivo ao FormData, se houver um arquivo selecionado
    if (data.files) {
      formData.append("files", data.files[0]); // Apenas o primeiro arquivo (ajuste para múltiplos, se necessário)
    }

    try {
      setErrorMessage(null);
      await axios.post(
        "https://5quazgdoai.execute-api.us-east-1.amazonaws.com/prod/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      router.push("/");

      console.log(data);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;

      const errorMessage =
        axiosError.response?.data?.error ??
        "Erro ao realizar o cadastro. Tente novamente.";

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
      title="Vamos começar!"
      description="Crie sua conta para acessar"
      textFooter="Já possui uma conta?"
      linkTextFooter="Clique aqui"
      hrefTextFooter="/"
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
            {/* Campos de texto */}
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
            <FormField
              control={form.control}
              name="primeiroNome"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={disabledForm}
                      placeholder="Primeiro nome"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-start ml-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ultimoNome"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={disabledForm}
                      placeholder="Último nome"
                      {...field}
                    />
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
                    <Input
                      disabled={disabledForm}
                      placeholder="Setor"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-start ml-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <Label
                    className="ml-3 text-muted-foreground"
                    htmlFor="picture"
                  >
                    Imagem perfil
                  </Label>
                  <FormControl>
                    <Input
                      disabled={disabledForm}
                      type="file"
                      id="picture"
                      onChange={(e) => field.onChange(e.target.files)}
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
                "Cadastrar"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </CardAuth>
  );
}
