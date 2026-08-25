import { HomeEditor } from "@/cms/components/HomeEditor";
import { getHomeDocument } from "@/cms/content/home";

export default async function AdminHomePage() {
  const document = await getHomeDocument();
  return <HomeEditor document={document} />;
}
