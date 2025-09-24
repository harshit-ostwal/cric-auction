import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Heading } from "@/components/ui/headings";
import Link from "next/link";

export default function NotFound() {
    return (
        <Container
            className={
                "flex h-screen flex-col items-center justify-center gap-4"
            }
        >
            <Heading size="h4">404 - Page Not Found</Heading>
            <Link href={"/"}>
                <Button>Go Back</Button>
            </Link>
        </Container>
    );
}
