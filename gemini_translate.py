import json
import time
import os
import requests
import os
import requests
import argparse
import re
from dotenv import load_dotenv

def flatten_dict(d, parent_key='', sep='|'):
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else str(k)
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        elif isinstance(v, list):
            for i, item in enumerate(v):
                items.extend(flatten_dict({str(i): item}, new_key, sep=sep).items())
        else:
            if isinstance(v, str) and v.strip() != "":
                items.append((new_key, v))
            else:
                items.append((new_key, v))
    return dict(items)

def nest_flat_dict(flat_dict, sep='|'):
    result = {}
    for k, v in flat_dict.items():
        parts = k.split(sep)
        d = result
        for part in parts[:-1]:
            d = d.setdefault(part, {})
        d[parts[-1]] = v
    return result

def load_json(path):
    if not os.path.exists(path):
        return {}
    with open(path, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except:
            return {}

def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def translate_batch_with_gemini(api_key, batch_dict_flat, language):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    # We nest the flat dictionary to give Gemini proper contextual nested JSON!
    nested_batch = nest_flat_dict(batch_dict_flat)

    prompt = f"""You are a professional translator for a gym management software. Translate the following JSON values from English to {language}. 
IMPORTANT: 
- Return ONLY valid JSON and nothing else. Do not use markdown blocks like ```json. 
- Keep the exact identical nested structure and keys.
- Don't translate placeholders like {{{{something}}}}.

JSON to translate:
{json.dumps(nested_batch, ensure_ascii=False, indent=2)}
"""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.1,
            "response_mime_type": "application/json"
        }
    }
    
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        if response.status_code == 429:
            print("[!] Rate limit exceeded (429).")
            return None
        elif response.status_code != 200:
            print(f"[!] API Error {response.status_code}: {response.text}")
            return None
            
        result = response.json()
        translated_text = result["candidates"][0]["content"]["parts"][0]["text"]
        
        try:
            translated_nested = json.loads(translated_text.strip())
            return flatten_dict(translated_nested)
        except json.JSONDecodeError:
            print("[!] Failed to parse Gemini response as JSON")
            return None
            
    except Exception as e:
        print(f"[!] Exception during API call: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Translate JSON using Gemini API")
    parser.add_argument("--source", type=str, required=True, help="Path to the source JSON file (e.g. en.json)")
    parser.add_argument("--target", type=str, required=True, help="Path to the output JSON file (e.g. ar.json)")
    parser.add_argument("--lang", type=str, required=True, help="Target language (e.g. 'French', 'Arabic')")
    parser.add_argument("--start", type=int, default=0, help="Line/Item index to start from (skip the first N string values)")
    parser.add_argument("--batch-size", type=int, default=40, help="Number of strings to send to Gemini per batch")
    parser.add_argument("--key-index", type=int, default=0, help="Index of the API key to start with from the .env file")
    args = parser.parse_args()

    # Load environment variables
    load_dotenv(".env")
    load_dotenv("backend/.env")

    # Find API keys
    API_KEYS = [value.strip() for key, value in os.environ.items() if "GEMINI" in key and "API_KEY" in key]
    if not API_KEYS:
        print("Warning: No Gemini API keys found in .env! (Defaulting to YOUR_API_KEY_1)")
        API_KEYS = ["YOUR_API_KEY_1"]

    source_file = args.source
    target_file = args.target
    BATCH_SIZE = args.batch_size

    en_data = load_json(source_file)
    if not en_data:
        print(f"Could not load {source_file}. Exiting.")
        return
        
    en_flat = flatten_dict(en_data)
    flat_keys = [k for k, v in en_flat.items() if isinstance(v, str) and v.strip() != ""]
    
    print(f"Found {len(flat_keys)} total strings in {source_file}")
    
    # Load what is ONLY in the target_file right now
    progress_flat = flatten_dict(load_json(target_file))
    
    # If the user specified a manual start offset using line numbers
    if args.start > 0:
        print(f"Applying manual start offset from LINE {args.start}...")
        try:
            with open(source_file, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            # Calculate how many string values appear BEFORE this line
            text_before = "".join(lines[:args.start-1]) # 0-indexed internally
            # Find all string values formatted like `: "value"`
            skipped_count = len(re.findall(r':\s*"(?:\\.|[^"\\])*"', text_before))
            # Also account for empty string values if they exist, though flat_keys filters them
            
            print(f"Line {args.start} corresponds to string index {skipped_count}. Skipping {skipped_count} original items...")
            flat_keys = flat_keys[skipped_count:]
        except Exception as e:
            print(f"Error reading line number {args.start}: {e}")

    # Determine what still needs translation
    # If the key isn't in ar.json, it hasn't been processed yet.
    # OR if the text in ar.json exactly matches the English text in en.json
    keys_needed = [k for k in flat_keys if k not in progress_flat or progress_flat[k] == en_flat[k]]
    
    # For progress tracking
    translated_count = len([k for k in flat_keys if k in progress_flat and progress_flat[k] != en_flat[k]])
    print(f"Detected {translated_count} already translated strings from the current pool in {target_file}.")
        
    print(f"Translating the remaining {len(keys_needed)} strings incrementally.")
    
    current_key_idx = args.key_index
    total_keys = len(API_KEYS)
    
    if len(keys_needed) > 0:
        for i in range(0, len(keys_needed), BATCH_SIZE):
            batch_keys = keys_needed[i:i+BATCH_SIZE]
            batch_dict_flat = {k: en_flat[k] for k in batch_keys}
            
            success = False
            retries = 0
            
            while not success and retries < total_keys * 2:
                current_api_key = API_KEYS[current_key_idx]
                print(f"\nTranslating next {len(batch_keys)} items using API Key Index [{current_key_idx}]...")
                
                translated_dict_flat = translate_batch_with_gemini(current_api_key, batch_dict_flat, args.lang)
                
                if translated_dict_flat is not None and len(translated_dict_flat) > 0:
                    for k in batch_keys:
                        if k in translated_dict_flat:
                            progress_flat[k] = translated_dict_flat[k]
                        else:
                            # If AI skips a key, populate the fallback
                            progress_flat[k] = en_flat[k] 
                    
                    # Instead of copying the ENTIRE EN.JSON file and pretending it's Arabic,
                    # we will literally rebuild a nested JSON of ONLY what has been fully processed and tracked in progress_flat!
                    ar_data = nest_flat_dict(progress_flat)
                    save_json(target_file, ar_data)
                    
                    print(f"-> Batch complete. Appended structurally to {target_file}.")
                    success = True
                    time.sleep(1) # Prevent rate limits
                else:
                    print("-> Batch Failed. Rotating API key.")
                    current_key_idx = (current_key_idx + 1) % total_keys
                    retries += 1
                    time.sleep(2)
                    
            if not success:
                print("All API keys failed or rate-limited. Aborting script. You can run it again later to resume.")
                break
                
    print("Done!")

if __name__ == "__main__":
    main()
