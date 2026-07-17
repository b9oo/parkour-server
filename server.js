const WebSocket = require('ws');

// Start the server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

let players = {};

console.log("WebSocket server is running on ws://localhost:8080");

wss.on('connection', (ws) => {
    console.log("A player joined!");

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'player_update') {
                // Store the player's new position
                players[data.id] = data.payload;

                // Send the updated world state to ALL connected players
                const broadcastData = JSON.stringify({
                    type: 'state_sync',
                    players: players
                });

                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(broadcastData);
                    }
                });
            }
        } catch (e) {
            console.error("Error processing message:", e);
        }
    });

    ws.on('close', () => {
        console.log("A player left.");
        // Optional: Clean up players object here
    });
});
