import { main, IGameState, TileState, Side, MoveDirection, TeamStates, ITeamMemberState, Coord } from "./ai.pathing";
import * as f from "./ai.pathing";

let tiles: TileState[][] = [];
for (let i = 0; i < 4; i++) {
	let row: TileState[] = [];
	for (let j = 0; j < 1; j++) {
		row.push(TileState.Good);
	}
	tiles.push(row);
}

tiles[1][0] = TileState.Danger;

let home: ITeamMemberState[] = [];
home.push({coord: [1,0], isDead: false});

let away: ITeamMemberState[] = [];

let teams: Record<Side, ITeamMemberState[]> = {
	[Side.Home]: home, 
	[Side.Away]: away, 
};

let state: IGameState = {boardSize: [4,1], teamStates: teams, tileStates: tiles};

console.log(f.getNextMoveLongest(state, home[0]));
console.log(main(state, Side.Home));
