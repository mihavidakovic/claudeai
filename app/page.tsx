'use client';

import React, { useState, FormEvent } from 'react';
import { StoryRequest, StoryResponse } from '@/types/claude';

export default function Home() {
  const [storyRequest, setStoryRequest] = useState<StoryRequest>({
    name: '',
    age: 0,
    gender: '',
    plot: '',
    genre: ''
  });
  const [storyResponse, setStoryResponse] = useState<StoryResponse | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(storyRequest),
    });
    const data: StoryResponse = await res.json();
    setStoryResponse(data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStoryRequest(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value) : value }));
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bedtime Story Generator</h1>
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={storyRequest.name}
          onChange={handleInputChange}
          placeholder="Character Name"
          className="input"
        />
        <input
          type="number"
          name="age"
          value={storyRequest.age}
          onChange={handleInputChange}
          placeholder="Age"
          className="input"
        />
        <input
          type="text"
          name="gender"
          value={storyRequest.gender}
          onChange={handleInputChange}
          placeholder="Gender"
          className="input"
        />
        <input
          type="text"
          name="plot"
          value={storyRequest.plot}
          onChange={handleInputChange}
          placeholder="Plot"
          className="input"
        />
        <input
          type="text"
          name="genre"
          value={storyRequest.genre}
          onChange={handleInputChange}
          placeholder="Genre"
          className="input"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Generate Story
        </button>
      </form>
      {storyResponse && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">{storyResponse.title}</h2>
          {storyResponse.content.map((paragraph, index) => (
            <div key={index} className="mb-4">
              <p>{paragraph}</p>
              <p className="text-sm text-gray-600 mt-2">{storyResponse.descriptions[index]}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
