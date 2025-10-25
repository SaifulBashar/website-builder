import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload an image to Supabase Storage and get the public URL
 * @param file - The image file to upload
 * @param bucket - The storage bucket name (default: 'images')
 * @param path - Optional custom path within the bucket
 * @returns Promise with the public URL
 */
export async function uploadImage(
  file: File,
  bucket: string = 'images',
  path?: string
): Promise<string> {
  try {
    // Generate a unique filename if path not provided
    const fileName = path || `${Date.now()}_${file.name}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image to Supabase:', error);
    throw error;
  }
}

/**
 * Upload multiple images at once
 * @param files - Array of image files to upload
 * @param bucket - The storage bucket name (default: 'images')
 * @returns Promise with array of public URLs
 */
export async function uploadMultipleImages(
  files: File[],
  bucket: string = 'images'
): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) => uploadImage(file, bucket));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple images to Supabase:', error);
    throw error;
  }
}

/**
 * Delete an image from Supabase Storage
 * @param filePath - The path of the file to delete
 * @param bucket - The storage bucket name (default: 'images')
 */
export async function deleteImage(
  filePath: string,
  bucket: string = 'images'
): Promise<void> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image from Supabase:', error);
    throw error;
  }
}

/**
 * Get a signed URL for private files (expires in 1 hour by default)
 * @param filePath - The path of the file
 * @param bucket - The storage bucket name (default: 'images')
 * @param expiresIn - Expiration time in seconds (default: 3600)
 */
export async function getSignedUrl(
  filePath: string,
  bucket: string = 'images',
  expiresIn: number = 3600
): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      throw error;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL from Supabase:', error);
    throw error;
  }
}