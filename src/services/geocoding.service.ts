import { injectable } from "inversify";
import axios from 'axios';
import { CONFIG } from "../config";

@injectable()
export class GeocodingService {

    public async addressToCoordinates(address: string): Promise<{ latitude: number, longitude: number }> {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${CONFIG.GOOGLE_KEY}`);

        const location = response.data?.results[0]?.geometry?.location;

        if (!location)
            return null;

        return {
            latitude: location.lat,
            longitude: location.lng
        }
    }
}