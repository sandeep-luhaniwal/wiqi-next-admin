export async function getPosts(token) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/getPost?limit=10000000`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch");

    return data.data.posts || [];
}


export async function getUsers(token) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/admin/getUser?limit=1000000`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch users");
    }

    const cleanUsers = data.data.users.map((u) => ({
        id: u._id,
        firstName: u.firstName,
        lastName: u.lastName,
        userName: u.userName,
        email: u.email,
        phone: u.phone,
        image: u.image,
        block: u.block ?? false,
    }));

    return cleanUsers;
}


export async function getUserWithPosts(userId, token) {
    if (!token) throw new Error("Token not found");
    if (!userId) throw new Error("User ID is required");

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/admin/getUserAllPost?userId=${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch user and posts");
    }

    return {
        user: data.data.userData,
        posts: data.data.posts || [],
    };
}
