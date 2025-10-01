"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useStreamCategory } from "./stream-category-context";

// ✅ Shadcn Dialog import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CreateStreamCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const { streamCategoryToEdit, triggerRefresh } = useStreamCategory();

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const url = streamCategoryToEdit
        ? `https://wiqiapi.testenvapp.com/api/admin/updateStreamCategory/${streamCategoryToEdit._id}`
        : "https://wiqiapi.testenvapp.com/api/admin/streamCategory";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Stream category saved successfully!");
        triggerRefresh();
        resetForm();
        setOpen(false);
      } else {
        toast.error(data.message || "Failed to save category.");
      }
    } catch (err) {
      toast.error("Something went wrong!");
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
              Create & Manage Stream Categories
            </p>
            <Button onClick={() => setOpen(true)}>+ Add Stream Category</Button>
          </div>
        </DialogTrigger>

        <DialogContent className="w-[95%] max-w-[500px] !px-0 md:!p-5">
          <DialogHeader>
            <DialogTitle>
              {streamCategoryToEdit ? "Edit Stream Category" : "Create Stream Category"}
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
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
    </div>
  );
};

export default CreateStreamCategory;
