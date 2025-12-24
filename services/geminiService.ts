
import { GoogleGenAI } from "@google/genai";
import { BuildResult, BuildType } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const createPrompt = (fileName: string, buildType: BuildType): string => `
You are an expert Android build system simulator. Your task is to generate a realistic build log for an Android project. The user has provided the following details:
- Project ZIP file: "${fileName}"
- Build Type: "${buildType}"

Generate a step-by-step build log that a developer would see in their terminal. Follow these steps precisely and do not add any extra commentary or explanations.

1.  Start with a line indicating the extraction of the ZIP file.
2.  Simulate running \`./gradlew clean\`. Show typical output for cleaning tasks. Include realistic task timings.
3.  Simulate running \`./gradlew assemble${buildType.charAt(0).toUpperCase() + buildType.slice(1)}\`. Show tasks like \`:app:compile${buildType.charAt(0).toUpperCase() + buildType.slice(1)}Kotlin\`, \`:app:merge${buildType.charAt(0).toUpperCase() + buildType.slice(1)}Resources\`, and \`:app:package${buildType.charAt(0).toUpperCase() + buildType.slice(1)}\`. This should be the longest part of the log with multiple task outputs.
4.  Simulate running \`./gradlew bundle${buildType.charAt(0).toUpperCase() + buildType.slice(1)}\`. Show tasks related to creating the AAB.
5.  Conclude with a clear "BUILD SUCCESSFUL" message in a specific total time (e.g., "in 1m 25s").
6.  IMPORTANT: After the entire build log, on a new line, output a single, raw JSON object enclosed in \`\`\`json ... \`\`\`. This JSON must represent the build report and have the following exact structure:
    {
      "success": true,
      "apk": {
        "name": "app-${buildType}.apk",
        "size": "[generate a realistic size in MB, e.g., '12.5 MB']"
      },
      "aab": {
        "name": "app-${buildType}.aab",
        "size": "[generate a realistic size in MB, e.g., '8.9 MB']"
      },
      "warnings": [
        "[generate 0 to 2 plausible-sounding build warnings, or an empty array]"
      ]
    }

The output must be a continuous stream of text, simulating a real-time console. Do not add any text before the log or after the JSON block.
`;

const parseFinalResponse = (responseText: string): BuildResult | null => {
    const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = responseText.match(jsonBlockRegex);
    if (match && match[1]) {
        try {
            return JSON.parse(match[1]);
        } catch (e) {
            console.error("Failed to parse build result JSON:", e);
            return null;
        }
    }
    return null;
};

export const simulateAndroidBuild = async (
    fileName: string,
    buildType: BuildType,
    onLogUpdate: (logChunk: string) => void,
    onResult: (result: BuildResult) => void
) => {
    const model = 'gemini-3-flash-preview';
    const prompt = createPrompt(fileName, buildType);

    const responseStream = await ai.models.generateContentStream({
        model: model,
        contents: prompt,
    });

    let fullResponseText = "";
    for await (const chunk of responseStream) {
        if (chunk.text) {
             // Split by newlines to stream line-by-line for a better console effect
            const lines = chunk.text.split('\n');
            lines.forEach(line => {
                if (line.trim()) { // Avoid empty lines
                    onLogUpdate(line);
                }
            });
            fullResponseText += chunk.text;
        }
    }

    const result = parseFinalResponse(fullResponseText);
    if (result) {
        onResult(result);
    } else {
        throw new Error("Could not parse the build report from the AI response.");
    }
};
