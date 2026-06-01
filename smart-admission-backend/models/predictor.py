"""
ML Prediction Engine
- Linear Regression
- Random Forest Classifier
- Logistic Regression
Trained on synthetic but realistic Indian engineering admission data.
"""
import numpy as np
import pandas as pd
from sklearn.linear_model    import LinearRegression, LogisticRegression
from sklearn.ensemble        import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing   import StandardScaler
from sklearn.model_selection import train_test_split
import joblib, os, random

MODEL_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
os.makedirs(MODEL_DIR, exist_ok=True)

_models = {}

# ─── Generate synthetic training data ────────────────────────
def _generate_dataset(n=5000):
    random.seed(42); np.random.seed(42)
    rows = []
    for _ in range(n):
        p10  = np.random.normal(80, 12)
        p12  = np.random.normal(78, 14)
        cgpa = np.random.normal(7.5, 1.2)
        ent  = np.random.normal(130, 40)
        cat  = random.choice([0, 3, 6, 9, 4])   # General=0, OBC=3, SC=6, ST=9, EWS=4
        ext  = random.choice([0, 2, 2, 4, 1])    # None=0, Sports=2, Olympiad=4, etc.

        # Clamp
        p10  = float(np.clip(p10, 40, 100))
        p12  = float(np.clip(p12, 35, 100))
        cgpa = float(np.clip(cgpa, 4, 10))
        ent  = float(np.clip(ent, 0, 300))

        # Admission probability formula (ground truth)
        prob = (p10 * 0.12 + p12 * 0.28 + cgpa * 10 * 0.30 + (ent / 300) * 100 * 0.30 + cat + ext)
        prob = float(np.clip(prob + np.random.normal(0, 3), 10, 97))
        admitted = 1 if prob >= 60 else 0

        rows.append([p10, p12, cgpa, ent, cat, ext, prob, admitted])

    return pd.DataFrame(rows, columns=["p10","p12","cgpa","entrance","category","extra","prob","admitted"])


# ─── Train or load models ─────────────────────────────────────
def get_models():
    global _models
    if _models:
        return _models

    lr_path  = os.path.join(MODEL_DIR, "lr.pkl")
    rf_path  = os.path.join(MODEL_DIR, "rf.pkl")
    log_path = os.path.join(MODEL_DIR, "log.pkl")
    sc_path  = os.path.join(MODEL_DIR, "scaler.pkl")

    if all(os.path.exists(p) for p in [lr_path, rf_path, log_path, sc_path]):
        _models = {
            "lr":     joblib.load(lr_path),
            "rf":     joblib.load(rf_path),
            "log":    joblib.load(log_path),
            "scaler": joblib.load(sc_path),
        }
        print("  ✅ ML models loaded from disk")
    else:
        print("  🔄 Training ML models…")
        df = _generate_dataset(6000)
        X  = df[["p10","p12","cgpa","entrance","category","extra"]].values
        y_prob     = df["prob"].values
        y_admitted = df["admitted"].values

        scaler = StandardScaler()
        Xs = scaler.fit_transform(X)

        Xtr, Xte, ytr, yte = train_test_split(Xs, y_prob, test_size=0.2, random_state=42)

        lr  = LinearRegression().fit(Xtr, ytr)
        rf  = RandomForestRegressor(n_estimators=100, random_state=42).fit(Xtr, ytr)
        log = LogisticRegression(max_iter=500).fit(Xs, y_admitted)

        joblib.dump(lr,     lr_path)
        joblib.dump(rf,     rf_path)
        joblib.dump(log,    log_path)
        joblib.dump(scaler, sc_path)

        _models = {"lr": lr, "rf": rf, "log": log, "scaler": scaler}
        print(f"  ✅ Models trained | LR score: {lr.score(Xte, yte):.3f}")

    return _models


# ─── Predict function ─────────────────────────────────────────
CAT_MAP   = {"General": 0, "OBC": 3, "SC": 6, "ST": 9, "EWS": 4}
EXTRA_MAP = {"None": 0, "Cultural Activities": 1, "NSS / NCC": 1,
             "Sports (State Level)": 2, "Published Research": 3, "Olympiad Winner": 4}

def predict_admission(p10, p12, cgpa, entrance, category, extra, exam="JEE Main"):
    models = get_models()
    scaler = models["scaler"]

    cat_val   = CAT_MAP.get(category, 0)
    extra_val = EXTRA_MAP.get(extra, 0)
    x_raw = np.array([[p10, p12, cgpa, entrance, cat_val, extra_val]])
    x_sc  = scaler.transform(x_raw)

    lr_score  = float(np.clip(models["lr"].predict(x_sc)[0], 5, 97))
    rf_score  = float(np.clip(models["rf"].predict(x_sc)[0], 5, 97))
    log_prob  = float(models["log"].predict_proba(x_sc)[0][1] * 100)

    # Ensemble average
    overall = round((lr_score + rf_score + log_prob) / 3, 1)

    # Rank estimate — based on JEE score + overall
    base_rank = max(500, int((100 - overall) * 200 + np.random.randint(100, 800)))

    return {
        "overall":  round(overall, 1),
        "lr_score": round(lr_score, 1),
        "rf_score": round(rf_score, 1),
        "log_score": round(log_prob, 1),
        "rank":     base_rank,
        "category": category,
        "exam":     exam,
    }
