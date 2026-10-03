/**
 * POST /api/list-repos
 * Body: { secret: string }
 * Returns all public repos for GITHUB_USERNAME — admin only.
 */

const GITHUB_USERNAME = 'SG17THEProgrammer';
const ADMIN_SECRET    = process.env.ADMIN_SECRET;

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

  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
    { headers: { 'User-Agent': 'portfolio-bot' } }
  );

  if (!res.ok) {
    return new Response('GitHub error: ' + res.status, { status: 502 });
  }

  const repos = await res.json();
  return Response.json(
    repos.map(r => ({
      name:     r.name,
      language: r.language ?? '',
      topics:   r.topics  ?? [],
      stars:    r.stargazers_count ?? 0,
    }))
  );
};

export const config = { path: '/api/list-repos' };
