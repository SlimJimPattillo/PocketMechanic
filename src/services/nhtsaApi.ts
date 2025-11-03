import { Config } from '../constants/config';

export interface VINDecodeResult {
  make: string;
  model: string;
  year: number;
  trim?: string;
  vin: string;
}

export interface MakeModel {
  makeId: number;
  makeName: string;
  modelId?: number;
  modelName?: string;
}

export const nhtsaApi = {
  /**
   * Decode a VIN to get vehicle information
   */
  async decodeVIN(vin: string): Promise<VINDecodeResult | null> {
    try {
      const response = await fetch(
        `${Config.nhtsa.apiUrl}/vehicles/DecodeVin/${vin}?format=json`
      );
      const data = await response.json();

      if (!data.Results || data.Results.length === 0) {
        return null;
      }

      const results = data.Results;
      const make = results.find((r: any) => r.Variable === 'Make')?.Value;
      const model = results.find((r: any) => r.Variable === 'Model')?.Value;
      const year = parseInt(
        results.find((r: any) => r.Variable === 'Model Year')?.Value
      );
      const trim = results.find((r: any) => r.Variable === 'Trim')?.Value;

      if (!make || !model || !year) {
        return null;
      }

      return {
        make,
        model,
        year,
        trim: trim || undefined,
        vin,
      };
    } catch (error) {
      console.error('Error decoding VIN:', error);
      return null;
    }
  },

  /**
   * Get all makes
   */
  async getAllMakes(): Promise<MakeModel[]> {
    try {
      const response = await fetch(
        `${Config.nhtsa.apiUrl}/vehicles/GetAllMakes?format=json`
      );
      const data = await response.json();

      if (!data.Results) {
        return [];
      }

      return data.Results.map((make: any) => ({
        makeId: make.Make_ID,
        makeName: make.Make_Name,
      }));
    } catch (error) {
      console.error('Error fetching makes:', error);
      return [];
    }
  },

  /**
   * Get models for a specific make and year
   */
  async getModelsForMakeYear(make: string, year: number): Promise<string[]> {
    try {
      const response = await fetch(
        `${Config.nhtsa.apiUrl}/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`
      );
      const data = await response.json();

      if (!data.Results) {
        return [];
      }

      return data.Results.map((model: any) => model.Model_Name);
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  },
};
