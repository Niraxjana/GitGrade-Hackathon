import axios from "axios";

const GITHUB_BASE_URL = "https://api.github.com";

const headers = {
  Accept: "application/vnd.github+json"
};


export const fetchRepositoryData = async (owner, repo) => {
  try {
    const repoUrl = `${GITHUB_BASE_URL}/repos/${owner}/${repo}`;

    const [
      repoInfo,
      contents,
      commits,
      languages,
      readme
    ] = await Promise.all([
      axios.get(repoUrl, { headers }),
      axios.get(`${repoUrl}/contents`, { headers }),
      axios.get(`${repoUrl}/commits?per_page=100`, { headers }),
      axios.get(`${repoUrl}/languages`, { headers }),
      axios.get(`${repoUrl}/readme`, { headers }).catch(() => null)
    ]);

    return {
      repoInfo: repoInfo.data,
      files: contents.data,
      commits: commits.data,
      languages: languages.data,
      readme: readme ? readme.data : null
    };

  } catch (error) {
    console.error(
      "GitHub API Error:",
      error.response?.status,
      error.response?.data?.message
    );

    if (error.response?.status === 404) {
      throw new Error("Repository not found or is private");
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("Invalid GitHub token or rate limit exceeded");
    }

    throw new Error("Failed to fetch GitHub repository data");
  }
};
