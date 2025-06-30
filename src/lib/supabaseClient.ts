import { createClient } from '@supabase/supabase-js';

// Use the provided Supabase credentials
const supabaseUrl = 'https://vleyzwirrsmwjotumxnf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsZXl6d2lycnNtd2pvdHVteG5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzc2OTksImV4cCI6MjA2NTgxMzY5OX0.5szh68n2g3xqk5FjEN1zXDWMv5gp2DX89tUFTF4v8Zw';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on your schema
export interface DatabaseBook {
  id: string;
  title: string | null;
  author: string | null;
  publication_year: number | null;
  category_slug: string | null;
  book_slug: string | null;
  description: string | null;
  duration_seconds: number | null; // The actual column name from the database
  created_at: string | null;
  audio_file_url: string | null;
  image_url: string | null;
  full_text_content: string | null;
}