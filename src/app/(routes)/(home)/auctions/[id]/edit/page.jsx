"use client";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/headings";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAuctionSchema } from "@/validations/(routes)/auctions";
import { Icons } from "@/shared/icons";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns/format";
import { cn } from "@/lib/utils";
import { useUpdateAuction, useGetAuctionById } from "@/hooks/useAuction";
import { useRouter, useParams } from "next/navigation";

function Page() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        if (!params.id) {
            router.push("/");
        }
    }, [params.id, router]);

    const { data: auctionResponse } = useGetAuctionById(params.id);

    const auctionData = auctionResponse?.data;

    const auctionForm = useForm({
        resolver: zodResolver(createAuctionSchema),
        defaultValues: {
            auctionName: "",
            auctionDate: new Date(),
            auctionTime: "",
            teamPoints: undefined,
            minimumBid: undefined,
            bidIncreaseBy: undefined,
            playerPerTeam: undefined,
            venue: undefined,
            status: "UPCOMING",
        },
    });

    useEffect(() => {
        if (auctionData) {
            auctionForm.reset({
                auctionName: auctionData.auctionName || "",
                auctionDate: auctionData.auctionDate
                    ? new Date(auctionData.auctionDate)
                    : new Date(),
                auctionTime: auctionData.auctionTime || "",
                teamPoints: auctionData.teamPoints || undefined,
                minimumBid: auctionData.minimumBid || undefined,
                bidIncreaseBy: auctionData.bidIncreaseBy || undefined,
                playerPerTeam: auctionData.playerPerTeam || undefined,
                venue: auctionData.venue || undefined,
                status: auctionData.status || "UPCOMING",
            });
        }
    }, [auctionData, auctionForm]);

    const { mutate: updateAuction } = useUpdateAuction();

    const onSubmit = (data) => {
        if (!params.id) {
            return;
        }

        setLoading(true);
        updateAuction(
            {
                id: params.id,
                data: data,
            },
            {
                onSuccess: () => {
                    setLoading(false);
                    router.push("/");
                },
                onError: () => {
                    setLoading(false);
                },
                onSettled: () => {
                    setLoading(false);
                },
            }
        );
    };

    if (!params.id) {
        return null;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <Heading size="h4" className="font-bold">
                    Edit Auction
                </Heading>
                <Heading size="h6" className="text-muted-foreground">
                    Update auction settings and configurations
                </Heading>
            </div>

            <Form {...auctionForm}>
                <form
                    onSubmit={auctionForm.handleSubmit(onSubmit)}
                    className="flex flex-col gap-8"
                >
                    <div className="grid items-start gap-6 md:grid-cols-2">
                        <FormField
                            name="auctionName"
                            control={auctionForm.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Auction Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter auction name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="auctionDate"
                            control={auctionForm.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Auction Date</FormLabel>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "h-12",
                                                        !field.value &&
                                                            "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(
                                                            field.value,
                                                            "PPP"
                                                        )
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <Icons.calendar className="text-muted-foreground ml-auto" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto"
                                            align="start"
                                        >
                                            <Calendar
                                                className="bg-transparent p-0 [--cell-size:--spacing(9.5)]"
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(date) => {
                                                    field.onChange(date);
                                                    setOpen(false);
                                                }}
                                                disabled={(date) =>
                                                    date <
                                                    new Date(
                                                        new Date().setHours(
                                                            0,
                                                            0,
                                                            0,
                                                            0
                                                        )
                                                    )
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="auctionTime"
                            control={auctionForm.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Auction Time</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="time"
                                            placeholder="Enter auction time"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="teamPoints"
                            control={auctionForm.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Team Points</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder="Ex: 100000"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="minimumBid"
                            control={auctionForm.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Minimum Bid</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder="Ex: 2000"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="bidIncreaseBy"
                            control={auctionForm.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bid Increase By</FormLabel>
                                    <FormControl>
                                        <Input
                                            type={"tel"}
                                            placeholder={"Ex: 2000"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="playerPerTeam"
                            control={auctionForm.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Players Per Team</FormLabel>
                                    <FormControl>
                                        <Input
                                            type={"tel"}
                                            placeholder={"11"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="venue"
                            control={auctionForm.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Venue</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={
                                                "Chennai, Tamil Nadu, India"
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button
                        isLoading={loading}
                        disabled={!auctionForm.formState.isValid || loading}
                        size={"md"}
                        type={"submit"}
                    >
                        Update Auction <Icons.gavel />
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default Page;
