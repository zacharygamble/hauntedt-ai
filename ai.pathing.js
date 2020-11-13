"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.getNextMove = exports.getNextMoveLongest = exports.findLongestPath = exports.findLongestPathImpl = exports.getCoord = exports.getTargetList = exports.getTargetListImpl = exports.isSafe = exports.isSafeTrivial = exports.MoveDirection = exports.Side = exports.TileState = void 0;
var TileState;
(function (TileState) {
    TileState[TileState["Good"] = 3] = "Good";
    TileState[TileState["Warning"] = 2] = "Warning";
    TileState[TileState["Danger"] = 1] = "Danger";
    TileState[TileState["Broken"] = 0] = "Broken";
})(TileState = exports.TileState || (exports.TileState = {}));
var Side;
(function (Side) {
    Side["Home"] = "home";
    Side["Away"] = "away";
})(Side = exports.Side || (exports.Side = {}));
var MoveDirection;
(function (MoveDirection) {
    MoveDirection["North"] = "north";
    MoveDirection["South"] = "south";
    MoveDirection["East"] = "east";
    MoveDirection["West"] = "west";
    MoveDirection["None"] = "none";
})(MoveDirection = exports.MoveDirection || (exports.MoveDirection = {}));
function isSafeTrivial(gameState, coord) {
    var row = coord[0], col = coord[1];
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
exports.isSafeTrivial = isSafeTrivial;
function isSafe(gameState, coord, dir) {
    var height = gameState.boardSize[0];
    var width = gameState.boardSize[1];
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
    if (row >= height) {
        return false;
    }
    else if (row < 0) {
        return false;
    }
    else if (col >= width) {
        return false;
    }
    else if (col < 0) {
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
exports.isSafe = isSafe;
function getTargetListImpl(gameState, coord) {
    var targets = [MoveDirection.North, MoveDirection.South, MoveDirection.East, MoveDirection.West, MoveDirection.None];
    var results = [];
    for (var _i = 0, targets_1 = targets; _i < targets_1.length; _i++) {
        var dir = targets_1[_i];
        if (isSafe(gameState, coord, dir)) {
            results.push(dir);
        }
    }
    if (results.length == 0) {
        return targets;
    }
    return results;
}
exports.getTargetListImpl = getTargetListImpl;
function getTargetList(gameState, player) {
    return getTargetListImpl(gameState, player.coord);
}
exports.getTargetList = getTargetList;
function getCoord(gameState, coord, dir) {
    var height = gameState.boardSize[0];
    var width = gameState.boardSize[1];
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
            return null;
    }
    if (row >= height) {
        console.log(row >= height);
        return null;
    }
    else if (row < 0) {
        console.log(row < 0);
        return null;
    }
    else if (col >= width) {
        console.log(col >= width);
        return null;
    }
    else if (col < 0) {
        console.log(col < 0);
        return null;
    }
    var ret = [row, col];
    console.log("getcoord: " + ret);
    return ret;
}
exports.getCoord = getCoord;
function listcontains(list, coord) {
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var c = list_1[_i];
        if (c[0] == coord[0] && c[1] === coord[1])
            return true;
    }
    return false;
}
function findLongestPathImpl(gameState, coord, visited) {
    var maxScore = 0;
    var targets = getTargetListImpl(gameState, coord);
    visited.push(coord); // constrain recursion
    console.log(visited);
    for (var _i = 0, targets_2 = targets; _i < targets_2.length; _i++) {
        var dir = targets_2[_i];
        if (dir === MoveDirection.None)
            continue;
        var newCoord = getCoord(gameState, coord, dir);
        if (newCoord === null || listcontains(visited, newCoord))
            continue;
        console.log("Unused");
        if (!isSafeTrivial(gameState, newCoord))
            continue;
        console.log("safe");
        var score = 1; // 1 for movement
        score += findLongestPathImpl(gameState, newCoord, visited);
        if (score > maxScore)
            maxScore = score;
    }
    visited.pop();
    return maxScore;
}
exports.findLongestPathImpl = findLongestPathImpl;
// return move direction with longest path
// This does not account for jumping
function findLongestPath(gameState, player) {
    var targets = getTargetList(gameState, player);
    var scores = [];
    console.log("list " + targets);
    for (var _i = 0, targets_3 = targets; _i < targets_3.length; _i++) {
        var dir = targets_3[_i];
        console.log("test " + dir);
        if (dir === MoveDirection.None) {
            scores.push(-1);
            continue;
        }
        console.log("test " + ":" + player.coord);
        var newCoord = getCoord(gameState, player.coord, dir);
        if (newCoord === null) {
            scores.push(-1);
            continue;
        }
        console.log("test " + newCoord + ":" + player.coord);
        if (!isSafeTrivial(gameState, newCoord)) {
            scores.push(0);
            continue;
        }
        var scoreBase = 1; // because this means there is a movement, but it might be unsafe
        scoreBase += findLongestPathImpl(gameState, newCoord, []);
        console.log("test " + newCoord + ":" + player.coord + " -- " + scoreBase);
        scores.push(scoreBase);
    }
    var maxScore = scores[0];
    var index = 0;
    for (var i = 1; i < targets.length; i++) {
        if (scores[i] > maxScore) {
            maxScore = scores[i];
            index = i;
        }
    }
    return targets[index];
}
exports.findLongestPath = findLongestPath;
function getNextMoveLongest(gameState, player) {
    if (player.isDead)
        return MoveDirection.None;
    if (isSafeTrivial(gameState, player.coord))
        return MoveDirection.None;
    return findLongestPath(gameState, player);
}
exports.getNextMoveLongest = getNextMoveLongest;
function getNextMove(gameState, player) {
    if (player.isDead)
        return MoveDirection.None;
    if (isSafeTrivial(gameState, player.coord))
        return MoveDirection.None;
    var targets = getTargetList(gameState, player);
    var rand = Math.floor(Math.random() * targets.length);
    return targets[rand];
}
exports.getNextMove = getNextMove;
function main(gameState, side) {
    var myTeam = gameState.teamStates[side];
    var otherTeam = gameState.teamStates[side == Side.Away ? Side.Home : Side.Away];
    var moves = [];
    for (var _i = 0, myTeam_1 = myTeam; _i < myTeam_1.length; _i++) {
        var player = myTeam_1[_i];
        //	moves.push(getNextMove(gameState, player));
        moves.push(getNextMoveLongest(gameState, player));
    }
    return moves;
}
exports.main = main;
