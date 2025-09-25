"use client";
import React, { memo } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/headings";
import { Icons } from "@/shared/icons";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";

const AUCTION_STATUS_CONFIG = {
    ONGOING: {
        cardStyle: "border-green-200 bg-green-50",
        badgeVariant: "success",
        avatarStyle: "bg-green-300 text-green-600",
    },
    COMPLETED: {
        cardStyle: "border-blue-200 bg-blue-50",
        badgeVariant: "info",
        avatarStyle: "bg-blue-300 text-blue-600",
    },
    UPCOMING: {
        cardStyle: "border-yellow-200 bg-yellow-50",
        badgeVariant: "warning",
        avatarStyle: "bg-yellow-300 text-yellow-600",
    },
    default: {
        cardStyle: "border-gray-200 bg-gray-50",
        badgeVariant: "default",
        avatarStyle: "bg-gray-300 text-gray-600",
    },
};

const AuctionSkeletonCard = memo(() => (
    <Card>
        <CardHeader className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-20" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 text-center">
                    <Skeleton className="mx-auto h-4 w-16" />
                    <Skeleton className="mx-auto h-5 w-12" />
                </div>
                <div className="space-y-2 text-center">
                    <Skeleton className="mx-auto h-4 w-16" />
                    <Skeleton className="mx-auto h-5 w-12" />
                </div>
                <div className="space-y-2 text-center">
                    <Skeleton className="mx-auto h-4 w-20" />
                    <Skeleton className="mx-auto h-5 w-8" />
                </div>
            </div>
        </CardContent>
    </Card>
));
AuctionSkeletonCard.displayName = "AuctionSkeletonCard";

const AuctionCard = memo(({ auction }) => {
    const statusConfig =
        AUCTION_STATUS_CONFIG[auction.status] || AUCTION_STATUS_CONFIG.default;

    const formatAuctionDateTime = (date, time) => {
        try {
            const formattedDate = format(new Date(date), "PPP");

            if (time && time.includes(":")) {
                const [hours, minutes] = time.split(":");
                const timeDate = new Date();
                timeDate.setHours(
                    parseInt(hours, 10),
                    parseInt(minutes, 10),
                    0,
                    0
                );
                const formattedTime = format(timeDate, "h:mm a");
                return { formattedDate, formattedTime };
            }

            return {
                formattedDate,
                formattedTime: "Time not set",
            };
        } catch {
            return {
                formattedDate: "Invalid Date",
                formattedTime: "Invalid Time",
            };
        }
    };

    const { formattedDate, formattedTime } = formatAuctionDateTime(
        auction.auctionDate,
        auction.auctionTime
    );

    const getAuctionInitials = (name) => {
        return (
            name
                ?.split(" ")
                .slice(0, 2)
                .map((word) => word.charAt(0))
                .join("")
                .toUpperCase() || "A"
        );
    };

    return (
        <Card className={cn(statusConfig.cardStyle)}>
            <CardHeader className="flex flex-col gap-4">
                <div className="flex w-full items-center justify-between">
                    <Avatar className={"size:16 lg:size-16"}>
                        {auction.auctionLogo ? (
                            <AvatarImage
                                src={auction.auctionLogo}
                                alt={auction.auctionName}
                            />
                        ) : (
                            <AvatarFallback
                                className={statusConfig.avatarStyle}
                            >
                                {getAuctionInitials(auction.auctionName)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <Badge
                        variant={statusConfig.badgeVariant}
                        className="font-medium"
                    >
                        {auction.status || "UPCOMING"}
                    </Badge>
                </div>

                <div className="space-y-2">
                    <CardTitle>
                        <Heading size="h5" className="font-semibold">
                            {auction.auctionName}
                        </Heading>
                    </CardTitle>
                    <CardDescription
                        className={"text-foreground flex flex-col gap-1"}
                    >
                        <Heading size="p">
                            <Icons.calendar />{" "}
                            {auction.auctionDate
                                ? formattedDate
                                : "Date not set"}
                        </Heading>
                        <Heading size="p">
                            <Icons.clock />{" "}
                            {auction.auctionTime
                                ? formattedTime
                                : "Time not set"}
                        </Heading>
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className={"flex flex-col gap-6"}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <Heading size="p" className="text-muted-foreground">
                            Team Points (Per Team)
                        </Heading>
                        <Heading size="p" className="font-semibold">
                            <Icons.targetArrow className="text-red-600" />
                            {auction.teamPoints?.toLocaleString() || 0}
                        </Heading>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Heading size="p" className="text-muted-foreground">
                            Min Bid (Per Player)
                        </Heading>
                        <Heading size="p" className="font-semibold">
                            <Icons.target className="text-blue-600" />
                            {auction.minimumBid?.toLocaleString() || 0}
                        </Heading>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Heading size="p" className="text-muted-foreground">
                            Total Players (Per Team)
                        </Heading>
                        <Heading size="p" className="font-semibold">
                            <Icons.target className="text-purple-600" />
                            {auction.playerPerTeam || 0}
                        </Heading>
                    </div>
                </div>

                <Button>View Auction</Button>
            </CardContent>
        </Card>
    );
});
AuctionCard.displayName = "AuctionCard";

export { AuctionCard, AuctionSkeletonCard };
