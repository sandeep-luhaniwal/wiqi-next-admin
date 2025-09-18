import { Container } from "@/components/common/container";
import React from "react";
import CreateCategory from "../../components/category/create-category/CreateCategory";
import AllTypeCategory from "../../components/category/create-category/AllTypeCategory";
import { CategoryProvider } from "../../components/category/create-category/category-context";

export default function Page() {
  return (
    <CategoryProvider>
      <Container className="flex flex-col gap-6">
        <CreateCategory />
        <AllTypeCategory />
      </Container>
    </CategoryProvider>
  );
}
