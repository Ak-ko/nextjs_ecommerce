import db from "@/app/db/db";
import PageHeader from "../../../_components/PageHeader";
import ProductForm from "../../new/_components/ProductForm";

export default async function AdminProductEdit({
    params,
}: {
    params: { id: string };
}) {
    let product = await db.product.findUnique({
        where: {
            id: params.id,
        },
    });
    return (
        <>
            <PageHeader>Edit Product</PageHeader>
            <ProductForm product={product} />
        </>
    );
}
