// /api/stream-category.js

export async function createStreamCategory(token, name) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/streamCategory`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create stream category");
    return data;
}

export async function updateStreamCategory(token, id, name) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/updateStreamCategory`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update stream category");
    return data;
}


// /api/stream-category.js

export async function getStreamCategories(token, limit = 100000) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/admin/getStreamCategory?limit=${limit}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    const data = await res.json();
    if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to fetch stream categories");

    return data.data.data || [];
}
