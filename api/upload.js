export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { file, filename } = req.body;

        // Your GitHub repo details
        const GITHUB_USERNAME = "615b"; // Replace with your GitHub username
        const REPO_NAME = "1g1v-uploads"; // Replace with your repository name
        const BRANCH = "main"; // Change if using a different branch
        const FILE_PATH = `uploads/${filename}`; // Save inside an 'uploads' folder
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Store this in Vercel's environment variables

        // Convert file to Base64
        const fileContent = Buffer.from(file, 'base64').toString('base64');

        // Create a commit in GitHub
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `token ${GITHUB_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: `Uploaded ${filename}`,
                    content: fileContent,
                    branch: BRANCH
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to upload file to GitHub");
        }

        // Return the file URL
        const fileUrl = `https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/${FILE_PATH}`;
        return res.status(200).json({ url: fileUrl });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
