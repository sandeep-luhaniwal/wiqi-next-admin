"use client";

import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Upload, Check, ChevronsUpDown } from "lucide-react";
import { useCountry } from "./country-context";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createCountry, editCountry } from "@/app/api/country/country";
import Image from "next/image";
import Flag from "react-world-flags";
import countryList from "react-select-country-list";
import { useDispatch } from "react-redux";
import { editCountryThunk, createCountryThunk } from "@/store/slices/countrySlice";
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
import { cn, getImageUrl } from "@/lib/utils";

export default function CreateCountry() {
    const { countryToEdit, setCountryToEdit, triggerRefresh } = useCountry();
    const dispatch = useDispatch();

    const [countryName, setCountryName] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [comboOpen, setComboOpen] = useState(false);

    const countries = useMemo(() => countryList().getData(), []);

    const resetForm = () => {
        if (preview && preview.startsWith('blob:')) {
            URL.revokeObjectURL(preview);
        }
        setCountryName("");
        setCountryCode("");
        setImageFile(null);
        setPreview(null);
        setErrors({});
        setCountryToEdit(null);
    };

    useEffect(() => {
        if (countryToEdit) {
            setCountryName(countryToEdit.countryName || "");
            // Try to find the country code by name
            const c = countries.find(x => x.label === countryToEdit.countryName);
            if (c) setCountryCode(c.value);

            setPreview(getImageUrl(countryToEdit.image) || null);
            setImageFile(null);
            setOpen(true);
        }

        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [countryToEdit, countries]);

    const validate = () => {
        const newErrors = {};
        if (!countryName.trim()) newErrors.countryName = "Country Name is required";
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
            formData.append("countryName", countryName);

            if (countryToEdit?._id) formData.append("id", countryToEdit._id);
            if (imageFile) formData.append("image", imageFile);

            if (countryToEdit) {
                await dispatch(editCountryThunk({ token, formData })).unwrap();
            } else {
                await dispatch(createCountryThunk({ token, formData })).unwrap();
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
                <DialogHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3">
                    <p className="text-primary font-semibold text-2xl">Manage Countries</p>
                    <DialogTrigger asChild>
                        <Button onClick={() => setOpen(true)}>+ Add Country</Button>
                    </DialogTrigger>
                </DialogHeader>

                <DialogContent className="w-[95%] max-w-[600px] max-h-[95%] !px-0 md:!p-5">
                    <DialogHeader>
                        <DialogTitle>
                            {countryToEdit ? "Edit Country" : "Create New Country"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[75vh] pr-2">
                        <Card className="w-full shadow-none border-none">
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Select Country</Label>
                                    <Popover open={comboOpen} onOpenChange={setComboOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={comboOpen}
                                                className="w-full justify-between"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {countryCode && (
                                                        <Flag code={countryCode} className="w-6 h-4 rounded-sm object-cover" />
                                                    )}
                                                    {countryName || "Select country..."}
                                                </div>
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-(--radix-popper-anchor-width) p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Search country..." />
                                                <CommandList>
                                                    <CommandEmpty>No country found.</CommandEmpty>
                                                    <CommandGroup className="max-h-60 overflow-y-auto">
                                                        {countries.map((country) => (
                                                            <CommandItem
                                                                key={country.value}
                                                                value={country.label}
                                                                onSelect={async (currentValue) => {
                                                                    setCountryName(currentValue);
                                                                    setCountryCode(country.value);
                                                                    setComboOpen(false);

                                                                    // Automatically fetch flag and populate upload field
                                                                    try {
                                                                        const flagUrl = `https://flagcdn.com/w640/${country.value.toLowerCase()}.png`;
                                                                        const response = await fetch(flagUrl);
                                                                        const blob = await response.blob();
                                                                        const file = new File([blob], `${country.label}_flag.png`, { type: "image/png" });

                                                                        setImageFile(file);
                                                                        setPreview(URL.createObjectURL(blob));
                                                                    } catch (err) {
                                                                        console.error("Error fetching flag:", err);
                                                                    }
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        countryName === country.label ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                <div className="flex items-center gap-2">
                                                                    <Flag code={country.value} className="w-5 h-3 object-cover rounded-sm" />
                                                                    {country.label}
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {errors.countryName && <p className="text-sm text-red-600">{errors.countryName}</p>}
                                </div>

                                {/* --- Image Upload --- */}
                                <div className="flex flex-col gap-3">
                                    <Label>Country Flag Image</Label>
                                    {preview ? (
                                        <div className="relative group w-full aspect-video max-w-xs overflow-hidden rounded-lg border bg-gray-50">
                                            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 hover:bg-gray-50 hover:border-primary/50 transition-all">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                                <p className="mb-2 text-sm text-gray-500 font-semibold">uploaded flag Image Here</p>
                                            </div>
                                        </div>
                                    )}
                                    {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
                                </div>
                            </CardContent>

                            <CardFooter className="flex justify-end gap-3 mt-4">
                                <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} disabled={loading} className="px-8">
                                    {loading ? "Saving..." : countryToEdit ? "Update Country" : "Create Country"}
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
