import { Meme } from "@shared/schema";

const REDDIT_API_BASE = "https://www.reddit.com";
const MEME_API_FALLBACK = "https://meme-api.com/gimme";

const ENGLISH_SUBREDDITS = [
  "memes",
  "wholesomememes", 
  "ProgrammerHumor",
  "EnglishMemes",
  "educationalmemes"
];

// Content filtering keywords to avoid inappropriate content
const FILTER_KEYWORDS = [
  "nsfw", "adult", "sexual", "violence", "hate", "offensive",
  "inappropriate", "explicit", "mature", "disturbing"
];

export interface RedditPost {
  data: {
    id: string;
    title: string;
    url: string;
    subreddit: string;
    permalink: string;
    ups: number;
    author: string;
    created_utc: number;
    over_18: boolean;
    is_video: boolean;
    post_hint?: string;
  };
}

export interface RedditResponse {
  data: {
    children: RedditPost[];
    after: string | null;
  };
}

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url) || 
         url.includes('i.redd.it') || 
         url.includes('imgur.com');
}

function isContentAppropriate(title: string, subreddit: string): boolean {
  const textToCheck = `${title} ${subreddit}`.toLowerCase();
  return !FILTER_KEYWORDS.some(keyword => textToCheck.includes(keyword));
}

async function fetchFromRedditAPI(subreddit: string, after?: string): Promise<Meme[]> {
  try {
    const url = `${REDDIT_API_BASE}/r/${subreddit}/hot.json?limit=25${after ? `&after=${after}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`);
    }

    const data: RedditResponse = await response.json();
    
    const memes: Meme[] = data.data.children
      .filter(post => {
        const { data: postData } = post;
        return (
          !postData.over_18 &&
          !postData.is_video &&
          isImageUrl(postData.url) &&
          isContentAppropriate(postData.title, postData.subreddit)
        );
      })
      .map(post => ({
        id: post.data.id,
        title: post.data.title,
        url: post.data.url,
        subreddit: `r/${post.data.subreddit}`,
        permalink: `https://reddit.com${post.data.permalink}`,
        upvotes: post.data.ups,
        author: post.data.author,
        created: post.data.created_utc * 1000, // Convert to milliseconds
      }));

    return memes;
  } catch (error) {
    console.error(`Failed to fetch from Reddit API for r/${subreddit}:`, error);
    return [];
  }
}

async function fetchFromMemeAPI(): Promise<Meme[]> {
  try {
    const response = await fetch(`${MEME_API_FALLBACK}/20`);
    
    if (!response.ok) {
      throw new Error(`Meme API error: ${response.status}`);
    }

    const data = await response.json();
    const memes = Array.isArray(data.memes) ? data.memes : [data];
    
    return memes
      .filter((meme: any) => 
        meme.url && 
        meme.title && 
        !meme.nsfw &&
        isContentAppropriate(meme.title, meme.subreddit || '')
      )
      .map((meme: any) => ({
        id: meme.postLink?.split('/').pop() || Math.random().toString(36),
        title: meme.title,
        url: meme.url,
        subreddit: meme.subreddit || 'r/memes',
        permalink: meme.postLink || '#',
        upvotes: meme.ups || 0,
        author: meme.author || 'unknown',
        created: Date.now(),
      }));
  } catch (error) {
    console.error('Failed to fetch from Meme API:', error);
    return [];
  }
}

export async function fetchMemes(page: number = 0): Promise<Meme[]> {
  const allMemes: Meme[] = [];

  // Since Reddit API has CORS issues in browser, use fallback API first
  try {
    const fallbackMemes = await fetchFromMemeAPI();
    allMemes.push(...fallbackMemes);
  } catch (error) {
    console.warn("Fallback meme API failed, trying Reddit:", error);
    
    // Try Reddit API as backup (though it will likely fail due to CORS)
    for (const subreddit of ENGLISH_SUBREDDITS.slice(0, 2)) { // Limit to prevent excessive requests
      try {
        const memes = await fetchFromRedditAPI(subreddit);
        allMemes.push(...memes);
      } catch (error) {
        console.warn(`Failed to fetch from r/${subreddit}:`, error);
      }
    }
  }

  // If we still don't have enough memes, create some demo content
  if (allMemes.length === 0) {
    // Return some demo memes to ensure the app works
    return [
      {
        id: "demo1",
        title: "When you finally understand a complex English idiom",
        url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        subreddit: "r/EnglishLearning",
        permalink: "https://reddit.com/r/EnglishLearning/demo1",
        upvotes: 1234,
        author: "learner123",
        created: Date.now(),
      },
      {
        id: "demo2", 
        title: "Me trying to use 'whom' correctly in a sentence",
        url: "https://images.unsplash.com/photo-1516131206008-dd041a9764fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        subreddit: "r/EnglishMemes",
        permalink: "https://reddit.com/r/EnglishMemes/demo2",
        upvotes: 987,
        author: "grammar_geek",
        created: Date.now(),
      },
      {
        id: "demo3",
        title: "When someone asks if you speak English and you say 'yes' but then they use slang",
        url: "https://images.unsplash.com/photo-1616347004137-2ed2eb9f6fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        subreddit: "r/memes",
        permalink: "https://reddit.com/r/memes/demo3", 
        upvotes: 2345,
        author: "confusedlearner",
        created: Date.now(),
      }
    ];
  }

  // Remove duplicates and shuffle
  const uniqueMemes = allMemes.filter((meme, index, self) => 
    index === self.findIndex(m => m.id === meme.id)
  );

  // Shuffle array for variety
  for (let i = uniqueMemes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [uniqueMemes[i], uniqueMemes[j]] = [uniqueMemes[j], uniqueMemes[i]];
  }

  return uniqueMemes.slice(0, 20); // Return max 20 memes per request
}
