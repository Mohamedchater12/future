UPDATE Project SET title_en = title WHERE title_en IS NULL OR title_en = '';
UPDATE Project SET description_en = description WHERE description_en IS NULL OR description_en = '';
-- Optionally copy to Arabic fields too if desired
-- UPDATE Project SET title_ar = title WHERE title_ar IS NULL OR title_ar = '';
-- UPDATE Project SET description_ar = description WHERE description_ar IS NULL OR description_ar = '';