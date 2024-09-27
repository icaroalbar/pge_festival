import React from "react";
import Image from "next/image";

export function PaginaCarregamento() {
  return (
    <div className="flex items-center justify-center antialiased bg-secondary bg-gradient-to-b from-primary to-secondary h-screen">
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
