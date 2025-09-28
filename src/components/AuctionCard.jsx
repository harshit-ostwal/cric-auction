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
import { Heading } from "@/components/ui/headings";
import { Icons } from "@/shared/icons";
import { format } from "date-fns/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useDeleteAuction } from "@/hooks/useAuction";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useRouter } from "next/navigation";

const AuctionSkeletonCard = memo(() => (
    <Card>
        <CardHeader className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between gap-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-24" />
            </div>

            <div className="flex w-full items-center gap-4">
                <Skeleton className="size-24 rounded-2xl" />
                <div className="flex flex-col space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
        </CardHeader>

        <CardContent className="flex items-center justify-between gap-6">
            <div className="flex flex-col gap-1">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-7 w-20" />
            </div>

            <div className="flex flex-col gap-1">
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-7 w-12" />
            </div>
        </CardContent>
    </Card>
));
AuctionSkeletonCard.displayName = "AuctionSkeletonCard";

const AuctionCard = memo(({ auction, currentUser }) => {
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

    const isOwner = currentUser && auction.userId === currentUser.id;

    const { mutate: deleteAuction } = useDeleteAuction();
    const router = useRouter();

    const handleEdit = (id) => {
        router.replace(`/auctions/${id}/edit`);
    };

    const handleDelete = (id) => {
        deleteAuction(id);
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <Card
                onClick={() => router.replace(`/auctions/${auction.id}`)}
                className={"bg-radial from-white via-white to-amber-50"}
            >
                <CardHeader className="flex flex-col gap-4">
                    <div className="flex w-full items-center justify-between gap-4 font-semibold">
                        <Heading size="p">
                            <Icons.calendar />
                            {auction.auctionDate
                                ? formattedDate
                                : "Date not set"}
                        </Heading>
                        <Heading size="p">
                            <Icons.clock />
                            {auction.auctionTime
                                ? formattedTime
                                : "Time not set"}
                        </Heading>
                    </div>

                    <div className="flex w-fit cursor-pointer items-center gap-4">
                        <Avatar
                            className={
                                "size-16 rounded-2xl object-cover lg:size-24"
                            }
                        >
                            {auction.auctionLogo ? (
                                <AvatarImage
                                    src={auction.auctionLogo}
                                    alt={auction.auctionName}
                                />
                            ) : (
                                <AvatarFallback
                                    className={"rounded-2xl object-cover"}
                                >
                                    {getAuctionInitials(auction.auctionName)}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="flex flex-col">
                            <CardTitle>
                                <Heading
                                    size="h5"
                                    className="line-clamp-1 font-semibold text-ellipsis"
                                >
                                    {auction.auctionName}
                                </Heading>
                            </CardTitle>
                            <CardDescription
                                className={
                                    "text-foreground flex flex-col gap-1"
                                }
                            >
                                <Heading
                                    size="p"
                                    className="text-muted-foreground line-clamp-1 font-semibold text-ellipsis"
                                >
                                    {auction.venue || "Venue not set"}
                                </Heading>
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent
                    className={"flex items-center justify-between gap-6"}
                >
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
                            Total Players (Per Team)
                        </Heading>
                        <Heading size="p" className="font-semibold">
                            <Icons.target className="text-purple-600" />
                            {auction.playerPerTeam || 0}
                        </Heading>
                    </div>
                </CardContent>
            </Card>
            {isOwner && (
                <div className="flex w-full gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="flex-1">
                                <Icons.edit />
                                Edit
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you sure you want to edit this auction?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action will allow you to edit the
                                    auction details.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleEdit(auction.id)}
                                >
                                    Edit Auction
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="flex-1">
                                <Icons.delete />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you sure you want to delete this
                                    auction?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the auction and all
                                    associated data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleDelete(auction.id)}
                                >
                                    Delete Auction
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}
        </div>
    );
});
AuctionCard.displayName = "AuctionCard";

export { AuctionCard, AuctionSkeletonCard };
