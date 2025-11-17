import * as Location from "expo-location";

declare global {
	var __checkNotesBackground:
		| ((coords: { latitude: number; longitude: number }) => void | Promise<void>)
		| undefined;
}
export {};
