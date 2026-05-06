import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY are required for Supabase client initialization');
}

export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
  global: {
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_KEY}`,
    },
  },
});
