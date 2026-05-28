import Debug     "mo:core/Debug";
import List      "mo:core/List";
import Nat64     "mo:core/Nat64";
import Float     "mo:core/Float";
import Text      "mo:core/Text";
import Types     "../types/health-metrics";

module {

  // -----------------------------------------------------------------------
  // Validation
  // -----------------------------------------------------------------------

  /// Returns an error string if the value is out of the medically accepted range.
  public func validate(metric_type : Types.MetricType, value : Float) : ?Text {
    switch (metric_type) {
      case (#HeartRate) {
        if (value < 40.0 or value > 200.0)
          ?("Heart rate must be between 40 and 200 bpm, got " # debug_show(value))
        else null;
      };
      case (#SystolicBP) {
        if (value < 80.0 or value > 200.0)
          ?("Systolic blood pressure must be between 80 and 200 mmHg, got " # debug_show(value))
        else null;
      };
      case (#DiastolicBP) {
        if (value < 40.0 or value > 120.0)
          ?("Diastolic blood pressure must be between 40 and 120 mmHg, got " # debug_show(value))
        else null;
      };
      case (#SleepHours) {
        if (value < 0.0 or value > 24.0)
          ?("Sleep hours must be between 0 and 24, got " # debug_show(value))
        else null;
      };
    };
  };

  // -----------------------------------------------------------------------
  // Type parsing helpers
  // -----------------------------------------------------------------------

  public func parseMetricType(s : Text) : ?Types.MetricType {
    switch (s) {
      case ("HeartRate")   ?#HeartRate;
      case ("SystolicBP")  ?#SystolicBP;
      case ("DiastolicBP") ?#DiastolicBP;
      case ("SleepHours")  ?#SleepHours;
      case (_)             null;
    };
  };

  public func parseSource(s : Text) : ?Types.MetricSource {
    switch (s) {
      case ("Bluetooth") ?#Bluetooth;
      case ("Manual")    ?#Manual;
      case (_)           null;
    };
  };

  public func metricTypeText(mt : Types.MetricType) : Text {
    switch (mt) {
      case (#HeartRate)   "HeartRate";
      case (#SystolicBP)  "SystolicBP";
      case (#DiastolicBP) "DiastolicBP";
      case (#SleepHours)  "SleepHours";
    };
  };

  // -----------------------------------------------------------------------
  // Baseline + windowed statistics
  // -----------------------------------------------------------------------

  /// Nanoseconds in one day.
  let NS_PER_DAY : Nat64 = 86_400_000_000_000;

  /// Returns the average of a list of Float values; null if the list is empty.
  func average(values : List.List<Float>) : ?Float {
    if (values.size() == 0) return null;
    var sum : Float = 0.0;
    for (v in values.values()) { sum := sum + v };
    ?(sum / values.size().toFloat());
  };

  /// Collects metric values recorded within the last `days` days from `now_ns`.
  func valuesInWindow(
    metrics  : List.List<Types.HealthMetric>,
    mt       : Types.MetricType,
    user_id  : Text,
    now_ns   : Nat64,
    days     : Nat64,
  ) : List.List<Float> {
    let cutoff : Nat64 = if (now_ns >= days * NS_PER_DAY) now_ns - days * NS_PER_DAY else 0;
    let result = List.empty<Float>();
    for (m in metrics.values()) {
      if (m.user_id == user_id and m.metric_type == mt and m.recorded_at >= cutoff) {
        result.add(m.value);
      };
    };
    result;
  };

  /// Computes the 14-day rolling average baseline for a given user/metric.
  public func computeBaseline14d(
    metrics : List.List<Types.HealthMetric>,
    mt      : Types.MetricType,
    user_id : Text,
    now_ns  : Nat64,
  ) : ?Float {
    average(valuesInWindow(metrics, mt, user_id, now_ns, 14));
  };

  // -----------------------------------------------------------------------
  // PredictionInput builder
  // -----------------------------------------------------------------------

  /// Returns the latest (most recent) value for a given user/metric.
  func latestValue(
    metrics : List.List<Types.HealthMetric>,
    mt      : Types.MetricType,
    user_id : Text,
  ) : ?Float {
    var best : ?Types.HealthMetric = null;
    for (m in metrics.values()) {
      if (m.user_id == user_id and m.metric_type == mt) {
        switch (best) {
          case null       { best := ?m };
          case (?current) {
            if (m.recorded_at > current.recorded_at) best := ?m;
          };
        };
      };
    };
    switch (best) {
      case null     null;
      case (?m)     ?m.value;
    };
  };

  /// Counts consecutive low-sleep nights (< 7 h) ending at `now_ns`.
  /// Walks backwards through nights in reverse chronological order.
  func consecutiveLowSleepNights(
    metrics : List.List<Types.HealthMetric>,
    user_id : Text,
    now_ns  : Nat64,
  ) : Nat {
    // Bucket sleep records by day index (floor(recorded_at / NS_PER_DAY))
    // then walk backwards from today.
    let _dayMap = List.empty<(Nat64, Float)>(); // (day_index, avg_for_day)
    // Accumulate totals per day
    let dayTotals = List.empty<(Nat64, Float, Nat)>(); // day, sum, count

    for (m in metrics.values()) {
      if (m.user_id == user_id and m.metric_type == #SleepHours) {
        let day = m.recorded_at / NS_PER_DAY;
        var found = false;
        dayTotals.mapInPlace(func(entry) : (Nat64, Float, Nat) {
          let (d, s, c) = entry;
          if (d == day) {
            found := true;
            (d, s + m.value, c + 1);
          } else entry;
        });
        if (not found) dayTotals.add((day, m.value, 1));
      };
    };

    let todayIndex = now_ns / NS_PER_DAY;
    var count : Nat = 0;
    var dayIdx = todayIndex;
    label search loop {
      var avgSleep : ?Float = null;
      for ((d, s, c) in dayTotals.values()) {
        if (d == dayIdx) {
          avgSleep := ?(s / c.toFloat());
        };
      };
      switch (avgSleep) {
        case null     { break search }; // gap in data — stop
        case (?avg) {
          if (avg < 7.0) { count += 1 } else { break search };
        };
      };
      if (dayIdx == 0) break search;
      dayIdx -= 1;
    };
    count;
  };

  public func buildPredictionInput(
    metrics : List.List<Types.HealthMetric>,
    user_id : Text,
    now_ns  : Nat64,
  ) : Types.PredictionInput {
    {
      hr_latest          = latestValue(metrics, #HeartRate,   user_id);
      systolic_latest    = latestValue(metrics, #SystolicBP,  user_id);
      diastolic_latest   = latestValue(metrics, #DiastolicBP, user_id);
      sleep_latest       = latestValue(metrics, #SleepHours,  user_id);

      hr_avg_7d          = average(valuesInWindow(metrics, #HeartRate,   user_id, now_ns, 7));
      systolic_avg_7d    = average(valuesInWindow(metrics, #SystolicBP,  user_id, now_ns, 7));
      diastolic_avg_7d   = average(valuesInWindow(metrics, #DiastolicBP, user_id, now_ns, 7));
      sleep_avg_7d       = average(valuesInWindow(metrics, #SleepHours,  user_id, now_ns, 7));

      hr_avg_14d         = average(valuesInWindow(metrics, #HeartRate,   user_id, now_ns, 14));
      systolic_avg_14d   = average(valuesInWindow(metrics, #SystolicBP,  user_id, now_ns, 14));
      diastolic_avg_14d  = average(valuesInWindow(metrics, #DiastolicBP, user_id, now_ns, 14));
      sleep_avg_14d      = average(valuesInWindow(metrics, #SleepHours,  user_id, now_ns, 14));

      consecutive_low_sleep_nights = consecutiveLowSleepNights(metrics, user_id, now_ns);
    };
  };

  // -----------------------------------------------------------------------
  // Query helpers
  // -----------------------------------------------------------------------

  /// Filters and sorts metrics for a user within the past `past_days` days.
  /// Optional metric_type_filter (as Text) narrows to a single type.
  public func queryMetrics(
    metrics            : List.List<Types.HealthMetric>,
    user_id            : Text,
    past_days          : Nat,
    metric_type_filter : ?Text,
    now_ns             : Nat64,
  ) : [Types.HealthMetric] {
    let days64 : Nat64 = Nat64.fromNat(past_days);
    let cutoff : Nat64 = if (now_ns >= days64 * NS_PER_DAY) now_ns - days64 * NS_PER_DAY else 0;

    let result = List.empty<Types.HealthMetric>();
    for (m in metrics.values()) {
      if (m.user_id == user_id and m.recorded_at >= cutoff) {
        let typeMatch = switch (metric_type_filter) {
          case null true;
          case (?filterText) {
            switch (parseMetricType(filterText)) {
              case null     false;
              case (?ftype) m.metric_type == ftype;
            };
          };
        };
        if (typeMatch) result.add(m);
      };
    };

    // Sort ascending by recorded_at
    let arr = result.toArray();
    let sorted = arr.sort(func(a : Types.HealthMetric, b : Types.HealthMetric) : {#less; #equal; #greater} {
      if (a.recorded_at < b.recorded_at) #less
      else if (a.recorded_at > b.recorded_at) #greater
      else #equal;
    });
    sorted;
  };

};
