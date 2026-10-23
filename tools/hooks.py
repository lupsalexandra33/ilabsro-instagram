#!/usr/bin/env python3
"""
hooks.py - browse and classify the Innovation Labs hook formulas in il-hooks.json.

  python3 hooks.py                       # formulas IL may write from (il_use: yes), with notes
  python3 hooks.py --use yes,adapt       # include the conditional ones
  python3 hooks.py --id 13               # one formula in full
  python3 hooks.py --classify "Still polishing the prompt?"

Python 3 standard library only.
"""
import argparse
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def load(path):
    d = json.load(open(path, encoding="utf-8"))
    return d, {h["id"]: h for h in d["hooks"]}


def classify(text, d, by_id):
    for i in d.get("classify_order") or sorted(by_id):
        h = by_id.get(i)
        if h and re.search(h["match"], text, re.IGNORECASE):
            return h
    return None


def main():
    ap = argparse.ArgumentParser(description="Browse / classify IL hook formulas.")
    ap.add_argument("--use", default="yes", help="comma list of il_use values to show: yes, adapt, no")
    ap.add_argument("--id", type=int)
    ap.add_argument("--classify")
    ap.add_argument("--hooks", default=os.path.join(HERE, "il-hooks.json"))
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    d, by_id = load(a.hooks)

    if a.classify:
        h = classify(a.classify, d, by_id)
        if a.json:
            print(json.dumps(h, ensure_ascii=False, indent=1)); return
        if not h:
            print("unclassified - read it by hand; it may be a formula that is not in il-hooks.json yet"); return
        print(f"#{h['id']} {h['name']}  [IL: {h['il_use']}]  {h['il_note']}")
        return

    if a.id:
        h = by_id.get(a.id)
        if not h:
            sys.exit(f"no formula {a.id}")
        print(json.dumps(h, ensure_ascii=False, indent=1) if a.json else "\n".join(f"{k:>10}: {v}" for k, v in h.items() if k != "match"))
        return

    want = {u.strip() for u in a.use.split(",")}
    rows = [h for h in d["hooks"] if h.get("il_use") in want]
    if a.json:
        print(json.dumps(rows, ensure_ascii=False, indent=1)); return
    for h in sorted(rows, key=lambda x: x["id"]):
        print(f"#{h['id']:<3}{h['name']:<28}[{h['il_use']}]  {h['template']}")
        print(f"     e.g. {h['example']}   on screen: {h['on_screen']}")
        print(f"     IL: {h['il_note']}\n")


if __name__ == "__main__":
    main()
