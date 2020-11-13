"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var ai_pathing_1 = require("./ai.pathing");
var f = __importStar(require("./ai.pathing"));
var tiles = [];
for (var i = 0; i < 4; i++) {
    var row = [];
    for (var j = 0; j < 1; j++) {
        row.push(ai_pathing_1.TileState.Good);
    }
    tiles.push(row);
}
tiles[1][0] = ai_pathing_1.TileState.Danger;
var home = [];
home.push({ coord: [1, 0], isDead: false });
var away = [];
var teams = (_a = {},
    _a[ai_pathing_1.Side.Home] = home,
    _a[ai_pathing_1.Side.Away] = away,
    _a);
var state = { boardSize: [4, 1], teamStates: teams, tileStates: tiles };
console.log(f.getNextMoveLongest(state, home[0]));
console.log(ai_pathing_1.main(state, ai_pathing_1.Side.Home));
