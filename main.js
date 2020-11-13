"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var U = require("./ai/ai.development.js");
var TileState;
(function (TileState) {
    TileState[TileState["Good"] = 3] = "Good";
    TileState[TileState["Warning"] = 2] = "Warning";
    TileState[TileState["Danger"] = 1] = "Danger";
    TileState[TileState["Broken"] = 0] = "Broken";
})(TileState || (TileState = {}));
var Side;
(function (Side) {
    Side["Home"] = "home";
    Side["Away"] = "away";
})(Side || (Side = {}));
var MoveDirection;
(function (MoveDirection) {
    MoveDirection["North"] = "north";
    MoveDirection["South"] = "south";
    MoveDirection["East"] = "east";
    MoveDirection["West"] = "west";
    MoveDirection["None"] = "none";
})(MoveDirection || (MoveDirection = {}));
var tiles = [];
for (var i = 0; i < 7; i++) {
    var row = [];
    for (var j = 0; j < 7; j++) {
        row.push(TileState.Good);
    }
    tiles.push(row);
}
var home = [];
home.push({ coord: [0, 0], isDead: false });
home.push({ coord: [0, 3], isDead: false });
home.push({ coord: [0, 6], isDead: false });
var away = [];
away.push({ coord: [6, 0], isDead: false });
away.push({ coord: [6, 3], isDead: false });
away.push({ coord: [6, 6], isDead: false });
var teams = (_a = {},
    _a[Side.Home] = home,
    _a[Side.Away] = away,
    _a);
var state = { boardSize: [7, 7], teamStates: teams, tileStates: tiles };

console.log(main(state, Side.Home));
