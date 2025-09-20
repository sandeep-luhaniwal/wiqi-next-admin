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
import { useSubCategory } from "./sub-category-context"; // ✅ Add this

export default function SubCreateCategory() {
    const { subCategoryToEdit, setSubCategoryToEdit, triggerRefresh } = useSubCategory();

    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [type, setType] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [categoryId, setcategoryId] = useState(""); // parent category id
    const [categoryList, setCategoryList] = useState([]); // list from API

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch category names for dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(
                    "https://wiqiapi.testenvapp.com/api/admin/categoryName",
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const data = await res.json();
                if (data.success) {
                    setCategoryList(data.data || []);
                } else {
                    throw new Error(data.message || "Failed to fetch categories");
                }
            } catch (err) {
                toast.error(err.message);
            }
        };
        fetchCategories();
    }, []);

    // Fill form when editing
    useEffect(() => {
        if (subCategoryToEdit) {
            setName(subCategoryToEdit.name || "");
            setTitle(subCategoryToEdit.title || "");
            setUrl(subCategoryToEdit.url || "");
            setType(subCategoryToEdit.type || "");
            setPreview(subCategoryToEdit.image || null);
            setcategoryId(subCategoryToEdit.categoryId || "");
            setImageFile(null);
        }
    }, [subCategoryToEdit]);

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "Name is required";
        if (!title.trim()) newErrors.title = "Title is required";
        if (!type.trim()) newErrors.type = "Type is required";
        if (!categoryId) newErrors.categoryId = "Parent category is required";
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
            formData.append("url", url && url.trim() !== "" ? url.trim() : "");

            if (subCategoryToEdit?._id) {
                formData.append("id", subCategoryToEdit._id);
                if (imageFile) {
                    formData.append("image", imageFile);
                }
            } else {
                if (imageFile) formData.append("image", imageFile);
                else throw new Error("Image is required for new subcategory");
            }

            const urlEndpoint = subCategoryToEdit?._id
                ? "https://wiqiapi.testenvapp.com/api/admin/updateSubCategory"
                : "https://wiqiapi.testenvapp.com/api/admin/createSubCategory";

            const res = await fetch(urlEndpoint, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok || !data.success)
                throw new Error(data.message || "Failed to save subcategory");

            toast.success(subCategoryToEdit ? "SubCategory updated!" : "SubCategory created!");

            // Reset form
            setName("");
            setTitle("");
            setUrl("");
            setType("");
            setcategoryId("");
            setImageFile(null);
            setPreview(null);
            setSubCategoryToEdit(null); // ✅ fixed

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
                    {subCategoryToEdit ? "Edit SubCategory" : "Create New SubCategory"}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    <div>
                        <Label htmlFor="url">URL (optional)</Label>
                        <Input
                            id="url"
                            placeholder="Enter URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
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

                    {/* Parent Category Dropdown */}
                    <div className="md:col-span-2">
                        <Label htmlFor="categoryId">Parent Category</Label>
                        <Select value={categoryId} onValueChange={(v) => setcategoryId(v)}>
                            <SelectTrigger id="categoryId" className="w-full cursor-pointer">
                                <SelectValue placeholder="Select Parent Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryList.map((cat) => (
                                    <SelectItem key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.categoryId && (
                            <p className="text-sm text-red-600">{errors.categoryId}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Image</Label>
                    {preview ? (
                        <div className="relative w-32 h-32">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-32 h-32 rounded object-cover border"
                            />
                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 rounded opacity-0 hover:opacity-100 transition">
                                <label className="cursor-pointer bg-white p-2 rounded-full shadow hover:bg-gray-100">
                                    <Pencil className="w-4 h-4 text-blue-600" />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e.target.files[0])}
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImageFile(null);
                                        setPreview(null);
                                    }}
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
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e.target.files[0])}
                            />
                        </label>
                    )}
                    {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Saving..." : subCategoryToEdit ? "Update" : "Create"}
                </Button>
                <Toaster position="top-right" />
            </CardFooter>
        </Card>
    );
}
