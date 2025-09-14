import json
import re
from llm import GeminiAPIWrapper # Assuming llm.py is in the same directory
from datetime import date

def update_note(customer_details: dict, convo_history: list[str], new_note: str) -> tuple[str, str, str]:
    """Analyzes customer conversation notes to determine sentiment and suggest next actions.

    This function sends customer data and conversation history to an LLM to classify
    the customer's status, recommend a follow-up date, and suggest the focus for
    the next conversation.

    Args:
        customer_details (dict): A dictionary with detailed customer information, including
                                 'name', 'contact', 'enrolled_policies', 
                                 'other_available_policies', and 'referral_details'.
        convo_history (list[str]): A list of strings, where each string is a past note.
        new_note (str): The latest conversation note to be added and analyzed.

    Returns:
        tuple[str, str, str]: A tuple containing:
                              - customer_status (str): One of four sentiment classifications.
                              - next_followup_date (str): The suggested follow-up date (YYYY-MM-DD).
                              - followup_focus (str): The suggested topic for the next follow-up.
    """
    full_history = convo_history + [new_note]
    today = date.today().strftime("%Y-%m-%d")

    prompt = f"""
    You are an intelligent CRM assistant for an insurance micro-entrepreneur.
    Your task is to analyze a customer's situation based on their detailed profile and conversation history.
    Today's date is {today}.

    **1. Customer Data:**
    This includes their personal details, policies, and referral program information.
    {json.dumps(customer_details, indent=2)}

    **2. Full Conversation History (Oldest to Newest):**
    {json.dumps(full_history, indent=2)}

    **3. Your Analysis Tasks:**

    A. **Determine Customer Status:** Classify the customer into one of these four categories.
        - "Positive - Retention Likely": Customer is happy, likely to renew existing policies.
        - "Positive - Upsell Opportunity": Customer is very happy and has expressed interest or potential for additional policies OR is a great candidate for referring others.
        - "Negative - At Risk": Customer has expressed concerns, frustration, or has payment issues. Needs attention to prevent loss.
        - "Negative - Discontinuation Likely": Customer is very unhappy, has mentioned leaving, or has significant unresolved issues.

    B. **Suggest Next Follow-up Date:** Based on the status and the contract end date of their enrolled policies.
        - For "Positive" statuses: Suggest a date 30-45 days BEFORE the soonest 'contract_end_date' to discuss renewal or new offers.
        - For "Negative" statuses: Suggest a date in the near future (e.g., within 7-10 days from today) to resolve their issues.
        - If any contract is already very close to ending (e.g., within 30 days), prioritize that urgency for all statuses.

    C. **Determine Follow-up Focus:** Briefly describe what the next conversation should be about.
        - For "Positive - Upsell Opportunity": If they mentioned needing another policy, focus on that. If the conversation mentioned friends/family needing insurance, focus on encouraging them to use their referral code.
        - For other "Positive" statuses: Focus on a smooth renewal process.
        - For "Negative" statuses": Focus on addressing their specific complaints directly and offering a solution.

    **CRITICAL OUTPUT FORMAT:**
    You MUST return your response as a single, valid JSON object with exactly three keys:
    1. "customer_status": The classification string.
    2. "next_followup_date": The suggested date in "YYYY-MM-DD" format.
    3. "followup_focus": The brief description of the follow-up content.

    Generate the JSON response now.
    """

    wrapper = GeminiAPIWrapper()
    if not wrapper.is_initialized:
        return "API Not Initialized", "N/A", "N/A"

    try:
        response_text = wrapper.invoke(prompt)
        match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if match:
            clean_response = match.group(0)
        else:
            raise json.JSONDecodeError("No valid JSON object found in the response.", response_text, 0)
            
        response_json = json.loads(clean_response)
        status = response_json.get("customer_status", "Status analysis failed.")
        followup_date = response_json.get("next_followup_date", "Date suggestion failed.")
        focus = response_json.get("followup_focus", "Focus suggestion failed.")
        return status, followup_date, focus
    except (json.JSONDecodeError, Exception) as e:
        return f"Error parsing LLM response: {e}", "N/A", "N/A"

