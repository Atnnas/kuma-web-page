import ProductForm from "@/components/admin/products/ProductForm";
import { getProductById } from "@/lib/actions/products";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const product = await getProductById(params.id);

    if (!product) {
        notFound();
    }

    return (
        <div className="animate-in fade-in py-6">
            <ProductForm initialData={product} isEdit />
        </div>
    );
}
