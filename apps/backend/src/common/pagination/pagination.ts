export const DEFAULT_PAGE = 1;
export const DEFAULT_SIZE = 50;
export const MAX_SIZE = 200;

export function buildPagination(page?: number, size?: number) {
  const safePage = page && page > 0 ? page : DEFAULT_PAGE;
  const rawSize = size && size > 0 ? size : DEFAULT_SIZE;
  const safeSize = Math.min(rawSize, MAX_SIZE);
  const skip = (safePage - 1) * safeSize;
  return { skip, take: safeSize };
}
