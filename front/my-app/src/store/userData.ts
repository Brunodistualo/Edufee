import { create } from "zustand";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


interface institutionData {
  id?: string;
  name?: string;
  email?: string;
  accountNumber?: string;
  address?: string;
  phone?: string;
  logo?: string;
  banner?: string;
  role?: string;
  mustPay?: number;
  isActive?: boolean;
}

interface Data {
  id?: string;
  userId?: string;
  name?: string;
  lastname?: string;
  email?: string;
  dni?: number;
  address?: string;
  phone?: string;
  status?: string;
  imgProfile?: string | null;
  role?: string;
  institution?: institutionData;
}
interface AllData {
  allUser: {
    id?: string;
    name?: string;
    lastname?: string;
    email?: string;
    dni?: string;
    address?: string;
    phone?: string;
    imgProfile?: string | null;
    role?: string;
    status?: string;
    institution?: institutionData;
  }[];
}


interface UserState {
  userData: Data;
  AllData: AllData[];
  getDataUser: () => Promise<void>;
  getAllData: () => Promise<void>;
  updateData: (status: boolean, id: string) => Promise<void>;
}


export const DataUser = create<UserState>((set) => ({
  userData: [],
  AllData: [],
  async getDataUser() {
    try {
      const store = localStorage.getItem("user");
      if (!store) {
        throw new Error("No hay token");
      }
      const dataToken = JSON.parse(store);
      const token = dataToken.state?.token;
      const payload = JSON.parse(atob(token.split(".")[1]));

      const response = await fetch(
        `${apiUrl}/users/${payload.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer: ${token}`,
          },
        }
      );
      const data = await response.json();
      set({ userData: data });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
  getAllData: async () => {
    try {
      const store = localStorage.getItem("user");
      if (!store) {
        throw new Error("No hay token");
      }
      const dataToken = JSON.parse(store);
      const token = dataToken.state?.token;
      const response = await fetch(`${apiUrl}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer: ${token}`,
        },
      });
      const data = await response.json();
      set({ AllData: Array.isArray(data) ? data : [data] });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
  updateData: async (status: boolean, id: string) => {
    const store = localStorage.getItem("user");
    if (!store) {
      throw new Error("No hay token");
    }
    const dataToken = JSON.parse(store);
    const token = dataToken.state?.token;
    try {
      const response = await fetch(`${apiUrl}/users/changeStatus/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer: ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const updatedUser = await response.json();
      set((state) => {
        const updatedData = state.AllData.map((userGroup) => ({
          ...userGroup,
          allUser: userGroup.allUser.map((user) =>
            user.id === id ? { ...user, status: updatedUser.status } : user
          ),
        }));
        return { AllData: updatedData };
      });
    } catch (error) {
      console.error("Error al actualizar el estado del usuario:", error);
    }
  }




}));
