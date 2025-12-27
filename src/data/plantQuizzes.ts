
export interface PlantQuizQuestion {
  question: string;
  options: string[];
  answer: number; // index of correct option
}

export type PlantQuizMap = Record<string, PlantQuizQuestion[]>;

export const plantQuizzes: PlantQuizMap = {
  Giloy: [
    {
      question: "What is Giloy famous for in traditional medicine?",
      options: ["Improving vision", "Boosting immunity", "Relieving headaches", "Curing diabetes"],
      answer: 1,
    },
    {
      question: "Which part of Giloy is mainly used?",
      options: ["Root", "Flower", "Leaf", "Seed"],
      answer: 0,
    },
    {
      question: "Giloy is also known as?",
      options: ["Neem", "Tulsi", "Amrita", "Ashwagandha"],
      answer: 2,
    },
    {
      question: "Giloy detoxifies which organ the most?",
      options: ["Heart", "Liver", "Stomach", "Eye"],
      answer: 1,
    }
  ],
  Neem: [
    {
      question: "What property is Neem well-known for?",
      options: ["Antiseptic", "Painkiller", "Laxative", "Stimulant"],
      answer: 0,
    },
    {
      question: "Neem leaves are widely used for?",
      options: ["Treating skin problems", "Improving hair growth", "Boosting memory", "Weight gain"],
      answer: 0,
    },
    {
      question: "Which part of Neem is less commonly used?",
      options: ["Leaf", "Bark", "Flower", "Stone"],
      answer: 3,
    },
    {
      question: "Neem is mostly related with which Ayurveda use?",
      options: ["Respiratory", "Digestive", "Dermatological", "Cardiac"],
      answer: 2,
    }
  ],
  // Add more plants/questions here as needed
};
