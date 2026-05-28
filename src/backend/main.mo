import List              "mo:core/List";
import Types             "types/health-metrics";
import HealthMetricsApi  "mixins/health-metrics-api";

actor {
  let metrics = List.empty<Types.HealthMetric>();
  include HealthMetricsApi(metrics);
};

