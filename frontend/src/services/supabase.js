import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fetch latest draw
export const fetchLatestDraw = async () => {
  try {
    const { data, error } = await supabase
      .from('past_results')
      .select('*')
      .order('draw_date', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching latest draw:', error);
    return null;
  }
};

// Fetch past results (last 20 draws)
export const fetchPastResults = async () => {
  try {
    const { data, error } = await supabase
      .from('past_results')
      .select('*')
      .order('draw_date', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching past results:', error);
    return [];
  }
};

// Fetch all results for prediction algorithm
export const fetchAllResults = async () => {
  try {
    const { data, error } = await supabase
      .from('past_results')
      .select('*')
      .order('draw_date', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching all results:', error);
    return [];
  }
};
