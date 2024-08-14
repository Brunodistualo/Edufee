'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Custom404() {
    const router = useRouter();

    // Redirección automática después de 5 segundos
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 8000);

        return () => clearTimeout(timer); // Limpieza del temporizador
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg text-center">
                <h1 className="text-5xl font-bold text-green-600 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                    Oops! Página no encontrada.
                </h2>
                <p className="text-gray-600 mb-4">
                    Lo sentimos, la página que estás buscando no existe o ha sido movida.
                </p>
                <p className="text-gray-600 mb-6">
                    Serás redirigido a la página de inicio en unos segundos...
                </p>
                <div>
                    <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
                        Volver a la página de inicio ahora
                    </Link>
                </div>
            </div>
            <style jsx>{`
        h1 {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
        </div>
    );
}
