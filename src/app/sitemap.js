export default async function sitemap() {
    return [
        {
            url: "/example",
            lastModified: new Date().toISOString(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];
}
