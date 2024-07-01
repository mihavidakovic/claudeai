// File: app/api/claude/route.ts
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { StoryRequest, StoryResponse } from "@/types/claude";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  const storyRequest = (await request.json()) as StoryRequest;

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4000,
      temperature: 0,
      system: `You are a children's bedtime storyteller. Your task is to create an entertaining, logical, engaging, imaginative, and captivating story for a young audience. The story should follow the structure of the dramatic triangle and be age-appropriate.

You will be given a main character name, age, gender, story main plot, and story genre

Create a 10-paragraph long bedtime story that matches the given genre. Each paragraph must be between 200 and 250 characters long. The story should:
1. Start with an introduction that sets the scene and introduces the main characters.
2. Build up to a climax where the characters face a significant challenge or problem.
3. Conclude with a resolution where the problem is resolved in a satisfying way, teaching a valuable lesson or moral.

Create a title for the story with a maximum of 40 characters.

Write the entire story in simple and grammatically correct English language.

Format your output as a JSON array with the following structure:
1. The title should be in an array named 'title' as a string.
2. The content should be in an array named 'content', with each paragraph in a separate array element.
3. Create a new array called "descriptions" with visual descriptions for each of the 10 paragraphs.

For the descriptions:
- Visually describe each paragraph in English.
- DO NOT USE NAMES, AGES, or specific looks.
- Describe what should be in the illustration, including the number of people, their actions, and the placement of all objects in the scene.
- Make each description independent of the others and do not reference previous or subsequent images.
- Ensure descriptions are detailed, including the placement of all elements in the illustration and what each character is doing.
- Describe the paragraph as you would for a painting artist to draw what is happening.
- ALWAYS mention the "main character" first, describe if what clothes are they wearing, and then ALWAYS visually describe people around them if present.
- Be sure to mention in description if main character is pregnant, sick, is wearing special uniform. You should always mention specific details in each description!

The final output should be structured as follows:
{"title": "<title>", "content": [<content>], "descriptions": [<descriptions>]}

Remember to adhere strictly to English language grammar rules and ensure the story is age-appropriate and sparks the imagination of young listeners.
Return just the JSON response.`,
      messages: [
        {
          role: "user",
          content: `name: ${storyRequest.name}, age: ${storyRequest.age}, gender: ${storyRequest.gender}, plot: ${storyRequest.plot}, genre: ${storyRequest.genre}`,
        },
      ],
    });

    // Extract the text content from the message
    let textContent = "";
    for (const content of msg.content) {
      if (content.type === "text") {
        textContent += content.text;
      }
    }

    // Parse the JSON response
    const storyResponse = JSON.parse(textContent) as StoryResponse;
    console.log(storyResponse);
    return NextResponse.json(storyResponse);
  } catch (error) {
    console.error("Error generating story:", error);
    return NextResponse.json(
      { error: "Failed to generate story" },
      { status: 500 }
    );
  }
}
