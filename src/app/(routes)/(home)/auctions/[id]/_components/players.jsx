import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heading } from "@/components/ui/headings";
import { Input } from "@/components/ui/input";
import { Icons } from "@/shared/icons";
import React, { useState } from "react";

function Players({ isOwner, auction }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPlayers = auction.players.filter((player) =>
        player.playerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex w-full flex-col gap-6">
            <Input
                placeholder="Search Players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

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
                                            <DropdownMenuItem>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
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
