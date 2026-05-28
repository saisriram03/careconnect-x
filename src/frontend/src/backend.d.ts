import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PredictionInput {
    systolic_avg_7d?: number;
    diastolic_latest?: number;
    diastolic_avg_14d?: number;
    sleep_avg_7d?: number;
    systolic_latest?: number;
    hr_avg_7d?: number;
    consecutive_low_sleep_nights: bigint;
    hr_avg_14d?: number;
    sleep_latest?: number;
    sleep_avg_14d?: number;
    diastolic_avg_7d?: number;
    hr_latest?: number;
    systolic_avg_14d?: number;
}
export interface HealthMetric {
    baseline_14d?: number;
    value: number;
    source: MetricSource;
    metric_type: MetricType;
    user_id: string;
    recorded_at: bigint;
}
export enum MetricSource {
    Manual = "Manual",
    Bluetooth = "Bluetooth"
}
export enum MetricType {
    HeartRate = "HeartRate",
    DiastolicBP = "DiastolicBP",
    SystolicBP = "SystolicBP",
    SleepHours = "SleepHours"
}
export interface backendInterface {
    add_metric(user_id: string, metric_type: string, value: number, source: string): Promise<{
        __kind__: "ok";
        ok: PredictionInput;
    } | {
        __kind__: "err";
        err: string;
    }>;
    get_prediction_input(user_id: string): Promise<PredictionInput | null>;
    get_user_metrics(user_id: string, past_days: bigint, metric_type_filter: string | null): Promise<Array<HealthMetric>>;
}
