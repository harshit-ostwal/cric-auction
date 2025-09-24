export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/private/", "/api/", "/admin/", "/_next/"],
        },
        sitemap: "",
    };
}
