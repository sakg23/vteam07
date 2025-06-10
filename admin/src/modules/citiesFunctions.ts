import { apiKey, baseURL } from "../utils";
import auth from "./auth"

interface City {
    id?: number;
    name: string;
    region: string;
}

interface CitiesResponse {
    status: string;
    cities: City[];
    message: string;
}

const citiesFunctions = {
    async getcities(): Promise<CitiesResponse> {
        try {
            const response = await fetch(`${baseURL}v1/cities/?api_key=${apiKey}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "GET",
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result as CitiesResponse;
        } catch (error) {
            console.error("Error fetching cities:", error);
            throw error;
        }
    },
    async addCity(name:string, region:string): Promise<string>{
        const city: City = {
            name: name,
            region: region,
          };
      
        try {
            const response = await fetch(`${baseURL}v1/cities/add`, {
                body:JSON.stringify(city),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`
                },
                
                method: "POST",
            });
           

            const result = await response.json();
            console.log(result.message);

            if (result.status === 'success') {
                return "ok";
              } else if (result.message === 'city exists') {
                
                
                return result.message;
              } else {
                return "Unexpected error occurred.";
              }
            
        } catch (error) {
            console.error("Error fetching cities:", error);
            throw error;
        }
    }
};

export default citiesFunctions;