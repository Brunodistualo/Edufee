"use client";

import Sidebar, { SidebarItem } from "@/components/sidebarAdmin/page";
import StudentTable from "@/components/StudentTable";
import { User } from "lucide-react";
import React, { useState } from "react";

const DashboardInstitution: React.FC = () => {
  const [view, setView] = useState<string>("students");
  const [filter, setFilter] = useState<string>("");
  const [filterField, setFilterField] = useState<string>("name");
  const [sortField, setSortField] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const students = [
    {
      id: "1",
      name: "pedro",
      lastname: "camelas",
      email: "lucho_101189@gmail.com",
      dni: "789456",
      address: "street 1234",
      phone: "555 213"
    },
    {
      id: "2",
      name: "maria",
      lastname: "perez",
      email: "mariaperez@gmail.com",
      dni: "789456",
      address: "street 1234",
      phone: "555 213"
    },
    {
      id: "3",
      name: "juan",
      lastname: "gomez",
      email: "juangierre@gmail.com",
      dni: "1",
      address: "street 1234",
      phone: "555 213"
    }
  ];

  const filteredStudents = students.filter(student => {
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


        {/* Tabla */}
        <StudentTable students={sortedStudents} />
      </div>
    </section>
  );
};

export default DashboardInstitution;
