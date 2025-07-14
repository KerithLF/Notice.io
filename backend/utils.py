import re
from backend.templates import PLACEHOLDER_ALIASES

def normalize_fuzzy_placeholders(text: str, data: dict) -> str:
    def replacer(match):
        raw_key = match.group(1).strip().lower()
        if raw_key in data:
            return str(data[raw_key])
        resolved_key = PLACEHOLDER_ALIASES.get(raw_key)
        if resolved_key and resolved_key in data:
            return str(data[resolved_key])
        return match.group(0)

    pattern = r"\[\s*['\"]?([^\[\]\"']+?)['\"]?\s*\]"
    return re.sub(pattern, replacer, text)
