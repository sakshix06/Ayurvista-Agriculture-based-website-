export interface Plant {
  id: string;
  commonName: string;
  botanicalName: string;
  image: string;
  waterRequirement: string;
  lightCondition: string;
  frequency: string;
  temperatureRange: string;
  description: string;
}

export const popularPlants: Plant[] = [
  {
    id: "aloe-vera",
    commonName: "Aloe Vera",
    botanicalName: "Aloe barbadensis miller",
    image: "🌵",
    waterRequirement: "250–500 ml",
    lightCondition: "Bright, indirect light",
    frequency: "Once every 2-3 weeks",
    temperatureRange: "18-24°C (65-75°F)",
    description: "Aloe Vera is a succulent plant known for its medicinal properties. The gel inside its leaves is used for treating burns, cuts, and skin irritations. It's easy to care for and thrives in bright, indirect sunlight with minimal watering."
  },
  {
    id: "golden-money-plant",
    commonName: "Golden Money Plant",
    botanicalName: "Epipremnum aureum",
    image: "🍃",
    waterRequirement: "200–400 ml",
    lightCondition: "Medium to bright indirect light",
    frequency: "Once a week",
    temperatureRange: "20-30°C (68-86°F)",
    description: "The Golden Money Plant, also known as Devil's Ivy, is a popular houseplant with heart-shaped leaves. It's believed to bring good luck and prosperity. This trailing plant is perfect for hanging baskets and requires minimal maintenance."
  },
  {
    id: "cactus",
    commonName: "Cactus",
    botanicalName: "Cactaceae family",
    image: "🌵",
    waterRequirement: "100–200 ml",
    lightCondition: "Full sun to bright light",
    frequency: "Once every 3-4 weeks",
    temperatureRange: "15-30°C (59-86°F)",
    description: "Cacti are desert plants that store water in their thick stems. They come in various shapes and sizes, from small decorative plants to large outdoor specimens. Perfect for beginners as they require very little care and water."
  },
  {
    id: "autumn-fern",
    commonName: "Autumn Fern",
    botanicalName: "Dryopteris erythrosora",
    image: "🌿",
    waterRequirement: "300–500 ml",
    lightCondition: "Partial to full shade",
    frequency: "2-3 times a week",
    temperatureRange: "15-25°C (59-77°F)",
    description: "The Autumn Fern is known for its beautiful coppery-red new fronds that mature to deep green. It's an excellent choice for shady gardens and adds texture and color to indoor spaces. Prefers consistently moist soil."
  },
  {
    id: "monstera-deliciosa",
    commonName: "Monstera Deliciosa",
    botanicalName: "Monstera deliciosa",
    image: "🌱",
    waterRequirement: "400–600 ml",
    lightCondition: "Bright, indirect light",
    frequency: "Once a week",
    temperatureRange: "20-30°C (68-86°F)",
    description: "Also known as the Swiss Cheese Plant, Monstera Deliciosa is famous for its large, split leaves. It's a fast-growing tropical plant that can reach impressive sizes. Perfect for creating a jungle-like atmosphere in your home."
  },
  {
    id: "coffee-fern",
    commonName: "Coffee Fern",
    botanicalName: "Pellaea andromedifolia",
    image: "☕",
    waterRequirement: "250–400 ml",
    lightCondition: "Bright, indirect light",
    frequency: "2-3 times a week",
    temperatureRange: "18-24°C (65-75°F)",
    description: "The Coffee Fern is a delicate, lacy fern with dark green fronds. Despite its name, it's not related to coffee plants but gets its name from the rich, dark color of its foliage. It adds elegance to any indoor space."
  },
  {
    id: "ashwagandha",
    commonName: "Ashwagandha",
    botanicalName: "Withania somnifera",
    image: "🌿",
    waterRequirement: "300–500 ml",
    lightCondition: "Full sun to partial shade",
    frequency: "Once every 3-4 days",
    temperatureRange: "20-35°C (68-95°F)",
    description: "Ashwagandha is a powerful adaptogenic herb in Ayurveda known as 'Indian Winter Cherry'. It helps reduce stress, improves sleep quality, enhances muscle strength, and boosts overall vitality. The roots are used in traditional medicine."
  },
  {
    id: "brahmi",
    commonName: "Brahmi",
    botanicalName: "Bacopa monnieri",
    image: "🧠",
    waterRequirement: "400–600 ml",
    lightCondition: "Partial shade to full sun",
    frequency: "Daily",
    temperatureRange: "22-30°C (72-86°F)",
    description: "Brahmi is a sacred herb in Ayurveda known for enhancing memory and cognitive function. It's often called 'the herb of grace' and is used to improve concentration, reduce anxiety, and support brain health."
  },
  {
    id: "amla",
    commonName: "Amla (Indian Gooseberry)",
    botanicalName: "Phyllanthus emblica",
    image: "🟢",
    waterRequirement: "500–800 ml",
    lightCondition: "Full sun",
    frequency: "Once every 2-3 days",
    temperatureRange: "15-35°C (59-95°F)",
    description: "Amla is one of the richest sources of Vitamin C and is considered a superfood in Ayurveda. It boosts immunity, improves digestion, promotes healthy skin and hair, supports heart health, and helps regulate blood sugar levels."
  },
  {
    id: "neem",
    commonName: "Neem",
    botanicalName: "Azadirachta indica",
    image: "🌳",
    waterRequirement: "600–1000 ml",
    lightCondition: "Full sun",
    frequency: "Once every 4-5 days",
    temperatureRange: "20-40°C (68-104°F)",
    description: "Neem is called 'the village pharmacy' in Ayurveda due to its numerous medicinal properties. It has antibacterial, antifungal, and antiviral properties. Excellent for skin health, oral hygiene, blood purification, and boosting immunity."
  },
  {
    id: "moringa",
    commonName: "Moringa (Drumstick Tree)",
    botanicalName: "Moringa oleifera",
    image: "🥬",
    waterRequirement: "400–600 ml",
    lightCondition: "Full sun",
    frequency: "Once every 2-3 days",
    temperatureRange: "25-35°C (77-95°F)",
    description: "Moringa is known as 'the miracle tree' and is packed with nutrients. It contains 7 times more Vitamin C than oranges, 4 times more Vitamin A than carrots, and is rich in protein, calcium, and iron. Great for overall health and energy."
  }
];
