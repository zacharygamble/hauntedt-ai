"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function isSafeSpecial(gameState, tileMap, coord, dir) {
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
    var tile = tileMap[row][col];
    if (tile > 1)
        return true;
    return false;
}
function getTargetListImplSpecial(gameState, tileMap, coord) {
    var targets = [MoveDirection.None, MoveDirection.North, MoveDirection.South, MoveDirection.East, MoveDirection.West];
    var results = [];
    for (var _i = 0, targets_1 = targets; _i < targets_1.length; _i++) {
        var dir = targets_1[_i];
        if (isSafeSpecial(gameState, tileMap, coord, dir)) {
            results.push(dir);
        }
    }
    if (results.length == 0) {
        return targets;
    }
    return results;
}
function getTargetListImpl(gameState, coord) {
    var targets = [MoveDirection.North, MoveDirection.South, MoveDirection.East, MoveDirection.West, MoveDirection.None];
    var results = [];
    for (var _i = 0, targets_2 = targets; _i < targets_2.length; _i++) {
        var dir = targets_2[_i];
        if (isSafe(gameState, coord, dir)) {
            results.push(dir);
        }
    }
    if (results.length == 0) {
        return targets;
    }
    return results;
}
function getTargetList(gameState, player) {
    return getTargetListImpl(gameState, player.coord);
}
function getCoord(gameState, coord, dir) {
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
            return null;
    }
    if (row >= height || row < 0 || col >= width || col < 0) {
        return null;
    }
    var ret = [row, col];
    return ret;
}
function findLongestPathImpl(gameState, coord, tileMap) {
    var maxScore = 0;
    var targets = getTargetListImplSpecial(gameState, tileMap, coord);
    for (var _i = 0, targets_3 = targets; _i < targets_3.length; _i++) {
        var dir = targets_3[_i];
        var newCoord = getCoord(gameState, coord, dir);
        if (newCoord === null)
            continue;
        var row = newCoord[0], col = newCoord[1];
        if (tileMap[row][col] > 1)
            continue;
        tileMap[row][col] = tileMap[row][col] - 1;
        var score = 1; // 1 for movement
        score += findLongestPathImpl(gameState, newCoord, tileMap);
        if (score > maxScore)
            maxScore = score;
        tileMap[row][col] = tileMap[row][col] + 1;
    }
    return maxScore;
}
// return move direction with longest path
// This does not account for jumping
function findLongestPath(gameState, player) {
    var targets = getTargetList(gameState, player);
    var scores = [];
    var tileMap = [];
    for (var i in gameState.tileStates) {
        tileMap.push([]);
        for (var j in gameState.tileStates[i]) {
            tileMap[i].push(gameState.tileStates[i][j]);
        }
    }
    for (var _i = 0, targets_4 = targets; _i < targets_4.length; _i++) {
        var dir = targets_4[_i];
        var newCoord = getCoord(gameState, player.coord, dir);
        if (newCoord === null) {
            scores.push(-1);
            continue;
        }
        if (!isSafeTrivial(gameState, newCoord)) {
            scores.push(0);
            continue;
        }
        var row = newCoord[0], col = newCoord[1];
        tileMap[row][col] = tileMap[row][col] - 1;
        var scoreBase = 1; // because this means there is a movement, but it might be unsafe
        scoreBase += findLongestPathImpl(gameState, newCoord, tileMap);
        scores.push(scoreBase);
        tileMap[row][col] = tileMap[row][col] + 1;
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
function getNextMoveLongest(gameState, player) {
    if (player.isDead)
        return MoveDirection.None;
    //if (isSafeTrivial(gameState, player.coord)) 
    //return MoveDirection.None;
    return findLongestPath(gameState, player);
}
function getNextMove(gameState, player) {
    if (player.isDead)
        return MoveDirection.None;
    if (isSafeTrivial(gameState, player.coord))
        return MoveDirection.None;
    var targets = getTargetList(gameState, player);
    var rand = Math.floor(Math.random() * targets.length);
    return targets[rand];
}
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
