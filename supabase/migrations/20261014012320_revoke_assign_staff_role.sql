-- Función de trigger: nunca debe poder llamarse por la API.
revoke execute on function public.assign_staff_role() from public, anon, authenticated;
