'use client'

import { uploadStudentImageProfile } from '@/helpers/student.helper';
import { useState } from 'react';
import { useUser } from "@auth0/nextjs-auth0/client";
import { tokenStore } from "@/store/tokenStore";
import { registerStudent } from "@/helpers/student.helper";
import { useRouter } from "next/navigation";


export interface FormDataStudent {
  nombre: string,
  apellido: string,
  dni: string,
  email: string,
  telefono: string,
  direccion: string,
  institucion: string
}

export const useFormStudent = (initialState: FormDataStudent) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState<any>({});
  const [file, setFile] = useState<File | null>(null);
  const { user } = useUser();
  const [renderFlag, setRenderFlag] = useState(false);
  const router = useRouter();
  const token = tokenStore((state) => state.token);
  const SetToken = tokenStore((state) => state.setToken);
  const newErrors: any = {};

  console.log("errores estado: ", errors)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  const handleSubmitStudentImageProfile = async(userId: string) => {
    if (file) {
      await uploadStudentImageProfile(userId, file);
    }
  }
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (validate() && user) {

      formData.email = user?.email!;
      console.log(formData)
      try {
        const studentId = await registerStudent(formData);
        await handleSubmitStudentImageProfile(studentId);
        SetToken(studentId)
        alert("Estudiante creado exitosamente")
        router.push("/student/dashboard")
      } catch (error: any) {
        try {  
          const errorResponse = JSON.parse(error.message);  
          alert("Ocurrió un error al registrar el usuario: " + errorResponse.message);  
          
          errorResponse.errores.forEach((err: any) => {  
            if (err.fields && err.message) {  
              // Inicializa como un array si no existe  
              if (!newErrors[err.fields.toLowerCase()]) {  
                newErrors[err.fields.toLowerCase()] = [];  
              }  
              newErrors[err.fields.toLowerCase()].push(err.message);  
            }  
          });
          setErrors(newErrors);
          setRenderFlag((prev) => !prev);
        } catch (parseError) {  
          alert("Ocurrió un error inesperado.");  
        }  
      } 
    }
  };

  const validate = () => {
    
    if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.apellido) newErrors.apellido = "El apellido es obligatorio";
    if (!formData.dni) {
      newErrors.dni = [];
      newErrors.dni.push("El DNI es obligatorio");
    }
    if (!formData.telefono)  newErrors.telefono = "El teléfono es obligatorio";
    if (!formData.institucion) newErrors.institucion = "La institución es obligatoria";
    
    console.log(" errores: ", newErrors)

    setErrors(newErrors);
    
    return Object.values(newErrors).every((error) => !error);
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    handleFileChange,
    handleSubmitStudentImageProfile,
    validate,
    setFormData,
  };
};
