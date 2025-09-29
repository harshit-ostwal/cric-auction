import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/headings";
import { Switch } from "@/components/ui/switch";
import { useUpdateAuction } from "@/hooks/useAuction";
import { Icons } from "@/shared/icons";
import React from "react";
import { toast } from "sonner";

const StatCard = React.memo(({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4">
        <span className="rounded-full border p-3">
            <Icon size={28} />
        </span>
        <div className="flex flex-col -space-y-1">
            <Heading size="p" className="text-muted-foreground">
                {label}
            </Heading>
            <Heading size="h6" className="font-semibold">
                {value}
            </Heading>
        </div>
    </div>
));

StatCard.displayName = "StatCard";

function About({ auction, isOwner }) {
    const { mutate: updateAuction } = useUpdateAuction();

    const auctionStats = React.useMemo(
        () => [
            {
                id: "code",
                icon: Icons.hash || Icons.cricket,
                label: "Auction Code",
                value: auction?.auctionCode
                    ? `${auction.auctionCode.slice(0, 5)}-${auction.auctionCode.slice(5, 8)}`
                    : "N/A",
            },
            {
                id: "points",
                icon: Icons.coins,
                label: "Team Points",
                value: auction?.teamPoints?.toLocaleString() || 0,
            },
            {
                id: "minBid",
                icon: Icons.coins,
                label: "Minimum Bid",
                value: auction?.minimumBid?.toLocaleString() || 0,
            },
            {
                id: "bidIncrease",
                icon: Icons.trendUp,
                label: "Bid Increase",
                value: auction?.bidIncreaseBy?.toLocaleString() || 0,
            },
            {
                id: "teams",
                icon: Icons.userGroup,
                label: "Teams",
                value: `${auction?.teams.length || 0} ${(auction?.teams.length || 0) === 1 ? "Team" : "Teams"}`,
            },
            {
                id: "players",
                icon: Icons.users,
                label: "Players",
                value: `${auction?.players.length || 0} ${(auction?.players.length || 0) === 1 ? "Player" : "Players"}`,
            },
        ],
        [auction]
    );

    return (
        <div className="flex flex-col gap-10">
            <Card>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        {auctionStats.map((stat) => (
                            <StatCard
                                key={stat.id}
                                icon={stat.icon}
                                label={stat.label}
                                value={stat.value}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {isOwner && (
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <Heading size="h5" className={"font-semibold"}>
                            Player Registeration
                        </Heading>
                        <Heading size="p" className="text-muted-foreground">
                            Allow players to register themselves for this
                            auction
                        </Heading>
                    </div>
                    <Switch
                        checked={auction?.playerRegistration}
                        onCheckedChange={(checked) => {
                            updateAuction(
                                {
                                    id: auction.id,
                                    data: { playerRegistration: checked },
                                },
                                {
                                    onSuccess: () => {
                                        toast.success(
                                            `Player registration ${
                                                checked ? "enabled" : "disabled"
                                            }`
                                        );
                                    },
                                    onError: () => {
                                        toast.error(
                                            "Something went wrong. Please try again."
                                        );
                                    },
                                }
                            );
                        }}
                    />
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <Heading size="h5" className={"font-semibold"}>
                        Player Registeration Link
                    </Heading>
                    <Heading size="p" className="text-muted-foreground">
                        Share this link with players to allow them to join the
                        auction.
                    </Heading>
                </div>
                <Button
                    variant="outline"
                    onClick={() => {
                        const fullLink = `${window.location.origin}/player/${auction.id}`;
                        navigator.clipboard.writeText(fullLink);
                        toast.success("Link copied to clipboard");
                    }}
                >
                    Copy Link
                </Button>
            </div>
        </div>
    );
}

export default React.memo(About);
