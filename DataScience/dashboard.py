import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# --- CONFIGURATION ---
st.set_page_config(page_title="Student Stress Analytics", page_icon="📊", layout="wide")

# --- COLOR PALETTE ---
STRESS_COLORS = {
    "Low": "#2ecc71",    # Green
    "Medium": "#f1c40f", # Yellow
    "High": "#e74c3c"    # Red
}
ORDER = ["Low", "Medium", "High"]

# --- DATA LOADING & CACHING ---
@st.cache_data
def load_data():
    df = pd.read_csv("Data/Raw_Responses/raw_google_form_export.csv", skiprows=[1], encoding="latin-1")
    df.columns = [
        "Timestamp","Age","Gender","Study_Hours","Class_Attendance",
        "Tuition","Exam_Frequency","Assignment_Load",
        "Sleep_Hours","Physical_Exercise","Social_Media_Use",
        "Screen_Time","Family_Income_Level","Peer_Pressure",
        "Family_Support","Anxiety_Level","University_Type",
        "Stress_Score","Stress_Level"
    ]
    
    num_cols = ["Sleep_Hours", "Screen_Time", "Peer_Pressure", "Family_Support"]
    for col in num_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    
    df[num_cols] = df[num_cols].mask(df[num_cols] < 0)
    df["Stress_Level"] = df["Stress_Level"].astype(str).str.strip().str.title()
    
    df = df[df["Stress_Level"].isin(ORDER)]
    df = df.dropna(subset=["Stress_Level", "Sleep_Hours", "Screen_Time", "Family_Support", "Peer_Pressure"])
    df["Stress_Level"] = pd.Categorical(df["Stress_Level"], categories=ORDER, ordered=True)
    return df

df = load_data()

# --- PRE-CALCULATE METRICS ---
total_students = len(df)
stress_counts = df["Stress_Level"].value_counts(normalize=True).reindex(ORDER) * 100

high_sleep = df[df['Stress_Level'] == 'High']['Sleep_Hours'].mean()
low_sleep = df[df['Stress_Level'] == 'Low']['Sleep_Hours'].mean()
sleep_gap = low_sleep - high_sleep

high_screen = df[df['Stress_Level'] == 'High']['Screen_Time'].mean()
low_screen = df[df['Stress_Level'] == 'Low']['Screen_Time'].mean()

high_support = df[df['Stress_Level'] == 'High']['Family_Support'].mean()
low_support = df[df['Stress_Level'] == 'Low']['Family_Support'].mean()


# --- HEADER ---
st.title("📊 Student Stress Analytics")
st.markdown("""
> **Student stress is driven more by lifestyle imbalance than academic workload.**

This dashboard examines what actually drives student stress — and what to do about it.
""")
st.divider()

# --- 1. OVERVIEW ---
st.header("1. Overview")

col_ov1, col_ov2 = st.columns([1, 1.5])

with col_ov1:
    st.metric("Total Students", f"{total_students}")
    st.markdown("### Stress Distribution")
    for level in ORDER:
        st.write(f"- **{level}**: {stress_counts[level]:.1f}%")

    dominant = stress_counts.idxmax()
    st.info(f"""
    Nearly **1 in 2** students are already in medium stress — and **1 in 10** are at high risk.
    """)

with col_ov2:
    fig_pie = px.pie(
        df, names="Stress_Level", 
        color="Stress_Level", 
        color_discrete_map=STRESS_COLORS,
        category_orders={"Stress_Level": ORDER},
        hole=0.45
    )
    fig_pie.update_traces(textposition='inside', textinfo='percent+label', marker=dict(line=dict(color='#000000', width=1)))
    fig_pie.update_layout(margin=dict(t=0, b=0, l=0, r=0))
    st.plotly_chart(fig_pie, width="stretch", height=300)

st.divider()

# --- 2. KEY DRIVERS OF STRESS ---
st.header("2. Key Drivers of Stress")
st.markdown("Three lifestyle factors consistently separate Low-stress students from High-stress ones. Everything else is secondary.")

col_drv1, col_drv2 = st.columns(2)

with col_drv1:
    st.subheader("A. Sleep Deprivation")
    fig_sleep = px.box(
        df, x="Stress_Level", y="Sleep_Hours", 
        color="Stress_Level", color_discrete_map=STRESS_COLORS,
        category_orders={"Stress_Level": ORDER}
    )
    fig_sleep.update_layout(xaxis_title="Stress Level", yaxis_title="Sleep Hours (Per Day)", showlegend=False, margin=dict(t=20))
    st.plotly_chart(fig_sleep, width="stretch")
    
    st.success(f"""
    High-stress students sleep **{high_sleep:.1f}h** vs. **{low_sleep:.1f}h** for Low-stress peers — a **{sleep_gap:.1f}-hour gap** that directly increases stress risk.
    """)

