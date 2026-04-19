import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vynafeqevootlsiwvese.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5bmFmZXFldm9vdGxzaXd2ZXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NjYwNzYsImV4cCI6MjA5MjE0MjA3Nn0.5njl3AirU47I8PtL94_LiTZ0cm3kRxSzGD2UlZYxzJ8'
);

async function seed() {
  console.log('Testing insert...');
  const { data, error } = await supabase.from('categories').insert([{ name: 'App Test' }]).select();
  console.log('Error:', error);
  console.log('Data:', data);
}

seed();
