'use client';
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import BotonLink from '../botonLink/boton'
import { Transition } from '@headlessui/react';
import { tokenStore } from '@/store/tokenStore';

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const token = tokenStore((state) => state.token);
  const setToken = tokenStore((state) => state.setToken);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };
  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className='h-16 bg-white w-full fixed'>
      {
        token !== "" ? (
          <nav className='h-full flex items-center justify-between'>
            <div className='ml-14'>
              <Image src="/vercel.svg" alt="Vercel Logo" width={100} height={50} className='text-white' />
            </div>
            <ul className='flex items-center gap-8 pr-14 text-black'>
              <BotonLink link="/instituciones" text="Instituciones" />
              <BotonLink link="/alumnos" text="Alumnos" />
              <div className='text-black flex items-center'>
                <div className='w-8 h-8 mr-2'>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" className='text-black ' />
                </div>
                <div className='relative' ref={dropdownRef}>
                  <button className="flex items-center mr-5" onClick={handleClick}>
                    Bienvenido
                    {!open ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 ml-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 ml-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 15.75 7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    )}
                  </button>
                  <Transition
                    show={open}
                    enter="transition ease-out duration-300"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-300"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <div className="backdrop-blur-md bg-gray-800 absolute top-10 right-2 flex flex-col items-center rounded-lg text-white z-50 w-44 ">
                      <a href="/profile" className="p-3 text-base flex items-center justify-between w-full hover:bg-white/10 hover:rounded-t-lg transition-all duration-200">
                        Perfil
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </a>
                      <button
                        onClick={handleLogout}
                        className="p-3 text-base cursor-pointer flex items-center justify-between w-full hover:text-red-600 hover:bg-black/10 hover:rounded-b-lg transition-all duration-200"
                      >
                        Cerrar Sesión
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                          />
                        </svg>
                      </button>
                    </div>
                  </Transition>
                </div>
              </div>
            </ul>
          </nav>
        ) : (
          <nav className='h-full flex items-center justify-between'>
            <div className='ml-14'>
              <Image src="/vercel.svg" alt="Vercel Logo" width={100} height={50} className='text-white' />
            </div>
            <ul className='flex gap-8 pr-14 text-black'>
              <BotonLink link="/instituciones" text="Instituciones" />
              <BotonLink link="/alumnos" text="Alumnos" />
              <BotonLink link="/login" text="Iniciar Sesion" />
            </ul>
          </nav>
        )
      }
    </div>
  )
}

export default Navbar