const isGithubActions = process.env.GITHUB_ACTIONS || false;

let assetPrefix = "";
let basePath = "";

if (isGithubActions) {
    // trim off `<owner>/`
    const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, "");

    assetPrefix = `/${repo}/`;
    basePath = `/${repo}`;
}
/** @type {import('next').NextConfig} */
const NextConfig = {
    assetPrefix: assetPrefix,
    output: "export",
    basePath: basePath,
    images: {
        unoptimized: true,
    },
};
export default NextConfig;
