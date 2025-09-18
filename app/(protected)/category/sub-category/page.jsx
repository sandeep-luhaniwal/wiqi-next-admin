import { Container } from "@/components/common/container";
import { SubCategoryProvider } from "../../components/category/create-sub-category/sub-category-context";
import SubCreateCategory from "../../components/category/create-sub-category/SubCreateCategory";
import SubCategoryTable from "../../components/category/create-sub-category/SubCategoryTabel";

export default function Page() {
    return (
        <SubCategoryProvider>
            <Container className="flex flex-col gap-6">
                <SubCreateCategory />
                <SubCategoryTable />
            </Container>
        </SubCategoryProvider>
    );
}
