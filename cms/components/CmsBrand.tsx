import Image from "next/image";
import logoMark from "@/assets/logo-mark.png";
import { cmsSite } from "@/cms/config/site";

export function CmsBrand({
  compact = false,
  priority = false,
}: {
  compact?: boolean;
  priority?: boolean;
}) {
  return (
    <div
      className="cms-brand"
      data-compact={compact || undefined}
      role="img"
      aria-label={`${cmsSite.name} content manager`}
    >
      <Image src={logoMark} alt="" priority={priority} />
      <span>Content manager</span>
    </div>
  );
}
