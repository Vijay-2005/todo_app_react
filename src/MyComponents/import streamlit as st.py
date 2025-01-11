import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt

# Title
st.title("Simple Streamlit App")

# Upload a file
uploaded_file = st.file_uploader("Choose a CSV file")
if uploaded_file:
    data = pd.read_csv(uploaded_file)
    st.write("Data Preview:")
    st.dataframe(data)

    # Plotting
    if st.checkbox("Show Plot"):
        st.write("Plotting data...")
        data.hist()
        st.pyplot(plt)
