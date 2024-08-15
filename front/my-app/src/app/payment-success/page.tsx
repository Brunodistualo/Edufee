"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DataUser } from "../../store/userData";
import { tokenStore } from "@/store/tokenStore";

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current 
        border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const amount = searchParams?.get("amount") || "0";
  const reference = searchParams?.get("reference") || "";
  const userData = DataUser((state) => state.userData);
  const token = tokenStore((state) => state.token);
  const [loading, setLoading] = useState(false);

  const paymentRegisteredRef = useRef(false);
  const registrationInProgressRef = useRef(false);
  const pdfUploadedRef = useRef(false);
  const uploadInProgressRef = useRef(false);

  const nombreCompleto = `${userData.name} ${userData.lastname}`;

  let userID = "";
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userID = payload.id as string;
    }
  } catch (error) {
    console.error("Failed to decode token:", error);
  }

  useEffect(() => {
    if (!userData.name || !userData.institution?.name) {
      console.error("User data is missing.");
      return;
    }

    const uploadPDFToCloudinary = async (
      pdfBlob: Blob
    ): Promise<string | null> => {
      if (pdfUploadedRef.current || uploadInProgressRef.current) {
        return null;
      }

      uploadInProgressRef.current = true;

      const uploadId = `${userID}-${amount}-${reference}`;
      const hasUploaded = localStorage.getItem(uploadId);

      if (hasUploaded === "true") {
        console.log("PDF already uploaded");
        pdfUploadedRef.current = true;
        uploadInProgressRef.current = false;
        return localStorage.getItem(uploadId) || null;
      }

      const formData = new FormData();
      formData.append("file", pdfBlob);
      formData.append(
        "upload_preset",
        process.env.NEXT_CLOUDINARY_UPLOAD_PRESET || "ml_default"
      );
      formData.append("public_id", reference);

      try {
        formData.append(
          "context",
          `name=${userData.name},institution=${userData.institution?.name}`
        );

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/daqlqr2wv/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload PDF to Cloudinary");
        }

        const data = await response.json();
        const fileUrl = data.secure_url; // Save the URL from Cloudinary response
        //console.log("PDF uploaded to Cloudinary successfully");
        //console.log("Cloudinary URL:", fileUrl); // Log the URL to the console

        // Modify the file URL to end with .png instead of .pdf
        const pngUrl = fileUrl.replace(/\.pdf$/, ".png");
        console.log(pngUrl);
        localStorage.setItem(uploadId, pngUrl);
        pdfUploadedRef.current = true;
        return pngUrl;
      } catch (error) {
        console.error("Error uploading PDF to Cloudinary:", error);
        return null;
      } finally {
        uploadInProgressRef.current = false;
      }
    };

    const registerPayment = async (pdfImage: string) => {
      if (paymentRegisteredRef.current || registrationInProgressRef.current) {
        return;
      }

      registrationInProgressRef.current = true;

      const transactionId = `${userID}-${amount}-${reference}`;
      const hasRegistered = localStorage.getItem(transactionId);
      if (hasRegistered === "true") {
        console.log("Payment already registered");
        paymentRegisteredRef.current = true;
        registrationInProgressRef.current = false;
        return;
      }
      const apiBaseUrl = process.env.AUTH0_BASE_URL || "http://localhost:3005";
      try {
        const response = await fetch(`${apiBaseUrl}/payments/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: parseInt(amount, 10),
            institution: userData.institution?.name,
            studentName: nombreCompleto,
            reference,
            pdfImage, // Use the Cloudinary URL here
            userId: userID,
            institutionId: userData.institution?.id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to register payment");
        }

        localStorage.setItem(transactionId, "true");
        paymentRegisteredRef.current = true;
        console.log("Payment registered successfully");
      } catch (error) {
        console.error("Error registering payment:", error);
      } finally {
        registrationInProgressRef.current = false;
      }
    };

    const generateAndUploadPDF = async () => {
      try {
        const response = await fetch("/api/downloadPDF", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            institution: userData.institution?.name || "miCasaSuCasa",
            studentName: nombreCompleto || "Yo",
            reference,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate PDF");
        }

        const blob = await response.blob();
        const pdfUrl = await uploadPDFToCloudinary(blob);
        if (pdfUrl) {
          await registerPayment(pdfUrl);
        }
      } catch (error) {
        console.error("Error handling PDF:", error);
      } finally {
        setLoading(false);
      }
    };

    generateAndUploadPDF();
  }, [amount, reference, userData, userID, token, nombreCompleto]);

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/downloadPDF", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          institution: userData.institution?.name,
          studentName: nombreCompleto,
          reference,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "receipt.pdf";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPayment = () => {
    router.push("/payment-form");
  };

  return (
    <main className="relative overflow-auto font-inter h-screen flex flex-col items-center space-y-8 text-white text-center border bg-gradient-to-tr from-blue-500 to-green-500 pb-32">
      <div className="mt-32 p-4 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-2">
          Gracias, {nombreCompleto || "Usuario"}
        </h1>
        <div className="bg-white p-2 rounded-md text-blue-600 mt-5 text-4xl font-bold">
          Pago enviado a{" "}
          <span className="font-bold font-inter">
            {userData.institution?.name || "Institución no disponible"}
          </span>{" "}
          por: ${amount}
        </div>
        <button
          onClick={handleDownloadPDF}
          className="mt-8 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-40"
          disabled={loading}
        >
          {loading ? "Generando PDF..." : "Descargar PDF"}
        </button>
        <button
          onClick={handleNewPayment}
          className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 w-40"
        >
          Generar nuevo pago
        </button>
      </div>
    </main>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentContent />
    </Suspense>
  );
}
