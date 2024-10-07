import { useUser } from "@/app/hook/UserProvider";
import axios from "axios";
import React from "react";
import useSWR from "swr";
import Image from "next/image";

const url = "https://5quazgdoai.execute-api.us-east-1.amazonaws.com/prod";

type RankingItem = {
  score: number;
  primeiroNome: string;
  ultimoNome: string;
  position: number | null;
};

type RankingData = {
  ranking: RankingItem[];
  scoreUser: {
    score: number;
    position: number;
  };
};

// Função para buscar os dados do ranking, recebe o userId como parâmetro
const fetchData = async (userId: number) => {
  const response = await axios.get(`${url}/ranking/${userId}`);
  return response.data;
};

export function Ranking() {
  const { user } = useUser(); // Pega o usuário usando o hook useUser

  // Verifica se o user e o user.id existem antes de passar para o useSWR
  const { data, error } = useSWR<RankingData>(
    `${url}/ranking/${user?.id}`,
    () => fetchData(user?.id || 0)
  );

  if (error) {
    return <p>Houve um erro ao carregar o ranking</p>;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center antialiased bg-primary h-screen">
        <Image
          src="https://pge-festival.s3.amazonaws.com/logo-pg-inova.png"
          alt="PG Inova logo"
          width={150}
          height={100}
          priority
          className="animate-pulse"
        />
      </div>
    );
  }

  const { scoreUser, ranking } = data;

  return (
    <div className="h-screen flex justify-start gap-y-8 items-center flex-col bg-primary py-6">
      <div className="flex items-center justify-center">
        <Image
          src="https://pge-festival.s3.amazonaws.com/ranking.png"
          alt="PG Inova logo"
          width={90}
          height={100}
          priority
        />
      </div>
      <div className="flex flex-col gap-3 w-full md:w-1/3 justify-center items-center p-4">
        {ranking.map((item: RankingItem, index: number) => (
          <div
            key={index}
            className="w-full py-3 flex justify-between items-center rounded-md bg-white p-2"
          >
            <div className="col-span-2 text-primary font-semibold flex gap-x-1 capitalize">
              <span>{index + 1}.</span>
              <p>{item.primeiroNome}</p>
              <p>{item.ultimoNome}</p>
            </div>
            <div className="col-span-1 text-muted-foreground font-semibold">
              <span>{item.score}</span>
            </div>
          </div>
        ))}
        <div className="w-full grid grid-cols-3 justify-between items-center rounded-md bg-black/50 p-2">
          <div className="col-span-2">
            <p className="text-yellow-500 font-semibold">Sua Posição:</p>
          </div>
          <div className="flex col-span-1 text-white font-semibold flex-col items-center">
            <div className="flex justify-between w-full">
              <p>Posição:</p>
              <span>{scoreUser.position}</span>
            </div>
            <div className="flex justify-between w-full">
              <p>Pontos:</p>
              <span>{scoreUser.score}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
