'use client';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser  } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';

function UpdateEmailForm() {
  const { getAccessTokenSilently } = useAuth0();
  const { user } = useUser();
  const [email, setEmail] = useState(user?.email);

  console.log(user)

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      console.log(token)
      const response = await fetch(`https://dev-lj6blfxnyizb5tei.us.auth0.com/api/v2/users/${user?.sub}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        console.log(response.statusText);
        throw new Error('Error updating email');
      }
      console.log(JSON.stringify(response))
      alert('Email updated successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to update email');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 pt-20">
      <input
        type="email"
        value={email!}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Update Email</button>
    </form>
  );
}

export default UpdateEmailForm;