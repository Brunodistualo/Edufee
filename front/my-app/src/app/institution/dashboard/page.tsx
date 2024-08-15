"use client";

import Sidebar, { SidebarItem } from "@/components/sidebarAdmin/page";
import StudentTableByInstitute, { Student } from "@/components/StudentTable";
import { getStudentsByInstitute } from "@/helpers/student.helper";
import { InstitutionsData } from "@/store/institutionsData";
import { User } from "lucide-react";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const DashboardInstitution: React.FC = () => {
  const [view, setView] = useState<string>("students");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [studentsByInstitute, setStudentsByInstitute] = useState<Student[]>([]);
  const getInstitutionData = InstitutionsData((state) => state.getInstitutionData);
  const institute = InstitutionsData((state) => state.institutionData);
  const Tickets = InstitutionsData((state) => state.ticketInsti);
  const getTickets = InstitutionsData((state) => state.getTickets);

  useEffect(() => {
    const fetchInstitutionData = async () => {
      try {
        await getInstitutionData();
        console.log("Institution data:", institute);
      } catch (error) {
        console.error("Error fetching institution data:", error);
      }
    };

    fetchInstitutionData();
  }, [getInstitutionData]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (institute?.id) {
        try {
          const students = await getStudentsByInstitute(institute.id);
          setStudentsByInstitute(students);
        } catch (error) {
          console.error("Error fetching students:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchStudents();
  }, [institute?.id]);

  useEffect(() => {
    if (institute?.id) {
      console.log("Fetching tickets for institute id:", institute.id);
      getTickets(institute.id);
      console.log("Tickets after fetching:", Tickets);
    }
  }, [getTickets, institute?.id]);

  const handleModal = () => {
    const tickets = Tickets || [];  // Asegurarse de que Tickets sea un array

    Swal.fire({
      width: "80%",
      title: "Detalles de los Tickets",
      padding: "1em",
      confirmButtonColor: "black",
      confirmButtonText: "Volver",
      html: (
        <div className="flex flex-col gap-4 w-full overflow-y-auto h-96">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <li
                key={ticket.id}
                className="flex items-center h-48 mb-6 shadow-lg rounded-lg border border-gray-200/40"
              >
                <div className="flex h-full items-center w-full">
                  <div className="flex flex-col gap-1 h-full w-full text-left p-2">
                    <p className="text-lg text-gray-900">
                      Fecha del Ticket: {ticket.date}
                    </p>
                    <p className="text-base text-gray-900">
                      Monto: ${ticket.amount}
                    </p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No hay tickets disponibles.</p>
          )}
        </div>
      ),
    });
  };



  return (
    <section className="h-screen flex pt-16 items-center">
      <Sidebar background="bg-orange-100">
        <SidebarItem
          icon={<User />}
          text="Alumnos"
          active={view === "students"}
          bgActive="bg-orange-200"
          onClick={() => setView("students")}
        />
        <SidebarItem
          icon={<User />}
          text="Boletas"
          active={view === "admins"}
          bgActive="bg-orange-200"
          onClick={handleModal}
        />
      </Sidebar>
      <div className="flex-1 h-full bg-orange-50 p-12">
        {isLoading ?
          <div className="h-[90vh] text-lg flex items-center justify-center">Cargando tabla de estudiantes...</div>
          :
          <StudentTableByInstitute studentByInstitute={studentsByInstitute}/>
        }
      </div>
    </section>
  );
};

export default DashboardInstitution;
