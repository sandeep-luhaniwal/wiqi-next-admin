export async function getBanners(token) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/getBanner?limit=10000000`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch");

    return data.data.data || [];
}

export async function getBannerById(token, id) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/getBannerById?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch banner");

    return data.data;
}

export async function createBanner(token, formData) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/createBanner`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to create banner");
    return data;
}

export async function updateBanner(token, formData) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/updateBanner`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to update banner");
    return data;
}

export async function deleteBanner(token, id) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/deleteBanner`, {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete banner");
    return data;
}

export async function bannerStatus(token, id, status) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/bannerStatus`, {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, status }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to update banner status");
    return data;
}