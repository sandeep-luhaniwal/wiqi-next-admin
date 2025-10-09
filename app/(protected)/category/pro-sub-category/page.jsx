import { Container } from "@/components/common/container";
import ProCreateCategory from "../../components/category/pro-category/ProCreateCategory";
import ProCategoryTabel from "../../components/category/pro-category/ProCategoryTabel";
import { ProCategoryProvider } from "../../components/category/pro-category/pro-category";

export default function Page() {
    return (
        <ProCategoryProvider>
            <Container className="flex flex-col gap-6">
                <ProCreateCategory />
                <ProCategoryTabel />
            </Container>
        </ProCategoryProvider>
    );
}
