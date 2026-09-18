"""
app/agents/llm_client.py
Thin wrapper around the Google Gemini API used by every Milestone 2 agent.
Retries automatically on transient 503 "model overloaded" errors, which are
common on Gemini's free tier under bursts of requests.
"""

import json
import time
from typing import Any, Dict

from google import genai
from google.genai import types
from google.genai.errors import ServerError

from app.config import GEMINI_API_KEY, GEMINI_MODEL, AGENT_TEMPERATURE

_client = None

MAX_RETRIES = 4
RETRY_BASE_DELAY_SECONDS = 5


class LLMNotConfiguredError(Exception):
    pass


def get_client() -> genai.Client:
    global _client
    if _client is None:
        if not GEMINI_API_KEY:
            raise LLMNotConfiguredError(
                "GEMINI_API_KEY is not set. Add it to a .env file in the "
                "project root (see .env.example) before calling any agent."
            )
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


def call_json(system_prompt: str, user_prompt: str) -> Dict[str, Any]:
    client = get_client()

    last_error = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=AGENT_TEMPERATURE,
                    response_mime_type="application/json",
                ),
            )
            raw = (response.text or "").strip()

            if raw.startswith("```"):
                raw = raw.strip("`")
                if raw.lower().startswith("json"):
                    raw = raw[4:]
                raw = raw.strip()

            try:
                return json.loads(raw)
            except json.JSONDecodeError as e:
                raise ValueError(f"LLM did not return valid JSON: {e}\nRaw output:\n{raw}")

        except ServerError as e:
            last_error = e
            if attempt < MAX_RETRIES:
                wait = RETRY_BASE_DELAY_SECONDS * attempt
                print(f"  Gemini overloaded (attempt {attempt}/{MAX_RETRIES}), retrying in {wait}s...")
                time.sleep(wait)
            continue

    raise last_error