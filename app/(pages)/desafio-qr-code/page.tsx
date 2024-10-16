// pages/index.js

"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

const QRCodeComponent = () => {
  const [qrCodeValue, setQrCodeValue] = useState(""); // Variável para armazenar o valor do QR Code
  const scannerRef = useRef<Html5Qrcode | null>(null); // Ref com tipo definido

  useEffect(() => {
    const fetchCamerasAndStartScanner = async () => {
      const cameras = await Html5Qrcode.getCameras(); // Obtém a lista de câmeras disponíveis
      if (cameras && cameras.length > 0) {
        // Tenta encontrar a câmera traseira (geralmente contém 'back' ou 'rear' no label)
        const backCamera = cameras.find((camera) =>
          camera.label.toLowerCase().includes("back")
        );

        // Se encontrar a câmera traseira, usa ela; caso contrário, usa a primeira disponível
        const cameraId = backCamera ? backCamera.id : cameras[0].id;

        if (!scannerRef.current) {
          const html5QrCode = new Html5Qrcode("reader");

          // Inicia o scanner com a câmera selecionada
          html5QrCode
            .start(
              cameraId,
              {
                fps: 10, // Frames por segundo
                qrbox: { width: 250, height: 250 }, // Tamanho da área de escaneamento
                aspectRatio: 1.5,
              },
              (decodedText) => {
                setQrCodeValue(decodedText); // Armazena o resultado do QR Code na variável
                html5QrCode.stop(); // Para o scanner após a leitura do QR Code
              },
              (errorMessage) => {
                console.warn(`Erro ao escanear QR Code: ${errorMessage}`);
              }
            )
            .catch((err) => {
              console.error("Erro ao iniciar o scanner: ", err);
            });

          // Armazena a instância do scanner na ref
          scannerRef.current = html5QrCode;
        }
      } else {
        console.error("Nenhuma câmera encontrada.");
      }
    };

    fetchCamerasAndStartScanner(); // Chama a função para buscar câmeras e iniciar o scanner

    // Limpa o scanner ao desmontar o componente
    return () => {
      scannerRef.current?.stop(); // Para o scanner ao desmontar
      scannerRef.current?.clear(); // Limpa a câmera se inicializada
    };
  }, []); // Efeito rodando apenas uma vez

  return (
    <div>
      <div id="reader" style={{ width: "100%" }}></div>{" "}
      {/* Scanner do QR Code */}
      <p>QR Code escaneado: {qrCodeValue}</p>{" "}
      {/* Exibe o valor do QR Code capturado */}
    </div>
  );
};

export default function DesafioQRCode() {
  return (
    <div>
      <h1>Next.js QR Code Scanner</h1>
      <QRCodeComponent />
    </div>
  );
}
