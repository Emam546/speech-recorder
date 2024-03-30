const isGithubActions = process.env.GITHUB_ACTIONS || false;

let basePath = "";

if (isGithubActions) {
    // trim off `<owner>/`
    const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, "");


    basePath = `/${repo}`;
}
/** @type {import('next').NextConfig} */
const NextConfig = {
    output: "export",
    basePath: basePath,
    images: {
        unoptimized: true,
    },
};
export default NextConfig;
