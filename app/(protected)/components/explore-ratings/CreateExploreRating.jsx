"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    addRatingThunk, 
    editRatingThunk, 
    fetchCategoryNamesThunk, 
    fetchInputNamesThunk,
    setRatingToEdit 
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check, ChevronsUpDown, Star, Loader2 } from "lucide-react";
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

export default function CreateExploreRating() {
    const dispatch = useDispatch();
    const { ratingToEdit, categoryNames, inputNames } = useSelector((state) => state.country);
    const { countryNames } = useSelector((state) => state.countryCategory);

    const [ratingValue, setRatingValue] = useState(5);
    const [selectedCountryId, setSelectedCountryId] = useState("");
    const [selectedCountryName, setSelectedCountryName] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [selectedInputId, setSelectedInputId] = useState("");
    const [selectedInputName, setSelectedInputName] = useState("");
    const [description, setDescription] = useState("");

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    
    const [countryComboOpen, setCountryComboOpen] = useState(false);
    const [categoryComboOpen, setCategoryComboOpen] = useState(false);
    const [inputComboOpen, setInputComboOpen] = useState(false);

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
        if (selectedCategoryId) {
            const token = localStorage.getItem("token");
            dispatch(fetchInputNamesThunk({ token, categoryId: selectedCategoryId }));
        }
    }, [selectedCategoryId, dispatch]);

    useEffect(() => {
        if (ratingToEdit) {
            setRatingValue(ratingToEdit.rating || 5);
            setSelectedCountryId(ratingToEdit.countryId?._id || "");
            setSelectedCountryName(ratingToEdit.countryId?.name || "");
            setSelectedCategoryId(ratingToEdit.categoryId?._id || "");
            setSelectedCategoryName(ratingToEdit.categoryId?.name || "");
            setSelectedInputId(ratingToEdit.inputId?._id || "");
            setSelectedInputName(ratingToEdit.inputId?.name || ratingToEdit.inputId?.inputName || "");
            setDescription(ratingToEdit.description || "");
            setOpen(true);
        }
    }, [ratingToEdit]);

    const resetForm = () => {
        setRatingValue(5);
        setSelectedCountryId("");
        setSelectedCountryName("");
        setSelectedCategoryId("");
        setSelectedCategoryName("");
        setSelectedInputId("");
        setSelectedInputName("");
        setDescription("");
        setErrors({});
        dispatch(setRatingToEdit(null));
    };

    const validate = () => {
        const newErrors = {};
        if (!selectedCountryId) newErrors.countryId = "Required";
        if (!selectedCategoryId) newErrors.categoryId = "Required";
        if (!selectedInputId) newErrors.inputId = "Required";
        if (ratingValue < 1 || ratingValue > 5) newErrors.rating = "Rating must be 1-5";
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
                countryId: selectedCountryId,
                categoryId: selectedCategoryId,
                inputId: selectedInputId,
                rating: Number(ratingValue),
                description: description,
            };

            if (ratingToEdit) {
                payload.id = ratingToEdit._id;
                await dispatch(editRatingThunk({ token, payload })).unwrap();
            } else {
                await dispatch(addRatingThunk({ token, payload })).unwrap();
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
                    <p className="text-primary font-semibold text-2xl">Manage Explore Ratings</p>
                    <DialogTrigger asChild>
                        <Button onClick={() => setOpen(true)}>+ Add Rating</Button>
                    </DialogTrigger>
                </DialogHeader>

                <DialogContent className="w-[95%] max-w-[600px] max-h-[95%] !px-0 md:!p-5">
                    <DialogHeader>
                        <DialogTitle>
                            {ratingToEdit ? "Edit Rating" : "Create New Rating"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[75vh] pr-2">
                        <Card className="w-full shadow-none border-none">
                            <CardContent className="space-y-5">
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* --- Country --- */}
                                    <div className="space-y-2">
                                        <Label className={cn(errors.countryId && "text-red-600")}>Country *</Label>
                                        <Popover open={countryComboOpen} onOpenChange={setCountryComboOpen}>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between h-auto min-h-10 py-2 px-3">
                                                    <span className="truncate flex-1 text-left">
                                                        {selectedCountryName || "Select country"}
                                                    </span>
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search..." />
                                                    <CommandList>
                                                        <CommandEmpty>No country found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {countryNames.map((c) => (
                                                                <CommandItem
                                                                    key={c._id}
                                                                    onSelect={() => {
                                                                        setSelectedCountryId(c._id);
                                                                        setSelectedCountryName(c.countryName);
                                                                        // Clear children
                                                                        setSelectedCategoryId(""); 
                                                                        setSelectedCategoryName("");
                                                                        setSelectedInputId(""); 
                                                                        setSelectedInputName("");
                                                                        setCountryComboOpen(false);
                                                                    }}
                                                                >
                                                                    <Check className={cn("mr-2 h-4 w-4", selectedCountryId === c._id ? "opacity-100" : "opacity-0")} />
                                                                    {c.countryName}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* --- Category --- */}
                                    <div className="space-y-2">
                                        <Label className={cn(errors.categoryId && "text-red-600")}>Category *</Label>
                                        <Popover open={categoryComboOpen} onOpenChange={setCategoryComboOpen}>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" disabled={!selectedCountryId} className="w-full justify-between h-auto min-h-10 py-2 px-3">
                                                    <span className="truncate flex-1 text-left">
                                                        {selectedCategoryName || "Select category"}
                                                    </span>
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search..." />
                                                    <CommandList>
                                                        <CommandEmpty>No category found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {categoryNames.map((cat) => (
                                                                <CommandItem
                                                                    key={cat._id}
                                                                    onSelect={() => {
                                                                        setSelectedCategoryId(cat._id);
                                                                        setSelectedCategoryName(cat.name || cat.categoryName);
                                                                        // Clear children
                                                                        setSelectedInputId(""); 
                                                                        setSelectedInputName("");
                                                                        setCategoryComboOpen(false);
                                                                    }}
                                                                >
                                                                    <Check className={cn("mr-2 h-4 w-4", selectedCategoryId === cat._id ? "opacity-100" : "opacity-0")} />
                                                                    {cat.name || cat.categoryName}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                {/* --- Input (Option) --- */}
                                <div className="space-y-2">
                                    <Label className={cn(errors.inputId && "text-red-600")}>Rating Name *</Label>
                                    <Popover open={inputComboOpen} onOpenChange={setInputComboOpen}>
                                        <PopoverTrigger asChild>
                                            <Button 
                                                variant="outline" 
                                                disabled={!selectedCategoryId} 
                                                className="w-full justify-between h-auto min-h-10 py-2 px-3"
                                            >
                                                <span className="truncate flex-1 text-left">
                                                    {selectedInputName || "Select option"}
                                                </span>
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                                <Command className="w-full">
                                                    <CommandInput placeholder="Search options..." />
                                                    <CommandList>
                                                        <CommandEmpty>No options found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {(inputNames || []).map((opt) => (
                                                                <CommandItem
                                                                    key={opt._id}
                                                                    value={opt.name || opt.inputName}
                                                                    onSelect={() => {
                                                                        setSelectedInputId(opt._id);
                                                                        setSelectedInputName(opt.name || opt.inputName);
                                                                        setInputComboOpen(false);
                                                                    }}
                                                                    className="flex items-start py-3"
                                                                >
                                                                    <Check className={cn("mr-2 h-4 w-4 mt-0.5 shrink-0", selectedInputId === opt._id ? "opacity-100" : "opacity-0")} />
                                                                    <span className="leading-tight">{opt.name || opt.inputName}</span>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                    </Popover>
                                </div>

                                {/* --- Rating --- */}
                                <div className="space-y-3 pt-2">
                                    <Label className={cn(errors.rating && "text-red-600")}>Rating (1-5)</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRatingValue(star)}
                                                    className="transition-transform hover:scale-110 active:scale-95"
                                                >
                                                    <Star 
                                                        size={32} 
                                                        fill={star <= ratingValue ? "#eab308" : "none"} 
                                                        className={star <= ratingValue ? "text-yellow-500" : "text-gray-300"}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <span className="text-2xl font-bold text-primary bg-primary/5 px-4 py-1 rounded-full border border-primary/10">
                                            {ratingValue}.0
                                        </span>
                                    </div>
                                    {errors.rating && <p className="text-sm text-red-600">{errors.rating}</p>}
                                </div>
                                
                                {/* --- Description --- */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Add more details about this rating..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="min-h-[100px] rounded-2xl resize-none border-slate-200 focus:border-primary"
                                    />
                                </div>

                            </CardContent>

                            <CardFooter className="flex justify-end gap-3 mt-6">
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
                                    {loading ? "Saving..." : ratingToEdit ? "Update Rating" : "Create Rating"}
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
