import os
import json
import time

from dotenv import load_dotenv
from google import genai


load_dotenv()


class LLMIntegration:

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY is not set. "
                "Please check your .env file."
            )

        self.client = genai.Client(api_key=api_key)

        # Primary model for the project
        self.model = "gemini-3.8-flash"

        # Fallback model if the primary model is temporarily unavailable
        self.fallback_model = "gemini-3.7-flash"

    # ---------------------------------------------------------
    # INTERNAL GENERATION
    # ---------------------------------------------------------

    def _generate(self, prompt, model):
        """
        Send a prompt to Gemini and return the generated text.
        """

        chat = self.client.chats.create(
            model=model
        )

        response = chat.send_message(
            message=prompt
        )

        if not response.text:
            raise ValueError(
                "Gemini returned an empty response."
            )

        return response.text.strip()

    # ---------------------------------------------------------
    # NORMAL RESPONSE
    # ---------------------------------------------------------

    def generate_response(self, prompt):
        """
        Generate a normal text response.

        Tries the primary model first.
        Retries temporary errors.
        Uses the fallback model if necessary.
        """

        last_error = None

        # -----------------------------------------------------
        # TRY PRIMARY MODEL
        # -----------------------------------------------------

        for attempt in range(3):

            try:
                return self._generate(
                    prompt,
                    self.model
                )

            except Exception as error:

                last_error = error
                error_text = str(error).upper()

                temporary_error = (
                    "503" in error_text
                    or "UNAVAILABLE" in error_text
                    or "429" in error_text
                    or "500" in error_text
                    or "INTERNAL" in error_text
                    or "TIMEOUT" in error_text
                )

                if not temporary_error:
                    raise

                wait_time = 2 ** attempt

                print(
                    "Gemini temporarily unavailable. "
                    f"Retrying in {wait_time} seconds..."
                )

                time.sleep(wait_time)

        # -----------------------------------------------------
        # TRY FALLBACK MODEL
        # -----------------------------------------------------

        print(
            f"Primary model unavailable. "
            f"Trying fallback model: {self.fallback_model}"
        )

        for attempt in range(2):

            try:
                return self._generate(
                    prompt,
                    self.fallback_model
                )

            except Exception as error:

                last_error = error
                error_text = str(error).upper()

                temporary_error = (
                    "503" in error_text
                    or "UNAVAILABLE" in error_text
                    or "429" in error_text
                    or "500" in error_text
                    or "INTERNAL" in error_text
                    or "TIMEOUT" in error_text
                )

                if not temporary_error:
                    raise

                wait_time = 2 ** attempt

                print(
                    "Fallback model temporarily unavailable. "
                    f"Retrying in {wait_time} seconds..."
                )

                time.sleep(wait_time)

        # -----------------------------------------------------
        # BOTH MODELS FAILED
        # -----------------------------------------------------

        raise RuntimeError(
            "Gemini API request failed after retries.\n"
            f"Last error: {last_error}"
        ) from last_error

    # ---------------------------------------------------------
    # STRUCTURED JSON RESPONSE
    # ---------------------------------------------------------

    def generate_structured_response(self, prompt):
        """
        Generate a JSON response from Gemini and convert it
        into a Python dictionary/list.
        """

        structured_prompt = f"""
{prompt}

IMPORTANT:
Return ONLY valid JSON.
Do not use Markdown.
Do not wrap the JSON in ```json or ``` blocks.
"""

        text = self.generate_response(
            structured_prompt
        )

        # Remove accidental Markdown code fences
        if text.startswith("```json"):
            text = text[7:]

        elif text.startswith("```"):
            text = text[3:]

        if text.endswith("```"):
            text = text[:-3]

        text = text.strip()

        try:
            return json.loads(text)

        except json.JSONDecodeError as error:

            raise ValueError(
                "Gemini returned an invalid JSON response:\n"
                f"{text}"
            ) from error