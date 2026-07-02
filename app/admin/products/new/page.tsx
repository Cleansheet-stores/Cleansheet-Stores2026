import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/AdminNav";
import { JerseyForm } from "@/components/JerseyForm";

export default async function NewProductPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Add New Jersey</h1>
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <JerseyForm mode="create" />
        </div>
      </div>
    </div>
  );
}
