import { Container } from "@/components/common/container";
import React from "react";
import AllCountryCategory from "../components/country-category/AllCountryCategory";
import CreateCountryCategory from "../components/country-category/CreateCountryCategory";

export default function CountryCategoryPage() {
    return (
        <Container className="flex flex-col gap-6">
            <CreateCountryCategory />
            <AllCountryCategory />
        </Container>
    );
}
