import { Container } from "@/components/common/container";
import React from "react";
import AllExploreOptions from "../components/explore-options/AllExploreOptions";
import CreateExploreOption from "../components/explore-options/CreateExploreOption";

export default function ExploreOptionsPage() {
    return (
        <Container className="flex flex-col gap-6">
            <CreateExploreOption />
            <AllExploreOptions />
        </Container>
    );
}
