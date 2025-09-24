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
import { auctionStats } from "@/constants";
import { cn } from "@/lib/utils";

function page() {
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
                                            {data.count}
                                        </Heading>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        </div>
                    ))}
                </CarouselContent>
            </Carousel>

            <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-4"></div>

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

export default page;
