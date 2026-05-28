import Debug   "mo:core/Debug";
import List    "mo:core/List";
import Time    "mo:core/Time";
import Nat64   "mo:core/Nat64";
import Types   "../types/health-metrics";
import Lib     "../lib/health-metrics";
import Int "mo:core/Int";

mixin (metrics : List.List<Types.HealthMetric>) {

  // -----------------------------------------------------------------------
  // add_metric
  // -----------------------------------------------------------------------
  // Stores a new health metric, recomputes its 14-day baseline, and returns
  // the updated PredictionInput for the user.
  public shared func add_metric(
    user_id     : Text,
    metric_type : Text,
    value       : Float,
    source      : Text,
  ) : async { #ok : Types.PredictionInput; #err : Text } {
    let mt = switch (Lib.parseMetricType(metric_type)) {
      case null     { return #err("Unknown metric_type: " # metric_type) };
      case (?t)     t;
    };
    let src = switch (Lib.parseSource(source)) {
      case null     { return #err("Unknown source: " # source) };
      case (?s)     s;
    };
    switch (Lib.validate(mt, value)) {
      case (?err) return #err(err);
      case null   {};
    };

    let now_ns : Nat64 = Nat64.fromNat(Int.abs(Time.now()));
    let baseline = Lib.computeBaseline14d(metrics, mt, user_id, now_ns);

    let entry : Types.HealthMetric = {
      user_id;
      metric_type  = mt;
      value;
      recorded_at  = now_ns;
      source       = src;
      baseline_14d = baseline;
    };
    metrics.add(entry);

    let predInput = Lib.buildPredictionInput(metrics, user_id, now_ns);
    #ok(predInput);
  };

  // -----------------------------------------------------------------------
  // get_user_metrics
  // -----------------------------------------------------------------------
  public shared query func get_user_metrics(
    user_id            : Text,
    past_days          : Nat,
    metric_type_filter : ?Text,
  ) : async [Types.HealthMetric] {
    let now_ns : Nat64 = Nat64.fromNat(Int.abs(Time.now()));
    Lib.queryMetrics(metrics, user_id, past_days, metric_type_filter, now_ns);
  };

  // -----------------------------------------------------------------------
  // get_prediction_input
  // -----------------------------------------------------------------------
  public shared query func get_prediction_input(
    user_id : Text,
  ) : async ?Types.PredictionInput {
    // Return null only when the user has zero stored metrics.
    var hasAny = false;
    for (m in metrics.values()) {
      if (m.user_id == user_id) hasAny := true;
    };
    if (not hasAny) return null;
    let now_ns : Nat64 = Nat64.fromNat(Int.abs(Time.now()));
    ?Lib.buildPredictionInput(metrics, user_id, now_ns);
  };

};
