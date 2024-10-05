class Game {
    /**
     * Game constructor
     * @param {String} code Unique game code to identify the game
     * @param {String} problem Problem description or object associated with the game
     */
    constructor(code, problem = '') {
        this.status = 'OPEN'; // Game status, starts as 'OPEN'
        this.code = code; // Unique game code
        this.players = []; // List of players (WebSocket objects)
        this.problem = problem; // Problem for the game, default is empty
    }

    /**
     * Add a player to the game
     * @param {WebSocket} player The player's WebSocket connection
     */
    addPlayer(player) {
        if (this.players.length < 2) {
            this.players.push(player);
            if (this.players.length === 2) {
                this.status = 'IN_PROGRESS';
            }
        } else {
            throw new Error('Cannot add more players, game is full');
        }
    }

    /**
     * Start the game by setting the problem and updating status
     * @param {Object} problem The problem object for the game
     */
    startGame(problem) {
        this.problem = problem;
        this.status = 'IN_PROGRESS';
    }

    /**
     * End the game by updating the status
     */
    endGame() {
        this.problem = '';
        this.status = 'OPEN';
    }

    /**
     * Remove a player from the game
     * @param {WebSocket} player The player's WebSocket connection to remove
     */
    removePlayer(player) {
        this.players = this.players.filter(p => p !== player);
        if (this.players.length < 2 && this.status === 'IN_PROGRESS') {
            this.status = 'OPEN'; // Revert back to 'OPEN' if a player leaves during the game
        }
    }

    export() {
        return {
            status: this.status,
            code: this.code,
            players: this.players.map(x => x.identifier),
            problem: this.problem
        }
    }
}

module.exports = Game;
