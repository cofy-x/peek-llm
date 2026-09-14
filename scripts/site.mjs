/** Shared catalog access for the portal build and release checks. */
import { EXPERIENCES } from '../apps/portal/src/experiences.mjs';
export { root, portalRoot, siteBase, portalBudget } from './paths.mjs';
export function validateRegistry(experiences) {
  const ids = new Set(), paths = new Set();
  for (const experience of experiences) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(experience.id) || ids.has(experience.id)) throw new Error('Invalid or duplicate experience id');
    if (!new RegExp(`^/[a-z0-9]+(?:-[a-z0-9]+)*/${experience.id}$`).test(experience.path) || paths.has(experience.path)) throw new Error('Invalid or duplicate experience route');
    if (!new RegExp(`^packages/[a-z0-9]+(?:-[a-z0-9]+)*/${experience.id}/src/entry\\.tsx$`).test(experience.source)) throw new Error('Source must belong to the experience');
    if (!Number.isSafeInteger(experience.maxBytes) || experience.maxBytes < 1 || !experience.sizeReason?.trim()) throw new Error('Justified runtime budget required');
    for (const field of ['title', 'category', 'description', 'interaction', 'format', 'previewAlt']) if (!experience[field]?.trim()) throw new Error(`Missing ${field}`);
    if (typeof experience.load !== 'function') throw new Error('Lazy loader required');
    ids.add(experience.id); paths.add(experience.path);
  }
  return experiences;
}
export const experiences = validateRegistry(EXPERIENCES);
