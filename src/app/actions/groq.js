"use server";

import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "openai/gpt-oss-20b";

async function generateWithGroq(prompt) {
    const result = await groq.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: "system",
                content:
                    "You are a professional blog writer and editor. Generate high-quality, original, well-structured HTML content. Return only the HTML content without markdown code fences.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.7,
        max_completion_tokens: 4000,
    });

    return result.choices[0]?.message?.content || "";
}

export async function generateBlogContent(title, category = "", tags = []) {
    try {
        if (!title || title.trim().length === 0) {
            throw new Error("Title Is Required To Generate Content");
        }

        const prompt = `
Write a comprehensive blog post with the title: "${title}"

${category ? `Category: ${category}` : ""}
${tags.length > 0 ? `Tags: ${tags.join(", ")}` : ""}

Requirements:
- Write engaging, informative content.
- Use proper HTML formatting.
- Include 3-5 main sections.
- Use h2 for main headings and h3 for subsections.
- Use p tags for paragraphs.
- Use ul and li for bullet points.
- Use strong and em for emphasis.
- Write in a conversational yet professional tone.
- Aim for approximately 800-1200 words.
- Include practical examples and actionable advice.
- Ensure the content is original and valuable.

Do not include the blog title in the content.
Start directly with the introduction paragraph.
`;

        const content = await generateWithGroq(prompt);

        if (!content || content.trim().length < 100) {
            throw new Error("Generated Content Is Too Short Or Empty");
        }

        return {
            success: true,
            content: content.trim(),
        };
    } catch (error) {
        console.error("Groq AI Error:", error);

        if (error.status === 429) {
            return {
                success: false,
                error: "AI Usage Limit Reached. Please Try Again Later.",
            };
        }

        if (error.status === 401) {
            return {
                success: false,
                error: "AI Service Configuration Error.",
            };
        }

        return {
            success: false,
            error: error.message || "Failed To Generate Content.",
        };
    }
}

export async function improveContent(
    currentContent,
    improvementType = "enhance",
) {
    try {
        if (!currentContent || currentContent.trim().length === 0) {
            throw new Error("Content Is Required For Improvement");
        }

        let prompt = "";

        switch (improvementType) {
            case "expand":
                prompt = `
Expand this blog content with more details, examples and insights:

${currentContent}

Requirements:
- Keep the existing structure and main points.
- Add more depth to each section.
- Include practical examples.
- Maintain the original tone and style.
- Return the improved content in HTML format.
`;
                break;

            case "simplify":
                prompt = `
Simplify this blog content:

${currentContent}

Requirements:
- Keep all main points.
- Use simpler language.
- Remove unnecessary complexity.
- Improve readability.
- Maintain HTML formatting.
`;
                break;

            default:
                prompt = `
Improve this blog content:

${currentContent}

Requirements:
- Improve flow and readability.
- Add engaging transitions.
- Enhance examples and explanations.
- Maintain the original HTML structure.
- Keep approximately the same length.
- Make it more engaging.
`;
        }

        const improvedContent = await generateWithGroq(prompt);

        if (!improvedContent || improvedContent.trim().length < 100) {
            throw new Error("Improved Content Is Too Short Or Empty");
        }

        return {
            success: true,
            content: improvedContent.trim(),
        };
    } catch (error) {
        console.error("Groq Content Improvement Error:", error);

        if (error.status === 429) {
            return {
                success: false,
                error: "AI Usage Limit Reached. Please Try Again Later.",
            };
        }

        return {
            success: false,
            error: error.message || "Failed To Improve Content.",
        };
    }
}
