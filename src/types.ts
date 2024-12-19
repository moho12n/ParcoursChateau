// Definition of types used 

export interface Result {
    numberOfRoomsVisited: number;
    totalNumberOfChests: number;
    filledChests: string[];
}

export interface RoomDataType {
    id: string,
    rooms: string[],
    chests: string[]
}

export interface ChestDataType {
    id: string;
    status: string;
}