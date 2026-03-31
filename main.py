"""
main.py — NutriMind AI entry point
Smart food decision assistant: recommends, explains, and suggests swaps.
"""

import json
import sys
from utils import health_score, explain, suggest_swap


DATA_FILE = "data.json"


def load_foods(filepath: str) -> list:
    """Load and return the food database from a JSON file."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"[Error] Data file '{filepath}' not found.")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"[Error] '{filepath}' contains invalid JSON.")
        sys.exit(1)


def get_budget() -> float:
    """Prompt the user for a valid budget in ₹."""
    while True:
        raw = input("Enter your budget (₹): ").strip()
        try:
            budget = float(raw)
            if budget <= 0:
                print("  ⚠  Budget must be greater than ₹0. Try again.")
                continue
            return budget
        except ValueError:
            print("  ⚠  Please enter a valid number. Try again.")


def print_banner() -> None:
    """Print the welcome banner."""
    print()
    print("╔══════════════════════════════════════════╗")
    print("║        🥗 NutriMind AI                   ║")
    print("║   Smart Food Decision Assistant          ║")
    print("╚══════════════════════════════════════════╝")
    print()


def print_recommendation(food: dict, score: float, reasons: list, swap: dict | None) -> None:
    """Print the formatted recommendation block."""
    width = 46
    line = "─" * width

    print(f"╔{line}╗")
    print(f"║{'  ✅ NutriMind AI Recommends':^{width}}║")
    print(f"╠{line}╣")
    print(f"║  Food:         {food['name']:<{width - 18}}║")
    print(f"║  Health Score: {score:<{width - 18}.2f}║")
    print(f"║  Price:        ₹{food['price']:<{width - 19}}║")
    print(f"║  Calories:     {food['calories']} kcal{'':<{width - 26}}║")
    print(f"║  Protein:      {food['protein']}g{'':<{width - 20}}║")
    print(f"║  Fat:          {food['fat']}g{'':<{width - 20}}║")
    print(f"╠{line}╣")
    print(f"║  📌 Why this choice:{'':<{width - 22}}║")
    for reason in reasons:
        # Word-wrap each reason to fit the box
        words = reason.split()
        line_buf = "     → "
        for word in words:
            if len(line_buf) + len(word) + 1 > width - 2:
                print(f"║  {line_buf:<{width - 4}}║")
                line_buf = "       " + word + " "
            else:
                line_buf += word + " "
        print(f"║  {line_buf.rstrip():<{width - 4}}║")

    print(f"╠{line}╣")
    print(f"║  💡 Healthier Swap:{'':<{width - 21}}║")
    if swap:
        swap_score = health_score(swap)
        print(f"║     {swap['name']:<{width - 7}}║")
        print(f"║     Score: {swap_score:.2f}  |  Price: ₹{swap['price']:<{width - 30}}║")
    else:
        msg = "No better option within your budget."
        print(f"║     {msg:<{width - 7}}║")

    print(f"╚{line}╝")
    print()


def main() -> None:
    foods = load_foods(DATA_FILE)
    print_banner()

    budget = get_budget()
    print()

    # Filter foods within budget
    affordable = [f for f in foods if f["price"] <= budget]

    if not affordable:
        print(f"  😔 No food found within ₹{budget:.0f}.")
        print("  Try increasing your budget or check back for more options.")
        print()
        sys.exit(0)

    # Rank by health score (descending)
    ranked = sorted(affordable, key=health_score, reverse=True)
    recommendation = ranked[0]

    score = health_score(recommendation)
    reasons = explain(recommendation, budget)
    swap = suggest_swap(recommendation, foods, budget)

    print_recommendation(recommendation, score, reasons, swap)


if __name__ == "__main__":
    main()
