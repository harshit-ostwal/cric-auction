import React from "react";

function MVP({ isOwner, auction }) {
    return (
        <div>
            <pre>{JSON.stringify(auction, null, 2)}</pre>
        </div>
    );
}

export default MVP;
