import os
import json
from google import genai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini with new google-genai package
client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

# Prompts for each mode
MODE_PROMPTS = {
    'shorten': 'Reformat the code to be shorter and more concise. Combine redundant logic, use language idioms, remove unnecessary variables. Keep all functionality intact. Return ONLY the code, no explanation, no markdown fences.',
    'minify':  'Minify the code as much as possible. Collapse whitespace, merge lines where valid, fewest characters while staying runnable. Return ONLY the code, no explanation, no markdown fences.',
    'clean':   'Clean up the code: fix indentation, consistent naming, remove dead code and unused variables. Return ONLY the code, no explanation, no markdown fences.',
    'comment': 'Add clear concise inline comments explaining what each section does. Focus on logic and non-obvious decisions. Return ONLY the commented code, no explanation, no markdown fences.',
}

@csrf_exempt
@require_http_methods(['POST', 'OPTIONS'])
def reformat_code(request):
    # Handle preflight CORS request from browser
    if request.method == 'OPTIONS':
        response = JsonResponse({})
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    try:
        # Parse request body
        body     = json.loads(request.body)
        code     = body.get('code', '').strip()
        language = body.get('language', 'JavaScript')
        mode     = body.get('mode', 'shorten')

        # Validate inputs
        if not code:
            return JsonResponse({'error': 'No code provided'}, status=400)
        if mode not in MODE_PROMPTS:
            return JsonResponse({'error': f'Invalid mode: {mode}'}, status=400)

        # Build prompt
        prompt = f"""You are an expert {language} developer.
{MODE_PROMPTS[mode]}

Language: {language}

Code:
{code}"""

        # Call Gemini API using new package
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        raw_output  = response.text or ''

        # Clean markdown fences if Gemini adds them
        reformatted = raw_output
        if reformatted.startswith('```'):
            lines = reformatted.split('\n')
            lines = lines[1:]
            if lines and lines[-1].strip() == '```':
                lines = lines[:-1]
            reformatted = '\n'.join(lines)
        reformatted = reformatted.strip()

        # Calculate stats
        input_lines  = len(code.split('\n'))
        output_lines = len(reformatted.split('\n'))
        input_chars  = len(code)
        output_chars = len(reformatted)
        reduction    = round((1 - output_chars / input_chars) * 100) if input_chars > 0 else 0

        return JsonResponse({
            'reformattedCode':  reformatted,
            'inputLines':       input_lines,
            'outputLines':      output_lines,
            'inputChars':       input_chars,
            'outputChars':      output_chars,
            'reductionPercent': reduction,
        })

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON in request'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_http_methods(['GET'])
def health_check(request):
    return JsonResponse({'status': 'ok', 'service': 'django-ai-service'})