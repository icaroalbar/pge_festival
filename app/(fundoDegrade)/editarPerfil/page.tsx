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
import { useUser } from "@/app/hook/UserProvider";
import axios from "axios";
import Icon from "@/components/ui/icons";

const formSchema = z.object({
  email: z.optional(z.string()),
  primeiroNome: z.optional(z.string()),
  ultimoNome: z.optional(z.string()),
  setor: z.optional(z.string()),
});

export default function Cadastro() {
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isDisabledForm, setIsDisabledForm] = useState<boolean>(false);
  const router = useRouter();
  const { user, setUser } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || "", // Define os valores padrão a partir do user
      primeiroNome: user?.primeiroNome || "",
      ultimoNome: user?.ultimoNome || "",
      setor: user?.setor || "",
    },
  });

  useEffect(() => {
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return null;
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsDisabledForm(true);

    try {
      // Filtra os campos que possuem valores, ignorando a chave no filtro
      const updatedFields = Object.fromEntries(
        Object.entries(data).filter(([value]) => value !== "" && value !== null)
      );

      // Verifica se há campos preenchidos antes de fazer a requisição
      if (Object.keys(updatedFields).length > 0) {
        await axios.put(
          "https://5quazgdoai.execute-api.us-east-1.amazonaws.com/prod/update",
          {
            id: user?.id,
            ...updatedFields,
          }
        );

        // Atualiza o provider apenas com os campos preenchidos, mantendo os anteriores
        setUser((prevUser) => ({
          ...prevUser, // Mantém todos os valores anteriores
          ...updatedFields, // Atualiza apenas os campos preenchidos
        }));

        router.push("/perfil");
      } else {
        console.warn("Nenhum campo foi preenchido");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDisabledForm(false);
    }
  }

  return (
    <CardAuth
      title="Editar perfil"
      description="Atualize seus dados"
      linkTextFooter="Voltar"
      hrefTextFooter="/perfil"
      className="border border-primary/70 shadow-xl"
    >
      <div className="flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              disabled
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input disabled={isDisabledForm} {...field} />
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
                      disabled={isDisabledForm}
                      placeholder={user?.primeiroNome}
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
                      disabled={isDisabledForm}
                      placeholder={user?.ultimoNome}
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
                      disabled={isDisabledForm}
                      placeholder={user?.setor}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-start ml-2" />
                </FormItem>
              )}
            />
            <Button
              disabled={isDisabledForm}
              type="submit"
              className="w-full capitalize font-semibold"
            >
              {isDisabledForm ? (
                <Icon name="LoaderCircle" className="animate-spin" />
              ) : (
                "salvar"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </CardAuth>
  );
}
