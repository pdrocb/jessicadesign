import { LookBookPageEditor } from "@/cms/components/LookBookPageEditor";
import { getLookBookDocument } from "@/cms/content/look-book";

export default async function AdminLookBookPage() {
  const document = await getLookBookDocument();
  return <LookBookPageEditor document={document} />;
}
