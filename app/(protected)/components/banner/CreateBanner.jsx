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
import { Pencil, Trash2, Upload } from "lucide-react";
import { useBanner } from "./banner-context";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createBanner, updateBanner } from "@/app/api/banner/banner";
import Image from "next/image";

export default function CreateBanner() {
    const { bannerToEdit, setBannerToEdit, triggerRefresh } = useBanner();

    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [type, setType] = useState("");
    const [index, setIndex] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const resetForm = () => {
        setTitle("");
        setUrl("");
        setType("");
        setIndex("");
        setImageFile(null);
        setPreview(null);
        setErrors({});
        setBannerToEdit(null);
    };

    useEffect(() => {
        if (bannerToEdit) {
            setTitle(bannerToEdit.title || bannerToEdit.name || "");
            setUrl(bannerToEdit.url || "");
            setType(bannerToEdit.type || "");
            setIndex(bannerToEdit.index || "");
            setPreview(bannerToEdit.image || null);
            setImageFile(null);
            setOpen(true);
        }
    }, [bannerToEdit]);

    const validate = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = "Title is required";
        if (!type.trim()) newErrors.type = "Type is required";
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
            formData.append("name", title); // API expects 'name' field
            formData.append("title", title);
            formData.append("type", type);
            if (url) formData.append("url", url);
            if (index) formData.append("index", index);
            if (bannerToEdit?._id) formData.append("id", bannerToEdit._id);
            if (imageFile) formData.append("image", imageFile);

            const data = bannerToEdit
                ? await updateBanner(token, formData)
                : await createBanner(token, formData);

            toast.success(bannerToEdit ? "Banner updated!" : "Banner created!");
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
                    <p className="text-primary font-semibold text-2xl">Create Banners</p>
                    <DialogTrigger asChild>
                        <Button onClick={() => setOpen(true)}>+ Add Banner</Button>
                    </DialogTrigger>
                </DialogHeader>

                <DialogContent className="w-[95%] max-w-[800px] max-h-[95%] !px-0 md:!p-5">
                    <DialogHeader>
                        <DialogTitle>
                            {bannerToEdit ? "Edit Banner" : "Create New Banner"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[75vh] pr-2">
                        <Card className="w-full shadow-none border-none">
                            <CardContent className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                        <Label htmlFor="type">Type</Label>
                                        <Select value={type} onValueChange={(v) => setType(v)}>
                                            <SelectTrigger id="type" className="w-full cursor-pointer">
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="news">News</SelectItem>
                                                <SelectItem value="banner">Banner</SelectItem>
                                                <SelectItem value="image">Image</SelectItem>
                                                <SelectItem value="weather">Weather</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
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
                                        <Label htmlFor="index">Index (optional)</Label>
                                        <Input
                                            id="index"
                                            type="number"
                                            placeholder="Enter Index"
                                            value={index}
                                            onChange={(e) => setIndex(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Image</Label>
                                    {preview ? (
                                        <div className="relative w-32 h-32">
                                            <Image width={128} height={128} src={preview} alt="Preview" className="w-32 h-32 rounded object-cover border" />
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
                                    {loading ? "Saving..." : bannerToEdit ? "Update" : "Create"}
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