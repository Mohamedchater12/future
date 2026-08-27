UPDATE Mission SET title_en = title WHERE title_en IS NULL OR title_en = '';
UPDATE Mission SET description_en = description WHERE description_en IS NULL OR description_en = '';
UPDATE MissionStep SET label_en = label WHERE label_en IS NULL OR label_en = '';
-- Optionally copy to Arabic fields too
-- UPDATE Mission SET title_ar = title WHERE title_ar IS NULL OR title_ar = '';
-- UPDATE Mission SET description_ar = description WHERE description_ar IS NULL OR description_ar = '';
-- UPDATE MissionStep SET label_ar = label WHERE label_ar IS NULL OR label_ar = '';