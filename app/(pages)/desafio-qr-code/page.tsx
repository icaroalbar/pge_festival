// pages/index.tsx

"use client";

import { Html5Qrcode, Html5QrcodeCameraScanConfig } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

const QRCodeComponent = () => {
  const [qrCodeValue, setQrCodeValue] = useState<string>(""); // Variável para armazenar o valor do QR Code
  const scannerRef = useRef<Html5Qrcode | null>(null); // Ref com tipo definido para a instância de Html5Qrcode

  useEffect(() => {
    const fetchCamerasAndStartScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras(); // Obtém a lista de câmeras disponíveis
        if (cameras && cameras.length > 0) {
          const backCamera = cameras.find((camera) =>
            camera.label.toLowerCase().includes("back")
          );

          const cameraId = backCamera ? backCamera.id : cameras[0].id;

          if (!scannerRef.current) {
            const html5QrCode = new Html5Qrcode("reader");

            // Configuração do scanner
            const config: Html5QrcodeCameraScanConfig = {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.5,
            };

            // Inicia o scanner com a câmera selecionada
            await html5QrCode.start(
              cameraId,
              config,
              (decodedText) => {
                setQrCodeValue(decodedText); // Armazena o resultado do QR Code
                html5QrCode.stop(); // Para o scanner após a leitura do QR Code
              },
              (errorMessage) => {
                console.warn(`Erro ao escanear QR Code: ${errorMessage}`);
              }
            );

            // Armazena a instância do scanner na ref
            scannerRef.current = html5QrCode;
          }
        } else {
          console.error("Nenhuma câmera encontrada.");
        }
      } catch (error) {
        console.error("Erro ao buscar câmeras ou iniciar o scanner: ", error);
      }
    };

    fetchCamerasAndStartScanner(); // Chama a função para buscar câmeras e iniciar o scanner

    return () => {
      // Limpa o scanner ao desmontar o componente
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.clear();
      }
    };
  }, []);

  return (
    <div>
      <div id="reader" style={{ width: "100%" }}></div>
      <p>QR Code escaneado: {qrCodeValue}</p>
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
