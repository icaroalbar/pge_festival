"use client";

import { Button } from "@/components/ui/button";
import CardPergunta from "@/components/ui/cardPergunta";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { PaginaCarregamento } from "@/components/ui/paginaCarregamento";
import { Input } from "@/components/ui/input";
import { uploadFile } from "./uploadFile";

interface Pergunta {
  questionNum: number;
  question: string;
  correctAnswer: number;
  tipoPergunta: "M" | "Q" | "I";
}

interface Resposta {
  optionNum: number;
  description: string;
  questionNum: number;
}

const FormSchema = z.object({
  type: z.string().min(1).optional(),
  files: z.any().optional(),
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
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isQuestionNum, setIsQuestionNum] = useState<number>(
    user?.lastQuestion || 1
  );
  const [timer, setTimer] = useState<number>(user?.timer || 30);
  const [isScoreUser, setIsScoreUser] = useState<number>(user?.score || 0);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const router = useRouter();

  const { data, error } = useSWR(url, fetchData);

  // Função para atualizar a pontuação do usuário
  const updateUserScore = useCallback(
    async (lastQuestion: number, timeLeft: number) => {
      if (!user) return; // Retorne se user não estiver definido
      try {
        // Chame a API para atualizar o score
        await axios.put(`${url}/score`, {
          id: Number(user.id),
          score: Number(isScoreUser),
          lastQuestion: Number(lastQuestion),
          timer: timeLeft,
        });

        // Atualize o contexto do usuário com os novos dados
        setUser((prevUser) => ({
          ...prevUser, // Mantém os campos anteriores
          score: isScoreUser, // Atualiza a pontuação
          lastQuestion: lastQuestion,
          timer: timeLeft,
        }));
      } catch (error) {
        console.error("Erro ao atualizar a pontuação do usuário:", error);
      }
    },
    [user, isScoreUser, setUser]
  );

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Atualiza a pontuação antes de fechar ou sair
      updateUserScore(isQuestionNum, timer);

      // Opcional: Exibir um alerta de confirmação ao tentar fechar ou recarregar
      event.preventDefault();
      event.returnValue = ""; // Necessário para alguns navegadores mostrarem o alerta padrão de confirmação
    };

    // Adiciona o listener ao evento `beforeunload`
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Limpa o listener ao desmontar o componente
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [updateUserScore, isQuestionNum, timer, router]);

  // useEffect para gerenciar o temporizador e atualizar a pontuação
  useEffect(() => {
    const dataUser = localStorage.getItem("dataUser");

    if (!dataUser) {
      router.push("/");
      return; // Evitar execução desnecessária
    }

    setIsChecking(false);
    setTimer(timer);

    const countdown = setInterval(() => {
      const perguntaAtual = data?.perguntas.find(
        (item: Pergunta) => item.questionNum === isQuestionNum
      );

      // Se o tipo da pergunta for "I", não inicie o temporizador
      if (perguntaAtual?.tipoPergunta === "I") {
        clearInterval(countdown); // Para o temporizador se for "I"
        return; // Não faz mais nada
      }

      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown); // Limpa o intervalo quando o tempo acaba

          const respostasAtuais = data?.respostas.filter(
            (resposta: Resposta) => resposta.questionNum === isQuestionNum
          );

          const selectedAnswer = form.getValues("type"); // Obter a resposta selecionada
          const selectedResposta = respostasAtuais?.find(
            (resposta) => resposta.description === selectedAnswer
          );

          // Verifica se uma resposta foi selecionada
          if (selectedResposta) {
            // Se uma resposta foi selecionada, verifica se é a correta
            if (selectedResposta.optionNum === perguntaAtual?.correctAnswer) {
              setIsScoreUser((prev) => prev + 100); // Incrementa a pontuação
            }
          }

          // Atualiza para a próxima pergunta e reseta o temporizador
          setIsQuestionNum((prev) => prev + 1);
          setTimer(30); // Reinicia o timer aqui

          return 30; // Evita que o timer continue diminuindo
        }
        return prev - 1; // Continua a contagem regressiva
      });
    }, 1000);

    return () => clearInterval(countdown); // Limpa o intervalo quando o componente é desmontado
  }, [isQuestionNum, router, form, data, timer]);

  useEffect(() => {
    const updateScoreIfFinished = async () => {
      // Verifica se todas as perguntas foram respondidas
      if (data?.perguntas && isQuestionNum > data.perguntas.length - 1) {
        await updateUserScore(9999, timer);
        router.push("/finalizado");
      }

      // Verifica se a última pergunta foi alcançada
      if (user?.lastQuestion === 9999) {
        router.push("/finalizado");
      }
    };

    updateScoreIfFinished();
  }, [isQuestionNum, data, router, updateUserScore, user, timer]);

  if (isChecking) {
    return null;
  }

  if (error) {
    return <p>Houve um erro ao carregar a pergunta: {error.message}</p>;
  }

  if (!data) {
    return <PaginaCarregamento />;
  }

  const perguntaAtual = data.perguntas.find(
    (item: Pergunta) => item.questionNum === isQuestionNum
  );

  const respostasAtuais = data.respostas.filter(
    (resposta: Resposta) => resposta.questionNum === isQuestionNum
  );

  async function onSubmit(image) {
    // Verifica se a pergunta atual requer um arquivo
    if (perguntaAtual?.tipoPergunta === "I") {
      const file = image?.files ? image.files[0] : null; // Verifica se image e files existem

      if (file) {
        setIsDisabled(true);
        try {
          await uploadFile(file, user?.id, isQuestionNum); // Chama a função de upload do arquivo
          setIsScoreUser((prev) => prev + 150); // Adiciona 200 pontos ao usuário
        } catch (error) {
          console.error("Erro ao enviar o arquivo:", error);
          // Aqui você pode adicionar uma mensagem de erro para o usuário, se necessário
        } finally {
          setIsDisabled(false);
        }
      }
    }

    // Verifica se o tipo de pergunta é diferente de "I" ou se não houve arquivo
    else {
      // Se a pergunta não requer um arquivo, ou não houve upload, verifica a resposta selecionada
      const selectedAnswer = form.getValues("type");
      const selectedResposta = respostasAtuais.find(
        (resposta) => resposta.description === selectedAnswer
      );

      if (selectedResposta?.optionNum === perguntaAtual?.correctAnswer) {
        setIsScoreUser((prev) => prev + 100); // Adiciona 100 pontos pela resposta correta
      }
    }

    // Avança para a próxima pergunta, se houver mais
    if (isQuestionNum < data!.perguntas.length) {
      setIsQuestionNum((prev) => prev + 1);
    }

    // Reinicia o temporizador
    setTimer(30);
  }

  return (
    <div className="bg-gray-200 min-h-screen">
      <nav className="flex justify-between gap-2 items-center px-2 py-3 bg-primary shadow-md">
        <Button
          onClick={() => {
            updateUserScore(isQuestionNum, timer);
            router.push("/home");
          }}
          className="text-white shadow-none hover:bg-transparent hover:text-white"
          size="icon"
        >
          <Icon name="House" />
        </Button>
        <h2 className="uppercase font-bold text-white text-xl">pge festival</h2>
        <Button
          onClick={() => {
            updateUserScore(isQuestionNum, timer);
            localStorage.removeItem("dataUser");
            localStorage.removeItem("user");
            router.push("/");
          }}
          className="text-white shadow-none hover:bg-transparent hover:text-white"
          size="icon"
        >
          <Icon name="LogOut" />
        </Button>
      </nav>
      <div className="p-4 flex justify-center">
        <CardPergunta
          title={perguntaAtual?.question || "Pergunta não disponível"}
          className="border border-primary/70 shadow-xl max-w-2xl"
        >
          <CardHeader>
            <div
              className={`flex pb-2 text-primary ${
                perguntaAtual?.tipoPergunta === "I"
                  ? "justify-end"
                  : "justify-between"
              }`}
            >
              <div
                className={`items-center gap-x-2 ${
                  perguntaAtual?.tipoPergunta === "I" ? "hidden" : "flex"
                }`}
              >
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
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {perguntaAtual?.tipoPergunta === "I" ? (
                    // Pergunta de tipo 'I' requer um arquivo para upload
                    <FormField
                      control={form.control}
                      name="files"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Envie sua imagem aqui</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isDisabled}
                              type="file"
                              accept="image/*"
                              placeholder="Envie uma imagem"
                              onChange={(e) => field.onChange(e.target.files)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    // Caso contrário, exibe as opções de resposta múltipla
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              {respostasAtuais?.map((resposta, index) => (
                                <FormItem key={index}>
                                  <FormControl>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value={resposta.description}
                                        id={`option-${index}`}
                                        className="sr-only"
                                      />
                                      <FormLabel
                                        htmlFor={`option-${index}`}
                                        className={cn(
                                          "flex w-full items-center p-4 rounded-md text-primary border space-x-3 space-y-0",
                                          resposta.description ===
                                            form.getValues("type")
                                            ? "border-primary text-white bg-primary/80"
                                            : "border-muted-foreground"
                                        )}
                                      >
                                        {resposta.description}
                                      </FormLabel>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                  <Button
                    disabled={isDisabled}
                    className={`font-semibold w-full ${
                      isQuestionNum === 9999 && "hidden"
                    }`}
                    type="submit"
                  >
                    Avançar
                  </Button>
                </form>
              </Form>
              <Button
                disabled={isDisabled}
                onClick={() => {
                  updateUserScore(isQuestionNum, timer);
                  router.push("/home");
                }}
                className={`bg-muted-foreground w-full hover:bg-muted-foreground/90 font-semibold my-2 ${
                  isQuestionNum === 9999 && "hidden"
                }`}
              >
                Continuar depois
              </Button>
            </div>
          </CardContent>
        </CardPergunta>
      </div>
    </div>
  );
}
