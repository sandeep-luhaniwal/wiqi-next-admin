"use client";

import React, { useEffect, useState, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { addCountryCategoryThunk, editCountryCategoryThunk, fetchCountryNamesThunk, setCategoryToEdit } from "@/store/slices/countryCategorySlice";
import { 
    Plus, 
    Upload, 
    Check, 
    ChevronsUpDown,
    Loader2,
    Trash2
} from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function CreateCountryCategory() {
    const dispatch = useDispatch();
    const { countryNames, categoryToEdit } = useSelector((state) => state.countryCategory);

    const [categoryName, setCategoryName] = useState("");
    const [selectedCountryId, setSelectedCountryId] = useState("");
    const [selectedCountryName, setSelectedCountryName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [comboOpen, setComboOpen] = useState(false);

    useEffect(() => {
        if (open) {
            const token = localStorage.getItem("token");
            dispatch(fetchCountryNamesThunk(token));
        }
    }, [open, dispatch]);

    useEffect(() => {
        if (categoryToEdit) {
            setCategoryName(categoryToEdit.categoryName || "");
            setSelectedCountryId(categoryToEdit.countryId?._id || "");
            setSelectedCountryName(categoryToEdit.countryId?.name || "");
            setPreview(getImageUrl(categoryToEdit.image) || null);
            setImageFile(null);
            setOpen(true);
        }
    }, [categoryToEdit]);

    const handleImageChange = (file) => {
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!categoryName.trim()) newErrors.categoryName = "Category Name is required";
        if (!selectedCountryId) newErrors.countryId = "Please select a country";
        if (!imageFile && !preview) newErrors.image = "Category image is required";
        return newErrors;
    };

    const resetForm = () => {
        setCategoryName("");
        setSelectedCountryId("");
        setSelectedCountryName("");
        setImageFile(null);
        if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
        setPreview(null);
        setErrors({});
        dispatch(setCategoryToEdit(null));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("categoryName", categoryName);
            formData.append("countryId", selectedCountryId);
            
            if (categoryToEdit?._id) formData.append("id", categoryToEdit._id);
            if (imageFile) formData.append("image", imageFile);

            if (categoryToEdit) {
                await dispatch(editCountryCategoryThunk({ token, formData })).unwrap();
            } else {
                await dispatch(addCountryCategoryThunk({ token, formData })).unwrap();
            }
            
            setOpen(false);
            resetForm();
        } catch (err) {
            console.error("Submission error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Dialog 
                open={open} 
                onOpenChange={(val) => { 
                    setOpen(val); 
                    if (!val) resetForm(); 
                }}
            >
                <DialogHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3">
                    <p className="text-primary font-semibold text-2xl">Manage Country Category</p>
                    <DialogTrigger asChild>
                        <Button onClick={() => setOpen(true)}>+ Add Country Category</Button>
                    </DialogTrigger>
                </DialogHeader>

                <DialogContent className="w-[95%] max-w-[600px] max-h-[95%] !px-0 md:!p-5">
                    <DialogHeader>
                        <DialogTitle>
                            {categoryToEdit ? "Edit Country Category" : "Create New Country Category"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[75vh] pr-2">
                        <Card className="w-full shadow-none border-none">
                            <CardContent className="space-y-6">
                                {/* --- Country Selector --- */}
                                <div className="space-y-2">
                                    <Label className={cn(errors.countryId && "text-red-600")}>Select Country</Label>
                                    <Popover open={comboOpen} onOpenChange={setComboOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={comboOpen}
                                                className="w-full justify-between"
                                            >
                                                {selectedCountryName || "Search and select country..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-(--radix-popper-anchor-width) p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Search country..." />
                                                <CommandList>
                                                    <CommandEmpty>No country found.</CommandEmpty>
                                                    <CommandGroup className="max-h-60 overflow-y-auto">
                                                        {countryNames.map((country) => (
                                                            <CommandItem
                                                                key={country._id}
                                                                value={country.countryName}
                                                                onSelect={() => {
                                                                    setSelectedCountryId(country._id);
                                                                    setSelectedCountryName(country.countryName);
                                                                    setComboOpen(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        selectedCountryId === country._id ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {country.countryName}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {errors.countryId && <p className="text-sm text-red-600">{errors.countryId}</p>}
                                </div>

                                {/* --- Category Name --- */}
                                <div className="space-y-2">
                                    <Label htmlFor="categoryName" className={cn(errors.categoryName && "text-red-600")}>
                                        Category Name
                                    </Label>
                                    <Input
                                        id="categoryName"
                                        placeholder="e.g. Adventure Tours"
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        className={cn(errors.categoryName && "border-red-300 focus-visible:ring-red-500")}
                                    />
                                    {errors.categoryName && <p className="text-sm text-red-600">{errors.categoryName}</p>}
                                </div>

                                {/* --- Image Upload --- */}
                                <div className="flex flex-col gap-3">
                                    <Label className={cn(errors.image && "text-red-600")}>Country Flag Image</Label>
                                    <label className="relative cursor-pointer group w-full aspect-video max-w-xs overflow-hidden rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-primary/50 transition-all bg-gray-50/50">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400 group-hover:text-primary transition-colors">
                                                <Upload className="w-10 h-10 mb-3" />
                                                <p className="mb-2 text-sm font-semibold text-gray-500">uploaded flag Image Here</p>
                                            </div>
                                        )}
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*" 
                                            onChange={(e) => handleImageChange(e.target.files[0])} 
                                        />
                                    </label>
                                    {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
                                </div>
                            </CardContent>

                            <CardFooter className="flex justify-end gap-3 mt-4">
                                <Button 
                                    variant="outline" 
                                    type="button" 
                                    onClick={() => { setOpen(false); resetForm(); }}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} disabled={loading} className="px-8">
                                    {loading ? "Saving..." : categoryToEdit ? "Update Category" : "Create Category"}
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
