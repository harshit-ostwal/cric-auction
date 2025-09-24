"use client";
import React, { memo } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Heading } from "./ui/headings";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { signOut, useSession } from "next-auth/react";

const UserAvatar = memo(function UserAvatar({ session }) {
    return (
        <Avatar>
            {session?.user?.image ? (
                <AvatarImage
                    src={session.user.image}
                    alt={session.user.name ?? "User avatar"}
                />
            ) : (
                <AvatarFallback className="bg-primary text-primary-foreground">
                    {session?.user?.name?.charAt(0).toUpperCase() ?? "HJ"}
                </AvatarFallback>
            )}
        </Avatar>
    );
});

function Navbar() {
    const { data: session, status } = useSession();

    return (
        <nav className="flex items-center justify-between gap-8">
            <Heading size="h4" className="font-bold">
                CricAuction
            </Heading>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    {status === "loading" ? (
                        <Skeleton className="h-10 w-10 rounded-full lg:h-12 lg:w-12" />
                    ) : session ? (
                        <UserAvatar session={session} />
                    ) : (
                        <Skeleton className="h-10 w-10 rounded-full lg:h-12 lg:w-12" />
                    )}
                </DropdownMenuTrigger>

                {session && (
                    <DropdownMenuContent
                        align="end"
                        className="flex w-64 flex-col gap-2 p-4"
                    >
                        <div className="flex flex-col">
                            <Heading
                                size="p"
                                className="line-clamp-1 font-semibold text-ellipsis"
                            >
                                {session.user?.name ?? "User"}, 👋
                            </Heading>
                            <Heading
                                size="span"
                                className="text-muted-foreground line-clamp-1 text-ellipsis"
                            >
                                {session.user?.email}
                            </Heading>
                        </div>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() =>
                                    signOut({ callbackUrl: "/login" })
                                }
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                )}
            </DropdownMenu>
        </nav>
    );
}

export default memo(Navbar);
