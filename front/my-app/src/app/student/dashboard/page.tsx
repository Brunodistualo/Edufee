"use client";

import React, { useEffect, useState } from "react";
import { DataUser } from "@/store/userData";
import Sidebar, { SidebarItem } from "@/components/sidebarAdmin/page";
import GenerarPagoView from "@/components/GenerarPago";
import { Wallet } from "lucide-react";

const DashboardStudent: React.FC = () => {
  const getData = DataUser((state) => state.getDataUser);
  const userData = DataUser((state) => state.userData);
  const [view, setView] = useState<string>("generar-pago");

  useEffect(() => {
    // Simulate a delay for data fetching
    const fetchData = async () => {
      await getData(); // Assuming getData is asynchronous
    };

    fetchData();
  }, [getData]);

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

      </Sidebar>
      <div className="flex-1 h-full bg-blue-50 p-12">
        <GenerarPagoView userData={userData} />
      </div>
    </section>
  );
};

export default DashboardStudent;
