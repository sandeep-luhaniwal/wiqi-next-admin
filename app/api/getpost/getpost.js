export async function getPosts(token) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/getPost?limit=10000000`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch");

    return data.data.posts || [];
}