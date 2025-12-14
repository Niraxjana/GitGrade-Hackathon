import axios from "axios";

const GROK_API_KEY = process.env.GROK_API_KEY;

export async function analyzeRepoWithLLM({ owner, repo, files = [], commits = [], readme = "", languages = [] }) {
  // Ensure languages is an array
  const langList = Array.isArray(languages) ? languages : [];

  const prompt = `
Respond ONLY in JSON format like this:
{
  "scores": {
    "documentation": 0,
    "structure": 0,
    "consistency": 0,
    "languages": 0,
    "total": 0
  },
  "roadmap": ["suggestion1", "suggestion2", "suggestion3"],
  "insights": {
    "totalFiles": 0,
    "totalCommits": 0,
    "activeDays": 0
  }
}

Repository Info:
Name: ${owner}/${repo}
Languages: ${langList.join(", ")}
Commits: ${commits.length}
Files: ${files.length}
README: ${readme || "No README"}
`;

  const response = await axios.post(
    "https://api.grok.api/v1/completions",
    {
      model: "grok",
      prompt,
      max_tokens: 500
    },
    {
      headers: {
        Authorization: `Bearer ${GROK_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const llmText = response.data.choices?.[0]?.text || "";

  try {
    return JSON.parse(llmText); // Parse the JSON from LLM
  } catch {
    return { error: "Failed to parse LLM output", raw: llmText };
  }
}
