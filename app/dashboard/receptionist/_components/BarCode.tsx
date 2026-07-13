// components/Barcode.tsx
"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

interface BarcodeProps {
  value: string;
  format?: "CODE128" | "EAN13" | "CODE39";
}

export default function Barcode({ value, format = "CODE128" }: BarcodeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: format,
          width: 2,
          height: 50,
          displayValue: true, // Shows the text under the barcode
          fontSize: 14,
          margin: 0,
        });
      } catch (error) {
        console.error("Barcode generation failed:", error);
      }
    }
  }, [value, format]);

  return <svg ref={svgRef} className="max-w-full h-auto"></svg>;
}
