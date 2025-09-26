"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useStreamCategory } from "./stream-category-context";

const CreateStreamCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { streamCategoryToEdit, triggerRefresh } = useStreamCategory();

  // 🔹 Populate form if editing
  useEffect(() => {
    if (streamCategoryToEdit) {
      setName(streamCategoryToEdit.name || "");
      setError("");
    }
  }, [streamCategoryToEdit]);

  const handleChange = (e) => {
    const value = e.target.value;
    const capitalized =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setName(capitalized);
    if (capitalized.trim() !== "") setError("");
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

      const method = streamCategoryToEdit ? "POST" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Stream category saved successfully!");
        setName("");
        triggerRefresh();
      } else {
        toast.error(data.message || "Failed to save category.");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{streamCategoryToEdit ? "Edit Stream Category" : "Create Stream Category"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" className="w-full">
            {streamCategoryToEdit ? "Update" : "Create"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateStreamCategory;
