export interface PlantExtended {
  id: number;
  name: string;
  scientificName: string;
  image: string;
  tourVideo?: string;
  category: "immunity" | "skincare" | "digestive" | "stress" | "detox" | "haircare";
  description: string;
  benefitsTags: string[];
  fullBenefits: string[];
  detailedUses: string[];
  precautions: string[];
  relatedHerbs: string[];
  symptoms: string[];
  goals: string[];
}

export const plantsExtended: PlantExtended[] = [
  {
    id: 1,
    name: "Giloy (Guduchi)",
    scientificName: "Tinospora cordifolia",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/_O6hAOb8XeU",
    category: "immunity",
    description: "Detoxifies the body, boosts immunity, and helps fight chronic infections.",
    benefitsTags: ["Immunity", "Detox", "Fever Relief"],
    fullBenefits: [
      "Purifies blood and flushes out metabolic toxins",
      "Boosts immune response and fights recurrent infections",
      "Reduces chronic fever and systemic inflammation",
      "Improves digestion, gut health, and liver functions"
    ],
    detailedUses: [
      "Mix 15-30 ml of Giloy juice in warm water and consume in the morning on an empty stomach.",
      "Take 1 Giloy tablet/capsule twice a day after meals."
    ],
    precautions: [
      "Autoimmune patients should consult a physician before long-term use.",
      "Monitor blood sugar levels closely if taking diabetic medications."
    ],
    relatedHerbs: ["Amla (Indian Gooseberry)", "Tulsi (Holy Basil)", "Moringa (Drumstick Tree)"],
    symptoms: ["Fever", "Weak Immunity", "Toxins", "Fatigue", "Cold & Cough"],
    goals: ["Immunity Boost", "Detox"]
  },
  {
    id: 2,
    name: "Amla (Indian Gooseberry)",
    scientificName: "Phyllanthus emblica",
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/oMWoyLPBv9A",
    category: "immunity",
    description: "Rich in Vitamin C, improves immunity, and aids digestion and metabolism.",
    benefitsTags: ["Immunity", "Digestion", "Hair Care"],
    fullBenefits: [
      "Extremely rich source of natural Vitamin C and bioflavonoids",
      "Improves digestive fire (Agni) and enhances metabolism",
      "Nourishes hair follicles, strengthens roots, and prevents hair fall",
      "Promotes youthful skin, healthy aging, and cell regeneration"
    ],
    detailedUses: [
      "Drink 10-20 ml of Amla juice mixed with water on an empty stomach in the morning.",
      "Eat 1 fresh Amla fruit daily or take Amla powder (1/2 tsp) with warm water."
    ],
    precautions: [
      "May cause hyperacidity in people with active peptic ulcers or high Pitta.",
      "Consume in moderation as high doses can lead to loose stools."
    ],
    relatedHerbs: ["Giloy (Guduchi)", "Aloe Vera (Ghritkumari)", "Mint (Pudina)"],
    symptoms: ["Indigestion", "Hair Fall", "Dull Skin", "Fatigue", "Weak Immunity"],
    goals: ["Immunity Boost", "Better Digestion", "Hair Growth"]
  },
  {
    id: 3,
    name: "Turmeric (Haldi)",
    scientificName: "Curcuma longa",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/KfQi8qQXr8g",
    category: "skincare",
    description: "Powerful anti-inflammatory and antioxidant, enhances skin health and immunity.",
    benefitsTags: ["Immunity", "Skin Care", "Anti-inflammatory"],
    fullBenefits: [
      "Reduces acne blemishes, fades hyperpigmentation, and brightens skin tone",
      "Powerful anti-inflammatory action provides relief to sore joints",
      "Boosts immune defense, cellular repair, and cardiovascular health",
      "Supports liver detoxification and digestive health"
    ],
    detailedUses: [
      "Drink warm golden milk (1/2 tsp Turmeric powder in warm milk) at bedtime.",
      "Apply a topical paste of Turmeric, honey, and milk to the skin for 15 minutes."
    ],
    precautions: [
      "Avoid high medicinal doses if you have gallstones or bile duct obstruction.",
      "Consult a doctor if taking blood thinners, as Turmeric can enhance their effect."
    ],
    relatedHerbs: ["Neem (Indian Lilac)", "Aloe Vera (Ghritkumari)", "Holy Basil (Tulsi Variant)"],
    symptoms: ["Acne", "Joint Pain", "Weak Immunity", "Skin Redness", "Skin Acne / Blemishes"],
    goals: ["Immunity Boost", "Skin Care"]
  },
  {
    id: 4,
    name: "Neem (Indian Lilac)",
    scientificName: "Azadirachta indica",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/MQnJROlQMQg",
    category: "skincare",
    description: "Renowned for its powerful antiseptic, blood purifying, and skin healing properties.",
    benefitsTags: ["Skin Care", "Detox", "Antiseptic"],
    fullBenefits: [
      "Clears severe acne, eczema, fungal infections, and skin blemishes",
      "Purifies blood, flushes out internal toxins, and cools skin irritation",
      "Controls dandruff, scalp itching, and promotes healthy hair follicles",
      "Supports oral hygiene, fights plaque, and enhances gum health"
    ],
    detailedUses: [
      "Apply Neem leaf paste or diluted Neem oil onto skin blemishes or scalp.",
      "Chew 2-3 clean tender Neem leaves daily or drink small amounts of Neem tea."
    ],
    precautions: [
      "Do not consume Neem internally continuously for more than 2-3 weeks.",
      "Avoid completely during pregnancy, lactation, and for small children."
    ],
    relatedHerbs: ["Turmeric (Haldi)", "Aloe Vera (Ghritkumari)", "Mint (Pudina)"],
    symptoms: ["Acne", "Skin Infections", "Toxins", "Dandruff", "Skin Acne / Blemishes", "Hair Fall"],
    goals: ["Skin Care", "Detox"]
  },
  {
    id: 5,
    name: "Tulsi (Holy Basil)",
    scientificName: "Ocimum sanctum",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/4Wv7TLmBZYk",
    category: "immunity",
    description: "Boosts immunity, fights infections, and improves respiratory health.",
    benefitsTags: ["Immunity", "Stress Relief", "Respiratory"],
    fullBenefits: [
      "Relieves cough, cold, respiratory congestion, and sore throat",
      "Acts as a powerful adaptogen to reduce mental stress and anxiety",
      "Antibacterial, antiviral, and antioxidant properties boost immune defense",
      "Improves digestion, relieves gas, and balances stomach acid"
    ],
    detailedUses: [
      "Brew Tulsi tea by boiling 5-7 leaves in water for 5 minutes; drink warm.",
      "Chew 3-5 fresh leaves on an empty stomach in the morning."
    ],
    precautions: [
      "May lower blood glucose levels; diabetics should monitor blood sugar.",
      "Avoid excessively high quantities if trying to conceive."
    ],
    relatedHerbs: ["Giloy (Guduchi)", "Brahmi", "Ashwagandha (Indian Ginseng)"],
    symptoms: ["Cough & Cold", "Stress", "Anxiety", "Weak Immunity", "Fever"],
    goals: ["Immunity Boost", "Stress Relief"]
  },
  {
    id: 6,
    name: "Moringa (Drumstick Tree)",
    scientificName: "Moringa oleifera",
    image: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/FcnHDjJAfDs",
    category: "immunity",
    description: "A nutrient-dense superfood that supports immune health and reduces inflammation.",
    benefitsTags: ["Immunity", "Detox", "Energy Boost"],
    fullBenefits: [
      "Rich in iron, calcium, Vitamin A, Vitamin C, and plant-based protein",
      "Protects the liver, supports detox, and aids cell repair",
      "Reduces joint inflammation, arthritis pain, and swelling",
      "Combats fatigue, restores energy, and boosts stamina"
    ],
    detailedUses: [
      "Add 1 teaspoon of Moringa leaf powder to smoothies, soups, or warm water.",
      "Eat cooked Moringa pods (drumsticks) or leaves in meals."
    ],
    precautions: [
      "Moringa bark or root extracts should be strictly avoided during pregnancy.",
      "May lower blood pressure; monitor if you take pressure medications."
    ],
    relatedHerbs: ["Giloy (Guduchi)", "Amla (Indian Gooseberry)", "Shatavari"],
    symptoms: ["Fatigue", "Joint Pain", "Weak Immunity", "Toxins", "Nutritional Deficiency"],
    goals: ["Immunity Boost", "Detox"]
  },
  {
    id: 7,
    name: "Mint (Pudina)",
    scientificName: "Mentha piperita",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/S12mEYVTLhQ",
    category: "digestive",
    description: "Soothes the digestive tract, refreshes skin, and provides cooling relief.",
    benefitsTags: ["Digestion", "Skin Care", "Cooling"],
    fullBenefits: [
      "Soothes stomach cramps, bloating, and relieves indigestion",
      "Refreshes breath, cures bad breath, and alleviates morning sickness",
      "Cooling effect reduces skin inflammation, redness, and acne breakouts",
      "Enhances mental alertness and relieves stress-related headaches"
    ],
    detailedUses: [
      "Drink fresh mint leaf tea after meals for digestion.",
      "Apply fresh crushed mint juice to skin blemishes or acne spots."
    ],
    precautions: [
      "May worsen symptoms of acid reflux (GERD) in sensitive individuals.",
      "Avoid applying pure peppermint oil directly to children's faces."
    ],
    relatedHerbs: ["Aloe Vera (Ghritkumari)", "Amla (Indian Gooseberry)", "Neem (Indian Lilac)"],
    symptoms: ["Indigestion", "Bloating", "Nausea", "Acne", "Skin Acne / Blemishes", "Stress"],
    goals: ["Better Digestion", "Skin Care"]
  },
  {
    id: 8,
    name: "Aloe Vera (Ghritkumari)",
    scientificName: "Aloe barbadensis",
    image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/SKqcqk6Cmt8",
    category: "skincare",
    description: "Hydrates and soothes the skin, heals wounds, and supports digestion.",
    benefitsTags: ["Skin Care", "Digestion", "Immunity"],
    fullBenefits: [
      "Deeply hydrates dry skin and soothes sunburns or acne inflammation",
      "Supports regular bowel movements, relieves constipation, and heals gut lining",
      "Enhances hair texture, moisturizes scalp, and controls dandruff",
      "Provides vital antioxidants and vitamins to support immunity"
    ],
    detailedUses: [
      "Apply fresh inner leaf gel directly to skin or scalp.",
      "Mix 20 ml of organic Aloe Vera juice in warm water and drink in the morning."
    ],
    precautions: [
      "Do not ingest the yellow latex layer (aloin) which has a harsh laxative effect.",
      "Do not ingest during pregnancy or lactation."
    ],
    relatedHerbs: ["Turmeric (Haldi)", "Mint (Pudina)", "Amla (Indian Gooseberry)"],
    symptoms: ["Acne", "Dry Skin", "Constipation", "Hair Fall", "Skin Acne / Blemishes", "Indigestion"],
    goals: ["Skin Care", "Better Digestion", "Hair Growth"]
  },
  {
    id: 9,
    name: "Ashwagandha (Indian Ginseng)",
    scientificName: "Withania somnifera",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/fm71OWdF7Z4",
    category: "stress",
    description: "A potent adaptogen that reduces stress, enhances vitality, and boosts energy levels.",
    benefitsTags: ["Stress Relief", "Immunity", "Vitality"],
    fullBenefits: [
      "Significantly lowers cortisol levels, alleviating stress and anxiety",
      "Improves sleep quality and helps manage chronic insomnia",
      "Enhances muscle strength, physical stamina, and overall vitality",
      "Supports thyroid health, hormone balance, and immune regulation"
    ],
    detailedUses: [
      "Mix 1/2 teaspoon of Ashwagandha powder in warm milk with honey at bedtime.",
      "Take 1 Ashwagandha capsule daily after a meal."
    ],
    precautions: [
      "May cause mild gastrointestinal discomfort in large doses.",
      "Not recommended during pregnancy or for individuals with hyperthyroidism."
    ],
    relatedHerbs: ["Brahmi", "Tulsi (Holy Basil)", "Shatavari"],
    symptoms: ["Stress", "Anxiety", "Insomnia", "Fatigue", "Weak Immunity"],
    goals: ["Stress Relief", "Immunity Boost"]
  },
  {
    id: 10,
    name: "Brahmi",
    scientificName: "Bacopa monnieri",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/-sbj7Y-JGfU",
    category: "stress",
    description: "Enhances cognitive function, memory, and helps relieve mental stress.",
    benefitsTags: ["Stress Relief", "Brain Health", "Immunity"],
    fullBenefits: [
      "Boosts memory recall, cognitive function, and concentration",
      "Calms the nervous system and reduces psychological stress and anxiety",
      "Contains powerful antioxidants that protect brain cells from free radicals",
      "Supports healthy hair growth and calms dry, itchy scalp conditions"
    ],
    detailedUses: [
      "Mix 1/4 teaspoon of Brahmi powder in warm water or milk twice daily.",
      "Massage head with Brahmi-infused sesame oil for stress relief and deep sleep."
    ],
    precautions: [
      "May cause dry mouth or mild abdominal cramps if consumed on an empty stomach.",
      "Can enhance the effect of sedative medications."
    ],
    relatedHerbs: ["Ashwagandha (Indian Ginseng)", "Tulsi (Holy Basil)", "Shatavari"],
    symptoms: ["Stress", "Anxiety", "Memory Loss", "Lack of Focus", "Hair Fall"],
    goals: ["Stress Relief", "Hair Growth"]
  },
  {
    id: 11,
    name: "Shatavari",
    scientificName: "Asparagus racemosus",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/bwpQ6-51z14",
    category: "immunity",
    description: "Promotes hormonal balance, supports women's health, and boosts immunity.",
    benefitsTags: ["Immunity", "Hormonal Balance", "Detox"],
    fullBenefits: [
      "Balances female reproductive hormones, eases PMS, and supports lactation",
      "Cooling, nutritive tonic that boosts cellular energy and vitality",
      "Helps the body adapt to physical and mental stress (adaptogenic)",
      "Soothes hyperacidity and maintains healthy digestive tract lining"
    ],
    detailedUses: [
      "Take 1/2 teaspoon of Shatavari powder with warm milk or water twice daily after meals.",
      "Take Shatavari capsules under the guidance of an Ayurvedic doctor."
    ],
    precautions: [
      "Avoid if allergic to asparagus or related plants.",
      "Use with caution in conditions associated with high estrogen levels."
    ],
    relatedHerbs: ["Ashwagandha (Indian Ginseng)", "Moringa (Drumstick Tree)", "Giloy (Guduchi)"],
    symptoms: ["Hormonal Imbalance", "Fatigue", "Weak Immunity", "Acid Reflux", "Indigestion"],
    goals: ["Immunity Boost", "Detox"]
  },
  {
    id: 12,
    name: "Holy Basil (Tulsi Variant)",
    scientificName: "Ocimum tenuiflorum",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=2070",
    tourVideo: "https://www.youtube.com/embed/nZx1DPBf0t4",
    category: "skincare",
    description: "Purifies the skin, prevents breakouts, and offers antimicrobial benefits.",
    benefitsTags: ["Skin Care", "Immunity", "Respiratory"],
    fullBenefits: [
      "Acts as a potent blood purifier, drawing out impurities and toxins",
      "Antimicrobial properties effectively target acne-causing bacteria",
      "Soothes skin rashes, minor cuts, insect bites, and eczema symptoms",
      "Purifies blood and respiratory channels, boosting overall vital force"
    ],
    detailedUses: [
      "Apply fresh crushed leaf juice directly on active acne blemishes for 10 mins.",
      "Add 8-10 leaves in boiling water and inhale steam for respiratory relief."
    ],
    precautions: [
      "Avoid excessive raw consumption if taking blood thinning medications.",
      "Keep intake within recommended levels."
    ],
    relatedHerbs: ["Turmeric (Haldi)", "Neem (Indian Lilac)", "Aloe Vera (Ghritkumari)"],
    symptoms: ["Acne", "Skin Redness", "Cough & Cold", "Toxins", "Skin Acne / Blemishes"],
    goals: ["Skin Care", "Immunity Boost"]
  }
];
