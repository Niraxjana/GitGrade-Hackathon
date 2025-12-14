import { analyzeRepository } from "../utils/repoScorer.js";

import { parseGithubUrl } from "../utils/githubParser.js";
import { fetchRepositoryData } from "../services/github.service.js";

export const analyzeRepositoryController = async (req, res) => {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl) {
      return res.status(400).json({ error: "GitHub repository URL is required" });
    }

    const { owner, repo } = parseGithubUrl(repoUrl);
    const repoData = await fetchRepositoryData(owner, repo);

    const basicStats = {
      totalFiles: repoData.files.length,
      totalCommits: repoData.commits.length,
      languages: Object.keys(repoData.languages),
      hasReadme: !!repoData.readme
    };

    // Move your analyzeRepository call here
    const analysis = analyzeRepository({
      commits: repoData.commits,
      files: repoData.files,
      readme: repoData.readme,
      languages: repoData.languages
    });

    res.json({
      repository: `${owner}/${repo}`,
      stats: basicStats,
      analysis
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
