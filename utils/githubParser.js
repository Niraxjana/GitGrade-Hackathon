export const parseGithubUrl = (repoUrl) => {
  try {
    const url = new URL(repoUrl);
    const parts = url.pathname.split("/").filter(Boolean);

    if (parts.length < 2) {
      throw new Error("Invalid GitHub repository URL");
    }

    return {
      owner: parts[0],
      repo: parts[1]
    };
  } catch (error) {
    throw new Error("Failed to parse GitHub URL");
  }
};