def generate_followup(customer_details: dict, convo_history: list[str], followup_focus: str, contact_platform: str = "General", additional_content: str = "") -> str:
    """Generates a ready-to-send follow-up message for a customer.

    This function uses customer data, conversation history, and a specific focus
    to generate a personalized message suitable for various platforms.

    Args:
        customer_details (dict): The detailed customer information object.
        convo_history (list[str]): A list of past conversation notes.
        followup_focus (str): The key objective of the follow-up message.
        contact_platform (str, optional): The target platform ('Email', 'WhatsApp', 'General').
        additional_content (str, optional): Any extra points the entrepreneur wants to add.

    Returns:
        str: The generated, ready-to-send follow-up message.
    """
    prompt = f"""
    You are an expert communication assistant for an insurance micro-entrepreneur.
    Your task is to write a brief, professional, and highly persuasive follow-up message to a customer.

    **1. Customer Data:**
    {json.dumps(customer_details, indent=2)}

    **2. Conversation History:**
    {json.dumps(convo_history, indent=2)}

    **3. Key Goal for this Message:**
    "{followup_focus}"
    
    **4. Target Communication Platform:**
    "{contact_platform}"

    **5. Additional Points to Include (if any):**
    "{additional_content}"

    **Instructions for Persuasive Communication:**
    - **Tailor the message to the platform:**
        - **Email:** Use a proper subject line (e.g., "Subject: ..."), be slightly more formal, and structure the message in clear paragraphs.
        - **WhatsApp:** Be conversational, friendly, and concise. Use emojis where appropriate.
        - **General:** A balanced professional and friendly tone suitable for most platforms.
    - Greet the customer warmly by their first name (e.g., "Hi Priya,").
    - **Use Persuasive Language:** Focus on benefits, value, and security.
    - **If the goal is positive (upselling or referral):** Persuasively explain the benefits. For referrals, clearly state the reward and make it easy to share their code.
    - **If the goal is negative (addressing a complaint):** Be empathetic and start by acknowledging their concern. Persuasively reassure them of your commitment to resolving the issue.
    - **End with a clear and easy call to action.**
    - Sign off with the entrepreneur's name (let's assume the name is 'Raj').

    Generate the persuasive follow-up message now.
    """

    wrapper = GeminiAPIWrapper()
    if not wrapper.is_initialized:
        return "Could not generate message: API Not Initialized."
    
    try:
        message = wrapper.invoke(prompt)
        return message
    except Exception as e:
        return f"Could not generate message: {e}"


if __name__ == "__main__":
    # --- SCENARIO 1: POSITIVE CUSTOMER WITH REFERRAL OPPORTUNITY ---
    print("\n" + "="*40 + "\n--- ANALYZING POSITIVE CUSTOMER ---\n" + "="*40)
    positive_customer = {
        "customer_id": "CUST101",
        "name": "Priya Sharma",
        "contact": "priya.sharma@email.com",
        "enrolled_policies": [
            {
                "policy_name": "Family Health Guard",
                "policy_id": "POL-H123",
                "contract_end_date": "2026-08-15",
                "payment_status": "On-Time",
                "premium": "12,000/year"
            }
        ],
        "other_available_policies": [
            "Secure Term Life",
            "Auto Safe Car Insurance",
            "Travel Secure"
        ],
        "referral_details": {
            "has_referred": False,
            "referral_code": "PRIYA123",
            "reward_program_details": "Get a ₹500 gift voucher for every successful referral who purchases a policy."
        }
    }
    positive_history = [
        "Initial call, customer was happy with the policy details for her family.",
        "Follow-up call 6 months later, no issues reported."
    ]
    positive_new_note = "Just spoke to Priya for a yearly check-in. She is very satisfied with the health policy and mentioned her sister is currently looking for car insurance."

    status, followup_date, focus = update_note(positive_customer, positive_history, positive_new_note)
    print(f"Customer Status: {status}")
    print(f"Next Follow-up Date: {followup_date}")
    print(f"Follow-up Focus: {focus}")

    # --- GENERATE FOLLOW-UP MESSAGE BASED ON ANALYSIS ---
    if "failed" not in focus.lower():
        print("\n" + "="*40 + "\n--- GENERATING PERSUASIVE FOLLOW-UP (POSITIVE) ---\n" + "="*40)
        followup_message = generate_followup(positive_customer, positive_history + [positive_new_note], focus, contact_platform="Email")
        print(f"Generated Email to send to {positive_customer['name']}:\n---")
        print(followup_message)
        print("---")


    # --- SCENARIO 2: AT-RISK CUSTOMER ---
    print("\n" + "="*40 + "\n--- ANALYZING AT-RISK CUSTOMER ---\n" + "="*40)
    negative_customer = {
        "customer_id": "CUST102",
        "name": "Amit Patel",
        "contact": "amit.patel@email.com",
        "enrolled_policies": [
            {
                "policy_name": "Auto Safe Car Insurance",
                "policy_id": "POL-A456",
                "contract_end_date": "2026-05-20",
                "payment_status": "Delayed",
                "premium": "15,000/year"
            }
        ],
        "other_available_policies": [
            "Family Health Guard",
            "Secure Term Life"
        ]
    }
    negative_history = [
        "Customer had some issues with claim submission last year, was a bit frustrated but we resolved it.",
        "Payment for the last premium was 10 days late."
    ]
    negative_new_note = "Amit called today. He is upset that the premium has slightly increased this year for his car. Said he might look for other options as his renewal date is approaching."

    status, followup_date, focus = update_note(negative_customer, negative_history, negative_new_note)
    print(f"Customer Status: {status}")
    print(f"Next Follow-up Date: {followup_date}")
    print(f"Follow-up Focus: {focus}")

    # --- GENERATE FOLLOW-UP MESSAGE FOR AT-RISK CUSTOMER ---
    if "failed" not in focus.lower():
        print("\n" + "="*40 + "\n--- GENERATING PERSUASIVE FOLLOW-UP (AT-RISK) ---\n" + "="*40)
        followup_message = generate_followup(negative_customer, negative_history + [negative_new_note], focus, contact_platform="WhatsApp")
        print(f"Generated WhatsApp Message to send to {negative_customer['name']}:\n---")
        print(followup_message)
        print("---")

