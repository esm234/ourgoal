-- Migration script to create quran_playlists table
-- Run this in your Supabase SQL editor

-- Create the quran_playlists table
CREATE TABLE IF NOT EXISTS public.quran_playlists (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    playlist_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quran_playlists_user_id ON public.quran_playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_quran_playlists_is_default ON public.quran_playlists(user_id, is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_quran_playlists_created_at ON public.quran_playlists(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.quran_playlists ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own playlists
CREATE POLICY "Users can view their own playlists" ON public.quran_playlists
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own playlists
CREATE POLICY "Users can insert their own playlists" ON public.quran_playlists
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own playlists
CREATE POLICY "Users can update their own playlists" ON public.quran_playlists
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own playlists
CREATE POLICY "Users can delete their own playlists" ON public.quran_playlists
    FOR DELETE USING (auth.uid() = user_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_quran_playlists_updated_at
    BEFORE UPDATE ON public.quran_playlists
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create a function to ensure only one default playlist per user
CREATE OR REPLACE FUNCTION public.ensure_single_default_playlist()
RETURNS TRIGGER AS $$
BEGIN
    -- If the new/updated playlist is set as default
    IF NEW.is_default = true THEN
        -- Unset all other default playlists for this user
        UPDATE public.quran_playlists 
        SET is_default = false 
        WHERE user_id = NEW.user_id 
        AND id != NEW.id 
        AND is_default = true;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to ensure only one default playlist per user
CREATE TRIGGER ensure_single_default_playlist_trigger
    BEFORE INSERT OR UPDATE ON public.quran_playlists
    FOR EACH ROW
    EXECUTE FUNCTION public.ensure_single_default_playlist();

-- Grant necessary permissions
GRANT ALL ON public.quran_playlists TO authenticated;
GRANT USAGE ON SEQUENCE public.quran_playlists_id_seq TO authenticated;

-- Insert some sample data (optional - remove if not needed)
-- This creates a default playlist for testing
/*
INSERT INTO public.quran_playlists (user_id, name, description, is_default, playlist_items)
VALUES (
    auth.uid(), -- This will only work if run by an authenticated user
    'قائمة المفضلة',
    'قائمة تشغيل افتراضية تحتوي على السور المفضلة',
    true,
    '[
        {
            "id": "1",
            "reciter_id": "254",
            "reciter_name": "بدر التركي",
            "surah_id": "1",
            "surah_name_ar": "سورة الفاتحة",
            "audio_url": "https://alquran.vip/scripts/playSurah?reciter=Bader-Alturki&id=1",
            "order": 0
        },
        {
            "id": "2",
            "reciter_id": "92",
            "reciter_name": "ياسر الدوسري",
            "surah_id": "36",
            "surah_name_ar": "سورة يس",
            "audio_url": "https://alquran.vip/scripts/playSurah?reciter=Yasser-Al-Dosari&id=36",
            "order": 1
        }
    ]'::jsonb
);
*/

-- Verify the table was created successfully
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'quran_playlists' 
ORDER BY ordinal_position;
