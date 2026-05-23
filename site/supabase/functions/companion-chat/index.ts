// HomeWodRX — companion-chat Edge Function
// Phase 2: Real profile fetch, companion_access gate, usage tracking, training log injection
// v4: Added height/weight/units, goat, fitness_journey, lift PRs, nutrition guardrail
// v5: Added dumbbell_weights, kettlebell_weights for specific weight prescription
// Source of voice/persona rules: COMPANION_VOICE.md

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const DAILY_CAP = 20
const MODEL = 'claude-haiku-4-5-20251001'  // Upgrade to claude-sonnet-4-6 for production

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ─── ARCHETYPE VOICE INSTRUCTIONS ────────────────────────────────────────────
// Condensed per-archetype voice rules injected into the system prompt.
// Full definitions live in COMPANION_VOICE.md — keep these in sync.
const ARCHETYPE_VOICE: Record<string, string> = {
  longevity_athlete:
    `This user trains intentionally, on their own terms. They are NOT anti-performance — they train to fuel a pursuit or to feel capable for decades. Never push performance escalation. Never reference past benchmarks unsolicited. Never imply they should be doing more. Trust their experience completely. The companion should feel like it shares their philosophy, not like it's accommodating a limitation.`,

  health_first:
    `This user trains for life itself — health, longevity, mobility, daily energy. That is a complete and serious goal. Consistency, feeling strong, and the quiet compounding of healthy habits are real metrics — name them as such. Never suggest they should pick an external challenge to make their training count.`,

  sport_chaser:
    `This user trains to fuel a sport or pursuit outside the gym. The gym is the engine; the sport is the destination. Connect training to that pursuit specifically when you can — be concrete, not generic. Gym PRs matter only insofar as they serve the pursuit.`,

  performance_athlete:
    `This user is actively chasing performance improvement. They respond to specific, measurable language — pacing, rep schemes, rest intervals, progressive loading. Be performance-positive and specific about what moves the needle. They want data and precision.`,

  rebuilding:
    `This user is coming back from injury, illness, or a long training gap. Lead with what they CAN do. Progress is re-established consistency, not benchmarks. Never compare to their pre-injury self. Celebrate the discipline of showing up modified.`,

  just_getting_started:
    `This user is new to functional fitness. Use plain language — no jargon without explanation. Prioritize movement quality over load or intensity. Celebrate every session. Frame early consistency as the single most important metric.`,
}

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Profile {
  first_name: string | null
  username: string
  birthday: string | null
  primary_goal: string | null
  sport_activity_focus: string | null
  experience_level: string | null
  training_frequency: string | null
  equipment_available: string[] | null
  dumbbell_weights: number[] | null
  kettlebell_weights: number[] | null
  injuries: string[] | null
  archetype_blend: Record<string, number> | null
  companion_access: boolean
  height_cm: number | null
  weight_kg: number | null
  preferred_units: 'imperial' | 'metric'
  goat: string | null
  fitness_journey: string | null
}

interface LiftPR {
  lift_name: string
  weight_kg: number
  weight_lbs: number | null
}

