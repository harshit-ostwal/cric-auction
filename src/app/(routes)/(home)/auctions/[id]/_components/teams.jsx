import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCreateTeam, useDeleteTeam, useUpdateTeam } from "@/hooks/useTeam";
import { Icons } from "@/shared/icons";
import { teamSchema } from "@/validations/(routes)/auctions";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const formatCurrency = (value) => {
    if (!value || value === 0) return "0";

    if (value >= 10000000) {
        return `${(value / 10000000).toFixed(1).replace(".0", "")}Cr`;
    } else if (value >= 100000) {
        return `${(value / 100000).toFixed(1).replace(".0", "")}L`;
    } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1).replace(".0", "")}K`;
    }
    return value.toString();
};

function Teams({ isOwner, auction }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [editingTeam, setEditingTeam] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const teamForm = useForm({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            teamName: "",
        },
    });

    const editTeamForm = useForm({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            teamName: "",
            teamPoints: 0,
            teamMaxBid: 0,
            teamNumberOfPlayers: 0,
        },
    });

    const filteredTeams = useMemo(() => {
        return auction.teams.filter((team) =>
            team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [auction.teams, searchTerm]);

    const topMVPPlayers = useMemo(() => {
        const allPlayers = auction.teams.flatMap((team) => team.players || []);
        const soldPlayers = allPlayers.filter(
            (player) => player.soldValue && player.soldValue > 0
        );
        const sortedByPrice = soldPlayers.sort(
            (a, b) => b.soldValue - a.soldValue
        );
        return sortedByPrice.slice(0, 3).map((player) => player.id);
    }, [auction.teams]);

    const { mutate: createTeam } = useCreateTeam();
    const { mutate: deleteTeam } = useDeleteTeam(auction.id);
    const { mutate: updateTeam, isPending: isUpdating } = useUpdateTeam(
        auction.id
    );

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
        };
        createTeam(teamData, {
            onSettled: () => {
                teamForm.reset();
                setOpen(false);
                setLoading(false);
            },
        });
    };

    const onEditSubmit = (data) => {
        if (editingTeam) {
            updateTeam(
                { teamId: editingTeam.id, data },
                {
                    onSuccess: () => {
                        setEditingTeam(null);
                        editTeamForm.reset();
                    },
                    onSettled: () => {
                        setEditOpen(false);
                        editTeamForm.reset();
                    },
                }
            );
        }
    };

    const handleEditTeam = (team) => {
        setEditingTeam(team);
        editTeamForm.reset({
            teamName: team.teamName,
            teamPoints: team.teamPoints,
            teamMaxBid: team.teamMaxBid,
            teamNumberOfPlayers: team.teamNumberOfPlayers,
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Search Players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        {isOwner && (
                            <Button
                                isLoading={
                                    loading || teamForm.formState.isSubmitting
                                }
                                disabled={
                                    !isOwner || teamForm.formState.isSubmitting
                                }
                                className={"ml-auto h-12"}
                                variant={"cricketBlue"}
                            >
                                <Icons.plus /> Create Teams
                            </Button>
                        )}
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Add a New Team to {auction.auctionName}
                            </DialogTitle>
                            <DialogDescription>
                                Fill in the team details below and submit to add
                                the team to the auction.
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
                                        loading ||
                                        teamForm.formState.isSubmitting
                                    }
                                    disabled={
                                        loading ||
                                        teamForm.formState.isSubmitting
                                    }
                                >
                                    Add Team
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            {filteredTeams.length === 0 ? (
                <Heading size="h6" className={"text-muted-foreground mx-auto"}>
                    No Teams found
                </Heading>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredTeams.length > 0 &&
                        filteredTeams.map((team) => (
                            <Drawer key={team.id}>
                                <DrawerTrigger asChild>
                                    <div className="flex flex-col overflow-hidden rounded-md border">
                                        <Avatar
                                            rounded={false}
                                            className="h-60 w-full"
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
                                            <Heading
                                                size="h5"
                                                className={"font-semibold"}
                                            >
                                                {team.teamName}
                                            </Heading>
                                            {isOwner && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <Icons.moreOptions />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuGroup>
                                                            <Dialog
                                                                open={editOpen}
                                                                onOpenChange={
                                                                    setEditOpen
                                                                }
                                                            >
                                                                <DialogTrigger
                                                                    className="w-full px-2 py-2 text-left"
                                                                    onClick={() =>
                                                                        handleEditTeam(
                                                                            team
                                                                        )
                                                                    }
                                                                >
                                                                    Edit
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>
                                                                            Edit
                                                                            Team
                                                                        </DialogTitle>
                                                                        <DialogDescription>
                                                                            Make
                                                                            changes
                                                                            to
                                                                            team
                                                                            here.
                                                                            Click
                                                                            update
                                                                            when
                                                                            you
                                                                            are
                                                                            done.
                                                                        </DialogDescription>
                                                                        <Form
                                                                            {...editTeamForm}
                                                                        >
                                                                            <form
                                                                                onSubmit={editTeamForm.handleSubmit(
                                                                                    onEditSubmit
                                                                                )}
                                                                                className="flex flex-col gap-6"
                                                                            >
                                                                                <FormField
                                                                                    name="teamName"
                                                                                    control={
                                                                                        editTeamForm.control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <FormItem>
                                                                                            <FormLabel>
                                                                                                Team
                                                                                                Name
                                                                                            </FormLabel>
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

                                                                                <FormField
                                                                                    name="teamPoints"
                                                                                    control={
                                                                                        editTeamForm.control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <FormItem>
                                                                                            <FormLabel>
                                                                                                Team
                                                                                                Points
                                                                                            </FormLabel>
                                                                                            <FormControl>
                                                                                                <Input
                                                                                                    type="number"
                                                                                                    placeholder="Enter team points"
                                                                                                    {...field}
                                                                                                />
                                                                                            </FormControl>
                                                                                            <FormMessage />
                                                                                        </FormItem>
                                                                                    )}
                                                                                />

                                                                                <FormField
                                                                                    name="teamMaxBid"
                                                                                    control={
                                                                                        editTeamForm.control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <FormItem>
                                                                                            <FormLabel>
                                                                                                Max
                                                                                                Bid
                                                                                            </FormLabel>
                                                                                            <FormControl>
                                                                                                <Input
                                                                                                    type="number"
                                                                                                    placeholder="Enter max bid"
                                                                                                    {...field}
                                                                                                />
                                                                                            </FormControl>
                                                                                            <FormMessage />
                                                                                        </FormItem>
                                                                                    )}
                                                                                />

                                                                                <FormField
                                                                                    name="teamNumberOfPlayers"
                                                                                    control={
                                                                                        editTeamForm.control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <FormItem>
                                                                                            <FormLabel>
                                                                                                Number
                                                                                                of
                                                                                                Players
                                                                                            </FormLabel>
                                                                                            <FormControl>
                                                                                                <Input
                                                                                                    type="number"
                                                                                                    placeholder="Enter number of players"
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
                                                                                        isUpdating ||
                                                                                        editTeamForm
                                                                                            .formState
                                                                                            .isSubmitting
                                                                                    }
                                                                                    disabled={
                                                                                        isUpdating ||
                                                                                        editTeamForm
                                                                                            .formState
                                                                                            .isSubmitting
                                                                                    }
                                                                                >
                                                                                    Update
                                                                                    Team
                                                                                </Button>
                                                                            </form>
                                                                        </Form>
                                                                    </DialogHeader>
                                                                </DialogContent>
                                                            </Dialog>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    deleteTeam(
                                                                        team.id
                                                                    )
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
                                </DrawerTrigger>
                                <DrawerContent>
                                    <div className="mx-auto flex h-full w-full max-w-2xl flex-col gap-6 overflow-y-auto p-4 pb-10">
                                        <div className="flex flex-col gap-1">
                                            <DrawerTitle
                                                className={
                                                    "text-muted-foreground font-normal"
                                                }
                                            >
                                                Team Details
                                            </DrawerTitle>
                                            <Heading
                                                size="h4"
                                                className={"font-semibold"}
                                            >
                                                {team.teamName}
                                            </Heading>
                                        </div>
                                        <div className="grid w-full grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <Heading
                                                    size="p"
                                                    className="text-muted-foreground"
                                                >
                                                    Points
                                                </Heading>
                                                <Heading
                                                    size="h6"
                                                    className="font-semibold"
                                                >
                                                    {team?.teamPoints}
                                                </Heading>
                                            </div>

                                            <div className="flex flex-col">
                                                <Heading
                                                    size="p"
                                                    className="text-muted-foreground"
                                                >
                                                    Used Points
                                                </Heading>
                                                <Heading
                                                    size="h6"
                                                    className="font-semibold"
                                                >
                                                    {team?.teamUsedPoints ?? 0}
                                                </Heading>
                                            </div>

                                            <div className="flex flex-col">
                                                <Heading
                                                    size="p"
                                                    className="text-muted-foreground"
                                                >
                                                    Max Bid
                                                </Heading>
                                                <Heading
                                                    size="h6"
                                                    className="font-semibold"
                                                >
                                                    {team?.teamMaxBid}
                                                </Heading>
                                            </div>

                                            <div className="flex flex-col">
                                                <Heading
                                                    size="p"
                                                    className="text-muted-foreground"
                                                >
                                                    Players
                                                </Heading>
                                                <Heading
                                                    size="h6"
                                                    className="font-semibold"
                                                >
                                                    {team?.teamNumberOfPlayers}
                                                </Heading>
                                            </div>
                                        </div>

                                        <ScrollArea>
                                            <div className="grid grid-cols-1 gap-4 pt-10">
                                                {team.players &&
                                                team.players.length > 0 ? (
                                                    team.players.map(
                                                        (player, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex flex-col gap-4"
                                                            >
                                                                <div className="relative flex flex-1 items-center gap-4">
                                                                    <Heading size="h6">
                                                                        {idx +
                                                                            1}
                                                                        .
                                                                    </Heading>
                                                                    <Heading
                                                                        size="h6"
                                                                        className={
                                                                            "flex-1 font-medium"
                                                                        }
                                                                    >
                                                                        {player.playerName ??
                                                                            "Unknown Player"}
                                                                    </Heading>
                                                                    <div className="flex gap-4">
                                                                        {topMVPPlayers.includes(
                                                                            player.id
                                                                        ) && (
                                                                            <Badge variant="success">
                                                                                MVP
                                                                            </Badge>
                                                                        )}
                                                                        <Heading
                                                                            size="h6"
                                                                            className={
                                                                                "font-semibold"
                                                                            }
                                                                        >
                                                                            <Icons.coins color="gold" />
                                                                            {formatCurrency(
                                                                                player.soldValue
                                                                            )}
                                                                        </Heading>
                                                                    </div>
                                                                </div>
                                                                <Separator />
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <div className="col-span-full flex flex-col items-center justify-center gap-2 py-8">
                                                        <Icons.userGroup className="text-muted-foreground size-14" />
                                                        <div className="flex flex-col items-center">
                                                            <Heading
                                                                size="h6"
                                                                className={
                                                                    "text-muted-foreground"
                                                                }
                                                            >
                                                                No Players found
                                                            </Heading>
                                                            <Heading
                                                                className="text-muted-foreground"
                                                                size="p"
                                                            >
                                                                Players added to
                                                                this team will
                                                                appear here.
                                                            </Heading>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        ))}
                </div>
            )}
        </div>
    );
}

export default Teams;
