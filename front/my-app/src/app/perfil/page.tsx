'use client';
import React, { useEffect } from 'react'
import { InstitutionsData } from '@/store/institutionsData'

// {
//*     id: 'afc340fd-b993-437e-9238-aff7856679f5',
//*     name: 'Insti',
//*     email: 'bruno123@gmail.com',
//*     accountNumber: '123213132123',
//*     address: 'calle viva 123',
//*     phone: '9463732323',
//*     logo: 'string',
//*     banner: 'string',
//*     role: 'institution',
//*     isActive: 'pending'
// }

const ProfileInstitucion = () => {
    const getData = InstitutionsData((state) => state.getInstitutionData);
    const data = InstitutionsData((state) => state.institutionData);

    useEffect(() => {
      getData();
    }, [getData]);
    console.log(data)
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 pt-20 px-4 pb-4">
      <h1>Profile</h1>
      <p>{data.name}</p>
      <p>{data.email}</p>
      <p>{data.accountNumber}</p>
      <p>{data.address}</p>
      <p>{data.phone}</p>
      <p>{data.logo}</p>
      <p>{data.banner}</p>
      <p>{data.role}</p>
      <p>{data.isActive}</p>
    </div>
  )
}

export default ProfileInstitucion