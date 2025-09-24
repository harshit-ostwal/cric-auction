"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Heading } from "@/components/ui/headings";
import { Icons } from "@/shared/icons";
import React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { useStats } from "@/hooks/useStats";

export default function HomePage() {
    const { data: stats } = useStats();

    const auctionStats = [
        {
            borderColor: "border-blue-500",
            title: "Total Auctions",
            description: "All auctions in the system",
            count: stats?.data?.auctionStats || 0,
        },
        {
            borderColor: "border-orange-500",
            title: "Active Auctions",
            description: "Currently active auctions",
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
    ];

    return (
        <section className="flex flex-col gap-6">
            <Carousel
                opts={{ align: "start", duration: 60, dragFree: true }}
                plugins={[
                    Autoplay({
                        delay: 3000,
                        stopOnInteraction: false,
                        stopOnMouseEnter: false,
                        stopOnLastSnap: false,
                        stopOnFocusIn: false,
                    }),
                ]}
            >
                <CarouselContent>
                    {auctionStats.map((data, index) => (
                        <div
                            key={index}
                            className="group relative w-full flex-shrink-0 basis-full cursor-pointer overflow-hidden rounded-md md:basis-1/2 xl:basis-1/4"
                        >
                            <CarouselItem key={index}>
                                <Card
                                    className={cn(
                                        data.borderColor,
                                        "w-auto border-t-4"
                                    )}
                                >
                                    <CardHeader>
                                        <CardTitle>
                                            <Heading
                                                size="h6"
                                                className="font-semibold"
                                            >
                                                {data.title}
                                            </Heading>
                                        </CardTitle>
                                        <CardDescription>
                                            <Heading
                                                size="p"
                                                className="font-medium"
                                            >
                                                {data.description}
                                            </Heading>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Heading
                                            size="h3"
                                            className={"font-bold"}
                                        >
                                            {data.count ? data.count : 0}
                                        </Heading>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        </div>
                    ))}
                </CarouselContent>
            </Carousel>

            <Dialog>
                <DialogTrigger asChild>
                    <Button size={"md"} className={"ml-auto w-fit"}>
                        Create New Auction <Icons.plus />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Auction</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to create a new auction
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </section>
    );
}
