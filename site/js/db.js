// ============================================================================
// SUPABASE DATABASE WRAPPER
// ============================================================================
// Provides a unified interface for all data operations.
// Falls back to localStorage if Supabase is not configured.

let supabaseClient = null;

// Initialize Supabase (loads via CDN)
async function initSupabase() {
  if (!CONFIG.isConfigured()) {
    console.log('Supabase not configured. Running in demo mode with localStorage.');
    return null;
  }

  if (window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(
        CONFIG.SUPABASE_URL,
        CONFIG.SUPABASE_ANON_KEY
      );
      return supabaseClient;
    } catch (error) {
      console.error('Failed to initialize Supabase:', error);
      return null;
    }
  }
  return null;
}

// Call this on page load
initSupabase();

const db = {
  // ===== AUTH =====

  async signUp(email, password, username) {
    if (!supabaseClient) {
      const user = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        username
      };
      localStorage.setItem('demo_user', JSON.stringify(user));
      localStorage.setItem('demo_auth_token', 'demo_token_' + user.id);
      return { user, error: null };
    }

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password
    });

    if (!error && data?.user) {
      await supabaseClient.from('profiles').insert({
        id: data.user.id,
        username
      });
    }

    return { user: data?.user, error };
  },

  async signIn(email, password) {
    if (!supabaseClient) {
      const user = JSON.parse(localStorage.getItem('demo_user') || '{}');
      if (user.email === email) {
        localStorage.setItem('demo_auth_token', 'demo_token_' + user.id);
        return { user, error: null };
      }
      return { user: null, error: new Error('Invalid credentials') };
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    return { user: data?.user, error };
  },

  async signOut() {
    if (!supabaseClient) {
      localStorage.removeItem('demo_user');
      localStorage.removeItem('demo_auth_token');
      return { error: null };
    }

    const { error } = await supabaseClient.auth.signOut();
    return { error };
  },

  async getUser() {
    if (!supabaseClient) {
      const token = localStorage.getItem('demo_auth_token');
      if (!token) return null;
      return JSON.parse(localStorage.getItem('demo_user') || 'null');
    }

    const { data, error } = await supabaseClient.auth.getUser();
    return data?.user || null;
  },

  async getProfile(userId) {
    if (!supabaseClient) {
      const user = JSON.parse(localStorage.getItem('demo_user') || '{}');
      if (user.id === userId) {
        return {
          id: user.id,
          username: user.username,
          bio: '',
          avatar_color: '#E8530A',
          created_at: new Date().toISOString()
        };
      }
      return null;
    }

    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return data;
  },

  async getProfileByUsername(username) {
    if (!supabaseClient) {
      const user = JSON.parse(localStorage.getItem('demo_user') || '{}');
      if (user.username === username) {
        return {
          id: user.id,
          username: user.username,
          bio: '',
          avatar_color: '#E8530A',
          created_at: new Date().toISOString()
        };
      }
      return null;
    }

    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    return data;
  },

  // ===== WORKOUTS =====

  async saveWorkout(workout) {
    if (!supabaseClient) {
      const workouts = JSON.parse(localStorage.getItem('demo_workouts') || '[]');
      const newWorkout = {
        id: 'workout_' + Math.random().toString(36).substr(2, 9),
        ...workout,
        user_id: JSON.parse(localStorage.getItem('demo_user') || '{}').id,
        created_at: new Date().toISOString()
      };
      workouts.push(newWorkout);
      localStorage.setItem('demo_workouts', JSON.stringify(workouts));
      return { data: newWorkout, error: null };
    }

    const { data, error } = await supabaseClient
      .from('workouts')
      .insert([workout])
      .select();

    return { data: data?.[0], error };
  },

  async deleteWorkout(workoutId) {
    if (!supabaseClient) {
      const workouts = JSON.parse(localStorage.getItem('demo_workouts') || '[]');
      localStorage.setItem('demo_workouts', JSON.stringify(workouts.filter(w => w.id !== workoutId)));
      return { error: null };
    }
    const { error } = await supabaseClient
      .from('workouts')
      .delete()
      .eq('id', workoutId);
    if (error) throw new Error(error.message);
    return { error: null };
  },

  async getWorkouts(options = {}) {
    const { isPublic = true, userId = null, limit = 100, offset = 0 } = options;

    if (!supabaseClient) {
      const workouts = JSON.parse(localStorage.getItem('demo_workouts') || '[]');
      let filtered = isPublic ? workouts.filter(w => w.is_public) : workouts;
      if (userId) {
        filtered = filtered.filter(w => w.user_id === userId);
      }
      return filtered.slice(offset, offset + limit);
    }

    let query = supabaseClient.from('workouts').select('*');

    if (isPublic && !userId) {
      query = query.eq('is_public', true);
    }
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return data || [];
  },

  async getWorkoutById(workoutId) {
    if (!supabaseClient) {
      const workouts = JSON.parse(localStorage.getItem('demo_workouts') || '[]');
      return workouts.find(w => w.id === workoutId);
    }

    const { data, error } = await supabaseClient
      .from('workouts')
      .select('*')
      .eq('id', workoutId)
      .single();

    return data;
  },

  // ===== RESULTS =====

  async saveResult(result) {
    if (!supabaseClient) {
      const results = JSON.parse(localStorage.getItem('demo_results') || '[]');
      const newResult = {
        id: 'result_' + Math.random().toString(36).substr(2, 9),
        ...result,
        user_id: JSON.parse(localStorage.getItem('demo_user') || '{}').id,
        created_at: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      };
      results.push(newResult);
      localStorage.setItem('demo_results', JSON.stringify(results));
      return { data: newResult, error: null };
    }

    const { data, error } = await supabaseClient
      .from('results')
      .insert([result])
      .select();

    return { data: data?.[0], error };
  },

  async getResults(options = {}) {
    const { benchmarkSlug = null, workoutId = null, userId = null, limit = 100, offset = 0 } = options;

    if (!supabaseClient) {
      const results = JSON.parse(localStorage.getItem('demo_results') || '[]');
      let filtered = results;
      if (benchmarkSlug) filtered = filtered.filter(r => r.benchmark_slug === benchmarkSlug);
      if (workoutId) filtered = filtered.filter(r => r.workout_id === workoutId);
      if (userId) filtered = filtered.filter(r =>(r.user_id === userId);
      return filtered.slice(offset, offset + limit);
    }

    let query = supabaseClient.from('results').select('*');

    if (benchmarkSlug) {
      query = query.eq('benchmark_slug', benchmarkSlug);
    }
    if (workoutId) {
      query = query.eq('workout_id', workoutId);
    }
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return data || [];
  },

  async getBenchmarkLeaderboard(slug, limit = 50) {
    if (!supabaseClient) {
      const results = JSON.parse(localStorage.getItem('demo_results') || '[]');
      return results
        .filter(r => r.benchmark_slug === slug)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
    }

    const { data, error } = await supabaseClient
      .from('results')
      .select('*')
      .eq('benchmark_slug', slug)
      .order('created_at', { ascending: false })
      .limit(limit);

    return data || [];
  },

  async getGlobalLeaderboard(filters = {}) {
    if (!supabaseClient) {
      const results = JSON.parse(localStorage.getItem('demo_results') || '[]');
      return results
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, filters.limit || 50);
    }

    let query = supabaseClient.from('results').select('*');

    if (filters.benchmarkSlug) {
      query = query.eq('benchmark_slug', filters.benchmarkSlug);
    }
    if (filters.workoutId) {
      query = query.eq('workout_id', filters.workoutId);
    }
    if (filters.username) {
      query = query.eq('username', filters.username);
    }
    if (filters.timePeriod === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = query.gte('date', weekAgo.toISOString().split('T')[0]);
    } else if (filters.timePeriod === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query = query.gte('date', monthAgo.toISOString().split('T')[0]);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(filters.limit || 50);

    return data || [];
  },

  async setFeatured(type, id, isFeatured) {
    if (!supabaseClient) {
      const featured = JSON.parse(localStorage.getItem('demo_featured') || '[]');
      if (isFeatured) {
        if (!featured.find(f => f.id === id)) {
          featured.push({ id, type, featured_date: new Date().toISOString().split('T')[0] });
          localStorage.setItem('demo_featured', JSON.stringify(featured));
        }
      } else {
        const filtered = featured.filter(f => f.id !== id);
        localStorage.setItem('demo_featured', JSON.stringify(filtered));
      }
      return { error: null };
    }

    return { error: null };
  },

  async getFeatured() {
    if (!supabaseClient) {
      const benchmarks = BENCHMARKS;
      const dayOfWeek = new Date().getDay();
      const featured = benchmarks[dayOfWeek % benchmarks.length];
      return {
        benchmark_slug: featured.slug,
        workout_id: null,
        featured_type: 'auto'
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabaseClient
      .from('featured')
      .select('*')
      .eq('feature_date', today)
      .single();

    if (!data) {
      const benchmarks = BENCHMARKS;
      const dayOfWeek = new Date().getDay();
      const featured = benchmarks[dayOfWeek % benchmarks.length];
      return {
        benchmark_slug: featured.slug,
        workout_id: null,
        featured_type: 'auto'
      };
    }

    return data;
  },

  async incrementViews(type, id) {
    if (!supabaseClient) return;
    return;
  },

  // ===== UTILITIES =====

  async getUserStats() {
    const user = await this.getUser();
    if (!user) return null;

    const results = await this.getResults({ userId: user.id });
    const workouts = await this.getWorkouts({ userId: user.id });

    return {
      totalResults: results.length,
      totalWorkouts: workouts.length,
      results,
      workouts
    };
  },

  async searchWorkouts(query) {
    const workouts = await this.getWorkouts({ isPublic: true, limit: 1000 });
    return workouts.filter(w =>
      w.title.toLowerCase().includes(query.toLowerCase()) ||
      w.description.toLowerCase().includes(query.toLowerCase())
    );
  }
};
