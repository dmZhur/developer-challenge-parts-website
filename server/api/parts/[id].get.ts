import { parts } from '../../data/parts';

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id');
  const part = parts.find((p) => p.id === id);

  if (!part) {
    throw createError({ statusCode: 404, statusMessage: 'Part not found' });
  }

  return part;
});
