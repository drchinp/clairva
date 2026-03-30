"""
File: app/tools/llm_provider.py

Purpose:
Universal LLM router for Clairva agents.

Supports:
- OpenAI
- Google Gemini
- Anthropic Claude
- DeepSeek
- Local models (future)

Allows user/provider selection dynamically.
"""


import os
from dotenv import load_dotenv
load_dotenv()
from openai import OpenAI
from anthropic import Anthropic
from app.utils.logger import get_logger
from app.security.budget_guard import check_budget

logger = get_logger(__name__)

# ------------------------------------------------
# Clients Initialization
# ------------------------------------------------

openai_client = None
claude_client = None

if os.getenv("OPENAI_API_KEY"):
    openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    logger.info("OpenAI client initialized")

if os.getenv("ANTHROPIC_API_KEY"):
    claude_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    logger.info("Claude client initialized")


# ------------------------------------------------
# Defaults
# ------------------------------------------------

DEFAULT_PROVIDER = os.getenv("DEFAULT_LLM_PROVIDER", "openai")
DEFAULT_MODEL = os.getenv("DEFAULT_LLM_MODEL", "gpt-4.1-mini")


# ------------------------------------------------
# Main LLM Router
# ------------------------------------------------

def generate(
    prompt: str,
    agent_id: str,
    provider: str | None = None,
    model: str | None = None,
    temperature: float = 0.3
):

    # --------------------------------------------
    # Budget Guard Check
    # --------------------------------------------

    check_budget(agent_id)

    selected_provider = provider or DEFAULT_PROVIDER
    selected_model = model or DEFAULT_MODEL

    logger.info(
        f"LLM request | agent={agent_id} | provider={selected_provider} | model={selected_model}"
    )

    if selected_provider == "openai":
        return generate_openai(prompt, selected_model, temperature)

    elif selected_provider == "claude":
        return generate_claude(prompt, selected_model)

    elif selected_provider == "gemini":
        return generate_gemini(prompt, selected_model)

    elif selected_provider == "deepseek":
        return generate_deepseek(prompt, selected_model)

    else:
        raise ValueError(f"Unsupported LLM provider: {selected_provider}")


# ------------------------------------------------
# OpenAI
# ------------------------------------------------

def generate_openai(prompt, model, temperature):

    if not openai_client:
        raise Exception("OpenAI API key not configured")

    response = openai_client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are an expert enterprise AI assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=temperature
    )

    return response.choices[0].message.content


# ------------------------------------------------
# Claude
# ------------------------------------------------

def generate_claude(prompt, model):

    if not claude_client:
        raise Exception("Anthropic API key not configured")

    message = claude_client.messages.create(
        model=model,
        max_tokens=1024,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return message.content[0].text


# ------------------------------------------------
# Gemini (placeholder)
# ------------------------------------------------

def generate_gemini(prompt, model):

    logger.info("Gemini provider selected (not yet implemented)")

    return "Gemini response placeholder"


# ------------------------------------------------
# DeepSeek (placeholder)
# ------------------------------------------------

def generate_deepseek(prompt, model):

    logger.info("DeepSeek provider selected (not yet implemented)")

    return "DeepSeek response placeholder"


# ------------------------------------------------
# Embeddings (for RAG)
# ------------------------------------------------

def generate_embedding(text: str):

    if not openai_client:
        raise Exception("OpenAI API key required for embeddings")

    logger.info("Generating embedding vector")

    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )

    return response.data[0].embedding