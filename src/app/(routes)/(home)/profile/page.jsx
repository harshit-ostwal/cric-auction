"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/headings";
import { Icons } from "@/shared/icons";
import React, { memo, useState } from "react";
import { CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyAuctions } from "@/hooks/useAuction";
import { AuctionCard, AuctionSkeletonCard } from "@/components/AuctionCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
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
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import { useUpdateUser } from "@/hooks/useUser";
import { useDeleteImage } from "@/hooks/useCloudinary";

const UserAvatar = memo(function UserAvatar({ session }) {
    const { mutate: updateUser } = useUpdateUser();
    const { mutate: deleteImage } = useDeleteImage();

    const handleUploadSuccess = async (result, { widget }) => {
        if (result?.info?.secure_url) {
            const newImageUrl = result.info.secure_url;
            const newPublicId = result.info.public_id;

            if (session?.user?.imagePublicId) {
                deleteImage(session.user.imagePublicId);
            }

            updateUser({
                id: session.user.id,
                data: {
                    image: newImageUrl,
                    imagePublicId: newPublicId,
                },
            });

            widget.close();
        }
    };

    return (
        <CldUploadWidget
            uploadPreset="cric-auction"
            options={{
                maxFiles: 1,
                multiple: false,
                resourceType: "image",
                clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
                maxImageFileSize: 5000000,
                folder: "Cric Auction",
            }}
            onSuccess={handleUploadSuccess}
        >
            {({ open }) => {
                return (
                    <div
                        className="group relative cursor-pointer"
                        onClick={open}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                open();
                            }
                        }}
                    >
                        <Avatar className="size-20 transition-opacity group-hover:opacity-80 lg:size-24">
                            {session?.user?.image ? (
                                <AvatarImage
                                    src={session.user.image}
                                    alt={session.user.name ?? "User avatar"}
                                />
                            ) : (
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    {session?.user?.name
                                        ?.charAt(0)
                                        .toUpperCase() ?? "HJ"}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                            <Icons.camera className="h-6 w-6 text-white" />
                        </div>
                    </div>
                );
            }}
        </CldUploadWidget>
    );
});

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

const Profile = memo(() => {
    const { data: auctions } = useGetMyAuctions();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);

    return (
        <section className="flex flex-col gap-12">
            <Card>
                <CardContent
                    className={
                        "flex flex-col items-center justify-between gap-6 md:flex-row"
                    }
                >
                    <div className="flex flex-col items-center gap-4 md:flex-row">
                        {status === "loading" ? (
                            <Skeleton className="size-20 rounded-full lg:size-24" />
                        ) : session ? (
                            <UserAvatar session={session} />
                        ) : (
                            <Skeleton className="size-20 rounded-full lg:size-24" />
                        )}

                        <div className="flex flex-col items-center gap-1 md:items-start">
                            {status === "loading" ? (
                                <>
                                    <Skeleton className="h-7 w-48" />
                                    <Skeleton className="h-5 w-40" />
                                </>
                            ) : (
                                <>
                                    <Heading
                                        size="h4"
                                        className="leading-none font-bold"
                                    >
                                        {session?.user?.name}!
                                    </Heading>
                                    <Heading
                                        size="h6"
                                        className="text-muted-foreground"
                                    >
                                        {session?.user?.email}
                                    </Heading>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full gap-2 md:w-fit">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    disabled={loading}
                                    isLoading={loading}
                                    variant="outline"
                                    className={"w-46 flex-1"}
                                >
                                    Logout
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you sure you want to log out?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You&apos;ll be signed out of your
                                        account. You can log back in anytime to
                                        access your data.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                setLoading(true);
                                                signOut();
                                            }}
                                            disabled={loading}
                                            isLoading={loading}
                                        >
                                            Logout
                                        </Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className={"flex-1"}
                                >
                                    Delete Account
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete your account and
                                        remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction>
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-4">
                    <Heading size="h4" className="font-semibold">
                        My Auctions
                    </Heading>
                    <Link href={"/auctions/create"}>
                        <Button variant={"cricketBlue"}>
                            <Icons.gavel /> Create Auction
                        </Button>
                    </Link>
                </div>
                {auctions ? (
                    auctions.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            {auctions.map((auction) => (
                                <AuctionCard
                                    key={auction.id}
                                    auction={auction}
                                    currentUser={session?.user}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card className="p-8 text-center">
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center gap-2">
                                    <Icons.calendar className="text-muted-foreground h-12 w-12" />
                                    <div className="flex flex-col items-center">
                                        <Heading
                                            size="h6"
                                            className="text-muted-foreground"
                                        >
                                            No Auctions Found
                                        </Heading>
                                        <Heading
                                            size="p"
                                            className="text-muted-foreground"
                                        >
                                            There are no auctions at the moment
                                        </Heading>
                                    </div>
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

Profile.displayName = "Profile";

export default Profile;
