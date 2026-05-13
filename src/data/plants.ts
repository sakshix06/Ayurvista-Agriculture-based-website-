export interface Plant {
  id: number;
  name: string;
  image: string;
  tourVideo?: string;
  sketchfabModelId?: string;
  category?: "immunity" | "skincare";
  description?: string;
}

export const plants: Plant[] = [
  {
    id: 1,
    name: "Giloy",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/_O6hAOb8XeU",
    category: "immunity",
    description:
      "Known as the root of immortality, Giloy boosts immunity, treats fever, and detoxifies the body."
  },
  {
    id: 2,
    name: "Amla",
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/oMWoyLPBv9A",
    category: "immunity",
    description:
      "Amla is rich in vitamin C, enhances immunity, and is used in Ayurveda for overall health."
  },
  {
    id: 3,
    name: "Turmeric",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/KfQi8qQXr8g",
    category: "skincare",
    description:
      "Rich in anti-inflammatory and antioxidant properties, Turmeric is used to enhance skin health and glow."
  },
  {
    id: 4,
    name: "Neem",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/MQnJROlQMQg",
    category: "skincare",
    description:
      "Neem is known for its antiseptic properties and is widely used in skincare for treating acne and wounds."
  },
  {
    id: 5,
    name: "Tulsi",
    image:
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/4Wv7TLmBZYk",
    category: "immunity",
    description:
      "Tulsi boosts immunity and acts as a natural remedy for colds, cough, and respiratory disorders."
  },
  {
    id: 6,
    name: "Moringa",
    image:
      "https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/FcnHDjJAfDs",
    category: "immunity",
    description:
      "Moringa is a superfood rich in nutrients that supports immune health and reduces inflammation."
  },
  {
    id: 7,
    name: "Mint",
    image:
      "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/S12mEYVTLhQ",
    category: "skincare",
    description:
      "Mint soothes skin and is used in many cosmetic products for its refreshing properties."
  },
  {
    id: 8,
    name: "Aloe Vera",
    image:
      "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/SKqcqk6Cmt8",
    category: "skincare",
    description:
      "Aloe Vera hydrates and soothes the skin, heals wounds, and is used extensively in skincare."
  },
  {
    id: 9,
    name: "Ashwagandha",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/fm71OWdF7Z4",
    category: "immunity",
    description:
      "Ashwagandha acts as an adaptogen, helping the body resist stress and boosting immune function."
  },
  {
    id: 10,
    name: "Brahmi",
    image:
      "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/-sbj7Y-JGfU",
    category: "immunity",
    description:
      "Brahmi enhances cognitive function and also plays a role in strengthening immune response."
  },
  {
    id: 11,
    name: "Shatavari",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/bwpQ6-51z14",
    category: "immunity",
    description:
      "Shatavari is known to boost immunity and support women’s health."
  },
  {
    id: 12,
    name: "Holy Basil",
    image:
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/nZx1DPBf0t4",
    category: "skincare",
    description:
      "Holy Basil purifies the skin, prevents breakouts, and offers antimicrobial benefits."
  }
];