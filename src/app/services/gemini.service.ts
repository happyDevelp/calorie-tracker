import {Injectable} from "@angular/core";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class GeminiService {
  private apiKey = environment.geminiApiKey;
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(this.apiKey);
  }

  async analyzeImage(base64Image: string): Promise<{title: string, calories: number}> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-flash-latest',
        // force Gemini to respond with a json file
        generationConfig: { responseMimeType: 'application/json' }
      })
      const prompt = "Look at this meal. Identify the main dish and estimate calories. Return a JSON with keys:" +
        " 'title' (string) and 'calories' (number). Example: { \"title\": \"Apple\", \"calories\": 95 }";

      // Forming an image object for Gemini
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg',
        }
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      console.log(text);

      return JSON.parse(text);
    }
    catch (error) {
      console.error('Gemini Service Error:', error);
      throw error;
    }

  }

}
