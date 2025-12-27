
import React from "react";
import { herbalStories } from "@/data/herbalStories";

interface HerbalStoryProps {
  plantName: string;
}

export const HerbalStory: React.FC<HerbalStoryProps> = ({ plantName }) => {
  const storyEntry = herbalStories.find(
    (story) => story.plantName.toLowerCase() === plantName.toLowerCase()
  );

  if (!plantName) return null;

  return (
    <div className="w-full mt-16 mb-4 p-6 bg-green-50 border border-green-200 rounded-2xl shadow flex flex-col items-center">
      <h3 className="text-2xl font-bold text-green-800 mb-3 text-center">Herbal Story</h3>
      <div className="text-lg text-gray-700 text-center max-w-2xl">
        {storyEntry
          ? storyEntry.story
          : "No herbal story found for this plant yet. Come back soon!"}
      </div>
    </div>
  );
};
