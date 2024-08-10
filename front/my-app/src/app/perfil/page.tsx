'use client';
import React, { useEffect, useState } from 'react'
import { InstitutionsData } from '@/store/institutionsData'
import { useUser } from '@auth0/nextjs-auth0/client';
import { PencilIcon } from 'lucide-react';
import { uploadImagesInstitution } from '@/helpers/uploadImage';
import swal from 'sweetalert';

const InstitutionProfile = () => {
    const [logo, setLogo] = useState<File | null>(null);
    const [banner, setBanner] = useState<File | null>(null);
    const { user, isLoading, error } = useUser();
    const getInstitution = InstitutionsData((state) => state.getInstitutionData);
    const Data = InstitutionsData((state) => state.institutionData);

    useEffect(() => {
        getInstitution();
    }, [getInstitution])

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

    return (
        <div className=" pt-24 pb-10 bg-gradient-radial from-[#e0f5f3] to-[#ffffff]">
            <div className="relative">
                <img
                    src={Data.banner!}
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
                <form className="w-[85%] h-fit rounded-xl shadow-lg bg-white p-3">
                    <h1 className="text-4xl text-black font-medium p-3">Configuración de perfil</h1>
                    <p className="text-black text-sm font-normal px-8">Puedes cambiar tus datos personales</p>
                    <div className="pt-11 flex justify-center items-center">
                        <div className="grid grid-cols-4 gap-4 max-w-screen-lg w-full">
                            <div className="p-4 flex flex-col text-center">
                                <label className="text-black text-lg mb-2">Correo:</label>
                                <input
                                    name="email"
                                    className="h-9 text-black bg-gray-200/40 border-b border-black rounded-t-lg p-2 mb-8 placeholder:p-2 placeholder:italic focus:outline-none"
                                    placeholder={Data.email! || 'Correo'}
                                    type="email"
                                />
                            </div>
                            <div className="p-4 flex flex-col text-center">
                                <label className="text-black text-lg mb-2">Contraseña actual:</label>
                                <input
                                    name="oldPassword"
                                    className="h-9 text-black bg-gray-200/40 border-b border-black rounded-t-lg p-2 mb-8 placeholder:p-2 placeholder:italic focus:outline-none"
                                    placeholder="Contraseña"
                                    type="password"
                                />
                            </div>
                            <div className="p-4 flex flex-col text-center">
                                <label className="text-black text-lg mb-2">Contraseña nueva:</label>
                                <input
                                    name="password"
                                    className="h-9 text-black bg-gray-200/40 border-b border-black rounded-t-lg p-2 mb-8 placeholder:p-2 placeholder:italic focus:outline-none"
                                    placeholder="Contraseña"
                                    type="password"
                                />
                            </div>
                            <div className="p-4 flex flex-col text-center">
                                <label className="text-black text-lg mb-2">Institución:</label>
                                <input
                                    name="name"
                                    className="h-9 text-black bg-gray-200/40 border-b rounded-t-lg border-black p-2 mb-8 placeholder:p-2 placeholder:italic focus:outline-none"
                                    placeholder={Data?.name || "Institución"}
                                    type="text"
                                />
                            </div>
                            <div className="p-4 flex flex-col text-center">
                                <label className="text-black text-lg mb-2">Dirección Fiscal:</label>
                                <input
                                    name="address"
                                    className="h-9 text-black bg-gray-200/40 border-b border-black rounded-t-lg p-2 mb-8 placeholder:p-2 placeholder:italic focus:outline-none"
                                    placeholder={Data?.address || "Dirección Fiscal"}
                                    type="text"
                                />
                            </div>
                            <div className="p-4 flex flex-col text-center">
                                <label className="text-black text-lg mb-2">Teléfono:</label>
                                <input
                                    name="phone"
                                    className="h-9 text-black bg-gray-200/40 border-b border-black rounded-t-lg p-2 mb-8 placeholder:p-2 placeholder:italic focus:outline-none"
                                    placeholder={Data.phone || "Teléfono"}
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-20 -mt-4 py-10">
                        <button type="submit" className="px-4 py-2 rounded-xl border-2 border-[#55A058] bg-lightorangeinti text-black font-medium hover:scale-105 transition-all duration-300 ease-in-out">Guardar cambios</button>
                        <div className="px-4 py-2 rounded-xl border-2 border-red-500 bg-transparent text-black font-medium hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
                            Cerrar mi cuenta
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default InstitutionProfile;
