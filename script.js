const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

const cohortName = '2306-ftb-mt-web-pt';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

    const fetchAllPlayers = async () => {
        try {
            const response = await fetch(`${APIURL}players`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            return result.data.players; // Update here
        } catch (err) {
            console.error('Uh oh, trouble fetching players!', err);
        }
    };
    

    const fetchSinglePlayer = async (playerId) => {
        try {
            const response = await fetch(`${APIURL}players/${playerId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            return result.data.player; // Update here
        } catch (err) {
            console.error(`Oh no, trouble fetching player #${playerId}!`, err);
        }
    };
    

    const addNewPlayer = async (playerObj) => {
        try {
            const response = await fetch(`${APIURL}players`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: playerObj.name,
                    breed: playerObj.breed, // Add breed
                    status: playerObj.status || 'bench', // Add status
                    imageUrl: playerObj.imageUrl // Add imageUrl
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (err) {
            console.error('Oops, something went wrong with adding that player!', err);
        }
    };
    

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}players/${playerId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (err) {
        console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
    }
};


const renderAllPlayers = (playerList) => {
    try {
        let playerContainerHTML = '';
        playerList.forEach(player => {
            playerContainerHTML += `<div class="player-card">
                <h3>${player.name}</h3>
                <p>Position: ${player.position}</p>
                <button onclick="fetchSinglePlayer(${player.id})">See details</button>
                <button onclick="removePlayer(${player.id})">Remove from roster</button>
            </div>`;
        });
        playerContainer.innerHTML = playerContainerHTML;
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

const renderNewPlayerForm = () => {
    try {
        newPlayerFormContainer.innerHTML = `<form id="new-player-form">
            <input type="text" id="player-name" placeholder="Player Name">
            <input type="text" id="player-position" placeholder="Position">
            <button type="submit">Add Player</button>
        </form>`;

        document.getElementById('new-player-form').addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementById('player-name').value;
            const position = document.getElementById('player-position').value;
            await addNewPlayer({ name, position });
            const players = await fetchAllPlayers();
            renderAllPlayers(players);
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    renderNewPlayerForm();
}

init();
