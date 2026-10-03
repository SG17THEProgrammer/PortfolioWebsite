/**
 * POST /api/save-projects
 * Body: { secret: string, projects: Project[] }
 * Saves projects array to Netlify Blobs — admin only.
 */
import { getStore } from '@netlify/blobs';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('Bad JSON', { status: 400 });
  }

  if (!ADMIN_SECRET || body.secret !== ADMIN_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const store = getStore('portfolio');
    await store.setJSON('projects', body.projects ?? []);
    return Response.json({ ok: true });
  } catch (e) {
    return new Response('Storage error: ' + e.message, { status: 500 });
  }
};

export const config = { path: '/api/save-projects' };
