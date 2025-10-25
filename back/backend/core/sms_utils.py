import os
from twilio.rest import Client

TWILIO_SID = os.getenv("TWILIO_SID")
TWILIO_AUTH = os.getenv("TWILIO_AUTH")
TWILIO_PHONE = os.getenv("TWILIO_PHONE")

if not TWILIO_SID or not TWILIO_AUTH or not TWILIO_PHONE:
    print("⚠️ Twilio not configured, SMS will be skipped.")

def send_sms(to: str, message: str):
    if not TWILIO_SID or not TWILIO_AUTH or not TWILIO_PHONE:
        return
    try:
        client = Client(TWILIO_SID, TWILIO_AUTH)
        client.messages.create(
            body=message,
            from_=TWILIO_PHONE,
            to=to
        )
        print(f"✅ SMS sent to {to}: {message}")
    except Exception as e:
        print(f"❌ SMS failed: {e}")
