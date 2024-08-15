'use client';
import React, { useEffect, useState } from "react";
import Sidebar, { SidebarItem } from "../sidebarAdmin/page";
import { User, School, CheckSquare } from "lucide-react";
import { InstitutionsData } from "@/store/institutionsData";
import { DataUser } from "@/store/userData";
import swal from 'sweetalert';


const StudentsTable = () => {
  const getData = DataUser((state) => state.getAllData);
  const dataUser = DataUser((state) => state.AllData);
  const update = DataUser((state) => state.updateData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleBan = async (id: string, status: boolean) => {
    const action = status ? 'banear' : 'desbanear';
    const confirmation = await swal({
      title: `¿Deseas ${action} este usuario?`,
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    });

    if (confirmation) {
      setLoading(true);
      swal({
        title: "Cargando...",
        text: "Por favor espera mientras se procesa la solicitud.",
        icon: "info",
        buttons: [""],
        closeOnClickOutside: false,
        closeOnEsc: false,
      });
      try {
        await update(status, id);
        swal({
          title: `Usuario ${status ? 'baneado' : 'desbaneado'}`,
          text: `El usuario ha sido ${status ? 'baneado' : 'desbaneado'} exitosamente.`,
          icon: "success",
          timer: 3000,
        });
        await getData();
      } catch (error) {
        console.error("Error al actualizar la información:", error);
        swal({
          title: "Error",
          text: "Hubo un problema al actualizar la información",
          icon: "error",
          timer: 4000,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Nombre</th>
            <th className="px-4 py-2 border">Institución</th>
            <th className="px-4 py-2 border">DNI</th>
            <th className="px-4 py-2 border">Estado de cuenta</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dataUser[0]?.allUser?.filter((user) => user.name !== '   ').map((user) => (
            <tr key={user.id} className="text-center">
              <td className="px-4 py-2 border">{user.name}</td>
              <td className="px-4 py-2 border">{user.institution?.name}</td>
              <td className="px-4 py-2 border">{user.dni}</td>
              <td className="px-4 py-2 border">{user.status === "true" ? 'Baneado' : 'Desbaneado'}</td>
              <td className="py-2 border flex justify-center gap-3">
                <button
                  onClick={() => handleBan(user.id!, true)}
                  className="px-4 py-1 bg-red-400 hover:bg-red-500 transition duration-300 text-white rounded flex gap-1 items-center justify-center"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                    <circle cx="10" cy="6" r="4" stroke="white" stroke-width="1.5" />
                    <path d="M20.4141 11.4142L18.9999 10M18.9999 10L17.5857 8.5858M18.9999 10L20.4141 8.58578M18.9999 10L17.5857 11.4142" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M17.9975 18C18 17.8358 18 17.669 18 17.5C18 15.0147 14.4183 13 10 13C5.58172 13 2 15.0147 2 17.5C2 19.9853 2 22 10 22C12.231 22 13.8398 21.8433 15 21.5634" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                  Ban
                </button>
                <button
                  onClick={() => handleBan(user.id!, false)}
                  className="px-2 py-1 bg-green-500 hover:bg-green-600 transition duration-300 text-white rounded flex flex-row-reverse gap-1 items-center justify-center"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="6" r="4" stroke="white" stroke-width="1.5" />
                    <path d="M12 13C14.6083 13 16.8834 13.8152 18.0877 15.024M15.5841 20.4366C14.5358 20.7944 13.3099 21 12 21C8.13401 21 5 19.2091 5 17C5 15.6407 6.18652 14.4398 8 13.717" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M18 18.5C18.3905 18.8905 18.6095 19.1095 19 19.5L21 17" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  Unban
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const InstitutionsTable = () => {
  const institutions = InstitutionsData((state) => state.institutions);
  const getInsti = InstitutionsData((state) => state.getInstitutions);
  const create = InstitutionsData((state) => state.createReceipt);
  const admin = InstitutionsData((state) => state.setAdmin);
  const insti = InstitutionsData((state) => state.setInstitution);

  useEffect(() => {
    getInsti();
  }, [getInsti]);


  const handleAdmin = async (id: string) => {
    try {
      const willConfirm = await swal({
        title: "¿Estás seguro?",
        text: "¿Quieres convertir a este usuario en administrador?",
        icon: "warning",
        buttons: ["Cancelar", "Confirmar"],
        dangerMode: true,
      });

      if (willConfirm) {
        const response = await admin(id);
        if (response?.ok) {
          swal({
            title: "Usuario administrador",
            text: "Administrador creado exitosamente.",
            icon: "success",
            timer: 5000,
          });
        }
        await getInsti()
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Error",
        text: "Hubo un problema al crear el administrador.",
        icon: "error",
      });
    }
  };

  const handleDesadmin = async (id: string) => {
    try {
      const willConfirm = await swal({
        title: "¿Estás seguro?",
        text: "¿Quieres convertir a este usuario en usuario normal?",
        icon: "warning",
        buttons: ["Cancelar", "Confirmar"],
        dangerMode: true,
      });

      if (willConfirm) {
        const response = await insti(id);
        if (response?.ok) {
          swal({
            title: "Usuario normal",
            text: "Usuario normal creado exitosamente.",
            icon: "success",
            timer: 5000,
          });
        }
        await getInsti()
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Error",
        text: "Hubo un problema al crear el usuario normal.",
        icon: "error",
      });
    }
  }


  const handleCreate = async (id: string) => {
    try {
      const response = await create(id);
      console.log(response)
      if (response?.ok) {
        swal({
          title: "Boleta creada",
          text: "La boleta ha sido creada exitosamente, Revise en dashboard de instituciones.",
          icon: "success",
          timer: 5000,
        });
      }
    } catch (error) {
      console.error(error)
    }
  }


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Institución</th>
            <th className="px-4 py-2 border">Estado</th>
            <th className="px-4 py-2 border">Dirección fiscal</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {institutions.map((institution) => (
            <tr key={institution.id} className="text-center">
              <td className="px-4 py-2 border">{institution.name}</td>
              <td className={`px-4 py-2 border ${institution.isActive === "approved" ? "bg-green-200" : institution.isActive === "denied" ? "bg-red-200" : "bg-yellow-200"}`}>{institution.isActive === "approved" ? "Aprobado" : institution.isActive === "denied" ? "Rechazado" : "Pendiente"}</td>
              <td className="px-4 py-2 border">{institution.address}</td>
              <td className="px-4 py-2 border flex justify-center items-center gap-5">
                <button
                  onClick={() => handleCreate(institution.id!)}
                  className="px-4 py-1 bg-green-400 hover:bg-green-500 transition-all duration-300 text-white rounded flex flex-row-reverse gap-3 justify-center items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                    <path d="M15 21H9C6.17157 21 4.75736 21 3.87868 20.1213C3 19.2426 3 17.8284 3 15M21 15C21 17.8284 21 19.2426 20.1213 20.1213C19.8215 20.4211 19.4594 20.6186 19 20.7487" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12 16V3M12 3L16 7.375M12 3L8 7.375" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  Generar boleta
                </button>
                {
                  institution.role !== "admin" ? (
                    <button
                      onClick={() => handleAdmin(institution.id!)}
                      className="px-4 py-1 bg-yellow-400 hover:bg-yellow-500 transition-all duration-300 text-white rounded"
                    >
                      Dar admin
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDesadmin(institution.id!)}
                      className="px-4 py-1 bg-red-400 hover:bg-red-500 transition-all duration-300 text-white rounded"
                    >
                      Quitar admin
                    </button>
                  )
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ApproveInstitutions = () => {
  const institutions = InstitutionsData((state) => state.institutions);
  const updateInstitutionStatus = InstitutionsData((state) => state.updateInstitutionStatus);
  const [loading, setLoading] = useState(false);

  const handleAction = async (institutionId: string, isApproved: boolean) => {
    const action = isApproved ? 'aprobar' : 'rechazar';
    const confirmation = await swal({
      title: `¿Estás seguro de que deseas ${action} esta institución?`,
      text: `Estás a punto de ${action} esta institución.`,
      icon: "warning",
      buttons: ["Cancelar", `${action.charAt(0).toUpperCase() + action.slice(1)}`],
      dangerMode: true,
    });

    if (confirmation) {
      setLoading(true);
      swal({
        title: "Procesando...",
        text: "Por favor espera mientras se realiza la acción.",
        icon: "info",
        buttons: [""],
        closeOnClickOutside: false,
        closeOnEsc: false,
      });

      try {
        await updateInstitutionStatus(institutionId, isApproved);
        swal({
          title: `Institución ${isApproved ? 'aprobada' : 'rechazada'}`,
          text: `La institución ha sido ${isApproved ? 'aprobada' : 'rechazada'} exitosamente.`,
          icon: "success",
          timer: 3000,
        });
      } catch (error) {
        swal({
          title: "Error",
          text: "Hubo un problema al procesar la solicitud. Por favor intenta nuevamente.",
          icon: "error",
          timer: 3000,
        });
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Nombre de la institución</th>
            <th className="px-4 py-2 border">ID de institución</th>
            <th className="px-4 py-2 border">Dirección fiscal</th>
            <th className="px-4 py-2 border">Cuenta bancaria</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {institutions.map((institution) => (
            <tr key={institution.id} className="text-center">
              <td className="py-2 border">{institution.name}</td>
              <td className="py-2 border">{institution.id}</td>
              <td className="py-2 border">{institution.address}</td>
              <td className="py-2 border">{institution.accountNumber}</td>
              <td className="py-2 border flex justify-center gap-3">
                <button
                  onClick={() => handleAction(institution.id!, true)}
                  className={`px-2 py-1 bg-green-500 hover:bg-green-600 transition-all duration-300 text-white rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''} flex items-center gap-2 justify-center`}
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                    <path d="M9.5 12.4L10.9286 14L14.5 10" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M3 10.4167C3 7.21907 3 5.62028 3.37752 5.08241C3.75503 4.54454 5.25832 4.02996 8.26491 3.00079L8.83772 2.80472C10.405 2.26824 11.1886 2 12 2C12.8114 2 13.595 2.26824 15.1623 2.80472L15.7351 3.00079C18.7417 4.02996 20.245 4.54454 20.6225 5.08241C21 5.62028 21 7.21907 21 10.4167C21 10.8996 21 11.4234 21 11.9914C21 14.4963 20.1632 16.4284 19 17.9041M3.19284 14C4.05026 18.2984 7.57641 20.5129 9.89856 21.5273C10.62 21.8424 10.9807 22 12 22C13.0193 22 13.38 21.8424 14.1014 21.5273C14.6796 21.2747 15.3324 20.9478 16 20.5328" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                  Aprobar
                </button>
                <button
                  onClick={() => handleAction(institution.id!, false)}
                  className={`px-2 py-1 bg-red-400 hover:bg-red-500 transition-all duration-300 text-white rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''} flex flex-row-reverse gap-1 items-center justify-center`}
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                    <path d="M14.5 9.5L9.50002 14.5M9.5 9.49998L14.5 14.5" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M3 10.4167C3 7.21907 3 5.62028 3.37752 5.08241C3.75503 4.54454 5.25832 4.02996 8.26491 3.00079L8.83772 2.80472C10.405 2.26824 11.1886 2 12 2C12.8114 2 13.595 2.26824 15.1623 2.80472L15.7351 3.00079C18.7417 4.02996 20.245 4.54454 20.6225 5.08241C21 5.62028 21 7.21907 21 10.4167C21 10.8996 21 11.4234 21 11.9914C21 14.4963 20.1632 16.4284 19 17.9041M3.19284 14C4.05026 18.2984 7.57641 20.5129 9.89856 21.5273C10.62 21.8424 10.9807 22 12 22C13.0193 22 13.38 21.8424 14.1014 21.5273C14.6796 21.2747 15.3324 20.9478 16 20.5328" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                  Rechazar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState("students");
  const getInstitutions = InstitutionsData((state) => state.getInstitutions);

  useEffect(() => {
    getInstitutions();
  }, [getInstitutions]);

  return (
    <div className="flex pt-20 h-screen">
      <Sidebar background="bg-white">
        <SidebarItem
          icon={<User />}
          text="Alumnos"
          active={view === "students"}
          bgActive="bg-gradient-to-tr from-indigo-200 to-indigo-100"
          onClick={() => setView("students")}
        />
        <SidebarItem
          icon={<School />}
          text="Instituciones"
          active={view === "institutions"}
          bgActive="bg-gradient-to-tr from-indigo-200 to-indigo-100"
          onClick={() => setView("institutions")}
        />
        <SidebarItem
          icon={<CheckSquare />}
          text="Aprobar Instituciones"
          active={view === "approve"}
          bgActive="bg-gradient-to-tr from-indigo-200 to-indigo-100"
          onClick={() => setView("approve")}
        />
      </Sidebar>
      <div className="flex-1 p-4">
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Nombre, ID, correo"
            className="border rounded-lg px-4 py-2 w-full"
          />
          <button className="ml-2 p-2 bg-gray-300 rounded-lg hover:bg-gray-400">
            🔍
          </button>
        </div>
        {view === "students" ? (
          <StudentsTable />
        ) : view === "institutions" ? (
          <InstitutionsTable />
        ) : (
          <ApproveInstitutions />
        )}
      </div>
    </div>
  );
};

export default App;
