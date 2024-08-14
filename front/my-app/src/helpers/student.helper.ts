import { FormDataStudent } from "@/hooks/useFormStudent";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const registerStudent = async (formData: FormDataStudent) => {
  try {
    const response = await fetch(`${apiUrl}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.nombre,
        lastname: formData.apellido,
        dni: formData.dni,
        email: formData.email,
        institutionName: formData.institucion,
        phone: formData.telefono,
        address: formData.direccion,
        imgProfile: null
      })
    });
    if (!response.ok) {
      const errorData = await response.json();  
      throw new Error(JSON.stringify(errorData));
    }
    const data = await response.json();
    const studentId = data.data.id;
    return studentId;
  } catch (error: any) {
    throw new Error(error.message || JSON.stringify(error));  
  }
};
export const uploadStudentImageProfile = async (studentId: string, file: File) => {
  const formData = new FormData()
  formData.append('file', file as File)

  try {
    const response = await fetch(`${apiUrl}/files/uploadUserImage/${studentId}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir la imagen');
    }
    const data = await response.json();
    console.log("Student profile image uploaded successfully", data);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
export const getStudentsByInstitute = async(instituteId: string) => {
  try {
      const token = JSON.parse(localStorage.getItem('user') ?? '{}')?.state?.token;
      console.log(instituteId)
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await fetch(`${apiUrl}/users/studentsBy/${instituteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer: ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los estudiantes');
    }
    const data = await response.json();
    console.log(data)
    return data.users;
  } catch (error: any) {
    throw new Error(error.message);
  }
}