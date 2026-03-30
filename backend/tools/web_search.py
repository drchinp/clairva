"""
File: app/tools/web_search.py

Purpose:
Universal web search tool for Clairva agents.

Supports:
- SerpAPI
- Tavily
- Perplexity

Allows provider selection dynamically.
"""

import os
import requests
from app.utils.logger import get_logger

logger = get_logger(__name__)

DEFAULT_SEARCH_PROVIDER = os.getenv("DEFAULT_SEARCH_PROVIDER", "tavily")


def web_search(query: str, provider: str | None = None):

    provider = provider or DEFAULT_SEARCH_PROVIDER

    logger.info(f"Web search | provider={provider} | query={query}")

    if provider == "serpapi":
        return search_serpapi(query)

    elif provider == "tavily":
        return search_tavily(query)

    elif provider == "perplexity":
        return search_perplexity(query)

    else:
        raise ValueError(f"Unsupported search provider: {provider}")


# ---------------------
# SerpAPI
# ---------------------

def search_serpapi(query: str):

    api_key = os.getenv("SERPAPI_API_KEY")

    url = "https://serpapi.com/search"

    params = {
        "q": query,
        "api_key": api_key,
        "engine": "google"
    }

    response = requests.get(url, params=params)

    data = response.json()

    results = []

    for result in data.get("organic_results", [])[:5]:
        results.append({
            "title": result.get("title"),
            "link": result.get("link"),
            "snippet": result.get("snippet")
        })

    return results


# ---------------------
# Tavily
# ---------------------

def search_tavily(query: str):

    api_key = os.getenv("TAVILY_API_KEY")

    url = "https://api.tavily.com/search"

    payload = {
        "api_key": api_key,
        "query": query,
        "search_depth": "advanced",
        "max_results": 5
    }

    response = requests.post(url, json=payload)

    data = response.json()

    return data.get("results", [])


# ---------------------
# Perplexity
# ---------------------

def search_perplexity(query: str):

    api_key = os.getenv("PERPLEXITY_API_KEY")

    url = "https://api.perplexity.ai/chat/completions"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "sonar-small-online",
        "messages": [
            {
                "role": "user",
                "content": query
            }
        ]
    }

    response = requests.post(url, headers=headers, json=payload)

    data = response.json()

    answer = data["choices"][0]["message"]["content"]

    return answer

from app.mcp.tool_registry import tool_registry

tool_registry.register_tool(
    "web_search",
    web_search
)