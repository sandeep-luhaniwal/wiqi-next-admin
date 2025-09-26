import { Container } from "@/components/common/container";
import React from "react";
import CreateStreamCategory from "../../components/stream-category/CreateStreamCategory";
import StreamCategoryTable from "../../components/stream-category/StreamCategoryTabel";
import { StreamCategoryProvider } from "../../components/stream-category/stream-category-context";

export default function Page() {
  return (
    <StreamCategoryProvider>
      <Container className="flex flex-col gap-6">
        <CreateStreamCategory />
        <StreamCategoryTable />
      </Container>
    </StreamCategoryProvider>
  );
}
