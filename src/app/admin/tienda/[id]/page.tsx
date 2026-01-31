import ProductForm from "@/components/admin/products/ProductForm";
import { getProductById } from "@/lib/actions/products";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    console.log("EditPage Params ID:", id);
    const product = await getProductById(id);
    console.log("EditPage Found:", product ? "Yes" : "No");

    if (!product) {
        notFound();
    }

    return (
        <div className="animate-in fade-in py-6">
            <ProductForm initialData={product} isEdit />
        </div>
    );
}
