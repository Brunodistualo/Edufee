"use client";

import React, { useEffect, useState } from "react";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { FormDataStudent, useFormStudent } from "@/hooks/useFormStudent";
import { getInstitutionsNames } from "@/helpers/institution.helper";

const StudentRegisterForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const initialState: FormDataStudent = {
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    direccion: "",
    telefono: "",
    institucion: "",
  };

  const { formData, errors, handleChange, handleSubmit, handleFileChange, setFormData } = useFormStudent(initialState);
  const [institutions, setInstitutions] = useState<string[]>([]);

  const fetchInstitutions = async () => {
    try {
      const institutions: string[] = await getInstitutionsNames();
      setInstitutions(institutions);
      setFormData((prevData) => ({
        ...prevData,
        institucion: institutions[0] || "",
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  if (isLoading) {
    return <div className="h-[90vh] text-lg flex items-center justify-center">Cargando formulario de estudiante...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 py-12">
      <div className="w-full max-w-lg p-8 bg-gradient-to-b from-blue-200 via-blue-200 to-blue-300 border-2 border-gray-200 shadow-xl rounded-3xl">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">Registro de Estudiante</h2>
        <form className="space-y-6 " onSubmit={handleSubmit}>
          <FormInput
            type="text"
            name="nombre"
            label="Nombre"
            placeholder="John"
            value={formData.nombre}
            onChange={handleChange}
            error={errors.nombre}
          />
          <FormInput
            type="text"
            name="apellido"
            label="Apellido"
            placeholder="Doe"
            value={formData.apellido}
            onChange={handleChange}
            error={errors.apellido}
          />
          <FormInput
            type="text"
            name="dni"
            label="DNI"
            placeholder="96021093"
            value={formData.dni}
            onChange={handleChange}
            error={errors.dni}
          />
          <FormInput
            type="text"
            name="direccion"
            label="Dirección"
            placeholder="Calle falsa 123"
            value={formData.direccion}
            onChange={handleChange}
            error={errors.direccion}
          />
          <FormInput
            type="tel"
            name="telefono"
            label="Teléfono"
            placeholder="1123908799"
            value={formData.telefono}
            onChange={handleChange}
            error={errors.telefono}
          />
          <FormSelect
            name="institucion"
            value={formData.institucion}
            label="Selecciona una institución"
            onChange={handleChange}
            options={institutions}
          />
          <div>
            <label htmlFor="photo-profile" className="block text-sm font-bold text-gray-700">
              Subir foto de perfil (opcional)
            </label>
            <input
              id="photo-profile"
              type="file"
              name="fotoPerfil"
              className="mt-2 w-full p-2 border border-gray-300 bg-slate-50 rounded-md focus:ring-blue-500 focus:border-blue-500"
              onChange={handleFileChange}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-green-500 text-white font-bold text-lg rounded-md shadow-md hover:bg-green-700 transition-colors duration-300"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentRegisterForm;
