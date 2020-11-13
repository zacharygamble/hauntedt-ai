export {};

export interface IGameState {
  boardSize: [number, number];
  tileStates: TileState[][];
  teamStates: TeamStates;
}

export enum TileState {
  Good = 3,
  Warning = 2,
  Danger = 1,
  Broken = 0,
}

export enum Side {
  Home = 'home',
  Away = 'away',
}

export enum MoveDirection {
  North = 'north',
  South = 'south',
  East = 'east',
  West = 'west',
  None = 'none',
}

export type TeamStates = Record<Side, ITeamMemberState[]>;

export interface ITeamMemberState {
  coord: Coord;
  isDead: boolean;
}

export type Coord = [number, number]

export function isSafeTrivial(gameState: IGameState, coord: Coord) {
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

export function isSafe(gameState: IGameState, coord: Coord, dir: MoveDirection) {
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

	if (row >= height) {
		return false;
	} else if (row < 0) {
		return false;
	} else if (col >= width) {
		return false;
	} else if (col < 0) {
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

export function getTargetListImpl(gameState: IGameState, coord: Coord) {
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

export function getTargetList(gameState: IGameState, player: ITeamMemberState) {
	return getTargetListImpl(gameState, player.coord);
}

export function getCoord(gameState: IGameState, coord: Coord, dir: MoveDirection) {
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

	if (row >= height) {
		console.log(row >= height);
		return null;
	} else if (row < 0) {
		console.log(row < 0);
		return null;
	} else if (col >= width) {
		console.log(col >= width);
		return null;
	} else if (col < 0) {
		console.log(col < 0);
		return null;
	}

	let ret: Coord = [row, col];
	console.log("getcoord: " + ret);
	return ret;
}

function listcontains(list: Coord[], coord: Coord) {
	for (let c of list) {
		if (c[0] == coord[0] && c[1] === coord[1])
			return true;
	}
	return false;
}

export function findLongestPathImpl(gameState: IGameState, coord: Coord, visited: Coord[]) {
	let maxScore: number = 0;
	let targets: MoveDirection[] = getTargetListImpl(gameState, coord);
	visited.push(coord); // constrain recursion
	console.log(visited);

	for (let dir of targets) {
		if (dir === MoveDirection.None)
			continue;
		let newCoord = getCoord(gameState, coord, dir);	
		if (newCoord === null || listcontains(visited, newCoord))
			continue;
		console.log("Unused");
		if (!isSafeTrivial(gameState, <Coord> newCoord)) 
			continue;
		console.log("safe");
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
export function findLongestPath(gameState: IGameState, player: ITeamMemberState) {
	let targets: MoveDirection[] = getTargetList(gameState, player);
	let scores: number[] = [];
	console.log("list " + targets); 

	for (let dir of targets) {
		console.log("test " + dir); 
		if (dir === MoveDirection.None) {
			scores.push(-1);
			continue;
		}
		console.log("test " + ":" + player.coord);
		let newCoord = getCoord(gameState, player.coord, dir);	
		if (newCoord === null) {
			scores.push(-1);
			continue;
		}
		console.log("test " + newCoord + ":" + player.coord);
		if (!isSafeTrivial(gameState, <Coord> newCoord)) {
			scores.push(0);
			continue;
		}
		let scoreBase: number = 1; // because this means there is a movement, but it might be unsafe
		scoreBase += findLongestPathImpl(gameState, <Coord>newCoord, []);
		console.log("test " + newCoord + ":" + player.coord + " -- " + scoreBase);
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

export function getNextMoveLongest(gameState: IGameState, player: ITeamMemberState) {
	if (player.isDead)
		return MoveDirection.None;
	if (isSafeTrivial(gameState, player.coord)) 
		return MoveDirection.None;

	return findLongestPath(gameState, player);
}

export function getNextMove(gameState: IGameState, player: ITeamMemberState) {
	if (player.isDead)
		return MoveDirection.None;
	if (isSafeTrivial(gameState, player.coord)) 
		return MoveDirection.None;

	let targets = getTargetList(gameState, player);
	let rand = Math.floor(Math.random() * targets.length);

	return targets[rand];
}

export function main(gameState: IGameState, side: Side) {
	const myTeam = gameState.teamStates[side];
	const otherTeam = gameState.teamStates[side == Side.Away ? Side.Home : Side.Away];

	let moves: MoveDirection[] = [];
	
	for (let player of myTeam) {
	//	moves.push(getNextMove(gameState, player));
		moves.push(getNextMoveLongest(gameState, player));
	}

	return moves;
}
