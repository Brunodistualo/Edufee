"use client";

import React from "react";
import FormInput from "@/components/FormInput";
import { FormDataInstitute, useFormInstitute } from "@/hooks/useFormInstitute";

const InstituteRegisterForm: React.FC = () => {
  const initialState: FormDataInstitute = {
    nombreInstitucion: "",
    direccion: "",
    telefono: "",
    numeroCuenta: "",
    email: "",
    logo: null,
    banner: null,
  };

  const { formData, errors, handleChange, handleSubmit } = useFormInstitute(initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 py-12">
      <div className="w-full max-w-lg p-8 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400 shadow-xl rounded-3xl">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">Registro de Institución</h2>
        <form className="space-y-6 " onSubmit={handleSubmit}>
          <FormInput
            type="text"
            name="nombreInstitucion"
            label="Nombre de la Institución"
            placeholder="Harvard University"
            value={formData.nombreInstitucion}
            onChange={handleChange}
            error={errors.nombreInstitucion}
          />
          <FormInput
            type="text"
            name="direccion"
            label="Dirección"
            placeholder="Street, City, State, Country"
            value={formData.direccion}
            onChange={handleChange}
            error={errors.direccion}
          />
          <FormInput
            type="tel"
            name="telefono"
            label="Teléfono"
            placeholder="555-555-5555"
            value={formData.telefono}
            onChange={handleChange}
            error={errors.telefono}
          />
          <FormInput
            type="text"
            name="numeroCuenta"
            label="Número de Cuenta"
            placeholder="1234567890"
            value={formData.numeroCuenta}
            onChange={handleChange}
            error={errors.numeroCuenta}
          />
          <div className="flex flex-col space-y-4">
            <div>
              <label htmlFor="logo" className="block font-bold text-sm text-gray-700 mb-1">
                Subir Logo (opcional)
              </label>
              <input
                id="logo"
                type="file"
                name="logo"
                className="mt-2 w-full p-3 border bg-slate-100 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-150 ease-in-out"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="banner" className="block font-bold text-sm  text-gray-700 mb-1">
                Subir Banner (opcional)
              </label>
              <input
                id="banner"
                type="file"
                name="banner"
                className="mt-2 w-full p-3 border bg-slate-100 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-150 ease-in-out"
                onChange={handleChange}
              />
            </div>
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

export default InstituteRegisterForm;
