import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import { useDeletePlayer, useUpdatePlayer } from "@/hooks/usePlayer";
import { Icons } from "@/shared/icons";
import { playerSchema } from "@/validations/(routes)/auctions";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

function Players({ isOwner, auction }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [editingPlayer, setEditingPlayer] = useState(null);
    const { mutate: deletePlayer } = useDeletePlayer(auction.id);
    const { mutate: updatePlayer, isPending: isUpdating } = useUpdatePlayer(
        auction.id
    );
    const [open, setOpen] = useState(false);

    const filteredPlayers = useMemo(() => {
        return auction.players.filter((player) =>
            player.playerName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [auction.players, searchTerm]);

    const playerForm = useForm({
        resolver: zodResolver(playerSchema),
        defaultValues: {
            playerName: "",
        },
    });

    const onSubmit = (data) => {
        if (editingPlayer) {
            updatePlayer(
                { playerId: editingPlayer.id, data },
                {
                    onSuccess: () => {
                        setEditingPlayer(null);
                        playerForm.reset();
                    },
                    onSettled: () => {
                        setOpen(false);
                        playerForm.reset();
                    },
                }
            );
        }
    };

    const handleEditPlayer = (player) => {
        setEditingPlayer(player);
        playerForm.reset({
            playerName: player.playerName,
        });
    };

    return (
        <div className="flex w-full flex-col gap-6">
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Search Players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              {isOwner && (  <Link href={`/player/${auction.id}`}>
                    <Button className={"h-12"} variant={"cricketRed"}>
                        <Icons.plus /> Add Players
                    </Button>
                </Link>)}
            </div>

            {filteredPlayers.length === 0 ? (
                <Heading size="h6" className={"text-muted-foreground mx-auto"}>
                    No players found
                </Heading>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredPlayers.map((player) => (
                        <div
                            key={player.id}
                            className="flex items-center gap-4 rounded-md border p-3"
                        >
                            <div className="flex flex-1 items-center gap-4">
                                <Avatar className="size-14 bg-lime-100 p-2">
                                    <AvatarImage
                                        src={
                                            "https://res.cloudinary.com/harshitjain/image/upload/v1759033653/kfgvxrisso7uai4hursr.png"
                                        }
                                        alt={player.playerName}
                                    />
                                </Avatar>
                                <Heading size="h6" className={"font-semibold"}>
                                    {player.playerName}
                                </Heading>
                            </div>
                            {isOwner && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Icons.moreOptions />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuGroup>
                                            <Dialog
                                                open={open}
                                                onOpenChange={setOpen}
                                            >
                                                <DialogTrigger
                                                    className="w-full px-2 py-2 text-left"
                                                    onClick={() =>
                                                        handleEditPlayer(player)
                                                    }
                                                >
                                                    Edit
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Edit Player
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Make changes to
                                                            player here. Click
                                                            update when you are
                                                            done.
                                                        </DialogDescription>
                                                        <Form {...playerForm}>
                                                            <form
                                                                onSubmit={playerForm.handleSubmit(
                                                                    onSubmit
                                                                )}
                                                                className="flex flex-col gap-6"
                                                            >
                                                                <FormField
                                                                    name="playerName"
                                                                    control={
                                                                        playerForm.control
                                                                    }
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormLabel>
                                                                                Player
                                                                                Name
                                                                            </FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    placeholder="Enter player name"
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
                                                                        playerForm
                                                                            .formState
                                                                            .isSubmitting
                                                                    }
                                                                    disabled={
                                                                        isUpdating ||
                                                                        playerForm
                                                                            .formState
                                                                            .isSubmitting
                                                                    }
                                                                >
                                                                    Update
                                                                    Player
                                                                </Button>
                                                            </form>
                                                        </Form>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </Dialog>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    deletePlayer(player.id)
                                                }
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Players;
