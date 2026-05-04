"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    addInputThunk, 
    editInputThunk, 
    fetchCategoryNamesThunk, 
    setInputToEdit 
} from "@/store/slices/countrySlice";
import { fetchCountryNamesThunk } from "@/store/slices/countryCategorySlice";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
import { Toaster } from "react-hot-toast";

export default function CreateExploreOption() {
    const dispatch = useDispatch();
    const { inputToEdit, categoryNames } = useSelector((state) => state.country);
    const { countryNames } = useSelector((state) => state.countryCategory);

    const [inputName, setInputName] = useState("");
    const [selectedCountryId, setSelectedCountryId] = useState("");
    const [selectedCountryName, setSelectedCountryName] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedCategoryName, setSelectedCategoryName] = useState("");

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [countryComboOpen, setCountryComboOpen] = useState(false);
    const [categoryComboOpen, setCategoryComboOpen] = useState(false);

    useEffect(() => {
        if (open) {
            const token = localStorage.getItem("token");
            dispatch(fetchCountryNamesThunk(token));
        }
    }, [open, dispatch]);

    useEffect(() => {
        if (selectedCountryId) {
            const token = localStorage.getItem("token");
            dispatch(fetchCategoryNamesThunk({ token, countryId: selectedCountryId }));
        }
    }, [selectedCountryId, dispatch]);

    useEffect(() => {
        if (inputToEdit) {
            setInputName(inputToEdit.inputName || "");
            setSelectedCountryId(inputToEdit.countryId?._id || "");
            setSelectedCountryName(inputToEdit.countryId?.name || "");
            setSelectedCategoryId(inputToEdit.categoryId?._id || "");
            setSelectedCategoryName(inputToEdit.categoryId?.name || "");
            setOpen(true);
        }
    }, [inputToEdit]);

    const resetForm = () => {
        setInputName("");
        setSelectedCountryId("");
        setSelectedCountryName("");
        setSelectedCategoryId("");
        setSelectedCategoryName("");
        setErrors({});
        dispatch(setInputToEdit(null));
    };

    const validate = () => {
        const newErrors = {};
        if (!inputName.trim()) newErrors.inputName = "Input Name is required";
        if (!selectedCountryId) newErrors.countryId = "Please select a country";
        if (!selectedCategoryId) newErrors.categoryId = "Please select a category";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const payload = {
                inputName,
                countryId: selectedCountryId,
                categoryId: selectedCategoryId,
            };

            if (inputToEdit) {
                payload.id = inputToEdit._id;
                await dispatch(editInputThunk({ token, payload })).unwrap();
            } else {
                await dispatch(addInputThunk({ token, payload })).unwrap();
            }
            
            setOpen(false);
            resetForm();
        } catch (err) {
            console.error("Submission error:", err);
        } finally {
            setLoading(false);
        }
    };

    // The categories are now fetched dynamically from the API based on the countryId
    const availableCategories = categoryNames;

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
                    <p className="text-primary font-semibold text-2xl">Manage Explore Options</p>
                    <DialogTrigger asChild>
                        <Button onClick={() => setOpen(true)}>+ Add Option</Button>
                    </DialogTrigger>
                </DialogHeader>

                <DialogContent className="w-[95%] max-w-[600px] max-h-[95%] !px-0 md:!p-5">
                    <DialogHeader>
                        <DialogTitle>
                            {inputToEdit ? "Edit Option" : "Create New Option"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[75vh] pr-2">
                        <Card className="w-full shadow-none border-none">
                            <CardContent className="space-y-6">
                                {/* --- Country Selector --- */}
                                <div className="space-y-2">
                                    <Label className={cn(errors.countryId && "text-red-600")}>Select Country</Label>
                                    <Popover open={countryComboOpen} onOpenChange={setCountryComboOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={countryComboOpen}
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
                                                                    setSelectedCategoryId(""); // Reset category when country changes
                                                                    setSelectedCategoryName("");
                                                                    setCountryComboOpen(false);
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

                                {/* --- Category Selector --- */}
                                <div className="space-y-2">
                                    <Label className={cn(errors.categoryId && "text-red-600")}>Select Category</Label>
                                    <Popover open={categoryComboOpen} onOpenChange={setCategoryComboOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={categoryComboOpen}
                                                disabled={!selectedCountryId}
                                                className="w-full justify-between disabled:opacity-50"
                                            >
                                                {selectedCategoryName || (selectedCountryId ? "Select category..." : "Please select a country first")}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-(--radix-popper-anchor-width) p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Search category..." />
                                                <CommandList>
                                                    <CommandEmpty>No category found.</CommandEmpty>
                                                    <CommandGroup className="max-h-60 overflow-y-auto">
                                                        {availableCategories.map((cat) => (
                                                            <CommandItem
                                                                key={cat._id}
                                                                value={cat.name || cat.categoryName}
                                                                onSelect={() => {
                                                                    setSelectedCategoryId(cat._id);
                                                                    setSelectedCategoryName(cat.name || cat.categoryName);
                                                                    setCategoryComboOpen(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        selectedCategoryId === cat._id ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {cat.name || cat.categoryName}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {errors.categoryId && <p className="text-sm text-red-600">{errors.categoryId}</p>}
                                </div>

                                {/* --- Input Name --- */}
                                <div className="space-y-2">
                                    <Label htmlFor="inputName" className={cn(errors.inputName && "text-red-600")}>
                                        Rating Name
                                    </Label>
                                    <Input
                                        id="inputName"
                                        placeholder="e.g. Our service, Best time to visit..."
                                        value={inputName}
                                        onChange={(e) => setInputName(e.target.value)}
                                        className={cn(errors.inputName && "border-red-300 focus-visible:ring-red-500")}
                                    />
                                    {errors.inputName && <p className="text-sm text-red-600">{errors.inputName}</p>}
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
                                <Button onClick={handleSubmit} disabled={loading} className="px-8 min-w-[120px]">
                                    {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                                    {loading ? "Saving..." : inputToEdit ? "Update Option" : "Create Option"}
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
