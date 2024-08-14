"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { tokenStore } from "@/store/tokenStore";
import Cookies from "js-cookie";

const LayerAuth = () => {
  const setToken = tokenStore((state) => state.setToken);
  const router = useRouter();
  const { user, isLoading, error } = useUser();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (user) {
        const { email } = user;
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
          const response = await fetch(`${API_URL}/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          const data = await response.json();
          if (response.ok) {
            const { token } = data;
            console.log(token)
            const payload = JSON.parse(atob(token.split(".")[1]));
            const { roles, isActive } = payload;
            setToken(token);
            Cookies.set("authToken", token, {
              expires: 7,
              secure: true,
              sameSite: "strict",
            });
            const isStudent = roles.includes("student");
            const isInstitutionApproved =
              roles.includes("institution") && isActive === "approved";
            const isInstitutionPending =
              roles.includes("institution") && isActive === "pending";
            const isAdmin = roles.includes("admin");
            const routes = {
              "/student/dashboard": isStudent,
              "/institution/dashboard": isInstitutionApproved,
              "/verificacionInstitucion": isInstitutionPending,
              "/dashboard-admin": isAdmin,
            };
            const route = Object.entries(routes).find(([, condition]) => condition)?.[0];
            if (route) {
              router.push(route);
            } else {
              console.error("Error en la autenticación:", data.message);
            }
          }
        } catch (error) {
          console.error("Error verificando usuario:", error);
          router.push("/select");
        }
      }
      else {
        router.push("/api/auth/login")
      }
    };

    checkUserAndRedirect();
  }, [user, isLoading, error, router]);

  return (
    <div className="h-screen grid content-center ">
      <h2 className="text-xl text-center text-blue-700">Cargando...</h2>
    </div>
  );
};

 export default LayerAuth;
