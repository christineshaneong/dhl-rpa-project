import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vzjfwxktoanhtfwqquvy.supabase.co'
const supabaseKey = 'sb_publishable_zgv8QV0P5gRevOWmQPFbqA_2EDSlc1x'
export const supabase = createClient(supabaseUrl, supabaseKey)