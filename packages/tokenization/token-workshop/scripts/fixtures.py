"""Regenerate independent cl100k_base oracle fixtures with locked tiktoken."""
import argparse
import json
import random
from pathlib import Path
import tiktoken
import regex

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', type=Path, default=Path(__file__).resolve().parents[1] / 'tests' / 'fixtures.json')
parser.add_argument('--random-count', type=int, default=0, help='Additional deterministic fuzz cases; use an ignored output path')
args = parser.parse_args()
enc = tiktoken.get_encoding('cl100k_base')
samples = ['', 'Hello, 世界! 👋', 'hello world', 'hello  world', '中文', '语言模型如何阅读文字？', '👋 👩🏽‍💻 🇨🇳 ❤️', 'def greet(name):\n\tprint("Hello", name)', '\r\n\t  \n', "WE'RE I'd they've it'ſ", '<|endoftext|>', 'e\u0301 é', '\u00a0\u0085\u2028\u2029\ufeff', 'aaaaaaaaaaaa', '中文中文', '1234567890', '\x00\x01\x7f']
rng = random.Random(20260915)
alphabet = list('abcXYZ0123456789 ,.!\n\r\t中文你好') + ['👋', '🏽', '\u200d', 'é', '\u0301', '\u00a0', '\u0085', '\u2028', '\ufeff']
samples += [''.join(rng.choices(alphabet, k=rng.randint(1, 100))) for _ in range(args.random_count)]
fixtures = [{'text': text, 'ids': enc.encode_ordinary(text), 'pieces': regex.findall(enc._pat_str, text)} for text in samples]
args.output.write_text('[\n' + ',\n'.join('  ' + json.dumps(case, ensure_ascii=True) for case in fixtures) + '\n]\n')
print(f'Wrote {len(fixtures)} fixtures to {args.output}')
