"use client";

import { Button } from "@/components/ui/button";
import CardPergunta from "@/components/ui/cardPergunta";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { useState } from "react";

export default function Perguntas() {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const isSelected = (value: string) => selectedOption === value;

  return (
    <CardPergunta
      title="[pergunta]"
      className="border border-primary/70 shadow-xl"
    >
      <div className="flex flex-col">
        <RadioGroup defaultValue="option-one">
          <div
            className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg ${
              isSelected("option-one")
                ? "bg-primary/10 border border-primary"
                : "bg-white border border-transparent"
            }`}
            onClick={() => setSelectedOption("option-one")}
          >
            <RadioGroupItem
              value="option-one"
              id="option-one"
              checked={isSelected("option-one")}
              onChange={() => setSelectedOption("option-one")}
              className="hidden"
            />
            <Label htmlFor="option-one">Option One</Label>
          </div>
          <div
            className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg ${
              isSelected("option-two")
                ? "bg-primary/10 border border-primary"
                : "bg-white border border-transparent"
            }`}
            onClick={() => setSelectedOption("option-two")}
          >
            <RadioGroupItem
              value="option-two"
              id="option-two"
              checked={isSelected("option-two")}
              onChange={() => setSelectedOption("option-two")}
              className="hidden"
            />
            <Label htmlFor="option-two">Option two</Label>
          </div>
        </RadioGroup>
        <Button className="font-semibold w-full lg:w-2/4 my-2" asChild>
          <Link href="/">Avançar</Link>
        </Button>
        <Button
          className="bg-muted-foreground hover:bg-muted-foreground/90 font-semibold w-full lg:w-2/4 my-2"
          asChild
        >
          <Link href="/">Continuar depois</Link>
        </Button>
      </div>
    </CardPergunta>
  );
}
