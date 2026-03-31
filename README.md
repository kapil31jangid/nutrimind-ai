# 🥗 NutriMind AI — Smart Food Decision Assistant

> A lightweight, zero-dependency Python CLI that recommends the healthiest food within your budget — and tells you **exactly why**.

---

## 🚨 Problem

Most food apps tell you what you *already* ate. Diet plans feel overwhelming. People make poor food choices not because they don't care — but because they lack **actionable, personalised guidance in the moment**.

---

## 💡 Solution

NutriMind AI is a **decision-making assistant**, not a calorie tracker.

Enter your budget → get an intelligent recommendation → understand why → get a smarter alternative if one exists.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 Budget-aware recommendation | Only foods you can actually afford |
| 📊 Health Score ranking | Science-backed formula (protein, fat, calories) |
| 🗣️ Plain-English explanation | Tells you *why* the food was chosen |
| 🔄 Smart Swap suggestion | Recommends a healthier alternative within budget |
| 🪶 Zero dependencies | Pure Python standard library — no `pip install` |

---

## 🧮 How It Works

### Health Score Formula

```
score = (protein × 2) - (fat × 1.5) - (calories ÷ 10)
```

| Component | Weight | Rationale |
|-----------|--------|-----------|
| Protein | +2× | Promotes satiety, muscle repair |
| Fat | −1.5× | Excess fat penalised |
| Calories | −0.1× | Manages energy density |

The food with the **highest score within your budget** is recommended.

---

## 📁 Project Structure

```
nutrimind-ai/
├── main.py           # CLI entry point — orchestrates the full flow
├── utils.py          # Pure logic: health_score(), explain(), suggest_swap()
├── data.json         # Static food database (6 items)
├── requirements.txt  # No external dependencies
└── README.md         # This file
```

---

## 🚀 How to Run

**Prerequisites:** Python 3.10+

```bash
# 1. Clone the repository
git clone https://github.com/kapil/nutrimind-ai.git
cd nutrimind-ai

# 2. Run (no install step needed)
python main.py
```

---

## 📊 Sample Output

```
╔══════════════════════════════════════════╗
║        🥗 NutriMind AI                   ║
║   Smart Food Decision Assistant          ║
╚══════════════════════════════════════════╝

Enter your budget (₹): 100

╔──────────────────────────────────────────────╗
║          ✅ NutriMind AI Recommends           ║
╠──────────────────────────────────────────────╣
║  Food:         Chicken Breast (100g)          ║
║  Health Score: 40.10                          ║
║  Price:        ₹60                            ║
║  Calories:     165 kcal                       ║
║  Protein:      31.0g                          ║
║  Fat:          3.6g                           ║
╠──────────────────────────────────────────────╣
║  📌 Why this choice:                          ║
║     → High protein content (31.0g) —          ║
║       great for energy and muscle             ║
║     → Low in fat (3.6g) — heart-friendly      ║
║     → Moderate calorie count (165 kcal)       ║
║     → Fits your budget (₹60 ≤ ₹100)          ║
╠──────────────────────────────────────────────╣
║  💡 Healthier Swap:                           ║
║     No better option within your budget.      ║
╚──────────────────────────────────────────────╝
```

---

## 🗄️ Food Database (data.json)

| Food | Calories | Protein | Fat | Price | Health Score |
|------|----------|---------|-----|-------|--------------|
| Chicken Breast (100g) | 165 kcal | 31g | 3.6g | ₹60 | **40.10** |
| Greek Yogurt (150g) | 100 kcal | 10g | 0.7g | ₹35 | **8.95** |
| Boiled Eggs (2 pcs) | 155 kcal | 13g | 11g | ₹20 | −6.00 |
| Banana | 89 kcal | 1.1g | 0.3g | ₹10 | −7.15 |
| Paneer Tikka | 220 kcal | 14g | 15g | ₹45 | −16.50 |
| Instant Noodles | 380 kcal | 8g | 14g | ₹15 | −43.00 |

---

## 📦 Assumptions

- Food database is static (JSON file — easily extendable)
- Budget is entered in Indian Rupees (₹)
- All nutritional values are per standard serving
- "Better" means strictly higher health score within the same budget
- Python 3.10+ required for `X | None` union type hints

---

## 🏗️ Architecture

```
main.py
  ├── load_foods()        → reads data.json
  ├── get_budget()        → validated user input
  ├── filter + rank       → affordable foods by health_score()
  └── print_recommendation()
        ├── utils.health_score()
        ├── utils.explain()
        └── utils.suggest_swap()
```

---

## 🧪 Edge Cases Handled

| Scenario | Behaviour |
|----------|-----------|
| Budget too low (₹5) | Friendly message, graceful exit |
| Only one affordable option | Recommended with "No swap available" |
| Non-numeric budget input | Re-prompts with clear error message |
| Budget of ₹0 or negative | Re-prompts with clear error message |

---

## 👨‍💻 Built For

**Hackathon — AI/ML Decision Assistants Track**

> *"The best technology is the one that helps you make better decisions."*
