import type { APIResponse } from "../types/Character";

const MOCK_CHARACTERS = [
  {
    name: "Luke Skywalker",
    height: "172",
    mass: "77",
    hair_color: "blond",
    skin_color: "fair",
    eye_color: "blue",
    birth_year: "19BBY",
    gender: "male",
    homeworld: "https://swapi.dev/api/planets/1/",
    films: ["https://swapi.dev/api/films/1/"],
    species: [],
    vehicles: ["https://swapi.dev/api/vehicles/14/"],
    starships: ["https://swapi.dev/api/starships/12/"],
    created: "2014-12-09T13:50:51.644000Z",
    edited: "2014-12-20T21:17:56.891000Z",
    url: "https://swapi.dev/api/people/1/",
  },
  {
    name: "Darth Vader",
    height: "202",
    mass: "136",
    hair_color: "none",
    skin_color: "white",
    eye_color: "yellow",
    birth_year: "41.9BBY",
    gender: "male",
    homeworld: "https://swapi.dev/api/planets/1/",
    films: ["https://swapi.dev/api/films/1/"],
    species: [],
    vehicles: [],
    starships: ["https://swapi.dev/api/starships/13/"],
    created: "2014-12-10T15:18:20.704000Z",
    edited: "2014-12-20T21:17:50.313000Z",
    url: "https://swapi.dev/api/people/4/",
  },
  {
    name: "Leia Organa",
    height: "150",
    mass: "49",
    hair_color: "brown",
    skin_color: "light",
    eye_color: "brown",
    birth_year: "19BBY",
    gender: "female",
    homeworld: "https://swapi.dev/api/planets/2/",
    films: ["https://swapi.dev/api/films/1/"],
    species: [],
    vehicles: ["https://swapi.dev/api/vehicles/30/"],
    starships: [],
    created: "2014-12-10T15:20:09.791000Z",
    edited: "2014-12-20T21:17:50.315000Z",
    url: "https://swapi.dev/api/people/5/",
  },
];
const BASE_URL = "https://swapi.dev/api";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const createMockResponse = (searchTerm: string = ""): APIResponse => {
  const filteredCharacters = searchTerm
    ? MOCK_CHARACTERS.filter((char) =>
        char.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : MOCK_CHARACTERS;

  return {
    count: filteredCharacters.length,
    next: null,
    previous: null,
    results: filteredCharacters,
  };
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export class APIService {
  static async searchCharacters(
    searchTerm: string = "",
    retryCount = 0,
  ): Promise<APIResponse> {
    try {
      const url = searchTerm
        ? `${BASE_URL}/people/?search=${encodeURIComponent(searchTerm)}`
        : `${BASE_URL}/people/`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status >= 400 && response.status < 500) {
          throw new Error(
            `Client error (${response.status}): ${response.statusText}. Please check your request and try again.`,
          );
        }

        if (response.status >= 500) {
          throw new Error(
            `Server error (${response.status}): ${response.statusText}. The service is temporarily unavailable.`,
          );
        }

        throw new Error(
          `Request failed with status ${response.status}: ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          if (retryCount < MAX_RETRIES) {
            console.log(
              `Request timed out, retrying... (${retryCount + 1}/${MAX_RETRIES})`,
            );
            await delay(RETRY_DELAY * (retryCount + 1));
            return this.searchCharacters(searchTerm, retryCount + 1);
          }
          throw new Error(
            "Request timed out after multiple attempts. Please check your internet connection and try again.",
          );
        }

        if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError")
        ) {
          if (retryCount < MAX_RETRIES) {
            console.log(
              `Network error, retrying... (${retryCount + 1}/${MAX_RETRIES})`,
            );
            await delay(RETRY_DELAY * (retryCount + 1));
            return this.searchCharacters(searchTerm, retryCount + 1);
          }
          console.warn(
            "Network error: Unable to connect to the Star Wars API. Using mock data as fallback.",
          );
          return createMockResponse(searchTerm);
        }

        if (error.message.includes("CORS")) {
          console.warn(
            "CORS error: Unable to access the Star Wars API. Using mock data as fallback.",
          );
          return createMockResponse(searchTerm);
        }

        throw error;
      }

      throw new Error("An unexpected error occurred while fetching data.");
    }
  }
}
