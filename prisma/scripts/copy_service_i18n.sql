UPDATE Service SET title_en = title WHERE title_en IS NULL OR title_en = '';
UPDATE Service SET description_en = description WHERE description_en IS NULL OR description_en = '';
-- Optionally copy to Arabic fields too if you want initial Arabic content:
-- UPDATE Service SET title_ar = title WHERE title_ar IS NULL OR title_ar = '';
-- UPDATE Service SET description_ar = description WHERE description_ar IS NULL OR description_ar = '';