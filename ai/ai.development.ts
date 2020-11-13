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

function isSafe(gameState: IGameState, coord: Coord, dir: MoveDirection) {
	let width = gameState.boardSize[0];
	let height = gameState.boardSize[1];

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

function getTargetList(gameState: IGameState, player: ITeamMemberState) {
	let targets: MoveDirection[] = [ MoveDirection.North, MoveDirection.South, MoveDirection.East, MoveDirection.West, MoveDirection.None ];
	let results: MoveDirection[] = [];

	for (let dir of targets) {
		if (isSafe(gameState, player.coord, dir)) {
			results.push(dir);
		}
	}

	if (results.length == 0) {
		return targets;
	}
	return results;
}

function getNextMove(gameState: IGameState, player: ITeamMemberState) {
	if (player.isDead)
		return MoveDirection.None;

	let targets = getTargetList(gameState, player);
	let rand = Math.floor(Math.random() * targets.length);
	console.log(targets);

	return targets[rand];
}

function main(gameState: IGameState, side: Side) {
	const myTeam = gameState.teamStates[side];
	const otherTeam = gameState.teamStates[side == Side.Away ? Side.Home : Side.Away];

	let moves: MoveDirection[] = [];
	
	for (let player of myTeam) {
		moves.push(getNextMove(gameState, player));
	}

	return moves;
}
