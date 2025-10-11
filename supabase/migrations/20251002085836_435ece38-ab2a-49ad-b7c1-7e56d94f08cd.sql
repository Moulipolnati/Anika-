-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Insert into profiles table
  insert into public.profiles (id, email, name, created_at)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    now()
  )
  on conflict (id) do nothing;
  
  -- Insert default customer role
  insert into public.user_roles (user_id, role, created_at)
  values (new.id, 'customer'::app_role, now())
  on conflict (user_id, role) do nothing;
  
  return new;
end;
$$;

-- Create trigger for new user signups
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();