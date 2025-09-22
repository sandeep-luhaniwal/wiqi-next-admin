import { Container } from "@/components/common/container";
import { ProductProvider } from "../../components/category/pro-category/pro-category";
import ProCreateCategory from "../../components/category/pro-category/ProCreateCategory";

export default function Page() {
    return (
        <ProductProvider>
            <Container className="flex flex-col gap-6">
                <ProCreateCategory />

            </Container>
        </ProductProvider>
    );
}
