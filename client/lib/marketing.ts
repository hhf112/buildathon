import "ai";
import { google } from '@ai-sdk/google';

import { generateText } from 'ai';
import { NextResponse } from 'next/server';

const { text } = await generateText({
  model: google('gemini-2.5-flash'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});



export const generate_advertisement = async (news: string) => {

  const m_dashboard_data = {
    "most_viewed_page": "Family Health Guard",
    "click_through_rate": 4.8,
    "conversion_rate": 2.3,
    "user_feedback": "Customers are asking for more family coverage options."
  };

  const m_policies = {
    "top_sellers": [
      { "policy_name": "Family Health Guard", "sold_last_month": 78 },
      { "policy_name": "Senior Secure", "sold_last_month": 52 }
    ],
    "new_launches": [
      { "policy_name": "CyberSafe Shield", "launch_date": "2025-08-10" }
    ]
  };

  const m_leads = {
    "target_leads": [{ "demographic": "Millennials interested in cyber insurance" }],
    "latest_news": "Rising cases of online fraud make cyber insurance essential.",
    "current_offers": ["10% off 'CyberSafe Shield' policy for first 500 signups."]
  };

  const m_ad_length = "medium";
  const m_platform = "Facebook";

  console.log("here");
  const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    prompt: `You are an expert marketing assistant for an insurance micro-entrepreneur. 
    Your task is to generate a compelling ad of ${m_ad_length} length, specifically for ${m_platform}.

    **Platform-Specific Instructions:**
    {platform_guidance.get(platform, "Use a general, friendly tone.")}

    **Content Generation Data:**
    1. Popular Policies: ${m_policies}
    2. Customer Engagement Insights: ${m_dashboard_data}
    3. Leads, News & User Prompt: ${m_leads}

**ADDITONAL NEWS**
  ${news}

    **LANGUAGE INSTRUCTIONS:**
    If the 'latest_news' or 'target_leads' mentions a specific Indian city or region (e.g., 'Chennai', 'Mumbai', 'Kerala'), provide the 'caption' in BOTH English and the primary regional language (e.g., Tamil for Chennai). Otherwise, provide the 'caption' only in English.`

  });

  return NextResponse.json({
    success: true,
    ad: text,
  }, { status: 200 });
}
