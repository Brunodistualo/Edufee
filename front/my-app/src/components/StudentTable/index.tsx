'use client'

import { getStudentsByInstitute } from "@/helpers/student.helper";
import { InstitutionsData } from "@/store/institutionsData";
import { useEffect, useState } from "react";

export interface Student {
  id: string;
  name: string;
  lastname: string;
  email: string;
  dni: string;
  address: string;
  phone: string;
}


const StudentTableByInstitute: React.FC< { studentByInstitute: Student[]; setStudentsByInstitute: (students: Student[]) => void } >  = ({ studentByInstitute, setStudentsByInstitute }) => {

  const [filter, setFilter] = useState<string>("");
  const [filterField, setFilterField] = useState<string>("name");
  const [sortField, setSortField] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [isLoading, setIsLoading] = useState(true);

  const filteredStudents = studentByInstitute.filter(student => {
    const fieldValue = student[filterField as keyof typeof student]?.toString().toLowerCase();
    return fieldValue?.includes(filter.toLowerCase());
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const fieldA = a[sortField as keyof typeof a]?.toString().toLowerCase();
    const fieldB = b[sortField as keyof typeof b]?.toString().toLowerCase();

    if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;

    return 0;
  });

  // useEffect(() => {
  //   const fetchInstitutionData = async () => {
  //     try {
  //       await getInstitutionData();
  //     } catch (error) {
  //       console.error("Error fetching institution data:", error);
  //     }
  //   };

  //   fetchInstitutionData();
  // }, [getInstitutionData]);

  // useEffect(() => {
  //   const fetchStudents = async () => {

  //     if (institute?.id) {
  //       try {
  //         const students = await getStudentsByInstitute(institute.id);
  //         setStudentsByInstitute(students);
  //       } catch (error) {
  //         console.error("Error fetching students:", error);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }
  //   };

  //   fetchStudents();
  // }, [institute?.id]);


  return (
    <>
      <div className="flex gap-4">
        {/* Filtro */}
        <div className="flex space-x-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 p-2">Filtrar</h2>
          <select
            title="Select filter"
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
            className="p-2 border rounded bg-white shadow-sm focus:ring-orange-300"
          >
            <option value="name">Nombre</option>
            <option value="lastname">Apellido</option>
            <option value="email">Email</option>
            <option value="dni">DNI</option>
            <option value="address">Dirección</option>
            <option value="phone">Teléfono</option>
          </select>
          <input
            type="text"
            placeholder={`Buscar por ${filterField}`}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded w-2/4 bg-white shadow-sm focus:ring-orange-300"
          />
        </div>
        {/* Ordenar */}
        <div className="flex space-x-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 py-2">Ordenar por</h2>
          <select
            title="Select field"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="p-2 border rounded bg-white shadow-sm focus:ring-orange-300"
          >
            <option value="id">ID</option>
            <option value="name">Nombre</option>
            <option value="lastname">Apellido</option>
            <option value="email">Email</option>
            <option value="dni">DNI</option>
            <option value="address">Dirección</option>
            <option value="phone">Teléfono</option>
          </select>
          <select
            title="Select Order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border rounded bg-white shadow-sm focus:ring-orange-300"
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-orange-200 text-gray-600 font-bold text-center">
              <th className="px-6 py-3 border">ID</th>
              <th className="px-6 py-3 border">Nombre</th>
              <th className="px-6 py-3 border">Apellido</th>
              <th className="px-6 py-3 border">Email</th>
              <th className="px-6 py-3 border">DNI</th>
              <th className="px-6 py-3 border">Dirección</th>
              <th className="px-6 py-3 border">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {studentByInstitute.map(student => (
              <tr key={student.id} className="text-center hover:bg-orange-100 transition-colors">
                <td className="px-6 py-2 border">{student.id}</td>
                <td className="px-6 py-2 border">{student.name}</td>
                <td className="px-6 py-2 border">{student.lastname}</td>
                <td className="px-6 py-2 border">{student.email}</td>
                <td className="px-6 py-2 border">{student.dni}</td>
                <td className="px-6 py-2 border">{student.address}</td>
                <td className="px-6 py-2 border">{student.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StudentTableByInstitute;
