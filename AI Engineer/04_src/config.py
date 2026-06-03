# 04_src/config.py
"""Konfigurasi global BurnoutGuard - SUMBER KEBENARAN TUNGGAL."""
# Library versions (Colab environment):
# tensorflow==2.20.0, scikit-learn==1.3.2
# pandas==2.1.3, numpy==1.26.2

# ---------- PATHS ----------
DRIVE_ROOT = '/content/drive/MyDrive/BurnoutGuard'
DATA_RAW = f'{DRIVE_ROOT}/00_data/raw/university_student_stress_dataset.csv'
DATA_PROCESSED = f'{DRIVE_ROOT}/00_data/processed'
MODELS_DIR = f'{DRIVE_ROOT}/02_models'
RESULTS_DIR = f'{DRIVE_ROOT}/03_results'
FIGURES_DIR = f'{RESULTS_DIR}/figures'
METRICS_DIR = f'{RESULTS_DIR}/metrics'

# ---------- REPRODUCIBILITY ----------
SEED = 42

# ---------- DATA SPLITTING ----------
TEST_SIZE = 0.15
VAL_SIZE = 0.15

# ---------- COLUMNS ----------
TARGET_COLUMN = 'Stress_Level'
DROP_COLUMNS = ['Stress_Score']
NUMERIC_COLS = ['Age', 'Study_Hours', 'Class_Attendance',
                'Exam_Frequency', 'Assignment_Load', 'Sleep_Hours',
                'Social_Media_Use', 'Screen_Time', 'Peer_Pressure',
                'Family_Support', 'Anxiety_Level']
CATEGORICAL_COLS = ['Gender', 'Tuition', 'Physical_Exercise',
                    'Family_Income_Level', 'University_Type']

# ---------- TARGET ENCODING ----------
CLASS_MAPPING = {'Low': 0, 'Medium': 1, 'High': 2}
CLASS_NAMES = ['Low', 'Medium', 'High']
NUM_CLASSES = 3

# ---------- TRAINING ----------
BATCH_SIZE = 32
EPOCHS = 100
LEARNING_RATE = 1e-3

# ---------- EVALUATION ----------
PRIMARY_METRIC = 'macro_f1'
SECONDARY_METRIC = 'recall_high'
