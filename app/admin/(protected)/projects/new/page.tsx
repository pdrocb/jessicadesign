import { NewProjectEditor } from "@/cms/components/NewProjectEditor";
import { isCmsDatabaseConfigured } from "@/cms/database/client";

export default function NewProjectPage() {
  return <NewProjectEditor connected={isCmsDatabaseConfigured()} />;
}
