import { createInquiryPost } from "@/app/api/inquiry/handler";
import { saveInquiry } from "@/cms/inquiries/delivery";

export const runtime = "nodejs";
export const POST = createInquiryPost(saveInquiry);
