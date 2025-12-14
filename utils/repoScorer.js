// utils/repoScorer.js

export const analyzeRepository = (data) => {
  // Example scoring logic
  const score = data.commits.length + data.files.length; // simple example
  const quality = score > 50 ? "Good" : "Average";

  return { score, quality };
};