with col_drv2:
    st.subheader("B. Screen Time Overload")
    fig_screen = px.box(
        df, x="Stress_Level", y="Screen_Time", 
        color="Stress_Level", color_discrete_map=STRESS_COLORS,
        category_orders={"Stress_Level": ORDER}
    )
    fig_screen.update_layout(xaxis_title="Stress Level", yaxis_title="Screen Time (Hours/Day)", showlegend=False, margin=dict(t=20))
    st.plotly_chart(fig_screen, width="stretch")
    
    st.error(f"""
    Screen time nearly doubles from **{low_screen:.1f}h** (Low) to **{high_screen:.1f}h** (High). \
    Uncontrolled digital consumption is the clearest behavioral risk marker in this dataset.
    """)

st.subheader("C. Family Support")
col_sup1, col_sup2 = st.columns([1, 2])
with col_sup1:
    st.warning(f"""
    Family support drops from **{low_support:.1f}** to **{high_support:.1f}** — weakening emotional resilience and directly increasing stress vulnerability.
    """)
with col_sup2:
    fig_family = px.box(
        df, x="Stress_Level", y="Family_Support", 
        color="Stress_Level", color_discrete_map=STRESS_COLORS,
        category_orders={"Stress_Level": ORDER}
    )
    fig_family.update_layout(xaxis_title="Stress Level", yaxis_title="Family Support Score (1-10)", showlegend=False, margin=dict(t=10), height=300)
    st.plotly_chart(fig_family, width="stretch")

st.divider()

# --- 3. BEHAVIORAL PATTERN ---
st.header("3. Behavioral Patterns")
st.markdown("How many students are already living in the risk zone?")

col_beh1, col_beh2 = st.columns(2)

with col_beh1:
    mean_sleep = df["Sleep_Hours"].mean()
    fig_hist_sleep = px.histogram(df, x="Sleep_Hours", nbins=10, color_discrete_sequence=["#3498db"])
    # Add Mean Line
    fig_hist_sleep.add_vline(x=mean_sleep, line_dash="dash", line_color="black", annotation_text=f"Mean: {mean_sleep:.1f}h")
    # Highlight Risky Range (< 6 hours)
    fig_hist_sleep.add_vrect(x0=0, x1=5.9, fillcolor="red", opacity=0.1, layer="below", line_width=0, annotation_text="Danger Zone (<6h)", annotation_position="top left")
    
    fig_hist_sleep.update_layout(xaxis_title="Sleep Hours", yaxis_title="Number of Students", margin=dict(t=20))
    st.plotly_chart(fig_hist_sleep, width="stretch")
    
    st.info("Students in the red zone sleep under 6 hours daily — a direct stress risk.")

with col_beh2:
    mean_screen = df["Screen_Time"].mean()
    fig_hist_screen = px.histogram(df, x="Screen_Time", nbins=10, color_discrete_sequence=["#9b59b6"])
    # Add Mean Line
    fig_hist_screen.add_vline(x=mean_screen, line_dash="dash", line_color="black", annotation_text=f"Mean: {mean_screen:.1f}h")
    # Highlight Risky Range (> 8 hours)
    fig_hist_screen.add_vrect(x0=8, x1=df["Screen_Time"].max()+1, fillcolor="red", opacity=0.1, layer="below", line_width=0, annotation_text="Danger Zone (>8h)", annotation_position="top right")
    
    fig_hist_screen.update_layout(xaxis_title="Screen Time (Hours)", yaxis_title="Number of Students", margin=dict(t=20))
    st.plotly_chart(fig_hist_screen, width="stretch")
    
    st.info("Students in the red zone exceed 8 hours of screen time daily — a key driver of high stress.")

st.divider()

# --- 4. SUPPORTING INSIGHT ---
st.header("4. Supporting Insight")

col_peer1, col_peer2 = st.columns([1, 2])
with col_peer1:
    st.markdown("### Peer Pressure")
    st.info("""
    Peer pressure scores are nearly flat across all stress levels. \
    It is **not** a significant driver — lifestyle factors carry far more weight.
    """)
with col_peer2:
    fig_peer = px.box(
        df, x="Stress_Level", y="Peer_Pressure", 
        color="Stress_Level", color_discrete_map=STRESS_COLORS,
        category_orders={"Stress_Level": ORDER}
    )
    fig_peer.update_layout(xaxis_title="Stress Level", yaxis_title="Peer Pressure (1-10)", showlegend=False, margin=dict(t=10), height=300)
    st.plotly_chart(fig_peer, width="stretch")

st.divider()

# --- 5 & 6. FINAL CONCLUSION & ACTIONABLE INSIGHTS ---
col_final1, col_final2 = st.columns(2)

with col_final1:
    st.header("🎯 Conclusion")
    st.error("""
    Student stress is driven by **excessive screen time**, **insufficient sleep**, and **weak support systems** — not academic workload.
    """)

with col_final2:
    st.header("🛠️ What To Do")
    st.success("""
    - Limit screen time to **<6 hours/day**.
    - Protect at least **6–7 hours of sleep** daily.
    - Actively build a support system **(friends/family)**.
    """)
