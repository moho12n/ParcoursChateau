import { ChestDataType, Result, RoomDataType } from "./types";
import axios from "axios";

const baseURL = 'https://infinite-castles.azurewebsites.net';

async function parcoursChateau() {
    //we used Set to avoid having duplicates
    const visitedRooms: Set<string> = new Set();
    const filledChests: string[] = [];
    const entryUrl = "/castles/1/rooms/entry";
    
    const result: Result = {
        numberOfRoomsVisited: 0,
        totalNumberOfChests: 0,
        filledChests: []
    };

    
    LogMessageDeDepart();
    const startTime = performance.now(); // to count the execution time
    await visitRoom(entryUrl, visitedRooms, filledChests, result);
    const endTime = performance.now();
    result.filledChests = filledChests;
    logMessageDeFin(result);
    console.log(`Temps d'execution: ${(endTime - startTime) / 60000} minutes`);
}

// Visit a room and its linked rooms (recursively)
async function visitRoom(
    url: string,
    visitedRooms: Set<string>,
    filledChests: string[],
    result: Result,
): Promise<void> {
    if (visitedRooms.has(url)) return; // Stop recursion if a room is already visited

    //console.log(`Visiting room: ${url}`);
    visitedRooms.add(url);
    result.numberOfRoomsVisited++;

    const roomData = await fetchElement<RoomDataType>(baseURL + url);
    if (!roomData) return;

    // Process chests in the current room
    await visitChests(roomData.chests, result, filledChests);

    // Recursively visit linked rooms
    for (const roomUrl of roomData.rooms) {
        await visitRoom(roomUrl, visitedRooms, filledChests, result);
    }
}

// Visit all chests in a room
async function visitChests(
    chestsUrls: string[],
    result: Result,
    filledChests: string[]
): Promise<void> {
    for (const chestUrl of chestsUrls) {        
        const chestData = await fetchElement<ChestDataType>(baseURL + chestUrl);
        if (chestData && chestData?.status !== "This chest is empty :/ Try another one!") {            
            console.log(`Bravo ! un coffre a été retrouvé: ${chestData.id}`);
            filledChests.push(baseURL + chestUrl);                     
        }
        result.totalNumberOfChests++;
    }
}

// Fetch an element from the API
async function fetchElement<T>(url: string): Promise<T | null> {
    try {
        const response = await axios.get<T>(url);
        return response.data;        
    } catch (error) {
        console.error("Unexpected error:", error);
    }
    return null;
}

function LogMessageDeDepart(){
    console.log("--------------------------------------------------------");
    console.log("🔍 Début de l'exécution du script pour explorer le château. Objectifs :");
    console.log("- Parcourir toutes les pièces du château");
    console.log("- Compter les pièces visitées");
    console.log("- Compter les coffres (total et non vides)");
    console.log("- Récupérer les liens des coffres non vides");
    console.log("🚪 Point d'entrée du château : https://infinite-castles.azurewebsites.net/castles/1/rooms/entry");
    console.log("📡 Exploration en cours...\n");
    console.log("--------------------------------------------------------");
}

function logMessageDeFin(result : Result){
    console.log("--------------------------------------------------------");
    console.log("\n✅ Exploration terminée !");
    console.log(`- Nombre total de pièces visitées : ${result.numberOfRoomsVisited}`);
    console.log(`- Nombre total de coffres trouvés : ${result.totalNumberOfChests}`);
    console.log(`- Nombre de coffres non vides : ${result.filledChests.length}`);
    console.log("🎯 Liens des coffres non vides collectés avec succès : ");
    console.log(`Coffres: [${result.filledChests.join(", ")}]`);
    console.log("Merci !");
    console.log("--------------------------------------------------------");
}
export { parcoursChateau };