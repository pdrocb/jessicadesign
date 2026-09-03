import { InquireEditor } from "@/cms/components/InquireEditor";
import { getInquireDocument } from "@/cms/content/inquire";

export default async function AdminInquirePage() {
  const document = await getInquireDocument();
  return <InquireEditor document={document} />;
}
