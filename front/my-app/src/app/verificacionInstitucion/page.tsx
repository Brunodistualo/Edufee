'use client'

import Image from "next/image";
import { useEffect } from "react";
import { InstitutionsData } from "@/store/institutionsData";
import { useRouter } from "next/navigation";

const VerificationPage = () => {
  const getInstitutionData = InstitutionsData((state) => state.getInstitutionData);
  const institute = InstitutionsData((state) => state.institutionData);
  const router = useRouter()

  useEffect(() => {
    getInstitutionData();
  }, [])
  
  useEffect(()=> {
    if (institute.isActive === "approved") {
      router.push("/institucion/dashboard");
    }
  },[institute])

  console.log(institute)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-blue-200 to-blue-300 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto text-center">
        <div className="//bg-blue-100 mx-auto   max-h-[full] flex flex-col items-center p-8 ">
          <Image
            src="/LOGO1.svg"
            alt="Your SVG Description"
            className="w-[100%] h-[100%]"
            width={100}
            height={100}
          />
        </div>

        <h1 className="text-xl font-semibold mb-4 text-gray-700">
          Tu cuenta está siendo verificada
        </h1>
        <p className="text-gray-600 mb-6">
        Estamos verificando tu cuenta. Por favor, permite que nuestro equipo tome el tiempo necesario para brindarte una respuesta. Gracias por tu paciencia.
        </p>
        {/* <Link
          href="/contact-us"
          className=" text-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition maw-w-[5px]"
        >
          Contáctanos
        </Link> */}
      </div>
    </div>
  );
};

export default VerificationPage;
