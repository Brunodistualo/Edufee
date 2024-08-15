'use client'

import { useState } from "react";

export interface Payment {
  id: string;
  date: string;
  pdfImage: string;
  amount: number;
  userId: string;
  userName: string;
}

const InstitutionPayments: React.FC<{ payments: Payment[] }> = ({ payments }) => {

  const [filter, setFilter] = useState<string>("");
  const [filterField, setFilterField] = useState<string>("userName");
  const [sortField, setSortField] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const filteredPayments = payments.filter(payment => {
    const fieldValue = payment[filterField as keyof Payment]?.toString().toLowerCase();
    return fieldValue?.includes(filter.toLowerCase());
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    const fieldA = a[sortField as keyof Payment]?.toString().toLowerCase();
    const fieldB = b[sortField as keyof Payment]?.toString().toLowerCase();

    if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;

    return 0;
  });
  return (
    <>
    {payments.length > 0 ?
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
            <option value="userName">Nombre del Estudiante</option>
            <option value="userId">ID del Usuario</option>
            <option value="amount">Monto</option>
            <option value="date">Fecha</option>
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
            <option value="userName">Nombre del Estudiante</option>
            <option value="userId">ID del Usuario</option>
            <option value="amount">Monto</option>
            <option value="date">Fecha</option>
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
              <th className="px-6 py-3 border">ID Pago</th>
              <th className="px-6 py-3 border">Nombre del Estudiante</th>
              <th className="px-6 py-3 border">ID del Usuario</th>
              <th className="px-6 py-3 border">Monto</th>
              <th className="px-6 py-3 border">Fecha</th>
              <th className="px-6 py-3 border">PDF</th>
            </tr>
          </thead>
          <tbody>
            {sortedPayments.map(payment => (
              <tr key={payment.id} className="text-center hover:bg-orange-100 transition-colors">
                <td className="px-6 py-2 border">{payment.id}</td>
                <td className="px-6 py-2 border">{payment.userName}</td>
                <td className="px-6 py-2 border">{payment.userId}</td>
                <td className="px-6 py-2 border">{payment.amount}</td>
                <td className="px-6 py-2 border">{payment.date}</td>
                <td className="px-6 py-2 border">
                  <a href={payment.pdfImage} target="_blank">Ver PDF</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </> 
    : 
    <div className="h-[90vh] text-lg flex items-center justify-center">No hay pagos registrados</div>}
    </>
  );
};

export default InstitutionPayments;
