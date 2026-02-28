const INSTAGRAM_TOKEN = import.meta.env.INSTAGRAM_ACCESS_TOKEN;

export interface InstagramPost {
  id: string;
  caption?: string;
  media_url: string;
  permalink: string;
  media_type: "IMAGE" | "CAROUSEL_ALBUM" | "VIDEO";
  timestamp: string;
}

export async function getInstagramPosts(
  limit = 12
): Promise<InstagramPost[]> {
  if (!INSTAGRAM_TOKEN) return [];

  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,media_type,timestamp&limit=${limit}&access_token=${INSTAGRAM_TOKEN}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data as InstagramPost[]).filter(
      (p) => p.media_type !== "VIDEO"
    );
  } catch {
    return [];
  }
}
