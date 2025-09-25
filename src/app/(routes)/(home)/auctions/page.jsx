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
import { useStats } from "@/hooks/useStats";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuctions } from "@/hooks/useAuction";
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
        className="group relative w-full flex-shrink-0 basis-full cursor-pointer overflow-hidden rounded-md lg:basis-1/2 xl:basis-1/3"
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
    const { data: stats, isLoading } = useStats();
    const { data: auctions } = useAuctions();

    const auctionStats = useMemo(
        () => [
            {
                borderColor: "border-orange-500",
                title: "Ongoing Auctions",
                description: "Currently ongoing auctions",
                count: stats?.data?.totalOngoingAuctions || 0,
            },
            {
                borderColor: "border-yellow-500",
                title: "Upcoming Auctions",
                description: "Scheduled for future dates",
                count: stats?.data?.totalUpcomingAuctions || 0,
            },
            {
                borderColor: "border-green-500",
                title: "Completed Auctions",
                description: "Finished auctions",
                count: stats?.data?.totalCompletedAuctions || 0,
            },
        ],
        [stats?.data]
    );

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

    const skeletonItems = useMemo(
        () =>
            Array.from({ length: 4 }).map((_, index) => (
                <div
                    key={`skeleton-${index}`}
                    className="group relative w-full flex-shrink-0 basis-full cursor-pointer overflow-hidden rounded-md lg:basis-1/2 xl:basis-1/3"
                >
                    <CarouselItem>
                        <SkeletonCard />
                    </CarouselItem>
                </div>
            )),
        []
    );

    const statItems = useMemo(
        () =>
            auctionStats.map((data, index) => (
                <StatCard key={`stat-${index}`} data={data} index={index} />
            )),
        [auctionStats]
    );

    return (
        <section className="flex flex-col gap-6">
            <Carousel opts={carouselOptions} plugins={carouselPlugins}>
                <CarouselContent>
                    {isLoading ? skeletonItems : statItems}
                </CarouselContent>
            </Carousel>

            <div className="flex flex-col gap-6">
                <Heading size="h4" className="font-semibold">
                    Auctions
                </Heading>

                {auctions ? (
                    auctions.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            {auctions.map((auction) => (
                                <AuctionCard
                                    key={auction.id}
                                    auction={auction}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card className="p-8 text-center">
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center gap-2">
                                    <Icons.calendar className="text-muted-foreground h-12 w-12" />
                                    <Heading
                                        size="h6"
                                        className="text-muted-foreground"
                                    >
                                        No auctions found
                                    </Heading>
                                    <p className="text-muted-foreground text-sm">
                                        There are no auctions available at the
                                        moment
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )
                ) : (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <AuctionSkeletonCard />
                        <AuctionSkeletonCard />
                    </div>
                )}
            </div>
        </section>
    );
});

HomePage.displayName = "HomePage";

export default HomePage;
