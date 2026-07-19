import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://yuvalfishler.com/",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
