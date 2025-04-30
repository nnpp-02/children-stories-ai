export type Book = {
  title: string;
  author: string;
  chapters: Chapter[];
};

export type Chapter = {
  title: string;
  content: string;
  imagePrompt: string;
  image: string;
  page: number;
};

export const data: Book = {
  title: "3 Little Acorns Learn About AI",
  author: "William",
  chapters: [
    {
      title: "A Curious Acorn",
      content:
        "Once upon a time, in a cozy oak tree, there were three little acorns named Oaky, Acorn, and Acorny. One day, Oaky, the most curious of the three, asked, 'What is this thing called AI that everyone keeps talking about?'",
      imagePrompt: "A curious acorn looking up at a computer screen",
      image: "/images/page1.jpeg",
      page: 1,
    },
    {
      title: "The Wise Old Owl",
      content:
        "A wise old owl, who lived in a nearby hollow, heard Oaky's question. 'AI, my young friend,' hooted the owl, 'is a clever tool that can think and learn, much like a human brain. It can solve problems, create art, and even drive cars!'",
      imagePrompt: "A wise old owl explaining AI to the acorns",
      image: "/images/page2.jpeg",
      page: 2,
    },
    {
      title: "Acorns Explore AI",
      content:
        "Intrigued, the three acorns decided to explore AI. They learned about robots that could dance and sing, and computers that could recognize faces. They even tried their hand at coding, creating simple programs that made their leaves glow.",
      imagePrompt: "The three acorns playing with a robot",
      image: "/images/page3.jpeg",
      page: 3,
    },
    {
      title: "A Lesson in Responsibility",
      content:
        "But the owl warned them, 'With great power comes great responsibility. AI can be a powerful tool, but it's important to use it wisely.' The acorns nodded, understanding the importance of using AI for good.",
      imagePrompt: "The wise old owl talking to the acorns",
      image: "/images/page4.jpeg",
      page: 4,
    },
    {
      title: "A Bright Future",
      content:
        "As the acorns grew older, they continued to learn about AI. They knew that with knowledge and responsibility, they could use AI to make the world a better place. And so, they set off on their adventure, ready to embrace the future.",
      imagePrompt:
        "The three acorns looking up at the sky, excited for the future",
      image: "/images/page1.jpeg",
      page: 5,
    },
  ],
};
