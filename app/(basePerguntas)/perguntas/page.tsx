"use client";

import { Button } from "@/components/ui/button";
import CardPergunta from "@/components/ui/cardPergunta";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import axios from "axios";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icons";
import { useUser } from "@/app/hook/UserProvider";

interface Pergunta {
  questionNum: number;
  question: string;
}

interface Resposta {
  optionNum: number;
  description: string;
  questionNum: number;
}

const FormSchema = z.object({
  type: z.string().min(1),
});

const url = "https://5quazgdoai.execute-api.us-east-1.amazonaws.com/prod";

const fetchData = async () => {
  const [perguntasRes, respostasRes] = await Promise.all([
    axios.get(url),
    axios.get(`${url}/responses`),
  ]);

  return {
    perguntas: perguntasRes.data as Pergunta[],
    respostas: respostasRes.data as Resposta[],
  };
};

export default function Perguntas() {
  const { user, setUser } = useUser();
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isQuestionNum, setIsQuestionNum] = useState<number>(
    user?.lastQuestion || 1
  );
  const [timer, setTimer] = useState<number>(30);
  const [isScoreUser, setIsScoreUser] = useState<number>(user?.score || 0);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const router = useRouter();

  const { data, error } = useSWR(url, fetchData);

  // Função para atualizar a pontuação do usuário
  const updateUserScore = useCallback(
    async (lastQuestion: number) => {
      if (!user) return; // Retorne se user não estiver definido
      try {
        // Chame a API para atualizar o score
        await axios.put(`${url}/score`, {
          id: Number(user.id),
          score: Number(isScoreUser),
          lastQuestion: Number(lastQuestion),
        });

        // Atualize o contexto do usuário com os novos dados
        setUser((prevUser) => ({
          ...prevUser, // Mantém os campos anteriores
          score: isScoreUser, // Atualiza a pontuação
          lastQuestion: lastQuestion,
        }));
      } catch (error) {
        console.error("Erro ao atualizar a pontuação do usuário:", error);
      }
    },
    [user, isScoreUser, setUser]
  );

  // useEffect para gerenciar o temporizador e atualizar a pontuação
  useEffect(() => {
    const dataUser = localStorage.getItem("dataUser");

    if (!dataUser) {
      router.push("/");
      return; // Adicionando return aqui para evitar execução desnecessária
    }

    setIsChecking(false);
    setTimer(30);

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setIsQuestionNum((prev) => prev + 1); // Incrementa o número da pergunta
          setTimer(30); // Reseta o temporizador
        }
        return prev - 1; // Decrementa o tempo
      });
    }, 1000);

    return () => clearInterval(countdown); // Limpa o intervalo ao desmontar
  }, [router]);

  useEffect(() => {
    const updateScoreIfFinished = async () => {
      // Verifica se todas as perguntas foram respondidas
      if (data?.perguntas && isQuestionNum > data.perguntas.length - 1) {
        await updateUserScore(9999);
        router.push("/finalizado");
      }

      // Verifica se a última pergunta foi alcançada
      if (user?.lastQuestion === 9999) {
        router.push("/finalizado");
      }
    };

    updateScoreIfFinished();
  }, [isQuestionNum, data, router, updateUserScore, user]);

  if (isChecking) {
    return null;
  }

  if (error) {
    return <p>Houve um erro ao carregar a pergunta: {error.message}</p>;
  }

  if (!data) {
    return <p>Carregando...</p>;
  }

  async function onSubmit() {
    if (isQuestionNum < data!.perguntas.length) {
      setIsQuestionNum((prev) => prev + 1);
      setIsScoreUser((prev) => prev + 100);
    }
  }

  const perguntaAtual = data.perguntas.find(
    (item: Pergunta) => item.questionNum === isQuestionNum
  );

  const respostasAtuais = data.respostas.filter(
    (resposta: Resposta) => resposta.questionNum === isQuestionNum
  );

  if (!perguntaAtual) {
    router.push("/finalizado");
  }

  return (
    <CardPergunta
      title={perguntaAtual?.question || "Pergunta não disponível"}
      className="border border-primary/70 shadow-xl"
    >
      <CardHeader>
        <div className="flex justify-between pb-2 text-primary">
          <div className="flex items-center gap-x-2">
            <Icon name="Clock" />
            {timer} segundos
          </div>
          <div className="flex items-center gap-x-2">
            <Icon name="Trophy" />
            {isScoreUser}
          </div>
        </div>
        <CardTitle className="font-semibold text-center text-lg text-primary bg-secondary py-4 rounded-lg shadow-md">
          {perguntaAtual?.question || "Pergunta não disponível"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {respostasAtuais.map((resposta, index) => (
                          <FormItem
                            key={index}
                            className={cn(
                              "flex items-center text-primary border space-x-3 space-y-0 p-4 rounded-md cursor-pointer transition-colors",
                              field.value === resposta.description
                                ? "border-primary border-2"
                                : "border-primary/40"
                            )}
                            onClick={() => field.onChange(resposta.description)}
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={resposta.description}
                                className="hidden"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {resposta.description}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="font-semibold w-full" type="submit">
                Avançar
              </Button>
            </form>
          </Form>
          <Button
            onClick={() => updateUserScore(isQuestionNum)}
            className="bg-muted-foreground hover:bg-muted-foreground/90 font-semibold w-full lg:w-2/4 my-2"
            asChild
          >
            <Link href="/home">Continuar depois</Link>
          </Button>
        </div>
      </CardContent>
    </CardPergunta>
  );
}
