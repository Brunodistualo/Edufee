const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const urlDomain = process.env.AUTH0_ISSUER_BASE_URL;

export const EditProfile = async (user: any, id: string) => {
    try {
        const response = await fetch(`${apiUrl}/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export async function getManagementApiToken() {
    const response = await fetch(`https://dev-lj6blfxnyizb5tei.us.auth0.com/oauth/token`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            client_id: "ogLiOLoIcltMAR3g7NSKPz0nuiQUe6Au",
            client_secret: "_XeZuFtqDkVTFVp7X5IugDS0z2X6AReGE6tmPvF8rYmNcYuMxWfBltvWXTd7-eiJ",
            audience: "https://dev-lj6blfxnyizb5tei.us.auth0.com/api/v2/",
            grant_type: "client_credentials"
        }),
    });

    const data = await response.json();
    return data.access_token;
}

export async function updateUser(userId: string, data: { email?: string; password?: string }) {
    const token = await getManagementApiToken();
    console.log(token)
    try {
        console.log("entra aqui")
        const response = await fetch(`${urlDomain}/api/v2/users/${userId}`, {
            method: 'PATCH',
            mode: 'no-cors',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        console.log(response.status)
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.log(error)
    }
}
