import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jcccugkueilsbnzrlert.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjY2N1Z2t1ZWlsc2JuenJsZXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjk1ODYsImV4cCI6MjA5MjgwNTU4Nn0.B9ODuCkm1CLabXXA9O1vq_Sn2ZMGhGf6_rdh-N48U8U'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export type Listing = {
  id: string
  seller_id: string
  title: string
  description: string | null
  price: number
  size: string | null
  condition: string | null
  category: string | null
  image_url: string | null
  created_at: string
  seller_email?: string
}

export type Order = {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  status: string
  created_at: string
}
