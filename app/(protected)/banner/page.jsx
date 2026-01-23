import { Container } from "@/components/common/container";
import React from "react";
import CreateBanner from "../components/banner/CreateBanner";
import AllBanners from "../components/banner/AllBanners";
import { BannerProvider } from "../components/banner/banner-context";

export default function Page() {
  return (
    <BannerProvider>
      <Container className="flex flex-col gap-6">
        <CreateBanner />
        <AllBanners />
      </Container>
    </BannerProvider>
  );
}