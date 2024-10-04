"use client"; // Adicione isso no topo do arquivo

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
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  primeiroNome: z.optional(z.string()),
  ultimoNome: z.optional(z.string()),
  setor: z.optional(z.string()),
  files: z
    .any()
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "O arquivo deve ter no máximo 10 MB",
    })
    .refine(
      (file) => {
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        return validTypes.includes(file.type);
      },
      {
        message: "Apenas arquivos de imagem (JPEG, PNG, JPG) são permitidos",
      }
    )
    .optional(),
});

export default function Cadastro() {
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isDisabledForm, setIsDisabledForm] = useState<boolean>(false);
  const router = useRouter();
  const { user, setUser } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primeiroNome: user?.primeiroNome || "",
      ultimoNome: user?.ultimoNome || "",
      setor: user?.setor || "",
      files: undefined,
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
      const updatedFields = Object.fromEntries(
        Object.entries(data).filter(([value]) => value !== "" && value !== null)
      );

      // Verifica se há campos preenchidos antes de fazer a requisição
      if (Object.keys(updatedFields).length > 0) {
        const formData = new FormData();
        if (user?.id) {
          formData.append("id", user.id.toString()); // Adiciona o id do usuário como string
        }

        // Adiciona todos os campos atualizados ao FormData, garantindo que não sejam undefined
        for (const [key, value] of Object.entries(updatedFields)) {
          if (value !== undefined) {
            formData.append(key, value); // Adiciona apenas se o valor não for undefined
          }
        }

        await axios.put(
          "https://5quazgdoai.execute-api.us-east-1.amazonaws.com/prod/update",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Define o tipo de conteúdo para multipart/form-data
            },
          }
        );

        // Atualiza o provider apenas com os campos preenchidos, mantendo os anteriores
        setUser((prevUser) => ({
          ...prevUser,
          ...updatedFields,
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
            <div>
              <Label className="text-muted-foreground">E-mail</Label>
              <Input disabled placeholder={user?.email} />
            </div>

            <FormField
              control={form.control}
              name="primeiroNome"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-muted-foreground">Primeiro nome</Label>
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
                  <Label className="text-muted-foreground">Último nome</Label>
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
                  <Label className="text-muted-foreground">Setor</Label>
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
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-muted-foreground" htmlFor="picture">
                    Trocar imagem
                  </Label>
                  <FormControl>
                    <Input
                      disabled={isDisabledForm}
                      type="file"
                      id="picture"
                      onChange={(e) => {
                        const file = e.target.files?.[0]; // Pega o primeiro arquivo ou undefined
                        field.onChange(file ?? null); // Passa o arquivo ou null se não houver
                      }}
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
