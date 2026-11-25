// Cover image for each blog post: shown on the blog cards and at the top of the article.
// Files live in public/images/blog/<slug>.jpg (1280×720). Posts without an entry show no image.

export type BlogImage = { alt: string; credit?: string };

const IMAGES: Record<string, BlogImage> = {
  "best-gear-car-vacation": { alt: "A woman stretching beside an open hatchback packed with a kettlebell, bands and a jump rope at a mountain overlook" },
  "best-home-gym-equipment": { alt: "A man sliding a plate onto a racked barbell in a well-equipped garage gym" },
  "bodyweight-benchmark-wods": { alt: "A woman doing push-ups on the grass in a park at sunrise" },
  "box-jumps-vs-step-ups": { alt: "One athlete doing a box jump while another does a step-up" },
  "budget-home-gym-under-500": { alt: "A man doing a dumbbell bench press in a simple basement home gym with kettlebells, rings and a pull-up bar" },
  "building-garage-gym": { alt: "A man laying rubber floor mats in an empty garage next to a half-built rack" },
  "case-for-logging-workouts": { alt: "A woman writing in a training notebook after a workout" },
  "choosing-a-pull-up-bar": { alt: "A woman doing a pull-up on a sturdy rig bar" },
  "cindy-strategy-scaling": { alt: "A woman doing push-ups in a garage gym" },
  "day-by-day-fitness-mindset": { alt: "A man lacing his training shoes on the porch steps at dawn" },
  "dt-strategy-scaling": { alt: "A man catching a barbell hang power clean" },
  "dumbbells-vs-barbell-first": { alt: "A woman kneeling between a pair of dumbbells and a barbell" },
  "emom-skill-work": { alt: "A woman practicing a swing on gymnastics rings" },
  "finding-balance-in-life": { alt: "A father laughing with his daughter in the backyard, a kettlebell on the grass" },
  "first-pull-up-progression": { alt: "A man in a dead hang from a pull-up bar, the first step toward a pull-up" },
  "fran-strategy-scaling": { alt: "A woman at the bottom of a barbell thruster" },
  "garage-gym-all-seasons": { alt: "A man rowing in his garage gym with snow falling outside" },
  "glp1-fitness-guide": { alt: "A healthy plate of salmon, quinoa and vegetables next to a water bottle" },
  "helen-grace-karen": { alt: "A man locking out a clean and jerk" },
  "hero-wod-guide": { alt: "Sailors and families gathered at a memorial for a Hero WOD's namesake before a run", credit: "U.S. Navy photo" },
  "hotel-room-workouts": { alt: "A woman doing air squats in a hotel room" },
  "how-to-scale-wods": { alt: "A young woman and an older man doing the same front squat at different loads" },
  "kettlebell-only-wods": { alt: "A woman swinging a kettlebell on an apartment balcony" },
  "learning-double-unders": { alt: "A man jumping rope on a driveway" },
  "murph-history-strategy-scaling": { alt: "Sailors man the rails of the destroyer USS Michael Murphy at its commissioning", credit: "U.S. Navy photo" },
  "named-benchmark-wods-guide": { alt: "Chalked hands gripping a barbell" },
  "programming-a-lighter-week": { alt: "A woman pedaling easily on an air bike" },
  "rest-days-garage-athlete": { alt: "A man foam rolling on the floor of his garage gym" },
  "rogue-vs-titan-home-gym": { alt: "Two power racks side by side in a garage gym" },
  "rx-vs-scaled-choosing-weights": { alt: "A hand choosing a bumper plate from a rack" },
  "sleep-and-athletic-performance": { alt: "A woman sleeping peacefully in early-morning light" },
  "small-space-gym-setup": { alt: "A spare bedroom set up as a tidy compact home gym" },
  "staying-connected-fitness": { alt: "A mom swinging a kettlebell in her living room while her toddler plays nearby" },
  "staying-motivated-solo-training": { alt: "A woman taking a breath between sets alone in her garage gym at night" },
  "test-retest-benchmark-progress": { alt: "A man smiling on a plyo box after finishing a benchmark workout" },
  "training-with-family": { alt: "A father and teenage daughter doing kettlebell deadlifts together" },
  "wall-ball-technique": { alt: "A woman catching a wall ball overhead" },
  "weekly-training-program-home": { alt: "A woman doing dumbbell walking lunges down a driveway at dawn" },
  "why-short-wods-work": { alt: "A man doing kettlebell swings in a basement gym" },
  "why-stretching-matters": { alt: "A woman doing a seated hamstring stretch in her living room" },
  "wod-formats-explained": { alt: "A class of athletes doing burpees together" },
};

export function postImage(slug: string): (BlogImage & { src: string }) | null {
  const img = IMAGES[slug];
  return img ? { ...img, src: `/images/blog/${slug}.jpg` } : null;
}
