"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Pencil, Trash2, Upload } from "lucide-react";
import { useProduct } from "./pro-category";

export default function ProCreateCategory() {
    const { productToEdit, setProductToEdit, triggerRefresh } = useProduct();

    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [type, setType] = useState("");
    const [subCategoryId, setSubCategoryId] = useState(""); // subcategory dropdown
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [categoryId, setCategoryId] = useState(""); // parent category id
    const [categoryList, setCategoryList] = useState([]); // main categories
    const [subCategoryList, setSubCategoryList] = useState([]); // subcategories

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch main categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(
                    "https://wiqiapi.testenvapp.com/api/admin/categoryName",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = await res.json();
                if (data.success) setCategoryList(data.data || []);
            } catch (err) {
                toast.error(err.message);
            }
        };
        fetchCategories();
    }, []);

    // Fetch subcategories
    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(
                    "https://wiqiapi.testenvapp.com/api/admin/subCategoryName",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = await res.json();
                if (data.success) setSubCategoryList(data.data || []);
            } catch (err) {
                toast.error(err.message);
            }
        };
        fetchSubCategories();
    }, []);

    // Fetch product data if editing
    useEffect(() => {
        const fetchProById = async (id) => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(
                    `https://wiqiapi.testenvapp.com/api/admin/getSubCategoryById?id=${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = await res.json();
                if (data.success) {
                    const p = data.data;
                    setName(p.name || "");
                    setTitle(p.title || "");
                    setUrl(p.url || "");
                    setType(p.type || "");
                    setPreview(p.image || null);
                    setCategoryId(p.categoryId || "");
                    setSubCategoryId(p.subCategoryId || "");
                    setImageFile(null);
                } else {
                    throw new Error(data.message || "Failed to fetch product");
                }
            } catch (err) {
                toast.error(err.message);
            }
        };

        if (productToEdit?._id) fetchProById(productToEdit._id);
    }, [productToEdit]);

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "Name is required";
        if (!title.trim()) newErrors.title = "Title is required";
        if (!type.trim()) newErrors.type = "Type is required";
        if (!categoryId) newErrors.categoryId = "Category is required";
        if (!subCategoryId) newErrors.subCategoryId = "SubCategory is required";
        if (!imageFile && !preview) newErrors.image = "Image is required";
        return newErrors;
    };

    const handleImageChange = (file) => {
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        setErrors({});
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token not found");

            const formData = new FormData();
            formData.append("name", name);
            formData.append("title", title);
            formData.append("type", type);
            formData.append("categoryId", categoryId);
            formData.append("subCategoryId", subCategoryId);
            formData.append("url", url && url.trim() !== "" ? url.trim() : "");

            if (productToEdit?._id) {
                formData.append("id", productToEdit._id);
                if (imageFile) formData.append("image", imageFile);
            } else {
                if (imageFile) formData.append("image", imageFile);
                else throw new Error("Image is required for new product");
            }

            const urlEndpoint = "https://wiqiapi.testenvapp.com/api/admin/proSubCategory";

            const res = await fetch(urlEndpoint, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok || !data.success)
                throw new Error(data.message || "Failed to save product");

            toast.success(productToEdit ? "Product updated!" : "Product created!");

            setName("");
            setTitle("");
            setUrl("");
            setType("");
            setCategoryId("");
            setSubCategoryId("");
            setImageFile(null);
            setPreview(null);
            setProductToEdit(null);
            triggerRefresh();
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">
                    {productToEdit ? "Edit Product" : "Create New Product"}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Title */}
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                    </div>

                    {/* URL */}
                    <div>
                        <Label htmlFor="url">URL (optional)</Label>
                        <Input
                            id="url"
                            placeholder="Enter URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>

                    {/* Type Dropdown */}
                    <div>
                        <Label htmlFor="type">Type</Label>
                        <Select value={type} onValueChange={(v) => setType(v)}>
                            <SelectTrigger id="type" className="w-full cursor-pointer">
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Wiqi Plus">Wiqi Plus</SelectItem>
                                <SelectItem value="Tv">Tv</SelectItem>
                                <SelectItem value="Radio">Radio</SelectItem>
                                <SelectItem value="Shops">Shops</SelectItem>
                                <SelectItem value="Reads">Reads</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
                    </div>

                    {/* Main Category Dropdown */}
                    <div>
                        <Label htmlFor="categoryId">Category</Label>
                        <Select value={categoryId} onValueChange={(v) => setCategoryId(v)}>
                            <SelectTrigger id="categoryId" className="w-full cursor-pointer">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryList.map((cat) => (
                                    <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.categoryId && <p className="text-sm text-red-600">{errors.categoryId}</p>}
                    </div>

                    {/* SubCategory Dropdown */}
                    <div>
                        <Label htmlFor="subCategoryId">SubCategory</Label>
                        <Select value={subCategoryId} onValueChange={(v) => setSubCategoryId(v)}>
                            <SelectTrigger id="subCategoryId" className="w-full cursor-pointer">
                                <SelectValue placeholder="Select SubCategory" />
                            </SelectTrigger>
                            <SelectContent>
                                {subCategoryList.map((sub) => (
                                    <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.subCategoryId && <p className="text-sm text-red-600">{errors.subCategoryId}</p>}
                    </div>
                </div>

                {/* Image */}
                <div className="flex flex-col gap-2">
                    <Label>Image</Label>
                    {preview ? (
                        <div className="relative w-32 h-32">
                            <img src={preview} alt="Preview" className="w-32 h-32 rounded object-cover border" />
                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 rounded opacity-0 hover:opacity-100 transition">
                                <label className="cursor-pointer bg-white p-2 rounded-full shadow hover:bg-gray-100">
                                    <Pencil className="w-4 h-4 text-blue-600" />
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e.target.files[0])} />
                                </label>
                                <button
                                    type="button"
                                    onClick={() => { setImageFile(null); setPreview(null); }}
                                    className="bg-white p-2 cursor-pointer rounded-full shadow hover:bg-gray-100"
                                >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <label className="flex items-center justify-center border border-dashed border-gray-400 rounded-lg p-6 cursor-pointer hover:bg-gray-50">
                            <Upload className="w-5 h-5 mr-2 text-gray-500" />
                            <span className="text-gray-600">Choose Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e.target.files[0])} />
                        </label>
                    )}
                    {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
                </div>
            </CardContent>

            <CardFooter className="flex justify-end">
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Saving..." : productToEdit ? "Update" : "Create"}
                </Button>
                <Toaster position="top-right" />
            </CardFooter>
        </Card>
    );
}
