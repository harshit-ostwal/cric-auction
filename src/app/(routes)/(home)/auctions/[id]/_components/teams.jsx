import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useCreateTeam, useDeleteTeam } from "@/hooks/useTeam";
import { Icons } from "@/shared/icons";
import { teamSchema } from "@/validations/(routes)/auctions";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

function Teams({ isOwner, auction }) {
    const teamForm = useForm({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            teamName: "",
        },
    });

    const { mutate: createTeam } = useCreateTeam();
    const { mutate: deleteTeam } = useDeleteTeam(auction.id);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onSubmit = (data) => {
        setLoading(true);
        const maxBid =
            auction.teamPoints -
            auction.minimumBid * (auction.playerPerTeam - 1);

        const teamData = {
            auctionId: auction.id,
            teamName: data.teamName,
            teamPoints: auction.teamPoints,
            teamMaxBid: maxBid,
            teamNumberOfPlayers: auction.playerPerTeam,
        };
        createTeam(teamData, {
            onSettled: () => {
                teamForm.reset();
                setOpen(false);
                setLoading(false);
            },
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        isLoading={loading || teamForm.formState.isSubmitting}
                        disabled={!isOwner || teamForm.formState.isSubmitting}
                        className={"ml-auto"}
                        variant={"cricketBlue"}
                    >
                        <Icons.plus /> Add Team
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Add a New Team to {auction.auctionName}
                        </DialogTitle>
                        <DialogDescription>
                            Fill in the team details below and submit to add the
                            team to the auction.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...teamForm}>
                        <form
                            onSubmit={teamForm.handleSubmit(onSubmit)}
                            className="flex flex-col gap-6"
                        >
                            <FormField
                                name="teamName"
                                control={teamForm.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Team Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter team name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                isLoading={
                                    loading || teamForm.formState.isSubmitting
                                }
                                disabled={
                                    loading || teamForm.formState.isSubmitting
                                }
                            >
                                Add Team
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {auction.teams &&
                    auction.teams.length > 0 &&
                    auction.teams.map((team) => (
                        <div
                            className="flex flex-col overflow-hidden rounded-md border"
                            key={team.id}
                        >
                            <Avatar
                                rounded={false}
                                className="h-40 w-full lg:h-60"
                            >
                                <AvatarImage
                                    src={
                                        team.teamLogo ??
                                        "https://res.cloudinary.com/harshitjain/image/upload/v1758842491/evqlhcs8svxch3iygray.webp"
                                    }
                                    alt={team.teamLogoPublicId}
                                />
                            </Avatar>
                            <div className="flex items-center justify-between p-4">
                                <Heading size="h6" className={"font-semibold"}>
                                    {team.teamName}
                                </Heading>
                                {isOwner && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <Icons.moreOptions />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        deleteTeam(team.id)
                                                    }
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>
                    ))}
            </div>

            {auction.teams && auction.teams.length === 0 && (
                <Card>
                    <CardContent className={"flex flex-col items-center gap-2"}>
                        <Heading size="h5" className={"font-medium"}>
                            No teams added yet
                        </Heading>
                        <Heading size="h6" className={"text-center"}>
                            Click on the &quot;Add Team&quot; button to add your
                            first team to this auction.
                        </Heading>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default Teams;
