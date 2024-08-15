"use client";

import Sidebar, { SidebarItem } from "@/components/sidebarAdmin/page";
import StudentTableByInstitute, { Student } from "@/components/StudentTable";
import { getStudentsByInstitute } from "@/helpers/student.helper";
import { InstitutionsData } from "@/store/institutionsData";
import { User } from "lucide-react";
import React, { useEffect, useState } from "react";

const DashboardInstitution: React.FC = () => {
  const [view, setView] = useState<string>("students");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [studentsByInstitute, setStudentsByInstitute] = useState<Student[]>([]);
  const getInstitutionData = InstitutionsData((state) => state.getInstitutionData);
  const institute = InstitutionsData((state) => state.institutionData);

  useEffect(() => {
    const fetchInstitutionData = async () => {
      try {
        await getInstitutionData();
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

  return (
    <section className="h-screen flex pt-20 items-center">
      <Sidebar background="bg-orange-100">
        <SidebarItem
          icon={<User />}
          text="Alumnos"
          active={view === "students"}
          bgActive="bg-orange-200"
          onClick={() => setView("students")}
        />
      </Sidebar>
      <div className="flex-1 h-full bg-orange-50 p-12">
        {isLoading? 
        <div className="h-[90vh] text-lg flex items-center justify-center">Cargando tabla de estudiantes...</div>    
        : 
          <StudentTableByInstitute studentByInstitute={studentsByInstitute} setStudentsByInstitute={setStudentsByInstitute}/>
        }
      </div>
    </section>
  );
};

export default DashboardInstitution;
