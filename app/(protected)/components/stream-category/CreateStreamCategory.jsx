"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import { useStreamCategory } from "./stream-category-context";

// ✅ Shadcn Dialog import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createStreamCategory, updateStreamCategory, } from "@/app/api/categories/categories";

const CreateStreamCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const { streamCategoryToEdit, triggerRefresh, setStreamCategoryToEdit } =
    useStreamCategory();

  // 🔹 Populate form if editing
  useEffect(() => {
    if (streamCategoryToEdit) {
      setName(streamCategoryToEdit.name || "");
      setError("");
      setOpen(true); // edit ke time pe dialog khul jaye
    }
  }, [streamCategoryToEdit]);

  const handleChange = (e) => {
    const value = e.target.value;
    const capitalized =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setName(capitalized);
    if (capitalized.trim() !== "") setError("");
  };

  const resetForm = () => {
    setName("");
    setError("");
    setStreamCategoryToEdit(null); // ✅ context reset
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let data;

      if (streamCategoryToEdit) {
        data = await updateStreamCategory(token, streamCategoryToEdit._id, name);
      } else {
        data = await createStreamCategory(token, name);
      }

      toast.success(data.message || "Stream category saved successfully!");
      triggerRefresh();
      resetForm();
      setOpen(false);
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
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
        <DialogTrigger asChild>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-primary font-semibold text-2xl">
              Create Stream Categories
            </p>
            <div className="max-w-max">
              <Button onClick={() => setOpen(true)}>+ Add Stream Category</Button>
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="w-[95%] max-w-[500px] !px-0 md:!p-5">
          <DialogHeader>
            <DialogTitle>
              {streamCategoryToEdit
                ? "Edit Stream Category"
                : "Create Stream Category"}
            </DialogTitle>
          </DialogHeader>

          <Card className="w-full shadow-none border-none">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter category name"
                    value={name}
                    onChange={handleChange}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {streamCategoryToEdit ? "Update" : "Create"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </DialogContent>
      </Dialog>
      <Toaster position="top-right" />
    </div>
  );
};

export default CreateStreamCategory;
