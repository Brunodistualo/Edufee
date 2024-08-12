'use client'

import { useState } from "react";
import { registerInstitution, uploadLogoBanner } from "@/helpers/institution.helper";
import { useUser } from "@auth0/nextjs-auth0/client";
import { tokenStore } from "@/store/tokenStore";
import { useRouter } from "next/navigation";

export interface FormDataInstitute {
  nombreInstitucion: string;
  direccion: string;
  telefono: string;
  numeroCuenta: string;
  email: string,
  logo: File | null;
  banner: File | null;
}

export const useFormInstitute = (initialState: FormDataInstitute) => {
  const [formData, setFormData] = useState<FormDataInstitute>(initialState);
  const [errors, setErrors] = useState<any>({});
  const [renderFlag, setRenderFlag] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const setToken = tokenStore((state) => state.setToken);
  const newErrors: any = {};

  console.log(errors)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (validate() && user) {
      console.log(formData)
      formData.email = user?.email!;
      user.name = formData.nombreInstitucion;

      console.log("hola")
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const data = await registerInstitution(formData);
        const instituteId = data.institutionResponse.id;
        const instituteEmail = data.institutionResponse.email
        await uploadLogoBanner(formData, instituteId);
        const response = await fetch(`${API_URL}/auth/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: instituteEmail,
          }),
        });
        const dataToken = await response.json();
        console.log(dataToken)
        setToken(dataToken.token)
        alert(" Institución registrada correctamente")
        router.push("/verificacionInstitucion")
      } catch (error: any) {  
        alert("Ocurrio un error al registrar una institution")
        const { errores} = JSON.parse(error.message)

        errores.forEach((error: any) => {
          newErrors[error.field.toLowerCase()] = error.message
        })

        setErrors(newErrors);
        setRenderFlag((prev) => !prev);
      }
    }
  };
  const validate = () => {
    
    if (!formData.nombreInstitucion) newErrors.name = "El nombre de la institución es requerido";
    if (!formData.direccion) newErrors.direccion = "La dirección es requerida";
    if (!formData.telefono) newErrors.telefono = "El teléfono es requerido";
    if (!formData.numeroCuenta) newErrors.numeroCuenta = "El número de cuenta es requerido";
  
    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error); 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const files = e.target instanceof HTMLInputElement && e.target.type === 'file' ? e.target.files : undefined;
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      [name]: files ? files[0] : value,
    }));
  };

  return { formData, errors, handleChange,handleSubmit, validate };
};
