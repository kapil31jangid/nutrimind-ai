"""
utils.py — NutriMind AI core logic
Pure functions: no I/O, no side effects.
"""


def health_score(food: dict) -> float:
    """
    Calculate the health score of a food item.

    Formula: (protein * 2) - (fat * 1.5) - (calories / 10)
    - Protein rewarded: supports muscle building and satiety.
    - Fat penalised: excess fat reduces the score.
    - Calories lightly penalised: manages energy density.

    Args:
        food: dict with keys 'protein' (g), 'fat' (g), 'calories' (kcal).

    Returns:
        float health score (higher is healthier).
    """
    return (food["protein"] * 2) - (food["fat"] * 1.5) - (food["calories"] / 10)


def explain(food: dict, budget: float) -> list:
    """
    Generate plain-English reasons why a food was recommended.

    Args:
        food:   dict with nutritional and price data.
        budget: user's budget in ₹.

    Returns:
        list of reason strings.
    """
    reasons = []

    if food["protein"] >= 10:
        reasons.append(f"High protein content ({food['protein']}g) — great for energy and muscle")

    if food["fat"] <= 5:
        reasons.append(f"Low in fat ({food['fat']}g) — heart-friendly choice")

    if food["calories"] <= 200:
        reasons.append(f"Moderate calorie count ({food['calories']} kcal) — won't weigh you down")

    reasons.append(f"Fits your budget (₹{food['price']} ≤ ₹{budget:.0f})")

    return reasons


def suggest_swap(selected: dict, all_foods: list, budget: float) -> dict | None:
    """
    Suggest a healthier food alternative within the same budget.

    Finds the food (excluding the selected one) within budget that has
    a strictly higher health score than the selected food.

    Args:
        selected:  currently recommended food dict.
        all_foods: full list of food dicts.
        budget:    user's budget in ₹.

    Returns:
        The best alternative food dict, or None if none exists.
    """
    selected_score = health_score(selected)

    candidates = [
        food for food in all_foods
        if food["name"] != selected["name"]
        and food["price"] <= budget
        and health_score(food) > selected_score
    ]

    if not candidates:
        return None

    return max(candidates, key=health_score)
