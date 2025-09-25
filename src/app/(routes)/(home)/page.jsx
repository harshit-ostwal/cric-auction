"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/headings";
import { Icons } from "@/shared/icons";
import React, { memo, useMemo } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuctions } from "@/hooks/useAuction";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuctionCard, AuctionSkeletonCard } from "@/components/AuctionCard";

const SkeletonCard = memo(() => (
    <Card className="w-auto border-t-4 border-gray-200">
        <CardHeader className={"flex flex-col gap-2"}>
            <CardTitle>
                <Skeleton className="h-6 w-32" />
            </CardTitle>
            <CardDescription>
                <Skeleton className="h-4 w-40" />
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Skeleton className="h-12 w-16" />
        </CardContent>
    </Card>
));
SkeletonCard.displayName = "SkeletonCard";

const StatCard = memo(({ data, index }) => (
    <div
        key={index}
        className="group relative w-full flex-shrink-0 basis-full cursor-pointer overflow-hidden rounded-md md:basis-1/2 xl:basis-1/3"
    >
        <CarouselItem>
            <Card className={cn(data.borderColor, "w-auto border-t-4")}>
                <CardHeader>
                    <CardTitle>
                        <Heading size="h6" className="font-semibold">
                            {data.title}
                        </Heading>
                    </CardTitle>
                    <CardDescription>
                        <Heading size="p" className="font-medium">
                            {data.description}
                        </Heading>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Heading size="h3" className={"font-bold"}>
                        {data.count || 0}
                    </Heading>
                </CardContent>
            </Card>
        </CarouselItem>
    </div>
));
StatCard.displayName = "StatCard";

const HomePage = memo(() => {
    const { data: auctions } = useAuctions();

    const carouselOptions = useMemo(
        () => ({
            align: "start",
            duration: 60,
            dragFree: true,
        }),
        []
    );

    const carouselPlugins = useMemo(
        () => [
            Autoplay({
                delay: 3000,
                stopOnInteraction: false,
                stopOnMouseEnter: false,
                stopOnLastSnap: false,
                stopOnFocusIn: false,
            }),
        ],
        []
    );

    const auctionItems = useMemo(() => {
        if (!auctions) {
            return Array.from({ length: 2 }).map((_, index) => (
                <div
                    key={`auction-skeleton-${index}`}
                    className="group relative w-full flex-shrink-0 basis-full cursor-pointer overflow-hidden rounded-md md:basis-1/2"
                >
                    <CarouselItem>
                        <AuctionSkeletonCard />
                    </CarouselItem>
                </div>
            ));
        }

        const todayAuctions = auctions
            .filter((auction) => {
                const today = new Date().toDateString();
                const auctionDate = new Date(
                    auction.auctionDate
                ).toDateString();

                return auctionDate === today;
            })
            .sort((a, b) => {
                if (a.auctionTime && b.auctionTime) {
                    return a.auctionTime.localeCompare(b.auctionTime);
                }

                if (a.auctionTime && !b.auctionTime) return -1;
                if (!a.auctionTime && b.auctionTime) return 1;

                return 0;
            })
            .slice(0, 4);

        if (todayAuctions.length === 0) {
            return [
                <div key="no-auctions" className="w-full">
                    <CarouselItem>
                        <Card className="flex h-57.5 items-center justify-center p-8">
                            <CardContent>
                                <div className="flex flex-col items-center gap-2">
                                    <Icons.calendar className="text-muted-foreground size-12" />
                                    <div className="flex flex-col items-center">
                                        <Heading
                                            size="h5"
                                            className="text-muted-foreground"
                                        >
                                            No Auctions Today
                                        </Heading>
                                        <Heading
                                            size="p"
                                            className="text-muted-foreground"
                                        >
                                            There are no Auctions Today at the
                                            moment
                                        </Heading>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                </div>,
            ];
        }

        return todayAuctions.map((auction) => (
            <div
                key={auction.id}
                className="group relative w-full flex-shrink-0 basis-full cursor-pointer overflow-hidden rounded-md md:basis-1/2"
            >
                <CarouselItem>
                    <AuctionCard auction={auction} />
                </CarouselItem>
            </div>
        ));
    }, [auctions]);

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
                <Heading size="h4" className="font-semibold">
                    Today&apos;s Auctions
                </Heading>

                <Carousel opts={carouselOptions} plugins={carouselPlugins}>
                    <CarouselContent>{auctionItems}</CarouselContent>
                </Carousel>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Link href={"/auctions/create"}>
                    <Button
                        size={"md"}
                        className={"w-full"}
                        variant={"cricketRed"}
                    >
                        <Icons.gavel /> Create Auction
                    </Button>
                </Link>
                <Link href={"/profile"}>
                    <Button
                        size={"md"}
                        className={"w-full"}
                        variant={"cricketGreen"}
                    >
                        <Icons.hammer className="rotate-270" /> My Auctions
                    </Button>
                </Link>
                <Link href={"/auctions"}>
                    <Button
                        size={"md"}
                        className={"w-full"}
                        variant={"cricketBlue"}
                    >
                        <Icons.cricket /> View Auctions
                    </Button>
                </Link>
                <Link href={"/auctions/join"}>
                    <Button
                        size={"md"}
                        className={"w-full"}
                        variant={"cricketBlue"}
                    >
                        <Icons.people /> Join as Player
                    </Button>
                </Link>
            </div>
        </section>
    );
});

HomePage.displayName = "HomePage";

export default HomePage;
