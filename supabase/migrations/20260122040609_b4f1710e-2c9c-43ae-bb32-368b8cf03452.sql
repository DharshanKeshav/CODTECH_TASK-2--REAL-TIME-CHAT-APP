-- Fix the handle_new_user trigger to handle duplicate usernames
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INT := 0;
BEGIN
  -- Get the base username from metadata or generate one
  base_username := COALESCE(NEW.raw_user_meta_data->>'username', 'User_' || substr(NEW.id::text, 1, 8));
  final_username := base_username;
  
  -- Check if username exists and add number suffix if needed
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || '_' || counter::text;
  END LOOP;
  
  INSERT INTO public.profiles (user_id, username, avatar)
  VALUES (
    NEW.id,
    final_username,
    'https://api.dicebear.com/7.x/lorelei/svg?seed=' || final_username
  );
  RETURN NEW;
END;
$function$;