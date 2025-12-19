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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Pencil, Trash2, Upload, Search, Check, ChevronDown } from "lucide-react";
import { useSubCategory } from "./sub-category-context";

// ✅ Shadcn Dialog import
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createSubCategory, getCategoriesName, updateSubCategory } from "@/app/api/categories/categories";

export default function SubCreateCategory() {
    const { subCategoryToEdit, setSubCategoryToEdit, triggerRefresh } = useSubCategory();

    const [name, setName] = useState(null);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState(null);
    const [type, setType] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [categoryId, setcategoryId] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [categorySearch, setCategorySearch] = useState("");
    const [categoryOpen, setCategoryOpen] = useState(false);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false); // ✅ dialog state

    // Fetch categories by type
    const fetchCategoriesByType = async (selectedType) => {
        if (!selectedType) {
            setCategoryList([]);
            return;
        }
        try {
            const token = localStorage.getItem("token");
             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/categoryGetByType?type=${selectedType}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.success) {
                setCategoryList(result.data);
            } else {
                toast.error(result.message || "Failed to fetch categories");
            }
        } catch (err) {
            toast.error(err.message || "Failed to fetch categories");
        }
    };

    // Fetch categories when type changes
    useEffect(() => {
        fetchCategoriesByType(type);
    }, [type]);

    // Fill form when editing
    useEffect(() => {
        if (subCategoryToEdit) {
            setName(subCategoryToEdit.name || "");
            setTitle(subCategoryToEdit.title || "");
            setUrl(subCategoryToEdit.url || "");
            setType(subCategoryToEdit.type || "");
            setPreview(subCategoryToEdit.image || null);
            setcategoryId(subCategoryToEdit.categoryId?._id || "");
            setImageFile(null);
            setOpen(true); // ✅ edit mode mai open
        }
    }, [subCategoryToEdit]);

    const resetForm = () => {
        setName(null);
        setTitle("");
        setUrl(null);
        setType("");
        setcategoryId("");
        setImageFile(null);
        setPreview(null);
        setErrors({});
        setSubCategoryToEdit(null);
        setCategorySearch("");
        setCategoryOpen(false);
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
            if (name !== null) formData.append("name", name);
            formData.append("title", title);
            formData.append("type", type);
            formData.append("categoryId", categoryId);
            if (url !== null) formData.append("url", url);

            if (subCategoryToEdit?._id) {
                formData.append("id", subCategoryToEdit._id);
                if (imageFile) formData.append("image", imageFile);
                await updateSubCategory(token, formData);
                toast.success("SubCategory updated!");
            } else {
                if (imageFile) formData.append("image", imageFile);
                else throw new Error("Image is required for new subcategory");
                await createSubCategory(token, formData);
                toast.success("SubCategory created!");
            }

            triggerRefresh();
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
            <Dialog
                open={open}
                onOpenChange={(o) => {
                    setOpen(o);
                    if (!o) resetForm();
                }}
            >
                <DialogHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-primary font-semibold text-2xl">Create SubCategories</p>
                    <DialogTrigger asChild>
                        <Button onClick={() => setOpen(true)}>+ Add SubCategory</Button>
                    </DialogTrigger>
                </DialogHeader>

                <DialogContent className="w-[95%] max-w-[800px] max-h-[95%] !px-0 md:!p-5">
                    <DialogHeader>
                        <DialogTitle>
                            {subCategoryToEdit ? "Edit SubCategory" : "Create New SubCategory"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[75vh] pr-2">
                        <Card className="w-full shadow-none border-none">
                            <CardContent className="space-y-5">
                                {/* --- Inputs --- */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                            value={url || ""}
                                            onChange={(e) => {
                                                const val = e.target.value.trim();
                                                setUrl(val === "" ? null : val);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="type">Type</Label>
                                        <Select value={type} onValueChange={(v) => {
                                            setType(v);
                                            setcategoryId(""); // Reset category selection when type changes
                                        }}>
                                            <SelectTrigger id="type" className="w-full cursor-pointer">
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Wiqi Plus">Wiqi Plus</SelectItem>
                                                <SelectItem value="TV">TV</SelectItem>
                                                <SelectItem value="Radio">Radio</SelectItem>
                                                <SelectItem value="Shops">Shops</SelectItem>
                                                <SelectItem value="Reads">Reads</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
                                    </div>

                                    {/* Parent Category Dropdown with Search */}
                                    <div className="md:col-span-2">
                                        <Label htmlFor="categoryId">Parent Category</Label>
                                        <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={categoryOpen}
                                                    className="w-full justify-between"
                                                    disabled={!type}
                                                >
                                                    {categoryId
                                                        ? categoryList.find((cat) => cat._id === categoryId)?.name
                                                        : (!type ? "Select Type first" : "Select Parent Category")}
                                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <div className="flex items-center border-b px-3">
                                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                                    <Input
                                                        placeholder="Search categories..."
                                                        value={categorySearch}
                                                        onChange={(e) => setCategorySearch(e.target.value)}
                                                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                    />
                                                </div>
                                                <div className="max-h-60 overflow-auto">
                                                    {categoryList
                                                        .filter((cat) =>
                                                            cat.name.toLowerCase().includes(categorySearch.toLowerCase())
                                                        )
                                                        .map((cat) => (
                                                            <div
                                                                key={cat._id}
                                                                className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
                                                                onClick={() => {
                                                                    setcategoryId(cat._id);
                                                                    setCategoryOpen(false);
                                                                    setCategorySearch("");
                                                                }}
                                                            >
                                                                <Check
                                                                    className={`mr-2 h-4 w-4 ${
                                                                        categoryId === cat._id ? "opacity-100" : "opacity-0"
                                                                    }`}
                                                                />
                                                                {cat.name}
                                                            </div>
                                                        ))}
                                                    {categoryList.filter((cat) =>
                                                        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
                                                    ).length === 0 && (
                                                        <div className="px-3 py-2 text-sm text-gray-500">
                                                            No categories found.
                                                        </div>
                                                    )}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        {errors.categoryId && <p className="text-sm text-red-600">{errors.categoryId}</p>}
                                    </div>
                                </div>

                                {/* --- Image Upload --- */}
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
                            </CardContent>

                            <CardFooter className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} disabled={loading}>
                                    {loading ? "Saving..." : subCategoryToEdit ? "Update" : "Create"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>
            <Toaster position="top-right" />
        </div>
    );
}
