"use client";

import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export const QRCodeComponent = () => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      true
    );

    scanner.render(
      (result) => {
        alert(`QR Code scanned: ${result}`); // Exibe o resultado do QR code
      },
      (error) => {
        console.warn(`Error scanning QR Code: ${error}`);
      }
    );

    return () => {
      scanner.clear(); // Limpa o scanner quando o componente for desmontado
    };
  }, []);

  return <div id="reader" style={{ width: "100%" }}></div>;
};
