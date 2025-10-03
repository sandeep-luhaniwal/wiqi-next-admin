import { Container } from "@/components/common/container";
import PostTable from "../components/post/PostTable";

export default function Page() {
    return (
        <Container className="flex flex-col gap-6">
            <PostTable />
        </Container>
    );
}
