import { Container } from "@/components/common/container";
import React from "react";
import AllExploreRatings from "../components/explore-ratings/AllExploreRatings";
import CreateExploreRating from "../components/explore-ratings/CreateExploreRating";

export default function ExploreRatingsPage() {
    return (
        <Container className="flex flex-col gap-6">
            <CreateExploreRating />
            <AllExploreRatings />
        </Container>
    );
}
