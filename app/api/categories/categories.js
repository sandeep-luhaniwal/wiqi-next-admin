export async function getCategories(token) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/getCategory?limit=10000000`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch");

    return data.data.data || [];
}

// /api/category.js

export async function createCategory(token, formData) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/createCategory`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to create category");
    return data;
}

export async function updateCategory(token, formData) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/updateCategory`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to update category");
    return data;
}

// /api/sub-category.js

export async function createSubCategory(token, formData) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/admin/createSubCategory`,
        {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        }
    );

    const data = await res.json();
    if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to create subcategory");
    return data;
}

export async function updateSubCategory(token, formData) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(
        `https://9ea028d19b92.ngrok-free.app/api/admin/updateSubCategory`,
        {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        }
    );

    const data = await res.json();
    if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to update subcategory");
    return data;
}

// Optional: fetch parent categories
export async function getParentCategories(token) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/admin/categoryName`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    const data = await res.json();
    if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to fetch categories");
    return data.data || [];
}
