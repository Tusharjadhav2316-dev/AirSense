import pandas as pd
import datetime
from app.services.analytics import compute_rolling_and_anomalies, ANOMALY_THRESHOLD_RATIO

def test_anomaly_detection_logic():
    """
    Unit test verifying pandas rolling average and >25% anomaly spike detection.
    Test scenario:
    - Days 0-6: Baseline AQI values around ~40
    - Day 7: Sudden severe pollution spike to 120 AQI (> 25% above 7-day rolling avg)
    - Day 8: Return to normal 44 AQI
    """
    base_time = datetime.datetime(2026, 8, 1, 12, 0)
    
    # 9 synthetic data points with a known spike on index 7
    aqi_values = [40, 42, 38, 41, 40, 45, 42, 120, 44]
    timestamps = [base_time + datetime.timedelta(days=i) for i in range(len(aqi_values))]
    
    df = pd.DataFrame({
        "id": range(1, len(aqi_values) + 1),
        "city_name": "TestCity",
        "fetched_at": timestamps,
        "aqi_value": aqi_values
    })

    result_df = compute_rolling_and_anomalies(df, window=7)

    # 1. Check columns exist
    assert "rolling_avg" in result_df.columns
    assert "is_anomaly" in result_df.columns

    # 2. Verify row count
    assert len(result_df) == 9

    # 3. Check baseline readings (Days 0 to 6 should NOT be anomalies)
    for i in range(7):
        assert result_df.loc[i, "is_anomaly"] == False, f"Row {i} incorrectly flagged as anomaly"

    # 4. Check Day 7 (index 7): AQI=120 vs rolling average ~52.6 -> Must be ANOMALY
    day7_aqi = result_df.loc[7, "aqi_value"]
    day7_rolling = result_df.loc[7, "rolling_avg"]
    assert day7_aqi == 120
    assert day7_aqi > (day7_rolling * ANOMALY_THRESHOLD_RATIO)
    assert result_df.loc[7, "is_anomaly"] == True, "Spike on Day 7 was not flagged as anomaly!"

    # 5. Check Day 8 (index 8): AQI=44 -> Must NOT be anomaly
    assert result_df.loc[8, "is_anomaly"] == False, "Normal AQI on Day 8 incorrectly flagged as anomaly!"

    print("✅ UNIT TEST PASSED: Rolling average & anomaly detection logic math is 100% correct!")
