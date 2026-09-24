import os
import json
from google import genai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODE_PROMPTS = {
    "shorten": "Reformat the code to be shorter and more concise. Combine redundant logic, use language idioms, remove unnecessary variables. Keep all functionality intact. Return ONLY the code.",
    "minify": "Minify the code as much as possible. Return ONLY the code.",
    "clean": "Clean up the code: fix indentation, consistent naming, remove dead code and unused variables. Return ONLY the code.",
    "comment": "Add clear concise inline comments explaining what each section does. Return ONLY the code."
}


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def reformat_code(request):

    if request.method == "OPTIONS":
        response = JsonResponse({})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    try:
        body = json.loads(request.body)

        code = body.get("code", "").strip()
        language = body.get("language", "JavaScript")
        mode = body.get("mode", "shorten")

        if not code:
            return JsonResponse(
                {"error": "No code provided"},
                status=400
            )

        if mode not in MODE_PROMPTS:
            return JsonResponse(
                {"error": "Invalid mode"},
                status=400
            )

        prompt = f"""
You are an expert {language} developer.

{MODE_PROMPTS[mode]}

Language: {language}

Code:
{code}
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        reformatted = (response.text or "").strip()

        if reformatted.startswith("```"):
            lines = reformatted.split("\n")[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            reformatted = "\n".join(lines).strip()

        input_lines = len(code.splitlines())
        output_lines = len(reformatted.splitlines())

        input_chars = len(code)
        output_chars = len(reformatted)

        reduction = (
            round((1 - output_chars / input_chars) * 100)
            if input_chars > 0
            else 0
        )

        return JsonResponse({
            "reformattedCode": reformatted,
            "inputLines": input_lines,
            "outputLines": output_lines,
            "inputChars": input_chars,
            "outputChars": output_chars,
            "reductionPercent": reduction
        })

    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON"},
            status=400
        )

    except Exception as e:
        return JsonResponse(
            {"error": str(e)},
            status=500
        )


@require_http_methods(["GET"])
def health_check(request):
    return JsonResponse({
        "status": "ok",
        "service": "django-ai-service"
    })