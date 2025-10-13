"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
    Card,
    CardContent,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2, Upload } from "lucide-react";
import { useProCategory } from "./pro-category";
import { createProSubCategory, getCategoriesName, getSubCategories, updateProSubCategory } from "@/app/api/categories/categories";

export default function ProCreateCategory() {
    const { triggerRefresh, proCategoryToEdit, setProCategoryToEdit, open, setOpen } = useProCategory();

    const [name, setName] = useState(null);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState(null);
    const [type, setType] = useState("");
    const [subCategoryId, setSubCategoryId] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [subLoading, setSubLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                const data = await getCategoriesName(token);
                setCategoryList(data);
            } catch (err) {
                toast.error(err.message);
            }
        };
        fetchCategories();
    }, []);
    // useEffect(() => {
    //     const fetchCategories = async () => {
    //         try {
    //             const token = localStorage.getItem("token");
    //             const res = await fetch("https://wiqiapi.testenvapp.com/api/admin/categoryName", { headers: { Authorization: `Bearer ${token}` } });
    //             const data = await res.json();
    //             if (data.success) setCategoryList(data.data || []);
    //         } catch (err) {
    //             toast.error(err.message);
    //         }
    //     };
    //     fetchCategories();
    // }, []);

    // Fetch subcategories when category changes

    useEffect(() => {
        if (!categoryId) {
            setSubCategoryList([]);
            setSubCategoryId("");
            return;
        }

        const fetchSubCategories = async () => {
            try {
                setSubLoading(true);
                const token = localStorage.getItem("token");
                const data = await getSubCategories(token, categoryId);
                setSubCategoryList(data);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setSubLoading(false);
            }
        };
        fetchSubCategories();
    }, [categoryId]);
    // Prefill form if editing
    useEffect(() => {
        if (proCategoryToEdit) {
            setName(proCategoryToEdit.name || "");
            setTitle(proCategoryToEdit.title || "");
            setUrl(proCategoryToEdit.url || "");
            setType(proCategoryToEdit.type || "");
            setCategoryId(proCategoryToEdit.categoryId?._id || "");
            setSubCategoryId(proCategoryToEdit.subCategoryId?._id || "");
            setPreview(proCategoryToEdit.image || null);
            setOpen(true);
        }
    }, [proCategoryToEdit]);

    const resetForm = () => {
        setName(null);
        setTitle("");
        setUrl(null);
        setType("");
        setCategoryId("");
        setSubCategoryId("");
        setImageFile(null);
        setPreview(null);
        setErrors({});
        setProCategoryToEdit(null);
    };

    const validate = () => {
        const newErrors = {};
        if (!name && !url) newErrors.name = "Either Name or URL is required";
        if (name && url) {
            newErrors.name = "You cannot provide both Name and URL";
            newErrors.url = "You cannot provide both Name and URL";
        }
        if (!title.trim()) newErrors.title = "Title is required";
        if (!type.trim()) newErrors.type = "Type is required";
        if (!categoryId) newErrors.categoryId = "Category is required";
        if (!subCategoryId || subCategoryId === "notfound") newErrors.subCategoryId = "SubCategory is required";
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
            if (name !== null) formData.append("name", name);
            formData.append("title", title.trim());
            formData.append("type", type.trim());
            formData.append("categoryId", categoryId);
            formData.append("subCategoryId", subCategoryId);
            if (url !== null) formData.append("url", url);
            if (proCategoryToEdit?._id) {
                formData.append("id", proCategoryToEdit._id);
                if (imageFile) formData.append("image", imageFile);
                await updateProSubCategory(token, formData);
                toast.success("Pro SubCategory updated!");
            } else {
                if (imageFile) formData.append("image", imageFile);
                else throw new Error("Image is required for new Pro SubCategory");
                await createProSubCategory(token, formData);
                toast.success("Pro SubCategory created!");
            }

            triggerRefresh && triggerRefresh();
            setOpen(false);
            resetForm();
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Toaster position="top-right" />
            <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
                <DialogHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3">
                    <p className="text-primary font-semibold text-2xl">Create & Manage Pro SubCategories</p>
                    <DialogTrigger asChild>
                        <Button onClick={() => setOpen(true)}>+ Add Pro Sub Category</Button>
                    </DialogTrigger>
                </DialogHeader>
                <DialogContent className="w-[95%] max-w-[800px] max-h-[95%] !px-0 md:!p-5">
                    <DialogHeader>
                        <DialogTitle>{proCategoryToEdit ? "Edit Product" : "Create New Product"}</DialogTitle>
                    </DialogHeader>

                    <div className="overflow-y-auto max-h-[75vh] pr-2">
                        <Card className="w-full shadow-none border-none">
                            <CardContent className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Name */}
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="Enter Name"
                                            value={name || ""}
                                            onChange={(e) => {
                                                const val = e.target.value.trim();
                                                setName(val === "" ? null : val);
                                            }}
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
                                            value={url || ""}
                                            onChange={(e) => {
                                                const val = e.target.value.trim();
                                                setUrl(val === "" ? null : val);
                                            }}
                                        />
                                        {errors.url && <p className="text-sm text-red-600">{errors.url}</p>}
                                    </div>

                                    {/* Type */}
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

                                    {/* Category */}
                                    <div>
                                        <Label htmlFor="category">Category</Label>
                                        <Select value={categoryId} onValueChange={(v) => setCategoryId(v)}>
                                            <SelectTrigger id="category" className="w-full cursor-pointer">
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

                                    {/* SubCategory */}
                                    <div>
                                        <Label htmlFor="subCategory">SubCategory</Label>
                                        <Select value={subCategoryId} onValueChange={(v) => setSubCategoryId(v)} disabled={subLoading}>
                                            <SelectTrigger id="subCategory" className="w-full cursor-pointer">
                                                <SelectValue placeholder={subLoading ? "Loading..." : "Select SubCategory"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subCategoryList.map((sub) => (
                                                    <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.subCategoryId && <p className="text-sm text-red-600">{errors.subCategoryId}</p>}
                                    </div>

                                    {/* Image */}
                                    <div className="col-span-1 md:col-span-2">
                                        <Label htmlFor="image">Image</Label>
                                        {preview ? (
                                            <div className="relative w-32 h-32">
                                                <img src={preview} alt="Preview" className="w-32 h-32 rounded object-cover border" />
                                                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 rounded opacity-0 hover:opacity-100 transition">
                                                    <label className="cursor-pointer bg-white p-2 rounded-full shadow hover:bg-gray-100">
                                                        <Pencil className="w-4 h-4 text-blue-600" />
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e.target.files[0])} />
                                                    </label>
                                                    <button type="button" onClick={() => { setImageFile(null); setPreview(null); }} className="bg-white p-2 cursor-pointer rounded-full shadow hover:bg-gray-100">
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
                                </div>
                            </CardContent>

                            <CardFooter className="flex justify-end space-x-3">
                                <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>Cancel</Button>
                                <Button onClick={handleSubmit} disabled={loading}>
                                    {loading ? "Saving..." : proCategoryToEdit ? "Update" : "Create"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}