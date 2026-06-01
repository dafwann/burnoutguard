# =========================================================
# ADVANCED SYNTHETIC DATA GENERATION
# UNTUK TEST OVERFITTING MODEL
# =========================================================

# INSTALL SEKALI:
# pip install sdv

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sdv.single_table import CTGANSynthesizer
from sdv.metadata.single_table import SingleTableMetadata

# =========================================================
# LOAD DATASET
# =========================================================

df = pd.read_csv("university_student_stress_dataset.csv")

print("\n===== DATASET ASLI =====")
print("Shape Awal:", df.shape)

# =========================================================
# DROP LEAKAGE FEATURE
# =========================================================

LEAKAGE_COLUMNS = [
    'Stress_Score'
]

existing_leakage = [
    col for col in LEAKAGE_COLUMNS
    if col in df.columns
]

if len(existing_leakage) > 0:

    df = df.drop(
        columns=existing_leakage
    )

    print("\nLeakage feature dihapus:")
    print(existing_leakage)

# =========================================================
# TARGET COLUMN
# =========================================================

TARGET_COLUMN = 'Stress_Level'

# pastikan target ada
if TARGET_COLUMN not in df.columns:
    raise Exception(
        f"{TARGET_COLUMN} tidak ditemukan!"
    )

# =========================================================
# SPLIT FEATURE & TARGET
# =========================================================

X_real = df.drop(
    columns=[TARGET_COLUMN]
)

y_real = df[TARGET_COLUMN]

print("\n===== FEATURE COLUMNS =====")
print(X_real.columns.tolist())

print("\n===== TARGET DISTRIBUTION =====")
print(y_real.value_counts())

# =========================================================
# DETECT METADATA
# =========================================================

metadata = SingleTableMetadata()

metadata.detect_from_dataframe(
    data=X_real
)

print("\nMetadata berhasil dibuat!")

# =========================================================
# TRAIN CTGAN
# =========================================================

print("\n===== TRAINING CTGAN =====")

synthesizer = CTGANSynthesizer(
    metadata=metadata,

    # bisa diturunkan kalau laptop lemah
    epochs=300,

    batch_size=500,

    verbose=True
)

synthesizer.fit(X_real)

print("\nTraining selesai!")

# =========================================================
# GENERATE SYNTHETIC FEATURES
# =========================================================

print("\n===== GENERATE SYNTHETIC FEATURES =====")

synthetic_X = synthesizer.sample(
    num_rows=100000
)

print("Shape Synthetic:", synthetic_X.shape)

print("\nSample Synthetic:")
print(synthetic_X.head())

# =========================================================
# SAVE SYNTHETIC FEATURE
# =========================================================

synthetic_X.to_csv(
    "synthetic_100k_features.csv",
    index=False
)

print("\nSynthetic feature dataset berhasil disimpan!")

# =========================================================
# PREPROCESS
# =========================================================

print("\n===== PREPROCESSING =====")

X_synth_processed = preprocessor.transform(
    synthetic_X
)

print("Transform selesai!")

# =========================================================
# MODEL PREDICTION
# =========================================================

print("\n===== MODEL PREDICTION =====")

pred_probs = winner_model.predict(
    X_synth_processed,
    verbose=0
)

pred_idx = np.argmax(
    pred_probs,
    axis=1
)

# =========================================================
# LABEL PREDICTION
# =========================================================

synthetic_X['Predicted_Stress_Level'] = [
    CLASS_NAMES[i]
    for i in pred_idx
]

synthetic_X['Confidence'] = [
    float(np.max(p))
    for p in pred_probs
]

# =========================================================
# SAVE FINAL RESULT
# =========================================================

synthetic_X.to_csv(
    "synthetic_prediction_result.csv",
    index=False
)

print("\nPrediction result berhasil disimpan!")

# =========================================================
# SAMPLE OUTPUT
# =========================================================

print("\n===== SAMPLE OUTPUT =====")

sample_cols = [
    'Age',
    'Study_Hours',
    'Sleep_Hours',
    'Anxiety_Level',
    'Predicted_Stress_Level',
    'Confidence'
]

existing_cols = [
    col for col in sample_cols
    if col in synthetic_X.columns
]

print(
    synthetic_X[
        existing_cols
    ].head(20)
)

# =========================================================
# CONFIDENCE ANALYSIS
# =========================================================

print("\n===== CONFIDENCE ANALYSIS =====")

avg_conf = synthetic_X[
    'Confidence'
].mean()

max_conf = synthetic_X[
    'Confidence'
].max()

min_conf = synthetic_X[
    'Confidence'
].min()

print(f"Average Confidence : {avg_conf:.4f}")
print(f"Max Confidence     : {max_conf:.4f}")
print(f"Min Confidence     : {min_conf:.4f}")

# =========================================================
# OVERFITTING DETECTION
# =========================================================

print("\n===== OVERFITTING DETECTION =====")

if avg_conf > 0.98:

    print("WARNING:")
    print("Model sangat overconfident.")
    print("Kemungkinan OVERFITTING atau MEMORIZATION.")

elif avg_conf > 0.90:

    print("Confidence tinggi.")
    print("Cek validation/test accuracy.")

elif avg_conf > 0.75:

    print("Confidence cukup realistis.")

else:

    print("Confidence rendah.")
    print("Kemungkinan model underfit atau synthetic terlalu sulit.")

# =========================================================
# CONFIDENCE DISTRIBUTION
# =========================================================

print("\n===== CONFIDENCE DISTRIBUTION =====")

plt.figure(figsize=(10,5))

plt.hist(
    synthetic_X['Confidence'],
    bins=30
)

plt.xlabel("Confidence")
plt.ylabel("Jumlah Data")
plt.title("Confidence Distribution")

plt.show()

# =========================================================
# DISTRIBUTION COMPARISON
# =========================================================

print("\n===== DISTRIBUTION COMPARISON =====")

numeric_cols = X_real.select_dtypes(
    include=np.number
).columns

for col in numeric_cols:

    plt.figure(figsize=(8,4))

    plt.hist(
        X_real[col],
        bins=30,
        alpha=0.5,
        label='Original'
    )

    plt.hist(
        synthetic_X[col],
        bins=30,
        alpha=0.5,
        label='Synthetic'
    )

    plt.title(f'Distribution Comparison - {col}')

    plt.legend()

    plt.show()

# =========================================================
# PREDICTION DISTRIBUTION
# =========================================================

print("\n===== PREDICTION DISTRIBUTION =====")

print(
    synthetic_X[
        'Predicted_Stress_Level'
    ].value_counts()
)

# =========================================================
# FINAL
# =========================================================

print("\nSELESAI.")
print("File hasil:")
print("- synthetic_100k_features.csv")
print("- synthetic_prediction_result.csv")