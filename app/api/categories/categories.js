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



export const fetchProCategories = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(
           `${process.env.NEXT_PUBLIC_API_URL}api/admin/getProSubCategory?limit=100000`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await res.json();
        if (data.success) {
            return data.data.data || [];
        } else {
            console.error("API returned error:", data.message);
            return [];
        }
    } catch (err) {
        console.error("Error fetching Pro Categories:", err);
        return [];
    }
};

// api/subCategoryApi.js

export async function fetchSubCategories(token) {
  if (!token) throw new Error("Token not found");

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/getSubCategory?limit=100000`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch subcategories");

    return data.data.data || [];
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    return [];
  }
}


// api/subCategoryApi.js

export async function getCategoriesName(token) {
  if (!token) throw new Error("Token not found");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/categoryName`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch categories");

  return data.data || [];
}

export async function createSubCategory(token, formData) {
  if (!token) throw new Error("Token not found");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/createSubCategory`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to create subcategory");
  return data;
}

export async function updateSubCategory(token, formData) {
  if (!token) throw new Error("Token not found");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/updateSubCategory`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to update subcategory");
  return data;
}


// Fetch subcategories by category id
export async function getSubCategories(token, categoryId) {
  if (!token) throw new Error("Token not found");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/subCategoryName?id=${categoryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch subcategories");

  if (!data.data?.length) return [{ _id: "notfound", name: "Not Found" }];
  return data.data;
}

// Create new Pro SubCategory
export async function createProSubCategory(token, formData) {
  if (!token) throw new Error("Token not found");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/proSubCategory`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to create Pro SubCategory");
  return data;
}

// Update existing Pro SubCategory
export async function updateProSubCategory(token, formData) {
  if (!token) throw new Error("Token not found");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/updateProSubCategory`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to update Pro SubCategory");
  return data;
}