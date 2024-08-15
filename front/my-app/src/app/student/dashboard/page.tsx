"use client";

import React, { useEffect, useState } from "react";
import { DataUser } from "@/store/userData";
import Sidebar, { SidebarItem } from "@/components/sidebarAdmin/page";
import GenerarPagoView from "@/components/GenerarPago";
import { History, Wallet } from "lucide-react";
import StudentPayments from "@/components/StudentPayments";
import { Payment } from "@/components/InstitutionPayments";
import { getStudentsPayments } from "@/helpers/student.helper";
import { useRouter } from "next/navigation";

const DashboardStudent: React.FC = () => {
  const getData = DataUser((state) => state.getDataUser);
  const userData = DataUser((state) => state.userData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [paymentsStudents, setPaymentsStudents] = useState<Payment[]>([])
  const [view, setView] = useState<string>("generar-pago");
  const router = useRouter()

  useEffect(()=> {
    if(typeof userData.status === 'string' && userData.status === 'true') {
      alert("Has sido baneado temporalmente, por favor contacta al administrador")
      router.push('/')
    }
},[userData])

  useEffect(() => {
    // Simulate a delay for data fetching
    const fetchData = async () => {
      try {
        await getData(); // Assuming getData is asynchronous
      } catch (error: any) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getData]);


  useEffect(() => {
    const fetchStudentPayments = async () => {
      if (userData?.id) {
        setPaymentsStudents(await getStudentsPayments(userData.id))
      }
    }
    fetchStudentPayments();
  }, [userData?.id])

  return (
    <section className="h-screen flex pt-16 items-center">
      <Sidebar background="bg-blue-100">
        <SidebarItem
          icon={<Wallet />}
          text="Generar Pago"
          active={view === "generar-pago"}
          bgActive="bg-blue-200"
          onClick={() => setView("generar-pago")}
        />
        <SidebarItem
          icon={<History />}
          text="Ver pagos"
          active={view === "ver-pagos"}
          bgActive="bg-blue-200"
          onClick={() => setView("ver-pagos")}
        />
      </Sidebar>
      <div className="flex-1 h-full bg-blue-50 p-12">
        {isLoading ? (
          <div className="h-[90vh] text-lg flex items-center justify-center">Cargando...</div>
        ) : (
          <>
            {view === "generar-pago" && (
              <GenerarPagoView userData={userData} />
            )}
            {view === "ver-pagos" && (
              <StudentPayments payments={paymentsStudents} />
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default DashboardStudent;
