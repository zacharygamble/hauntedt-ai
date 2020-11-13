/*interface IGameState {
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

type Coord = [number, number];

let tiles: TileState[][] = [];
for (let i = 0; i < 7; i++) {
	let row: TileState[] = [];
	for (let j = 0; j < 7; j++) {
		row.push(TileState.Good);
	}
	tiles.push(row);
}

let home: ITeamMemberState[] = [];
home.push({coord: [0,0], isDead: false});
home.push({coord: [0,3], isDead: false});
home.push({coord: [0,6], isDead: false});

let away: ITeamMemberState[] = [];
away.push({coord: [6,0], isDead: false});
away.push({coord: [6,3], isDead: false});
away.push({coord: [6,6], isDead: false});

let teams: Record<Side, ITeamMemberState[]> = {
	[Side.Home]: home, 
	[Side.Away]: away, 
};

let state: IGameState = {boardSize: [7,7], teamStates: teams, tileStates: tiles};

console.log(main(state, Side.Home));*/
