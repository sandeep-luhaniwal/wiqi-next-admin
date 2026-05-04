import { Container } from "@/components/common/container";
import React from "react";
import CreateCountry from "../components/country/CreateCountry";
import AllCountry from "../components/country/AllCountry";
import { CountryProvider } from "../components/country/country-context";

export default function CountryPage() {
  return (
    <CountryProvider>
      <Container className="flex flex-col gap-6">
        <CreateCountry />
        <AllCountry />
      </Container>
    </CountryProvider>
  );
}
