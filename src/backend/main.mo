import List              "mo:core/List";
import Map               "mo:core/Map";
import Types             "types/health-metrics";
import AuthTypes         "types/auth";
import HealthMetricsApi  "mixins/health-metrics-api";
import AuthApi           "mixins/auth-api";

actor {
  let metrics = List.empty<Types.HealthMetric>();
  let users   = Map.empty<Text, AuthTypes.AuthRecord>();

  include HealthMetricsApi(metrics);
  include AuthApi(users);
};

