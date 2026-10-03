/**
 * GET /api/get-projects
 * Returns the saved projects array from Netlify Blobs.
 */
import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  try {
    const store = getStore('portfolio');
    const data  = await store.get('projects', { type: 'json' });
    return Response.json(data ?? []);
  } catch (e) {
    return Response.json([], { status: 200 }); // first run — nothing saved yet
  }
};

export const config = { path: '/api/get-projects' };
