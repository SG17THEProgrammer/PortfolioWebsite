/**
 * POST /api/fetch-repo
 * Body: { secret: string, repoName: string }
 *
 * 1. Fetches repo metadata from GitHub API
 * 2. Fetches README text
 * 3. Calls Groq to produce a 1–2 sentence description
 * 4. Returns { name, description, language, topics, html_url, homepage }
 */

const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

async function fetchReadme(repoName) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`,
      {
        headers: {
          Accept: 'application/vnd.github.v3.raw',
          'User-Agent': 'portfolio-bot',
        },
      }
    );
    return res.ok ? await res.text() : '';
  } catch { return ''; }
}

async function groqSummarise(repoName, repoDesc, readmeText) {
  const context = [
    repoDesc ? `GitHub description: ${repoDesc}` : '',
    readmeText ? `README (first 1200 chars):\n${readmeText.slice(0, 1500)}` : '',
  ].filter(Boolean).join('\n\n');

  if (!context) return { description: repoDesc || 'No description available.', topics: [] };

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      //   max_tokens: 80,
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: `You are a professional portfolio builder. Your job is to write crisp, one or two sentence project descriptions for a developer portfolio. \
Be specific about what the project does. No filler phrases like "This project..." or "A web app that...". \
Start with a strong verb or noun. Keep it crisp. Anyone reading it should know about it just by reading. \
It should have a positive impact on anyone reading it. No long sentences or essays.

Return this exact JSON shape:
{
  "description": "one or two sentence project description, crisp and specific",
  "topics": ["tech1", "tech2", "tech3", "tech4"]
}

For topics: extract actual technologies, frameworks, libraries used. Max top 5 tags.`

        },
        {
          role: 'user',
          content: `Project: ${repoName}\n\n${context}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    console.error('Groq error', res.status, await res.text());
    return { description: repoDesc || 'No description available.', topics: [] };
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content?.trim() ?? '{}';

  try {
    const parsed = JSON.parse(raw);
    return {
      description: parsed.description ?? repoDesc ?? 'No description available.',
      topics: Array.isArray(parsed.topics) ? parsed.topics : [],
    };
  } catch {
    // if AI didn't return valid JSON, fall back
    return { description: raw, topics: [] };
  }
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let body;
  try { body = await req.json(); } catch {
    return new Response('Bad JSON', { status: 400 });
  }

  if (!ADMIN_SECRET || body.secret !== ADMIN_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { repoName } = body;
  if (!repoName) return new Response('repoName required', { status: 400 });

  // 1. GitHub metadata
  const ghRes = await fetch(
    `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}`,
    { headers: { 'User-Agent': 'portfolio-bot' } }
  );
  if (!ghRes.ok) {
    return new Response(`GitHub error: ${ghRes.status}`, { status: 502 });
  }
  const repo = await ghRes.json();

  // 2. README
  const readme = await fetchReadme(repoName);

  // 3. AI description + topics
  let description = repo.description || 'No description available.';
  let aiTopics = [];

  if (GROQ_API_KEY) {
    const result = await groqSummarise(repoName, repo.description, readme);
    description = result.description;
    aiTopics = result.topics;
  } else {
    description = repo.description || 'No description available.';
  }

  // merge GitHub topics + AI-detected topics, deduplicate
  const mergedTopics = [...new Set([...(repo.topics ?? []), ...aiTopics])];

  return Response.json({
    name: repo.name,
    displayName: repo.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description,
    language: repo.language ?? '',
    topics: mergedTopics,
    html_url: repo.html_url,
    homepage: repo.homepage ?? '',
    stars: repo.stargazers_count ?? 0,
    updatedAt: repo.updated_at,
  });
};

export const config = { path: '/api/fetch-repo' };
