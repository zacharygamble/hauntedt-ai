"use strict";
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
function isSafe(gameState, coord, dir) {
    var width = gameState.boardSize[0];
    var height = gameState.boardSize[1];
    var row = coord[0], col = coord[1];
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
    if (row >= height || row < 0 || col >= width || col < 0) {
        return false;
    }
    var tile = gameState.tileStates[row][col];
    switch (tile) {
        case TileState.Good:
        case TileState.Warning:
            return true;
        case TileState.Danger:
        case TileState.Broken:
            return false;
    }
}
function getTargetList(gameState, player) {
    var targets = [MoveDirection.North, MoveDirection.South, MoveDirection.East, MoveDirection.West, MoveDirection.None];
    var results = [];
    for (var _i = 0, targets_1 = targets; _i < targets_1.length; _i++) {
        var dir = targets_1[_i];
        if (isSafe(gameState, player.coord, dir)) {
            results.push(dir);
        }
    }
    if (results.length == 0) {
        return targets;
    }
    return results;
}
function getNextMove(gameState, player) {
    if (player.isDead)
        return MoveDirection.None;
    var targets = getTargetList(gameState, player);
    var rand = Math.floor(Math.random() * targets.length);
    console.log(targets);
    return targets[rand];
}
function main(gameState, side) {
    var myTeam = gameState.teamStates[side];
    var otherTeam = gameState.teamStates[side == Side.Away ? Side.Home : Side.Away];
    var moves = [];
    for (var _i = 0, myTeam_1 = myTeam; _i < myTeam_1.length; _i++) {
        var player = myTeam_1[_i];
        moves.push(getNextMove(gameState, player));
    }
    return moves;
}
