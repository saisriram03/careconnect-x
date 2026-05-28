import Debug "mo:core/Debug";

module {

  public type MetricType = {
    #HeartRate;
    #SystolicBP;
    #DiastolicBP;
    #SleepHours;
  };

  public type MetricSource = {
    #Bluetooth;
    #Manual;
  };

  /// Stored health metric record.
  public type HealthMetric = {
    user_id      : Text;
    metric_type  : MetricType;
    value        : Float;
    recorded_at  : Nat64;
    source       : MetricSource;
    baseline_14d : ?Float;
  };

  /// Snapshot of the latest metric values plus averages used by
  /// the Predictive Care Engine.
  public type PredictionInput = {
    // Latest raw readings (null when no data yet)
    hr_latest          : ?Float;
    systolic_latest    : ?Float;
    diastolic_latest   : ?Float;
    sleep_latest       : ?Float;

    // 7-day averages
    hr_avg_7d          : ?Float;
    systolic_avg_7d    : ?Float;
    diastolic_avg_7d   : ?Float;
    sleep_avg_7d       : ?Float;

    // 14-day averages (also used as rolling baseline)
    hr_avg_14d         : ?Float;
    systolic_avg_14d   : ?Float;
    diastolic_avg_14d  : ?Float;
    sleep_avg_14d      : ?Float;

    /// Number of consecutive nights where sleep < 7 hours
    consecutive_low_sleep_nights : Nat;
  };

};
