/**
 * Lumina Gallery - Curated Image Dataset
 * Royalty-free Unsplash photography with optimized parameters and rich metadata
 */

const GALLERY_DATA = [
  {
    id: 1,
    title: "Alpine Lake Reflection",
    category: "nature",
    author: "Luca Bravo",
    authorUrl: "https://unsplash.com/@lucabravo",
    description: "Serene glacial lake reflecting snow-capped peaks in the heart of the Dolomites during early dawn.",
    tags: ["mountain", "lake", "reflection", "dolomites", "dawn"],
    thumbUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    fullUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=90"
  },
  {
    id: 2,
    title: "Futuristic Glass Atrium",
    category: "architecture",
    author: "Timur Garifov",
    authorUrl: "https://unsplash.com/@tgarifov",
    description: "Geometric glass ceiling spiraling upward, creating an intricate web of ambient natural light and shadows.",
    tags: ["architecture", "geometric", "glass", "modern", "design"],
    thumbUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
    fullUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1920&auto=format&fit=crop&q=90"
  },
  {
    id: 3,
    title: "Majestic Red Fox",
    category: "wildlife",
    author: "Ray Hennessy",
    authorUrl: "https://unsplash.com/@rayhennessy",
    description: "A wild red fox pausing silently in a frosty winter meadow, caught under soft twilight.",
    tags: ["fox", "wildlife", "animal", "winter", "nature"],
    thumbUrl: "https://images.unsplash.com/photo-1516934024742-b461fba47600?w=800&auto=format&fit=crop&q=80",
    fullUrl: "https://images.unsplash.com/photo-1516934024742-b461fba47600?w=1920&auto=format&fit=crop&q=90"
  },
  {
    id: 4,
    title: "Streets of Kyoto at Night",
    category: "travel",
    author: "Sora Sagano",
    authorUrl: "https://unsplash.com/@sorasagano",
    description: "Traditional wooden machiya houses glowing with red lantern illumination in the historic Gion district.",
    tags: ["japan", "kyoto", "travel", "night", "lanterns"],
    thumbUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
    fullUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&auto=format&fit=crop&q=90"
  },
  {
    id: 5,
    title: "Misty Pine Forest",
    category: "nature",
    author: "Thomas Kelley",
    authorUrl: "https://unsplash.com/@thkelley",
    description: "Dense evergreen forest shrouded in atmospheric morning fog, exuding stillness and mystery.",
    tags: ["forest", "fog", "trees", "mist", "moody"],
    thumbUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
    fullUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&auto=format&fit=crop&q=90"
  },
  {
    id: 6,
    title: "Urban Spiral Staircase",
    category: "architecture",
    author: "Dan Freeman",
    authorUrl: "https://unsplash.com/@danfreemanphoto",
    description: "Minimalist concrete spiral staircase winding infinitely downward in a hypnotic monochrome composition.",
    tags: ["stairs", "minimalism", "concrete", "monochrome", "curves"],
    thumbUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    fullUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1920&auto=format&fit=crop&q=90"
  },
  {
    id: 7,
    title: "Amalfi Coast Cliffside",
    category: "travel",
    author: "Will Truettner",
    authorUrl: "https://unsplash.com/@willtruettner",
    description: "Pastel-colored villas perched precipitously above the azure waters of Positano along Italy's coast.",
    tags: ["italy", "positano", "coast", "ocean", "vacation"],
    thumbUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80",
    fullUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&auto=format&fit=crop&q=90"
  },
  {
    id: 8,
    title: "Humpback Whale Breach",
    category: "wildlife",
    author: "Thomas Kelley",
    authorUrl: "https://unsplash.com/@thkelley",
    description: "Massive ocean giant bursting through the cresting surface in an energetic display of natural power.",
    tags: ["whale", "ocean", "sea", "wildlife", "marine"],
    thumbUrl: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=800&auto=format&fit=crop&q=80",
    fullUrl: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1920&auto=format&fit=crop&q=90"
  },
  {
    id: 9,
    title: "Sahara Sand Dunes",
    category: "nature",
    author: "Jeremy Bishop",
    authorUrl: "https://unsplash.com/@jeremybishop",
    description: "Sculpted ridges of golden sand rippling across the vast horizon under blazing golden hour light.",
    tags: ["desert", "sand", "dunes", "golden", "sunset"],
    thumbUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80",
    fullUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&auto=format&fit=crop&q=90"
  },
  {
    id: 10,
    title: "Skyscraper Cloud Piercer",
    category: "architecture",
    author: "Denys Nevozhai",
    authorUrl: "https://unsplash.com/@dnevozhai",
    description: "Ultra-modern glass tower disappearing into rolling storm clouds in an impressive urban panorama.",
    tags: ["skyscraper", "city", "clouds", "metropolis", "glass"],
    thumbUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
    fullUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&auto=format&fit=crop&q=90"
  },
  {
    id: 11,
    title: "Hot Air Balloons in Cappadocia",
    category: "travel",
    author: "Yonatan Anugerah",
    authorUrl: "https://unsplash.com/@yonatananugerah",
    description: "Kaleidoscope of colorful balloons floating above surreal volcanic fairy chimney rock formations.",
    tags: ["turkey", "cappadocia", "balloons", "sunrise", "adventure"],
    thumbUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    fullUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=90"
  },
  {
    id: 12,
    title: "Snow Leopard Stare",
    category: "wildlife",
    author: "Frida Bredesen",
    authorUrl: "https://unsplash.com/@fridabredesen",
    description: "Intense gaze of the elusive ghost of the mountains camouflaged amidst rugged rocky cliffs.",
    tags: ["leopard", "wildlife", "eyes", "predator", "cat"],
    thumbUrl: "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=800&auto=format&fit=crop&q=80",
    fullUrl: "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=1920&auto=format&fit=crop&q=90"
  }
];