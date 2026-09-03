import assert from "node:assert/strict";
import test from "node:test";
import { defaultSiteSettings } from "@/cms/settings/config";
import { createPageMetadata } from "@/lib/seo";

test("keeps search metadata page-specific and sharing identity global", () => {
  const metadata = createPageMetadata(defaultSiteSettings, {
    title: "Look Book search title",
    description: "Look Book search description",
    pathname: "/look-book",
  });

  assert.equal(metadata.title, "Look Book search title");
  assert.equal(metadata.description, "Look Book search description");
  assert.equal(metadata.openGraph?.title, defaultSiteSettings.ogTitle);
  assert.equal(metadata.openGraph?.description, "Look Book search description");
  assert.deepEqual(metadata.openGraph?.images, [{
    url: defaultSiteSettings.ogImageUrl,
    width: 1200,
    height: 630,
    alt: defaultSiteSettings.ogImageAlt,
  }]);
  assert.equal(metadata.twitter?.title, defaultSiteSettings.ogTitle);
  assert.equal(metadata.twitter?.description, "Look Book search description");
});
