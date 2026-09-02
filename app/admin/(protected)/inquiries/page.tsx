import { InquiriesEditor } from "@/cms/components/InquiriesEditor";
import { getInquiries } from "@/cms/inquiries/repository";

export default async function InquiriesPage() {
  const { inquiries, connected } = await getInquiries();
  return <InquiriesEditor initialInquiries={inquiries} connected={connected} />;
}
