import React from 'react';

interface FormInputProps {
  type: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string[] | string;
}

const FormInput: React.FC<FormInputProps> = ({ type, name,label, placeholder, value, onChange, error }) => (
  
  <div>
    <label htmlFor={name} className="block font-bold">{label}</label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 rounded-md"
      value={value}
      onChange={onChange}
    />
    {error && Array.isArray(error) && error.map((error) => <p key={error} className="text-red-700 font-bold">{error}</p>)}
    {error && !Array.isArray(error)  && <p className="text-red-700 font-bold">{error}</p>}
  </div>
);

export default FormInput;
