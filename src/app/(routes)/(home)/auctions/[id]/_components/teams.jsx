import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Form } from "@/components/ui/form";
import { useCreateTeam, useTeams } from "@/hooks/useTeam";
import { Icons } from "@/shared/icons";
import { teamSchema } from "@/validations/(routes)/auctions";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

function Teams({ auction }) {
    const teamForm = useForm({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            teamName: "",
            maxBid: 0,
            teamPoints: 0,
            teamUsedPoints: 0,
            numberOfPlayers: 0,
        },
    });

    const { mutate: createTeam } = useCreateTeam();
    const { data: teams } = useTeams(auction.id);

    const onSubmit = (data) => {
        createTeam({ ...data, auctionId: auction.id });
        teamForm.reset();
    };

    return (
        <div className="flex flex-col gap-4">
            <Drawer>
                <DrawerTrigger asChild>
                    <Button className={"ml-auto"} variant={"cricketBlue"}>
                        <Icons.plus /> Add Team
                    </Button>
                </DrawerTrigger>
                <DrawerContent className={"max-w-lg"}>
                    <Form {...teamForm}>
                        <form
                            onSubmit={teamForm.handleSubmit(onSubmit)}
                            className="flex flex-col gap-6"
                        >
                            <input
                                type="text"
                                placeholder="Team Name"
                                {...teamForm.register("teamName")}
                            />
                            <input
                                type="number"
                                placeholder="Max Bid"
                                {...teamForm.register("maxBid")}
                            />
                            <input
                                type="number"
                                placeholder="Team Points"
                                {...teamForm.register("teamPoints")}
                            />
                            <input
                                type="number"
                                placeholder="Team Used Points"
                                {...teamForm.register("teamUsedPoints")}
                            />
                            <input
                                type="number"
                                placeholder="Number of Players"
                                {...teamForm.register("numberOfPlayers")}
                            />
                            <Button type="submit">Add Team</Button>
                        </form>
                    </Form>
                </DrawerContent>
            </Drawer>

            <pre>{JSON.stringify(teams, null, 2)}</pre>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
        </div>
    );
}

export default Teams;
