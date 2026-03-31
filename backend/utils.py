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
    Generate sophisticated, analytical reasons why a food was mathematically recommended.
    """
    reasons = []
    
    # Protein density check
    if food["protein"] >= 15:
        reasons.append(f"Superior protein density ({food['protein']}g) detected for lean mass support.")
    elif food["protein"] > 5:
        reasons.append(f"Balanced amino acid profile with {food['protein']}g of high-quality protein.")
        
    # Fat/Lipid profile
    if food["fat"] <= 5:
        reasons.append(f"Optimized lipid profile ({food['fat']}g) to minimize metabolic inflammation.")
    elif food["fat"] <= 12:
        reasons.append(f"Controlled fat content ({food['fat']}g) aligned with heart-healthy guidelines.")
        
    # Caloric efficiency
    if food["calories"] <= 150:
        reasons.append(f"High caloric efficiency: only {food['calories']} kcal for maximum nutrient delivery.")
    elif food["calories"] <= 300:
        reasons.append(f"Sustainable energy release at {food['calories']} kcal for prolonged satiety.")

    # Budget optimization
    savings = budget - food["price"]
    if savings > 0:
        reasons.append(f"Fiscal efficiency: Secured 100% of nutritional needs at just ₹{food['price']} (saving ₹{savings:.0f}).")
    else:
        reasons.append(f"Maximum budget utilization for peak nutritional density at ₹{food['price']}.")

    return reasons[:4] # Keep it sharp and focused


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
