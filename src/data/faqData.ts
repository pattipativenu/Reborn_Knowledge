// src/data/faqData.ts
export interface FAQItem {
  question: string;
  answer: string;
}

const rawFaqText = `1.    What is REBORN, and how can it transform my learning?
   * REBORN is a unique podcast-style audiobook platform designed to transform your learning journey. We provide key insights from non-fiction books, featuring well-researched, real-world examples that are integrated directly into the audio. This helps you understand how to apply positive learnings and avoid negatives in your life, relationships, and career.


2. How do I access REBORN?
   * You can access REBORN directly through our desktop website. (Mobile version: We are currently working on it.)


3. What kind of books does REBORN cover, and what is REBORN's core mission?
   * REBORN is the first platform to transform books into podcasts, going beyond traditional audiobooks. Our core mission is to help users truly understand and implement a book's key values, encouraging personal growth and helping them become a better version of themselves. All books in our current library are 100% copyright-free and publicly available, allowing us to understand user engagement as we develop. Soon, you will receive an update when our full library of books becomes publicly available. You can sign up or click here to get the latest updates.


4. Who narrates REBORN's audiobooks, and how does the AI work?
   * Our audiobooks are uniquely narrated by our advanced AI characters, Tara and James, providing a distinct podcast-style listening experience. Our intelligent AI, named Tara, helps you get questions answered, provides insights based on book content, and you can test your knowledge with Tara quizzes.


5. What makes REBORN's podcast-style audiobooks unique?
   * REBORN offers full-length, podcast-style audiobooks that seamlessly integrate well-researched, real-world examples directly into the audio narration. Our platform emphasises deep understanding and practical application, ensuring you gain actionable insights beyond just listening.




6. What features are included in REBORN's service? Is it free?
   * REBORN offers unlimited access to our library of high-quality, podcast-style audiobooks. Our service is currently provided at no cost.


7. How can I contact REBORN?
   * For any questions, support, or if you are interested in working with us, please email us directly at <a href="https://mail.google.com/mail/?view=cm&to=support@rebornknowledge.com" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">support@rebornknowledge.com</a>.`;

const parseFaqs = (text: string): FAQItem[] => {
  const faqs: FAQItem[] = [];
  // Split the text by numbered questions, capturing the number and the question text
  const sections = text.split(/\n(?=\d+\.\s)/);

  sections.forEach(section => {
    const match = section.match(/^(\d+)\.\s*(.*?)\n([\s\S]*)/);
    if (match) {
      const question = match[2].trim();
      const answer = match[3].trim().replace(/^\*\s*/, ''); // Remove leading asterisk
      faqs.push({ question, answer });
    }
  });
  return faqs;
};

export const faqData: FAQItem[] = parseFaqs(rawFaqText);