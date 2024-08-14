interface Student {
    id: string;
    name: string;
    lastname: string;
    email: string;
    dni: string;
    address: string;
    phone: string;
  }
  
  interface StudentTableProps {
    students: Student[];
  }
  
  const StudentTable: React.FC<StudentTableProps> = ({ students }) => {
    return (
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
            {students.map(student => (
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
    );
  };
  
  export default StudentTable;
  