import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://yxjisctnsmttpbuoqiny.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4amlzY3Ruc210dHBidW9xaW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ5NzcyMzIsImV4cCI6MjAwMDU1MzIzMn0.T8jqLzdXyVm3mnVbCZOQSaL6gPL1TaSZ5MdjbHG-qrM"
);

export default supabase;
