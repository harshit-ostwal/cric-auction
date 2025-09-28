"use client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/headings";
import { Input } from "@/components/ui/input";
import { useGetAuctionById } from "@/hooks/useAuction";
import { useCreatePlayer } from "@/hooks/usePlayer";
import { Icons } from "@/shared/icons";
import { playerSchema } from "@/validations/(routes)/auctions";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

function Page() {
    const params = useParams();
    const { data: auction, isLoading } = useGetAuctionById(params.id);
    const { mutate: createPlayer } = useCreatePlayer();
    const [loading, setLoading] = useState(false);

    const playerForm = useForm({
        resolver: zodResolver(playerSchema),
        defaultValues: {
            playerName: "",
        },
    });

    const router = useRouter();

    const onSubmit = (data) => {
        setLoading(true);

        const playerData = {
            ...data,
            auctionId: auction.id,
            baseValue: auction.minimumBid,
        };

        createPlayer(playerData, {
            onSettled: () => {
                playerForm.reset();
                setLoading(false);
                router.replace(`/auctions/${auction.id}`);
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex w-full items-center justify-center py-20">
                <Icons.loader2 className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="flex max-w-md flex-col gap-4">
                <Link href={"/"}>
                    <Heading
                        size="h4"
                        className="flex items-center gap-2 font-bold"
                    >
                        <Icons.gavel size={32} />
                        CricAuction
                    </Heading>
                </Link>

                {auction && auction?.playerRegistration && (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <Heading size="h5">
                                Welcome! You&apos;ve been invited to participate
                                in a cricket auction
                            </Heading>
                            <div className="flex flex-col gap-1">
                                <Heading size="h4" className={"font-semibold"}>
                                    <Link
                                        href={`/auctions/${auction.id}`}
                                        className="text-blue-500"
                                    >
                                        Join {auction.auctionName}&apos;s
                                        Auction
                                    </Link>
                                </Heading>
                                <Heading
                                    size="h6"
                                    className={"text-muted-foreground"}
                                >
                                    Enter your player name below to join the
                                    auction room.
                                </Heading>
                            </div>
                        </div>
                        <Form {...playerForm}>
                            <form
                                onSubmit={playerForm.handleSubmit(onSubmit)}
                                className="flex flex-col gap-4"
                            >
                                <FormField
                                    name="playerName"
                                    control={playerForm.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Player Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Player Name"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    isLoading={loading}
                                    disabled={loading}
                                    type={"submit"}
                                    variant={"cricketRed"}
                                    className={"w-full"}
                                >
                                    Save
                                </Button>
                            </form>
                        </Form>
                    </div>
                )}

                {!auction ||
                    (!auction?.playerRegistration && (
                        <div className="flex flex-col gap-2">
                            <Heading size="h5" className="font-semibold">
                                Invalid Auction Link
                            </Heading>
                            <Heading
                                size="h6"
                                className="text-muted-foreground"
                            >
                                The auction link you&apos;re trying to access is
                                not valid or has expired
                            </Heading>
                        </div>
                    ))}

                <Link href={"/"} className="mx-auto">
                    <Button variant={"link"} size={"none"}>
                        Go to Home <Icons.arrowNarrowRight />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default Page;
