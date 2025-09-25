import Navbar from "@/components/navbar";
import Container from "@/components/ui/container";

export default function HomeLayout({ children }) {
    return (
        <Container className={"flex flex-col gap-10 pt-4 pb-20"}>
            <Navbar />
            {children}
        </Container>
    );
}
