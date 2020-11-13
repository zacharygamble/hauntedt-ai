export {};

interface IGameState {
  boardSize: [number, number];
  tileStates: TileState[][];
  teamStates: TeamStates;
}

enum TileState {
  Good = 3,
  Warning = 2,
  Danger = 1,
  Broken = 0,
}

enum Side {
  Home = 'home',
  Away = 'away',
}

enum MoveDirection {
  North = 'north',
  South = 'south',
  East = 'east',
  West = 'west',
  None = 'none',
}

type TeamStates = Record<Side, ITeamMemberState[]>;

interface ITeamMemberState {
  coord: Coord;
  isDead: boolean;
}

type Coord = [number, number]

function isSafeTrivial(gameState: IGameState, coord: Coord) {
	let [row, col] = coord;
	let tile = gameState.tileStates[row][col];
	switch (tile) {
	case TileState.Good:
	case TileState.Warning:
		return true;
	case TileState.Danger:
	case TileState.Broken:
		return false;
	}
}

function isSafe(gameState: IGameState, coord: Coord, dir: MoveDirection) {
	let height = gameState.boardSize[0];
	let width = gameState.boardSize[1];

	let [row, col] = coord;

	switch (dir) {
	case MoveDirection.North:
		row -= 1;
		break;
	case MoveDirection.South:
		row += 1;
		break;
	case MoveDirection.East:
		col += 1;
		break;
	case MoveDirection.West:
		col -= 1;
		break;
	case MoveDirection.None:
		break;
	default:
		return false;
	}

	if (row >= height || row < 0 || col >= width || col < 0 ) {
		return false;
	}
	
	let tile = gameState.tileStates[row][col];
	switch (tile) {
	case TileState.Good:
	case TileState.Warning:
		return true;
	case TileState.Danger:
	case TileState.Broken:
		return false;
	}
}

function getTargetListImpl(gameState: IGameState, coord: Coord) {
	let targets: MoveDirection[] = [ MoveDirection.North, MoveDirection.South, MoveDirection.East, MoveDirection.West, MoveDirection.None ];
	let results: MoveDirection[] = [];

	for (let dir of targets) {
		if (isSafe(gameState, coord, dir)) {
			results.push(dir);
		}
	}

	if (results.length == 0) {
		return targets;
	}
	return results;
}

function getTargetList(gameState: IGameState, player: ITeamMemberState) {
	return getTargetListImpl(gameState, player.coord);
}

function getCoord(gameState: IGameState, coord: Coord, dir: MoveDirection) {
	let height = gameState.boardSize[0];
	let width = gameState.boardSize[1];

	let [row, col] = coord;

	switch (dir) {
	case MoveDirection.North:
		row -= 1;
		break;
	case MoveDirection.South:
		row += 1;
		break;
	case MoveDirection.East:
		col += 1;
		break;
	case MoveDirection.West:
		col -= 1;
		break;
	case MoveDirection.None:
		break;
	default:
		return null;
	}

	if (row >= height || row < 0 || col >= width || col < 0 ) {
		return null;
	}

	let ret: Coord = [row, col];
	return ret;
}


function listcontains(list: Coord[], coord: Coord) {
	for (let c of list) {
		if (c[0] == coord[0] && c[1] === coord[1])
			return true;
	}
	return false;
}

function findLongestPathImpl(gameState: IGameState, coord: Coord, visited: Coord[]) {
	let maxScore: number = 0;
	let targets: MoveDirection[] = getTargetListImpl(gameState, coord);
	visited.push(coord); // constrain recursion

	for (let dir of targets) {
		if (dir === MoveDirection.None)
			continue;
		let newCoord = getCoord(gameState, coord, dir);	
		if (newCoord === null || listcontains(visited, coord))
			continue;
		if (!isSafeTrivial(gameState, <Coord> newCoord)) 
			continue;
		let score = 1; // 1 for movement
		score += findLongestPathImpl(gameState, <Coord> newCoord, visited);
		if (score > maxScore)
			maxScore = score;
	}

	visited.pop();

	return maxScore;
}

// return move direction with longest path
// This does not account for jumping
function findLongestPath(gameState: IGameState, player: ITeamMemberState) {
	let targets: MoveDirection[] = getTargetList(gameState, player);
	let scores: number[] = [];

	for (let dir of targets) {
		if (dir === MoveDirection.None) {
			scores.push(-1);
			continue;
		}
		let newCoord = getCoord(gameState, player.coord, dir);	
		if (newCoord === null) {
			scores.push(-1);
			continue;
		}
		if (!isSafeTrivial(gameState, <Coord> newCoord)) {
			scores.push(0);
			continue;
		}
		let scoreBase: number = 1; // because this means there is a movement, but it might be unsafe
		scoreBase += findLongestPathImpl(gameState, <Coord>newCoord, []);
		scores.push(scoreBase);
	}

	let maxScore = scores[0];
	let index = 0;
	for (let i = 1; i < targets.length; i++) {
		if (scores[i] > maxScore) {
			maxScore = scores[i];
			index = i;
		}
	}

	return targets[index];
}

function getNextMoveLongest(gameState: IGameState, player: ITeamMemberState) {
	if (player.isDead)
		return MoveDirection.None;
	if (isSafeTrivial(gameState, player.coord)) 
		return MoveDirection.None;

	return findLongestPath(gameState, player);
}

function getNextMove(gameState: IGameState, player: ITeamMemberState) {
	if (player.isDead)
		return MoveDirection.None;
	if (isSafeTrivial(gameState, player.coord)) 
		return MoveDirection.None;

	let targets = getTargetList(gameState, player);
	let rand = Math.floor(Math.random() * targets.length);

	return targets[rand];
}

function main(gameState: IGameState, side: Side) {
	const myTeam = gameState.teamStates[side];
	const otherTeam = gameState.teamStates[side == Side.Away ? Side.Home : Side.Away];

	let moves: MoveDirection[] = [];
	
	for (let player of myTeam) {
	//	moves.push(getNextMove(gameState, player));
		moves.push(getNextMoveLongest(gameState, player));
	}

	return moves;
}
