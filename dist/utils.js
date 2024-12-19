"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcoursChateau = parcoursChateau;
const axios_1 = __importDefault(require("axios"));
const baseURL = 'https://infinite-castles.azurewebsites.net';
function parcoursChateau() {
    return __awaiter(this, void 0, void 0, function* () {
        const visitedRooms = new Set();
        const filledChests = [];
        const result = {
            numberOfRoomsVisited: 0,
            totalNumberOfChests: 0,
            filledChests: []
        };
        const entryUrl = "/castles/1/rooms/entry";
        const startTime = performance.now();
        yield visitRoom(entryUrl, visitedRooms, filledChests, result);
        const endTime = performance.now();
        result.filledChests = filledChests;
        console.log(result);
        console.log(`Execution time: ${(endTime - startTime) / 60000} minutes`);
    });
}
// Visit a room and its linked rooms (recursively)
function visitRoom(url, visitedRooms, filledChests, result) {
    return __awaiter(this, void 0, void 0, function* () {
        if (visitedRooms.has(url))
            return; // Stop recursion if a room is already visited
        console.log(`Visiting room: ${url}`);
        visitedRooms.add(url);
        result.numberOfRoomsVisited++;
        const roomData = yield fetchElement(baseURL + url);
        if (!roomData)
            return;
        // Process chests in the current room
        yield visitChests(roomData.chests, result, filledChests);
        // Recursively visit linked rooms
        for (const roomUrl of roomData.rooms) {
            yield visitRoom(roomUrl, visitedRooms, filledChests, result);
        }
    });
}
// Visit all chests in a room
function visitChests(chestsUrls, result, filledChests) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const chestUrl of chestsUrls) {
            console.log(`Opening chest: ${chestUrl}`);
            const chestData = yield fetchElement(baseURL + chestUrl);
            if (chestData && (chestData === null || chestData === void 0 ? void 0 : chestData.status) !== "This chest is empty :/ Try another one!") {
                filledChests.push(baseURL + chestUrl);
            }
            result.totalNumberOfChests++;
        }
    });
}
// Fetch an element from the API
function fetchElement(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url);
            return response.data;
        }
        catch (error) {
            console.error("Unexpected error:", error);
        }
        return null;
    });
}
