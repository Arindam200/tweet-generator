import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import fs from 'fs';
import path from 'path';

type Env = {
  AI: any;
};

type Tweet = {
  tweet: {
    full_text: string;
  };
};


function extractFullTexts(tweets: Tweet[]): string[] {
  return tweets.map(item => item.tweet.full_text).filter(Boolean);
}

export async function POST(req: NextRequest) {
  const { topic }: { topic: string } = await req.json();
  const env = (await getCloudflareContext()).env as Env;

  try {
    // Read the Tweets.json file
    const filePath = path.join(process.cwd(), 'tweets.json');
    console.log('Reading file:', filePath);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const tweets: Tweet[] = JSON.parse(fileContents);

    // Extract full_text from tweets
    const fullTexts = extractFullTexts(tweets);
    // const fullTextsString = fullTexts.join('\n');
    const fullTextsString = fullTexts.slice(0, 10).join('\n');

    const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: "system", content: "You are a Tweet Writer specializing in fiery, attention-grabbing tweets. Your tweets should be engaging, provocative (but not offensive), and under 280 characters. Use emojis sparingly for emphasis. Write as if you're a social media influencer with a dark, edgy style." },
        { role: "user", content: `Write a tweet about the following topic: ${topic}. Here are some example tweets to consider for tone and style:\n\n${fullTextsString}` }
      ],
      max_tokens: 280,
      temperature: 0.7
    });

    // Ensure we're returning a string
    const tweetText = typeof response === 'object' && response.response 
      ? response.response 
      : String(response);

    console.log(tweetText);
    return NextResponse.json(
      { message: tweetText },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating tweet:', error);
    return NextResponse.json(
      { error: 'Failed to generate tweet. Our AI is taking a dark coffee break.' },
      { status: 500 }
    );
  }
}

