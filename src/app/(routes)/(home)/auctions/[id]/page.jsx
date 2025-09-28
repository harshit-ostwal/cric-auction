"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/headings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAuctionById } from "@/hooks/useAuction";
import { Icons } from "@/shared/icons";
import { format } from "date-fns/format";
import { useParams } from "next/navigation";
import React from "react";
import Teams from "./_components/teams";
import About from "./_components/about";
import Players from "./_components/players";
import { useSession } from "next-auth/react";

function Page() {
    const { id } = useParams();
    const { data: session } = useSession();

    const { data: auctionResponse } = useGetAuctionById(id);

    const auction = auctionResponse?.data || auctionResponse;

    const formatAuctionDateTime = (date, time) => {
        try {
            const formattedDate = format(new Date(date), "dd-MM-yyyy");

            if (time && time.includes(":")) {
                const [hours, minutes] = time.split(":");
                const timeDate = new Date();
                timeDate.setHours(
                    parseInt(hours, 10),
                    parseInt(minutes, 10),
                    0,
                    0
                );
                const formattedTime = format(timeDate, "hh:mm a").toUpperCase();
                return { formattedDate, formattedTime };
            }

            return {
                formattedDate,
                formattedTime: "TIME NOT SET",
            };
        } catch {
            return {
                formattedDate: "INVALID DATE",
                formattedTime: "INVALID TIME",
            };
        }
    };

    const isOwner = session?.user && auction?.userId === session?.user?.id;

    return (
        <div className="flex flex-col gap-6">
            {auction && (
                <>
                    <Card className="flex border-none bg-amber-50">
                        <CardContent className={"flex items-center gap-4"}>
                            <Avatar className="border-primary size-24 border-4 lg:size-32">
                                <AvatarImage
                                    src={
                                        auction.auctionImage ??
                                        "https://res.cloudinary.com/harshitjain/image/upload/v1758842491/evqlhcs8svxch3iygray.webp"
                                    }
                                    alt={auction.auctionImagePublicId}
                                />
                            </Avatar>
                            <div className="flex flex-col gap-1">
                                <Heading size={"h5"} className="font-bold">
                                    {auction.auctionName}
                                </Heading>

                                <div className="flex flex-col">
                                    <Heading
                                        size="p"
                                        className="flex items-center gap-2 font-medium"
                                    >
                                        <Icons.calendar />
                                        {auction.auctionDate &&
                                        auction.auctionTime
                                            ? `${
                                                  formatAuctionDateTime(
                                                      auction.auctionDate,
                                                      auction.auctionTime
                                                  ).formattedDate
                                              } , ${
                                                  formatAuctionDateTime(
                                                      auction.auctionDate,
                                                      auction.auctionTime
                                                  ).formattedTime
                                              }`
                                            : "Date and time not set"}
                                    </Heading>

                                    <Heading
                                        size="p"
                                        className="flex items-center gap-2 font-medium"
                                    >
                                        <Icons.userGroup />
                                        {auction.playerPerTeam} Players/Team
                                    </Heading>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs
                        defaultValue="teams"
                        className="flex w-full flex-col gap-6"
                    >
                        <TabsList>
                            <TabsTrigger value="teams">Teams</TabsTrigger>
                            <TabsTrigger value="players">Players</TabsTrigger>
                            <TabsTrigger value="mvp">MVP</TabsTrigger>
                            <TabsTrigger value="about">About</TabsTrigger>
                        </TabsList>
                        <TabsContent value="teams">
                            <Teams isOwner={isOwner} auction={auction} />
                        </TabsContent>
                        <TabsContent value="players">
                            <Players isOwner={isOwner} auction={auction} />
                        </TabsContent>
                        <TabsContent value="mvp">MVP</TabsContent>
                        <TabsContent value="about">
                            <About isOwner={isOwner} auction={auction} />
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </div>
    );
}

export default Page;
