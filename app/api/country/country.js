export async function getCountries(token) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/getCountry?limit=100000`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch countries");

    // Handle nested data.data structure if present, otherwise return data.data
    return Array.isArray(data.data) ? data.data : (data.data?.data || []);
}

export async function createCountry(token, formData) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/addCountry`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to create country");
    return data;
}

export async function editCountry(token, formData) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/editCountry`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to edit country");
    return data;
}

export async function deleteCountry(token, id) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/deleteCountry?id=${id}`, {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${token}`
        }
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete country");
    return data;
}

export async function getInputs(token) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/getInput`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch inputs");
    return data.data?.data || [];
}

export async function addInput(token, payload) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/addInput`, {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to add input");
    return data;
}

export async function editInput(token, payload) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/editInput`, {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to edit input");
    return data;
}

export async function deleteInput(token, id) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/deleteInput?id=${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete input");
    return data;
}

export async function getCountryCategoryNames(token, countryId) {
    if (!token) throw new Error("Token not found");

    const url = countryId 
        ? `${process.env.NEXT_PUBLIC_API_URL}api/admin/getCountryCategoryName?countryId=${countryId}`
        : `${process.env.NEXT_PUBLIC_API_URL}api/admin/getCountryCategoryName`;

    const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch category names");
    return data.data || [];
}

export async function getRatings(token) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/getRating`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch ratings");
    return data.data?.data || [];
}

export async function addRating(token, payload) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/addRating`, {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to add rating");
    return data;
}

export async function editRating(token, payload) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/editRating`, {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to edit rating");
    return data;
}

export async function deleteRating(token, id) {
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/deleteRating?id=${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete rating");
    return data;
}

export async function getInputNames(token, categoryId) {
    if (!token) throw new Error("Token not found");

    const url = categoryId 
        ? `${process.env.NEXT_PUBLIC_API_URL}api/admin/getInputName?categoryId=${categoryId}`
        : `${process.env.NEXT_PUBLIC_API_URL}api/admin/getInputName`;

    const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch input names");
    return data.data || [];
}