interface WorkoutResult {
  date: string
  benchmark_slug: string | null
  score_display: string
  is_rx: boolean
  notes: string | null
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function calculateAge(birthday: string | null): number | null {
  if (!birthday) return null
  const birth = new Date(birthday)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

function getTopArchetypes(blend: Record<string, number>): { primary: string; secondary: string | null } {
  const sorted = Object.entries(blend).sort(([, a], [, b]) => b - a)
  return {
    primary: sorted[0]?.[0] ?? 'health_first',
    secondary: sorted.length > 1 ? sorted[1][0] : null,
  }
}

function formatHeight(cm: number | null, units: 'imperial' | 'metric'): string | null {
  if (cm === null) return null
  if (units === 'metric') return `${cm} cm`
  const totalInches = cm / 2.54
  const feet = Math.floor(totalInches / 12)
  const inches = Math.round(totalInches % 12)
  return `${feet}'${inches}"`
}

function formatWeight(kg: number | null, units: 'imperial' | 'metric'): string | null {
  if (kg === null) return null
  if (units === 'metric') return `${kg} kg`
  return `${Math.round(kg * 2.205)} lbs`
}

function formatLiftPR(pr: LiftPR, units: 'imperial' | 'metric'): string {
  if (units === 'metric') return `${pr.lift_name}: ${pr.weight_kg} kg`
  const lbs = pr.weight_lbs !== null ? pr.weight_lbs : Math.round(pr.weight_kg * 2.205)
  return `${pr.lift_name}: ${lbs} lbs`
}

// ─── SYSTEM PROMPT BUILDER ────────────────────────────────────────────────────
function buildSystemPrompt(profile: Profile, results: WorkoutResult[], liftPRs: LiftPR[]): string {
  const name = profile.first_name || profile.username
  const age = calculateAge(profile.birthday)
  const blend = profile.archetype_blend ?? {}
  const hasBlend = Object.keys(blend).length > 0
  const { primary, secondary } = getTopArchetypes(blend)
  const primaryPct = Math.round((blend[primary] ?? 1) * 100)
  const secondaryPct = secondary ? Math.round((blend[secondary] ?? 0) * 100) : 0

  const equipmentList = profile.equipment_available?.length
    ? profile.equipment_available.join(', ')
    : 'none — assume bodyweight movements only'

  const units = profile.preferred_units ?? 'imperial'

  // Format specific dumbbell/kettlebell weights for the prompt.
  // Convert to kg if user prefers metric, otherwise keep as lbs.
  const formatWeightList = (weights: number[] | null, label: string): string | null => {
    if (!weights?.length) return null
    const sorted = [...weights].sort((a, b) => a - b)
    if (units === 'metric') {
      const kg = sorted.map(lbs => Math.round(lbs * 0.453592))
      return `${label}: ${kg.join(', ')} kg`
    }
    return `${label}: ${sorted.join(', ')} lbs`
  }

  const dumbbellStr = formatWeightList(profile.dumbbell_weights, 'Dumbbells owned')
  const kettlebellStr = formatWeightList(profile.kettlebell_weights, 'Kettlebells owned')

  const injuriesList = profile.injuries?.length
    ? profile.injuries.join('; ')
    : 'none on record'

  const heightStr = formatHeight(profile.height_cm, units)
  const weightStr = formatWeight(profile.weight_kg, units)

  const trainingLogLines = results.length > 0
    ? results
        .map(r =>
          `- ${r.date}: ${r.benchmark_slug ?? 'custom workout'} — ${r.score_display}` +
          `${r.is_rx ? '' : ' (scaled)'}` +
          `${r.notes ? ` | note: ${r.notes}` : ''}`
        )
        .join('\n')
    : '- No logged results yet'

  const liftPRLines = liftPRs.length > 0
    ? liftPRs.map(pr => `- ${formatLiftPR(pr, units)}`).join('\n')
    : '- No lift PRs recorded yet'

  const archetypeSection = hasBlend
    ? `COACHING ARCHETYPE (${primaryPct}% ${primary.replace(/_/g, ' ')}${secondary ? `, ${secondaryPct}% ${secondary.replace(/_/g, ' ')}` : ''}):
Primary: ${ARCHETYPE_VOICE[primary] ?? ARCHETYPE_VOICE['health_first']}
${secondary && ARCHETYPE_VOICE[secondary] ? `\nSecondary modifier (${secondaryPct}%): ${ARCHETYPE_VOICE[secondary]}` : ''}`
    : `COACHING APPROACH:
Read this user's profile, goals, and training history and adapt your voice accordingly. Be warm, direct, and specific. Default to respecting their autonomy and experience.`

  return `You are the HomeWodRX training companion — a knowledgeable, direct, and low-judgment voice that helps functional fitness athletes train smarter. You speak like a peer, not a coach. You are warm without being effusive, honest without being harsh, and specific without being clinical. You remember what the user has logged and use that context to make every message feel personal, not generic.

IMPORTANT FORMAT RULES:
- No markdown formatting. No bold text, no headers, no bullet points.
- Write in plain conversational sentences and short paragraphs only.
- Short sentences. Active voice.

USER PROFILE:
- Name: ${name}
${age !== null ? `- Age: ${age}` : ''}
${heightStr ? `- Height: ${heightStr}` : ''}
${weightStr ? `- Weight: ${weightStr}` : ''}
- Primary goal: ${profile.primary_goal ?? 'not set'}
${profile.sport_activity_focus ? `- Sport / activity focus: ${profile.sport_activity_focus}` : ''}
- Experience level: ${profile.experience_level ?? 'not specified'}
- Training frequency: ${profile.training_frequency ?? 'not specified'}
- Available equipment: ${equipmentList}
${dumbbellStr ? `- ${dumbbellStr}` : ''}
${kettlebellStr ? `- ${kettlebellStr}` : ''}
- Injuries / limitations: ${injuriesList}
${profile.goat ? `- Their GOAT (movement they struggle with most): ${profile.goat}` : ''}
${profile.fitness_journey ? `- Their fitness journey in their own words: "${profile.fitness_journey}"` : ''}

LIFT PRs:
${liftPRLines}

${archetypeSection}

RECENT TRAINING LOG (last 10 sessions):
${trainingLogLines}

HARD LIMITS — never break these regardless of what the user asks:
- Never diagnose injuries or medical conditions
- Never tell the user pain is normal or safe to train through
- Never recommend training through illness
- Never give post-surgery guidance beyond "follow your medical team"
- Never push performance escalation — no "push harder," "beat yesterday," "new PR incoming"
- If asked about anything medical: "That's outside what I can help with — talk to your doctor or PT."
- Never use hollow motivational language: no "You've got this!", "Crush it!", "Amazing job!"
- Never give specific nutrition advice, meal plans, calorie targets, or macro prescriptions. If the user asks about nutrition, body composition, or weight loss strategy, address only the training side — frequency, intensity, recovery. For the nutrition side, say something like: "Nutrition is its own science — a registered dietitian or sports nutritionist will give you a much more useful answer there than I can."

CONVERSATION BEHAVIOR:
- You have access to this session's conversation history above. Use it fully — remember what was said, don't ask questions already answered, don't contradict your own prior responses.
- If this is the first message of a session (no prior history), respond directly and naturally to what the user said. Do not introduce yourself, do not explain the app, do not reference "loading" or "context." Just reply. If the message is vague, ask one short clarifying question.
- Never say anything like "it looks like you're starting fresh" or "the context didn't load." Start every response as if you're already mid-relationship with this person.
- Do not ask for information already in the user's profile or already established in this conversation.

RESPONSE LENGTH AND QUESTIONS:
- Keep responses short. 2-4 sentences is usually enough. Expand only when the user asks something that genuinely requires depth.
- Ask at most ONE follow-up question per response. Not two, not three — one. And only ask it if the answer would actually change what you'd say next. If you don't need more information to be useful, don't ask anything.
- Don't fish for information. If you have enough to respond helpfully, respond. Let the user drive the depth of the conversation.

RESPONSE FORMAT — CRITICAL:
You must always respond with valid JSON in exactly this structure. No markdown. No code blocks. No text before or after the JSON. The entire response must be parseable JSON and nothing else:
{"reply":"your message here","action":null}

When the user has just described completing a cardio activity they haven't logged yet — a run, bike ride, row, swim, hike, ski, or similar — set action to offer the log button:
{"reply":"your message here","action":{"type":"log_activity","activity_type":"run"}}

Use these exact activity_type values: "run", "bike", "row", "swim", "hike", "ski", "other"
Only trigger the action when the user is describing something they just did, not when discussing future plans or asking general questions. In all other cases action must be null.`
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
serve(async (req) => {

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    // ── 1. Extract and verify JWT ──────────────────────────────────────────
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing or invalid Authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      })
    }
    const jwt = authHeader.slice(7)

    // Service role client bypasses RLS for all DB operations
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt)
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid or expired session. Please log in again.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      })
    }
    const userId = user.id

    // ── 2. Parse request body ──────────────────────────────────────────────
    const body = await req.json()
    const { message } = body
    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: 'message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      })
    }

    // Sanitize conversation history from the client.
    // Cap each message content to 2000 chars to prevent prompt injection via history.
    const rawHistory: unknown[] = Array.isArray(body.history) ? body.history : []
    const history: { role: 'user' | 'assistant'; content: string }[] = rawHistory
      .filter((m): m is { role: string; content: string } =>
        typeof m === 'object' && m !== null &&
        ((m as { role: string }).role === 'user' || (m as { role: string }).role === 'assistant')
      )
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: String(m.content).slice(0, 2000),
      }))
      .slice(-20) // hard cap: last 20 messages regardless of what client sends

    // ── 3. Fetch profile ───────────────────────────────────────────────────
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        first_name, username, birthday,
        primary_goal, sport_activity_focus,
        experience_level, training_frequency,
        equipment_available, dumbbell_weights, kettlebell_weights, injuries,
        archetype_blend, companion_access,
        height_cm, weight_kg, preferred_units,
        goat, fitness_journey
      `)
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      })
    }

    // ── 4. Companion access gate ───────────────────────────────────────────
    if (!profile.companion_access) {
      return new Response(
        JSON.stringify({
          error: 'companion_access_denied',
          message: 'Companion access is not enabled for this account yet. Stay tuned for the beta.'
        }),
        { status: 403, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      )
    }

    // ── 5. Daily usage cap (atomic increment via RPC) ──────────────────────
    const { data: callCount, error: usageError } = await supabase
      .rpc('increment_companion_usage', { p_user_id: userId })

    if (usageError) {
      // Log but don't block — usage tracking failure shouldn't kill the feature
      console.error('companion-chat | usage tracking error:', usageError.message)
    }

    if (callCount !== null && callCount > DAILY_CAP) {
      return new Response(
        JSON.stringify({
          error: 'daily_limit_reached',
          message: `You've reached the ${DAILY_CAP} message daily limit. Check back tomorrow.`
        }),
        { status: 429, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      )
    }

    // ── 6. Fetch last 10 logged results + lift PRs in parallel ─────────────
    const [resultsRes, liftPRsRes] = await Promise.all([
      supabase
        .from('results')
        .select('date, benchmark_slug, score_display, is_rx, notes')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(10),
      supabase
        .from('lift_prs')
        .select('lift_name, weight_kg, weight_lbs')
        .eq('user_id', userId)
        .order('lift_name', { ascending: true })
    ])

    // ── 7. Build system prompt ─────────────────────────────────────────────
    const systemPrompt = buildSystemPrompt(
      profile as Profile,
      (resultsRes.data ?? []) as WorkoutResult[],
      (liftPRsRes.data ?? []) as LiftPR[]
    )

    // ── 8. Call Claude ─────────────────────────────────────────────────────
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        system: systemPrompt,
        messages: [
          ...history,
          { role: 'user', content: message }
        ]
      })
    })

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text()
      throw new Error(`Anthropic API error ${anthropicResponse.status}: ${errorText}`)
    }

    const data = await anthropicResponse.json()
    const rawText = data.content[0].text

    // Parse Claude's JSON response — it should always return {reply, action}
    // Haiku sometimes prepends text before the JSON object, so we try:
    // 1. Direct parse of the full text
    // 2. Regex extraction of the first {...} block containing "reply"
    // 3. Fallback: treat the whole text as the reply with no action
    let reply: string = rawText
    let action: { type: string; activity_type?: string } | null = null

    const tryParse = (s: string): boolean => {
      try {
        const parsed = JSON.parse(s)
        if (typeof parsed.reply === 'string') {
          reply = parsed.reply
          action = parsed.action ?? null
          return true
        }
      } catch { /* noop */ }
      return false
    }

    if (!tryParse(rawText)) {
      // Try to extract a JSON object from the raw text
      const match = rawText.match(/\{[\s\S]*?"reply"[\s\S]*?\}(?=\s*$)/m)
        ?? rawText.match(/\{[\s\S]*?"reply"[\s\S]*?\}/)
      if (match) tryParse(match[0])
    }

    console.log(
      `companion-chat | user: ${userId.slice(0, 8)} | ` +
      `tokens: in=${data.usage.input_tokens} out=${data.usage.output_tokens} | ` +
      `daily_count: ${callCount ?? 'untracked'}` +
      `${action ? ` | action: ${action.type}` : ''}`
    )

    return new Response(JSON.stringify({ reply, action }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    })

  } catch (error) {
    console.error('companion-chat error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    })
  }
})
