import { create } from "zustand";


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface InstiData {
    accountNumber?: string;
    address?: string;
    banner?: string;
    email?: string;
    id?: string;
    isActive?: string;
    logo?: string;
    name?: string;
    phone?: string;
    role?: string;
    mustPay?: string;
}

interface ReceiptData {
    id?: string;
    date?: string;
    amount?: string;
    account?: number;
}

interface InstitucionState {
    institutions: InstiData[];
    institutionData: InstiData;
    ticketInsti: ReceiptData[];
    getInstitutions: () => Promise<void>;
    updateInstitutionStatus: (id: string, status: boolean) => Promise<void>;
    getInstitutionData: () => Promise<void>;
    createReceipt: (id: string) => Promise<Response | undefined>;
    setAdmin: (id: string) => Promise<Response | undefined>;
    setInstitution: (id: string) => Promise<Response | undefined>;
    getTickets: (id: string) => Promise<void>;
}

export const InstitutionsData = create<InstitucionState>((set) => ({
    institutions: [],
    institutionData: {},
    ticketInsti: [],
    async getInstitutions() {
        try {
            const store = localStorage.getItem("user");
            if (!store) {
                throw new Error("No hay token");
            }
            const dataToken = JSON.parse(store);
            const token = dataToken.state?.token;
            const response = await fetch(`${apiUrl}/institution`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            console.log(data)
            set({ institutions: data });
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    },
    updateInstitutionStatus: async (id: string, status: boolean) => {
        const store = localStorage.getItem("user");
        if (!store) {
            throw new Error("No hay token");
        }
        const dataToken = JSON.parse(store);
        const token = dataToken.state?.token;
        try {
            const response = await fetch(`${apiUrl}/institution/approve/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer: ${token}`,
                },
                body: JSON.stringify({ 
                    status: status === true ? "approved" : "denied" 
                }),
            });
            const data = await response.json();
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    },
    async getInstitutionData() {
        try {
            const store = localStorage.getItem("user");
            if (!store) {
                throw new Error("No hay token");
            }
            const dataToken = JSON.parse(store);
            console.log(dataToken)
            const token = dataToken.state?.token;
            const payload = JSON.parse(atob(token.split(".")[1]));

            const response = await fetch(`${apiUrl}/institution/${payload.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            set({ institutionData: data });
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    },
    createReceipt: async (id: string) => {
        try {
            const response = await fetch(`${apiUrl}/payments/register/institution/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()
            console.log(data)
            set({ ticketInsti: data })
            return response
        } catch (error) {
            console.error(error)
        }
    },
    setAdmin: async (id: string) => {
        try {
            const response = await fetch(`${apiUrl}/institution/asignAdmin/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const data = await response.json();
            console.log(data)
            return response
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    },
    setInstitution: async (id: string) => {
        try {
            const response = await fetch(`${apiUrl}/institution/quitarAdmin/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const data = await response.json();
            console.log(data)
            return response
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    },
    getTickets: async (id: string) => {
        try {
            const response = await fetch(`${apiUrl}/payments/institution/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            const data = await response.json()
            console.log(data)
            set({ ticketInsti: data })
        }catch (error) {
            console.error(error)
        }

    }
}))