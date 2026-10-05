-- Migration: get_admin_athletes RPC
-- Joins auth.users with profiles for admin use only.
-- Caller must have is_admin = true in profiles; otherwise returns empty.
-- Never exposed to anon or regular user keys.

CREATE OR REPLACE FUNCTION get_admin_athletes(
  p_sort TEXT DEFAULT 'created',
  p_limit INT DEFAULT 200
)
RETURNS TABLE (
  id          UUID,
  username    TEXT,
  email       TEXT,
  joined      TIMESTAMPTZ,
  last_login  TIMESTAMPTZ,
  total_results INT,
  is_admin    BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Verify caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = TRUE
  ) THEN
    RETURN; -- return empty result set, no error exposed
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.username,
    u.email,
    u.created_at   AS joined,
    u.last_sign_in_at AS last_login,
    COALESCE(p.total_results, 0)::INT AS total_results,
    COALESCE(p.is_admin, FALSE) AS is_admin
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.id
  ORDER BY
    CASE WHEN p_sort = 'username' THEN p.username END ASC,
    CASE WHEN p_sort = 'results'  THEN p.total_results END DESC NULLS LAST,
    CASE WHEN p_sort NOT IN ('username','results') THEN u.created_at END DESC NULLS LAST
  LIMIT p_limit;
END;
$$;

-- Revoke public access, grant only to authenticated users
-- (the function itself enforces admin check internally)
REVOKE ALL ON FUNCTION get_admin_athletes(TEXT, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_admin_athletes(TEXT, INT) TO authenticated;
