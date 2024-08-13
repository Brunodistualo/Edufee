'use client';
import React, { use, useEffect, useState } from 'react';
import { InstitutionsData } from '@/store/institutionsData';
import { useUser } from '@auth0/nextjs-auth0/client';
import { PencilIcon } from 'lucide-react';
import { uploadImagesInstitution } from '@/helpers/uploadImage';
import swal from 'sweetalert';
import { editInstitution } from '@/helpers/institution.helper';
import { updateUser } from '@/helpers/editProfile';

const InstitutionProfile = () => {
    const [formData, setFormData] = useState({
        name: '',
        accountNumber: '',
        address: '',
        phone: ''
    });
    const [originalData, setOriginalData] = useState({
        name: '',
        accountNumber: '',
        address: '',
        phone: ''
    })
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [logo, setLogo] = useState<File | null>(null);
    const [banner, setBanner] = useState<File | null>(null);
    const { user } = useUser();
    const getInstitution = InstitutionsData((state) => state.getInstitutionData);
    const Data = InstitutionsData((state) => state.institutionData);

    useEffect(() => {
        getInstitution();
    }, [getInstitution]);

    useEffect(() => {
        if (Data) {
            const initialData = {
                name: Data.name || '',
                accountNumber: Data.accountNumber || '',
                address: Data.address || '',
                phone: Data.phone || '',
            };
            setFormData(initialData);
            setOriginalData(initialData);
        }
    }, [Data]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            if (type === 'logo') {
                setLogo(file);
            } else {
                setBanner(file);
            }
            handleUpload(type === 'logo' ? file : null, type === 'banner' ? file : null);
        }
    };

    const handleUpload = async (logo: File | null, banner: File | null) => {
        try {
            const data = await uploadImagesInstitution(logo, banner, Data.id!);
            if (data.ok) {
                swal({
                    title: "Imágenes subidas correctamente",
                    text: "El logo y/o banner de la institución han sido actualizados",
                    icon: "success",
                    timer: 4000,
                });
                getInstitution();
            }
        } catch (error) {
            swal({
                title: "Error",
                text: "Hubo un problema al subir las imágenes",
                icon: "error",
                timer: 4000,
            });
            console.log(error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'confirmPassword') {
            setCurrentPassword(value);
        } else if (name === 'password') {
            setNewPassword(value);
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handlePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (currentPassword === '' || newPassword === '') {
            swal({
                title: "Error",
                text: "Debe rellenar todos los campos",
                icon: "error",
                timer: 4000,
            });
            return;
        }

        if (currentPassword === newPassword) {
            swal({
                title: "Error",
                text: "Las contraseñas deben coincidir",
                icon: "error",
                timer: 4000,
            });
            return;
        }
        try {
            const response = await updateUser(user?.sub!, newPassword);
            if (response?.ok) {
                swal({
                    title: "Contraseña actualizada",
                    text: "La contraseña de la institución ha sido actualizada correctamente",
                    icon: "success",
                    timer: 4000,
                });
                getInstitution();
            }
        }catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            swal({
                title: "Error",
                text: "Hubo un problema al actualizar la contraseña",
                icon: "error",
                timer: 4000,
            });
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currentPassword || newPassword) {
            if (currentPassword === '' || newPassword === '') {
                swal({
                    title: "Error",
                    text: "Debe rellenar todos los campos de contraseña",
                    icon: "error",
                    timer: 4000,
                });
                return;
            }
    
            if (currentPassword !== newPassword) {
                swal({
                    title: "Error",
                    text: "Las contraseñas deben coincidir",
                    icon: "error",
                    timer: 4000,
                });
                return;
            }
    
            try {
                const passwordResponse = await updateUser(user?.sub!, newPassword);
                console.log(passwordResponse);
                if (passwordResponse?.ok) {
                    swal({
                        title: "Contraseña actualizada",
                        text: "La contraseña de la institución ha sido actualizada correctamente",
                        icon: "success"
                    });
                    setCurrentPassword('');
                    setNewPassword('');
                } else {
                    swal({
                        title: "Error",
                        text: "Hubo un problema al actualizar la contraseña",
                        icon: "error",
                        timer: 4000,
                    });
                    return;
                }
                return passwordResponse;
            } catch (error) {
                console.error("Error al actualizar la contraseña:", error);
                swal({
                    title: "Error",
                    text: "Hubo un problema al actualizar la contraseña",
                    icon: "error",
                    timer: 4000,
                });
                return;
            }

        }
    
        if (JSON.stringify(formData) === JSON.stringify(originalData)) {
            swal({
                title: "No se realizaron cambios",
                text: "No se realizaron cambios en los datos de la institución",
                icon: "info",
                timer: 4000,
            });
            return;
        }
    
        try {
            const response = await editInstitution({ ...formData }, Data.id!);
    
            if (response?.ok) {
                swal({
                    title: "Datos actualizados",
                    text: "Los datos de la institución han sido actualizados correctamente",
                    icon: "success",
                    timer: 4000,
                });
                getInstitution();
            } else {
                swal({
                    title: "Error",
                    text: "No se pudieron actualizar los datos",
                    icon: "error",
                    timer: 4000,
                });
            }
        } catch (error) {
            console.error("Error al actualizar los datos:", error);
            swal({
                title: "Error",
                text: "Hubo un problema al actualizar los datos",
                icon: "error",
                timer: 4000,
            });
        }
    };
    

    return (
        <div className=" pt-24 pb-10 bg-gradient-radial from-[#e0f5f3] to-[#ffffff]">
            <div className="relative">
                <img
                    src={Data.banner! || user?.picture!}
                    alt="banner"
                    className="w-[85%] mx-auto rounded-lg h-52 object-cover"
                />
                <input
                    id="bannerInput"
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.webp,.avif"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'banner')}
                />
                <button
                    type="button"
                    onClick={() => document.getElementById('bannerInput')?.click()}
                    className="absolute -top-2 left-[6%] bg-white p-2 rounded-full shadow-xl hover:bg-gray-200 transition-all duration-300 ease-in-out"
                >
                    <PencilIcon className="h-5 w-5 text-gray-600" />
                </button>
            </div>
            <div className="relative -mt-16 flex justify-center">
                <div className="relative">
                    <img
                        src={Data.logo!}
                        alt="logo"
                        className="w-36 h-36 rounded-full border-4 border-white shadow-lg"
                    />
                    <input
                        id="logoInput"
                        type="file"
                        accept=".jpg,.jpeg,.png,.gif,.webp,.avif"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'logo')}
                    />
                    <button
                        type="button"
                        onClick={() => document.getElementById('logoInput')?.click()}
                        className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-xl hover:bg-gray-200 transition-all duration-300 ease-in-out"
                    >
                        <PencilIcon className="h-5 w-5 text-gray-600" />
                    </button>
                </div>
            </div>
            <div className="mt-10 flex justify-center">
                <form onSubmit={handleSubmit} className="w-[85%] h-fit rounded-xl shadow-lg bg-white p-3">
                    <h1 className="text-4xl text-black font-medium p-3">Configuración de perfil</h1>
                    <p className="text-black text-sm font-normal px-8">Puedes cambiar tus datos personales</p>
                    <div className="pt-11 flex justify-center items-center">
                        <div className="grid grid-cols-4 gap-4 max-w-screen-lg w-full">
                            <div className="p-4 flex flex-col text-center">
                                <label className="text-black text-lg mb-2">Institución:</label>
                                <input
                                    name="name"
                                    className="h-9 text-black bg-gray-200/40 border-b rounded-t-lg border-black p-2 mb-8 placeholder:p-2 placeholder:italic focus:outline-none"
                                    placeholder={Data?.name || "Institución"}
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="p-4 flex flex-col text-center">
                                <label className="text-black text-lg mb-2">Numero de cuenta:</label>
                                <input
                                    name="accountNumber"
                                    className="h-9 text-black bg-gray-200/40 border-b border-black rounded-t-lg p-2 mb-8 placeholder:p-2 placeholder:italic focus:outline-none"
                                    placeholder={Data.accountNumber! || 'Numero de cuenta'}
                                    type="text"
                                    value={formData.accountNumber}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="p-4 flex flex-col text-center">
                                <label className="text-black text-lg mb-2">Dirección Fiscal:</label>
                                <input
                                    name="address"
                                    className="h-9 text-black bg-gray-200/40 border-b border-black rounded-t-lg p-2 mb-8 placeholder:p-2 placeholder:italic focus:outline-none"
                                    placeholder={Data?.address || "Dirección Fiscal"}
                                    type="text"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="p-4 flex flex-col text-center">
                                <label className="text-black text-lg mb-2">Teléfono:</label>
                                <input
                                    name="phone"
                                    className="h-9 text-black bg-gray-200/40 border-b border-black rounded-t-lg p-2 mb-8 placeholder:p-2 placeholder:italic focus:outline-none"
                                    placeholder={Data.phone || "Teléfono"}
                                    type="text"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="p-4 flex flex-col text-center">
                                <label className="text-black text-lg mb-2">Contraseña nueva:</label>
                                <input
                                    value={newPassword}
                                    onChange={handleInputChange}
                                    name="password"
                                    className="h-9 text-black bg-gray-200/40 border-b border-black rounded-t-lg p-2 mb-8 placeholder:p-2 placeholder:italic focus:outline-none"
                                    placeholder="Nueva Contraseña"
                                    type="password"
                                />
                            </div>
                            <div className="p-4 flex flex-col text-center">
                                <label className="text-black text-lg mb-2">Confirmar contraseña:</label>
                                <input
                                    value={currentPassword}
                                    onChange={handleInputChange}
                                    name="confirmPassword"
                                    className="h-9 text-black bg-gray-200/40 border-b border-black rounded-t-lg p-2 mb-8 placeholder:p-2 placeholder:italic focus:outline-none"
                                    placeholder="Confirmar Contraseña"
                                    type="password"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-20 -mt-4">
                        <button type="submit" className="px-4 py-2 rounded-xl border-2 border-[#55A058] bg-lightorangeinti text-black font-medium hover:scale-105 transition-all duration-300 ease-in-out">Guardar cambios</button>
                        <div className="px-4 py-2 rounded-xl border-2 border-red-500 bg-transparent text-black font-medium hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
                            Cerrar mi cuenta
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InstitutionProfile;
