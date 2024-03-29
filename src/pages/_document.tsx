import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link
                    rel="icon"
                    href="https://emam546.github.io/logo.png"
                    type="image/png"
                />
                <meta
                    name="description"
                    content="Speech Recorder - The Self-Recording Language Learning Tool is a web application designed to aid language learners in improving their language skills through self-recording and reflection. Leveraging the power of audio recording, this tool enables users to practice speaking in their target language, track their progress, and refine their pronunciation, fluency, and vocabulary."
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
