import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(image) {
    if (!image) return null;
    if (image.startsWith('http') || image.startsWith('data:')) return image;
    
    // Fallback to S3 bucket URL from next.config.mjs
    const baseUrl = "https://wiqi-assets-mumbai.s3.ap-south-1.amazonaws.com/";
    return `${baseUrl}${image}`;
}
