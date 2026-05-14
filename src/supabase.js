import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://gnenxuwzljdguzftflov.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZW54dXd6bGpkZ3V6ZnRmbG92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2Nzg2MDEsImV4cCI6MjA5NDI1NDYwMX0.toV6CBZYxpJgDkWQy48BFA9GRnQn4rmgWctzXxxf16M"

export const supabase = createClient(supabaseUrl, supabaseKey)