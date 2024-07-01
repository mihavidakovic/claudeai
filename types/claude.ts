export interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: ClaudeMessage[];
}

export interface ClaudeResponse {
  content: Array<{ text: string }>;
}

export interface StoryRequest {
  name: string;
  age: number;
  gender: string;
  plot: string;
  genre: string;
}

export interface StoryResponse {
  title: string[];
  content: string[];
  descriptions: string[];
}
