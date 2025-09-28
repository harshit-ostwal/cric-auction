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
import React, { useState } from "react";
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
import { useCreateAuction } from "@/hooks/useAuction";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Page() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const auctionForm = useForm({
        resolver: zodResolver(createAuctionSchema),
        defaultValues: {
            auctionLogo: "",
            auctionName: "",
            auctionDate: new Date(),
            auctionTime: "",
            teamPoints: undefined,
            minimumBid: undefined,
            bidIncreaseBy: undefined,
            playerPerTeam: undefined,
            venue: undefined,
        },
    });
    const router = useRouter();

    const { mutate: createAuction } = useCreateAuction();

    const onSubmit = (data) => {
        setLoading(true);
        createAuction(data, {
            onSuccess: () => {
                setLoading(false);
                router.replace("/");
            },
            onError: () => {
                setLoading(false);
            },
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <Heading size="h4" className="font-bold">
                    Create New Auction
                </Heading>
                <Heading size="h6" className="text-muted-foreground">
                    Set up a new cricket auction with teams, players, and
                    bidding rules
                </Heading>
            </div>

            <Form {...auctionForm}>
                <form
                    onSubmit={auctionForm.handleSubmit(onSubmit)}
                    className="flex flex-col gap-8"
                >
                    <CldUploadWidget
                        uploadPreset="cric-auction"
                        options={{
                            maxFiles: 1,
                            multiple: false,
                            resourceType: "image",
                            clientAllowedFormats: [
                                "jpg",
                                "jpeg",
                                "png",
                                "gif",
                                "webp",
                            ],
                            maxImageFileSize: 5000000,
                            folder: "Cric Auction",
                        }}
                        onSuccess={(result, { widget }) => {
                            auctionForm.setValue(
                                "auctionLogo",
                                result.info.secure_url
                            );
                            auctionForm.setValue(
                                "auctionLogoPublicId",
                                result.info.public_id
                            );
                            auctionForm.trigger("auctionLogo");
                            widget.close();
                        }}
                    >
                        {({ open }) => {
                            return (
                                <div
                                    className="group relative w-fit cursor-pointer"
                                    onClick={open}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === " "
                                        ) {
                                            open();
                                        }
                                    }}
                                >
                                    <Avatar className={"size-32 lg:size-32"}>
                                        <AvatarImage
                                            src={
                                                auctionForm.watch(
                                                    "auctionLogo"
                                                ) ?? ""
                                            }
                                            alt="Auction Logo"
                                        />
                                        <AvatarFallback
                                            className={"bg-muted-foreground"}
                                        >
                                            <Icons.camera className="h-6 w-6 text-white" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Icons.camera className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            );
                        }}
                    </CldUploadWidget>

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
                        Create New Auction <Icons.gavel />
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default Page;
