import json
from llm import GeminiAPIWrapper # Assuming llm.py is in the same directory

def generate_advertisement(policies_data: dict, dashboard_data: dict, leads_and_news: dict, ad_length: str = "medium", platform: str = "Facebook") -> tuple[str, str]:
    """
    Generates a targeted ad caption and a corresponding image prompt using an LLM.

    Args:
        policies_data (dict): Data on insurance policies.
        dashboard_data (dict): Usage/engagement metrics.
        leads_and_news (dict): Info on leads, user prompts, and news.
        ad_length (str): The desired length ('short', 'medium', 'long').
        platform (str): Target platform ('Facebook', 'Instagram', 'LinkedIn', 'X', 'General').

    Returns:
        tuple[str, str]: A tuple containing the image prompt and the ad caption.
    """
    platform_guidance = {
        "Facebook": "Use a friendly, community-focused tone. Encourage shares and comments. Can be slightly longer and include a direct link.",
        "Instagram": "Use a highly visual and engaging tone. Include emojis and relevant hashtags. The main call to action should be 'link in bio'.",
        "LinkedIn": "Use a professional and formal tone. Focus on financial security, career protection, and business benefits. Avoid emojis.",
        "X": "Be very concise and punchy (under 280 characters). Use hashtags and a short link. Create a sense of urgency.",
        "General": "Create a versatile ad suitable for any platform. Focus on a clear message and a universal call to action. Include relevant hashtags."
    }

    prompt = f"""
    You are an expert marketing assistant for an insurance micro-entrepreneur. 
    Your task is to generate a compelling ad of '{ad_length}' length, specifically for '{platform}'.

    **Platform-Specific Instructions:**
    {platform_guidance.get(platform, "Use a general, friendly tone.")}

    **Content Generation Data:**
    1. Popular Policies: {json.dumps(policies_data, indent=2)}
    2. Customer Engagement Insights: {json.dumps(dashboard_data, indent=2)}
    3. Leads, News & User Prompt: {json.dumps(leads_and_news, indent=2)}

    **LANGUAGE INSTRUCTIONS:**
    If the 'latest_news' or 'target_leads' mentions a specific Indian city or region (e.g., 'Chennai', 'Mumbai', 'Kerala'), provide the 'caption' in BOTH English and the primary regional language (e.g., Tamil for Chennai). Otherwise, provide the 'caption' only in English.

    **CRITICAL OUTPUT FORMAT:**
    You MUST return your response as a single, valid JSON object with exactly two keys:
    1. "image_prompt": A descriptive prompt (max 25 words) for an AI image generator to create a relevant image for this ad.
    2. "caption": The text for the advertisement itself, following all platform and language instructions.

    Example JSON output:
    {{
      "image_prompt": "A happy young family smiling, protected under a large, glowing umbrella representing an insurance policy.",
      "caption": "Your family's safety is our priority!..."
    }}

    Generate the JSON response now.
    """

    wrapper = GeminiAPIWrapper()
    if not wrapper.is_initialized:
        return "Generation failed.", "Gemini API not initialized."

    try:
        response_text = wrapper.invoke(prompt)
        response_json = json.loads(response_text)
        image_prompt = response_json.get("image_prompt", "Failed to generate image prompt.")
        caption = response_json.get("caption", "Failed to generate caption.")
        return image_prompt, caption
    except (json.JSONDecodeError, Exception) as e:
        return f"Error parsing LLM response: {e}", response_text

def ad_image(prompt):
    wrapper = GeminiAPIWrapper()
    if not wrapper.is_initialized:
        return "Generation failed.", "Gemini API not initialized."

    try:
        response_image = wrapper.imagegen(prompt)
        return response_image, "Image generated successfully."
    except Exception as e:
        return f"Error generating image: {e}", response_image

if __name__ == "__main__":
    mock_policies = {"top_sellers": [{"policy_name": "Family Health Guard", "sold_last_month": 78}]}
    mock_dashboard = {"most_viewed_page": "Family Health Guard"}
    # Example with a regional cue
    mock_leads_regional = {
        "target_leads": [{"demographic": "Young Families in Chennai"}],
        "latest_news": "New network of 50+ hospitals added in Chennai.",
        "current_offers": ["15% discount on 'Family Health Guard'."]
    }
    
    print("\n" + "="*40 + "\n--- GENERATING REGIONAL AD (CHENNAI) ---\n" + "="*40)
    img_prompt, ad_caption = generate_advertisement(
        mock_policies, mock_dashboard, mock_leads_regional, 'medium', 'Facebook'
    )
    
    print(f"🖼️  IMAGE PROMPT:\n{img_prompt}\n")
    print(f"✍️  CAPTION:\n{ad_caption}")

