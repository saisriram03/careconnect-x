import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Brain,
  Calendar,
  ChevronRight,
  Heart,
  Lightbulb,
  Pill,
  Shield,
  Sparkles,
  Stethoscope,
  User,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

type Severity = "Mild" | "Moderate" | "Severe" | "Critical";
type RiskLevel = "Low Risk" | "Moderate Risk" | "High Risk" | "Critical";

interface Disease {
  name: string;
  match: number;
  symptoms: string[];
  causes: string[];
  prevention: string[];
  homeCare: string[];
  specialist: string;
  severity: Severity;
}

interface MedixReport {
  extractedSymptoms: string[];
  diseases: Disease[];
  riskLevel: RiskLevel;
  isEmergency: boolean;
  healthInsights: string[];
}

// ─── Medicines Database ───────────────────────────────────────────────────────

type MedicineEntry = {
  name: string;
  dosage: string;
  timing: string;
  note?: string;
};

const MEDICINES_DB: Record<string, MedicineEntry[]> = {
  "COVID-19": [
    {
      name: "Paracetamol",
      dosage: "500 mg",
      timing: "Every 6 hours as needed for fever",
      note: "Do not exceed 4g per day",
    },
    {
      name: "Vitamin C + Zinc",
      dosage: "1 tablet",
      timing: "Once daily",
      note: "Supports immune recovery",
    },
    {
      name: "Azithromycin",
      dosage: "500 mg",
      timing: "Once daily for 5 days",
      note: "Only if prescribed by a doctor",
    },
  ],
  "Influenza (Flu)": [
    {
      name: "Oseltamivir (Tamiflu)",
      dosage: "75 mg",
      timing: "Twice daily for 5 days",
      note: "Best within 48 hours of onset",
    },
    {
      name: "Paracetamol",
      dosage: "500 mg",
      timing: "Every 6 hours for fever/pain",
      note: "Stay hydrated",
    },
    {
      name: "Vitamin D3",
      dosage: "1000 IU",
      timing: "Once daily",
      note: "Supports immune response",
    },
  ],
  "Common Cold": [
    {
      name: "Cetirizine",
      dosage: "10 mg",
      timing: "Once daily at night",
      note: "May cause drowsiness",
    },
    {
      name: "Paracetamol",
      dosage: "500 mg",
      timing: "Every 6 hours as needed",
      note: "For fever and body aches",
    },
    {
      name: "Vitamin C",
      dosage: "500 mg",
      timing: "Twice daily",
      note: "Boosts recovery",
    },
  ],
  Tuberculosis: [
    {
      name: "Rifampicin",
      dosage: "600 mg",
      timing: "Once daily",
      note: "Part of DOTS regimen",
    },
    {
      name: "Isoniazid",
      dosage: "300 mg",
      timing: "Once daily",
      note: "Take with pyridoxine",
    },
    {
      name: "Pyrazinamide",
      dosage: "1500 mg",
      timing: "Once daily",
      note: "Monitor liver function",
    },
    {
      name: "Ethambutol",
      dosage: "800 mg",
      timing: "Once daily",
      note: "Monitor vision",
    },
  ],
  Malaria: [
    {
      name: "Artemether-Lumefantrine",
      dosage: "20/120 mg",
      timing: "Twice daily for 3 days",
      note: "Take with fatty meal",
    },
    {
      name: "Paracetamol",
      dosage: "500 mg",
      timing: "Every 6 hours for fever",
      note: "Avoid NSAIDs",
    },
  ],
  "Dengue Fever": [
    {
      name: "Paracetamol",
      dosage: "500 mg",
      timing: "Every 6 hours for fever/pain",
      note: "Strictly avoid NSAIDs like ibuprofen",
    },
    {
      name: "ORS Sachets",
      dosage: "1 sachet",
      timing: "Dissolve in 1L water, drink frequently",
      note: "Prevent dehydration",
    },
    {
      name: "Papaya Leaf Extract",
      dosage: "As directed",
      timing: "Twice daily",
      note: "Traditional supportive remedy",
    },
  ],
  Typhoid: [
    {
      name: "Cefixime",
      dosage: "200 mg",
      timing: "Twice daily for 14 days",
      note: "Complete full course",
    },
    {
      name: "Azithromycin",
      dosage: "500 mg",
      timing: "Once daily for 7 days",
      note: "Alternative if cefixime not tolerated",
    },
    {
      name: "Paracetamol",
      dosage: "500 mg",
      timing: "Every 6 hours for fever",
      note: "Stay hydrated",
    },
  ],
  Cholera: [
    {
      name: "ORS",
      dosage: "1 sachet",
      timing: "Frequently in small sips",
      note: "Critical for rehydration",
    },
    {
      name: "Azithromycin",
      dosage: "1 g",
      timing: "Single dose",
      note: "Reduces duration and severity",
    },
    {
      name: "Zinc",
      dosage: "20 mg",
      timing: "Once daily for 10–14 days",
      note: "Reduces stool volume",
    },
  ],
  "Hepatitis A": [
    {
      name: "Paracetamol",
      dosage: "500 mg",
      timing: "Every 6 hours for fever/pain",
      note: "Avoid hepatotoxic drugs",
    },
    {
      name: "Vitamin B Complex",
      dosage: "1 tablet",
      timing: "Once daily",
      note: "Supports liver recovery",
    },
  ],
  "Hepatitis B": [
    {
      name: "Tenofovir",
      dosage: "300 mg",
      timing: "Once daily",
      note: "Antiviral — long-term under specialist care",
    },
    {
      name: "Entecavir",
      dosage: "0.5 mg",
      timing: "Once daily",
      note: "Alternative antiviral option",
    },
  ],
  "Hepatitis C": [
    {
      name: "Sofosbuvir-Velpatasvir",
      dosage: "400/100 mg",
      timing: "Once daily for 12 weeks",
      note: "Direct-acting antiviral — specialist only",
    },
  ],
  Chickenpox: [
    {
      name: "Acyclovir",
      dosage: "800 mg",
      timing: "5 times daily for 5–7 days",
      note: "Best started within 24 hours of rash",
    },
    {
      name: "Calamine Lotion",
      dosage: "Topical",
      timing: "Apply 2–3 times daily",
      note: "Relieves itching",
    },
    {
      name: "Paracetamol",
      dosage: "500 mg",
      timing: "Every 6 hours for fever",
      note: "Avoid aspirin in children",
    },
  ],
  Pneumonia: [
    {
      name: "Amoxicillin-Clavulanate",
      dosage: "625 mg",
      timing: "Twice daily for 7–10 days",
      note: "First-line bacterial pneumonia",
    },
    {
      name: "Azithromycin",
      dosage: "500 mg",
      timing: "Once daily for 5 days",
      note: "Atypical coverage",
    },
    {
      name: "Paracetamol",
      dosage: "500 mg",
      timing: "Every 6 hours for fever",
      note: "Rest and hydration",
    },
  ],
  Measles: [
    {
      name: "Vitamin A",
      dosage: "200,000 IU",
      timing: "Single dose (children)",
      note: "Reduces complications per WHO",
    },
    {
      name: "Paracetamol",
      dosage: "500 mg",
      timing: "Every 6 hours for fever",
      note: "Supportive care",
    },
    {
      name: "ORS",
      dosage: "As needed",
      timing: "Frequently",
      note: "Prevent dehydration",
    },
  ],
  Hypertension: [
    {
      name: "Amlodipine",
      dosage: "5 mg",
      timing: "Once daily",
      note: "Monitor blood pressure regularly",
    },
    {
      name: "Losartan",
      dosage: "50 mg",
      timing: "Once daily",
      note: "Protects kidneys in diabetics",
    },
    {
      name: "Hydrochlorothiazide",
      dosage: "12.5 mg",
      timing: "Once daily",
      note: "Diuretic — monitor electrolytes",
    },
  ],
  "Heart Attack": [
    {
      name: "Aspirin",
      dosage: "325 mg",
      timing: "Chew immediately at onset",
      note: "Emergency — call ambulance first",
    },
    {
      name: "Clopidogrel",
      dosage: "300 mg",
      timing: "Loading dose",
      note: "Hospital administration",
    },
    {
      name: "Atorvastatin",
      dosage: "80 mg",
      timing: "Once daily",
      note: "Statin therapy post-event",
    },
  ],
  Stroke: [
    {
      name: "Aspirin",
      dosage: "75 mg",
      timing: "Once daily",
      note: "Secondary prevention after imaging",
    },
    {
      name: "Atorvastatin",
      dosage: "40 mg",
      timing: "Once daily at night",
      note: "Lipid management",
    },
  ],
  "Heart Failure": [
    {
      name: "Furosemide",
      dosage: "40 mg",
      timing: "Once daily",
      note: "Diuretic — monitor weight and potassium",
    },
    {
      name: "Enalapril",
      dosage: "5 mg",
      timing: "Once daily",
      note: "ACE inhibitor — monitor kidney function",
    },
    {
      name: "Carvedilol",
      dosage: "3.125 mg",
      timing: "Twice daily",
      note: "Beta blocker — titrate slowly",
    },
  ],
  "Coronary Artery Disease": [
    {
      name: "Aspirin",
      dosage: "75 mg",
      timing: "Once daily",
      note: "Antiplatelet therapy",
    },
    {
      name: "Atorvastatin",
      dosage: "20 mg",
      timing: "Once daily at night",
      note: "Cholesterol lowering",
    },
    {
      name: "Metoprolol",
      dosage: "50 mg",
      timing: "Once daily",
      note: "Reduces cardiac workload",
    },
  ],
  Arrhythmia: [
    {
      name: "Amiodarone",
      dosage: "200 mg",
      timing: "Once daily",
      note: "Antiarrhythmic — monitor thyroid and liver",
    },
    {
      name: "Metoprolol",
      dosage: "50 mg",
      timing: "Once daily",
      note: "Rate control",
    },
  ],
  Asthma: [
    {
      name: "Salbutamol Inhaler",
      dosage: "100 mcg",
      timing: "2 puffs as needed",
      note: "Rescue inhaler — shake before use",
    },
    {
      name: "Budesonide Inhaler",
      dosage: "200 mcg",
      timing: "2 puffs twice daily",
      note: "Preventer — rinse mouth after",
    },
    {
      name: "Montelukast",
      dosage: "10 mg",
      timing: "Once daily at night",
      note: "Leukotriene receptor antagonist",
    },
  ],
  COPD: [
    {
      name: "Tiotropium",
      dosage: "18 mcg",
      timing: "Once daily via inhaler",
      note: "Long-acting bronchodilator",
    },
    {
      name: "Salbutamol",
      dosage: "100 mcg",
      timing: "2 puffs as needed",
      note: "Rescue inhaler",
    },
    {
      name: "Prednisolone",
      dosage: "5 mg",
      timing: "Once daily during exacerbations",
      note: "Short course only — taper as directed",
    },
  ],
  Bronchitis: [
    {
      name: "Amoxicillin",
      dosage: "500 mg",
      timing: "Three times daily for 5–7 days",
      note: "If bacterial suspected",
    },
    {
      name: "Dextromethorphan",
      dosage: "10 mg",
      timing: "Every 4–6 hours for cough",
      note: "Avoid if productive cough",
    },
    {
      name: "Paracetamol",
      dosage: "500 mg",
      timing: "Every 6 hours for fever",
      note: "Rest and fluids",
    },
  ],
  "Pulmonary Fibrosis": [
    {
      name: "Pirfenidone",
      dosage: "267 mg",
      timing: "Three times daily with meals",
      note: "Antifibrotic — monitor liver enzymes",
    },
    {
      name: "Nintedanib",
      dosage: "150 mg",
      timing: "Twice daily with food",
      note: "Antifibrotic — specialist only",
    },
  ],
  "Sleep Apnea": [
    {
      name: "CPAP Therapy",
      dosage: "N/A",
      timing: "Nightly during sleep",
      note: "Gold standard — not a tablet",
    },
    {
      name: "Modafinil",
      dosage: "200 mg",
      timing: "Once daily in morning",
      note: "For residual daytime sleepiness",
    },
  ],
  "Alzheimer Disease": [
    {
      name: "Donepezil",
      dosage: "5 mg",
      timing: "Once daily at night",
      note: "Cholinesterase inhibitor — titrate to 10 mg",
    },
    {
      name: "Memantine",
      dosage: "5 mg",
      timing: "Once daily",
      note: "NMDA antagonist — increase gradually",
    },
  ],
  "Parkinson Disease": [
    {
      name: "Levodopa-Carbidopa",
      dosage: "110 mg",
      timing: "Three times daily",
      note: "Gold standard — adjust with meals",
    },
    {
      name: "Ropinirole",
      dosage: "0.25 mg",
      timing: "Three times daily",
      note: "Dopamine agonist",
    },
  ],
  Epilepsy: [
    {
      name: "Levetiracetam",
      dosage: "500 mg",
      timing: "Twice daily",
      note: "First-line — monitor mood changes",
    },
    {
      name: "Sodium Valproate",
      dosage: "500 mg",
      timing: "Twice daily",
      note: "Broad spectrum — avoid in pregnancy",
    },
  ],
  Migraine: [
    {
      name: "Sumatriptan",
      dosage: "50 mg",
      timing: "At onset of attack",
      note: "Repeat after 2 hours if needed (max 200 mg/day)",
    },
    {
      name: "Propranolol",
      dosage: "40 mg",
      timing: "Once daily",
      note: "Preventive — monitor heart rate",
    },
    {
      name: "Paracetamol",
      dosage: "500 mg",
      timing: "Every 6 hours",
      note: "For mild attacks",
    },
  ],
  "Multiple Sclerosis": [
    {
      name: "Interferon Beta-1a",
      dosage: "30 mcg",
      timing: "Once weekly IM injection",
      note: "Disease-modifying therapy",
    },
    {
      name: "Fingolimod",
      dosage: "0.5 mg",
      timing: "Once daily",
      note: "Monitor heart rate at first dose",
    },
  ],
  Dementia: [
    {
      name: "Donepezil",
      dosage: "5 mg",
      timing: "Once daily at night",
      note: "May increase to 10 mg after 4–6 weeks",
    },
    {
      name: "Rivastigmine",
      dosage: "1.5 mg",
      timing: "Twice daily",
      note: "Alternative cholinesterase inhibitor",
    },
  ],
  Depression: [
    {
      name: "Sertraline",
      dosage: "50 mg",
      timing: "Once daily in morning",
      note: "SSRI — may take 2–4 weeks to work",
    },
    {
      name: "Escitalopram",
      dosage: "10 mg",
      timing: "Once daily",
      note: "SSRI — generally well tolerated",
    },
    {
      name: "Mirtazapine",
      dosage: "15 mg",
      timing: "Once daily at night",
      note: "Helpful if insomnia present",
    },
  ],
  "Anxiety Disorder": [
    {
      name: "Sertraline",
      dosage: "50 mg",
      timing: "Once daily",
      note: "First-line SSRI for anxiety",
    },
    {
      name: "Clonazepam",
      dosage: "0.25 mg",
      timing: "Twice daily",
      note: "Short-term only — risk of dependence",
    },
    {
      name: "Propranolol",
      dosage: "10 mg",
      timing: "As needed for physical symptoms",
      note: "Beta blocker for situational anxiety",
    },
  ],
  "Bipolar Disorder": [
    {
      name: "Lithium Carbonate",
      dosage: "300 mg",
      timing: "Twice daily",
      note: "Mood stabilizer — monitor blood levels",
    },
    {
      name: "Valproate",
      dosage: "500 mg",
      timing: "Twice daily",
      note: "Alternative mood stabilizer",
    },
    {
      name: "Quetiapine",
      dosage: "25 mg",
      timing: "Once daily at night",
      note: "Atypical antipsychotic — sedating",
    },
  ],
  Schizophrenia: [
    {
      name: "Risperidone",
      dosage: "2 mg",
      timing: "Once daily",
      note: "Atypical antipsychotic — monitor prolactin",
    },
    {
      name: "Olanzapine",
      dosage: "5 mg",
      timing: "Once daily",
      note: "Effective for positive and negative symptoms",
    },
  ],
  PTSD: [
    {
      name: "Sertraline",
      dosage: "50 mg",
      timing: "Once daily",
      note: "FDA-approved for PTSD",
    },
    {
      name: "Prazosin",
      dosage: "1 mg",
      timing: "Once daily at night",
      note: "Reduces nightmares — titrate slowly",
    },
  ],
  ADHD: [
    {
      name: "Methylphenidate",
      dosage: "10 mg",
      timing: "Once daily in morning",
      note: "Stimulant — monitor growth in children",
    },
    {
      name: "Atomoxetine",
      dosage: "40 mg",
      timing: "Once daily",
      note: "Non-stimulant alternative",
    },
  ],
  OCD: [
    {
      name: "Fluoxetine",
      dosage: "20 mg",
      timing: "Once daily",
      note: "SSRI — higher doses often needed for OCD",
    },
    {
      name: "Clomipramine",
      dosage: "25 mg",
      timing: "Once daily at night",
      note: "Tricyclic — effective but more side effects",
    },
  ],
  "Rheumatoid Arthritis": [
    {
      name: "Methotrexate",
      dosage: "15 mg",
      timing: "Once weekly",
      note: "DMARD — take folic acid next day",
    },
    {
      name: "Hydroxychloroquine",
      dosage: "200 mg",
      timing: "Twice daily",
      note: "Monitor eye health annually",
    },
    {
      name: "Prednisolone",
      dosage: "5 mg",
      timing: "Once daily",
      note: "Bridge therapy — taper as directed",
    },
  ],
  Lupus: [
    {
      name: "Hydroxychloroquine",
      dosage: "200 mg",
      timing: "Twice daily",
      note: "Foundation therapy — monitor eyes",
    },
    {
      name: "Prednisolone",
      dosage: "5 mg",
      timing: "Once daily",
      note: "Flare management — taper slowly",
    },
    {
      name: "Mycophenolate",
      dosage: "500 mg",
      timing: "Twice daily",
      note: "For severe organ involvement",
    },
  ],
  Psoriasis: [
    {
      name: "Methotrexate",
      dosage: "15 mg",
      timing: "Once weekly",
      note: "For moderate-to-severe cases",
    },
    {
      name: "Topical Corticosteroid",
      dosage: "As directed",
      timing: "Twice daily on plaques",
      note: "Avoid long-term continuous use on same area",
    },
    {
      name: "Calcipotriene",
      dosage: "As directed",
      timing: "Twice daily",
      note: "Vitamin D analog — combine with steroids",
    },
  ],
  "Crohn Disease": [
    {
      name: "Mesalazine",
      dosage: "1 g",
      timing: "Three times daily",
      note: "Mild disease — monitor kidney function",
    },
    {
      name: "Azathioprine",
      dosage: "50 mg",
      timing: "Once daily",
      note: "Immunomodulator — monitor blood counts",
    },
    {
      name: "Infliximab",
      dosage: "5 mg/kg",
      timing: "IV infusion every 8 weeks",
      note: "Biologic — specialist administration",
    },
  ],
  "Type 1 Diabetes": [
    {
      name: "Insulin Glargine",
      dosage: "As prescribed",
      timing: "Once daily at same time",
      note: "Basal insulin — never skip",
    },
    {
      name: "Insulin Aspart",
      dosage: "As prescribed",
      timing: "Before meals",
      note: "Rapid-acting — dose per carbs",
    },
  ],
  "Type 2 Diabetes Mellitus": [
    {
      name: "Metformin",
      dosage: "500 mg",
      timing: "Twice daily with meals",
      note: "First-line — may cause GI upset initially",
    },
    {
      name: "Glimepiride",
      dosage: "1 mg",
      timing: "Once daily before breakfast",
      note: "Sulfonylurea — risk of hypoglycemia",
    },
    {
      name: "Sitagliptin",
      dosage: "100 mg",
      timing: "Once daily",
      note: "DPP-4 inhibitor — weight neutral",
    },
  ],
  "Celiac Disease": [
    {
      name: "Gluten-Free Diet",
      dosage: "N/A",
      timing: "Strict lifelong avoidance",
      note: "No medication — diet is the treatment",
    },
    {
      name: "Vitamin D + Calcium",
      dosage: "As directed",
      timing: "Once daily",
      note: "Correct deficiencies from malabsorption",
    },
  ],
  Obesity: [
    {
      name: "Orlistat",
      dosage: "120 mg",
      timing: "With each main meal",
      note: "Blocks fat absorption — take multivitamin",
    },
    {
      name: "Metformin",
      dosage: "500 mg",
      timing: "Twice daily",
      note: "If insulin resistant or prediabetic",
    },
  ],
  "Fatty Liver Disease": [
    {
      name: "Vitamin E",
      dosage: "400 IU",
      timing: "Once daily",
      note: "For non-diabetic NAFLD per guidelines",
    },
    {
      name: "Metformin",
      dosage: "500 mg",
      timing: "Twice daily",
      note: "If diabetic — improves insulin sensitivity",
    },
    {
      name: "Atorvastatin",
      dosage: "10 mg",
      timing: "Once daily at night",
      note: "If dyslipidemia present",
    },
  ],
  "High Cholesterol": [
    {
      name: "Atorvastatin",
      dosage: "20 mg",
      timing: "Once daily at night",
      note: "Monitor liver enzymes",
    },
    {
      name: "Ezetimibe",
      dosage: "10 mg",
      timing: "Once daily",
      note: "Add-on if statin insufficient",
    },
    {
      name: "Fenofibrate",
      dosage: "145 mg",
      timing: "Once daily",
      note: "For high triglycerides",
    },
  ],
  Gastritis: [
    {
      name: "Pantoprazole",
      dosage: "40 mg",
      timing: "Once daily before breakfast",
      note: "PPI — take 30 minutes before food",
    },
    {
      name: "Sucralfate",
      dosage: "1 g",
      timing: "Four times daily before meals",
      note: "Coats stomach lining",
    },
    {
      name: "Domperidone",
      dosage: "10 mg",
      timing: "Three times daily before meals",
      note: "For nausea and bloating",
    },
  ],
  GERD: [
    {
      name: "Omeprazole",
      dosage: "20 mg",
      timing: "Once daily before breakfast",
      note: "PPI — may need 4–8 weeks",
    },
    {
      name: "Ranitidine",
      dosage: "150 mg",
      timing: "Twice daily",
      note: "H2 blocker — alternative or add-on",
    },
    {
      name: "Gaviscon",
      dosage: "10 ml",
      timing: "After meals and at bedtime",
      note: "Alginate antacid for breakthrough",
    },
  ],
  "Peptic Ulcer": [
    {
      name: "Omeprazole",
      dosage: "20 mg",
      timing: "Twice daily",
      note: "PPI — essential for healing",
    },
    {
      name: "Amoxicillin",
      dosage: "1 g",
      timing: "Twice daily",
      note: "If H. pylori positive — triple therapy",
    },
    {
      name: "Clarithromycin",
      dosage: "500 mg",
      timing: "Twice daily",
      note: "Part of H. pylori eradication",
    },
  ],
  Appendicitis: [
    {
      name: "Emergency Surgery",
      dosage: "N/A",
      timing: "Immediate",
      note: "Appendectomy is definitive treatment",
    },
    {
      name: "Ceftriaxone",
      dosage: "1 g",
      timing: "IV every 12 hours pre-op",
      note: "Perioperative antibiotics",
    },
  ],
  "Liver Cirrhosis": [
    {
      name: "Spironolactone",
      dosage: "100 mg",
      timing: "Once daily",
      note: "For ascites — monitor potassium",
    },
    {
      name: "Propranolol",
      dosage: "40 mg",
      timing: "Twice daily",
      note: "For portal hypertension — prevent bleeding",
    },
    {
      name: "Lactulose",
      dosage: "15 ml",
      timing: "Twice daily",
      note: "For hepatic encephalopathy",
    },
  ],
  IBS: [
    {
      name: "Mebeverine",
      dosage: "135 mg",
      timing: "Three times daily before meals",
      note: "Antispasmodic",
    },
    {
      name: "Loperamide",
      dosage: "2 mg",
      timing: "As needed for diarrhea",
      note: "Do not exceed 8 mg/day",
    },
    {
      name: "Psyllium Husk",
      dosage: "3.5 g",
      timing: "Twice daily with water",
      note: "Soluble fiber — start low, go slow",
    },
  ],
  "Kidney Stones": [
    {
      name: "Tamsulosin",
      dosage: "0.4 mg",
      timing: "Once daily",
      note: "Helps pass distal ureteric stones",
    },
    {
      name: "Potassium Citrate",
      dosage: "As directed",
      timing: "Twice daily",
      note: "Alkalinizes urine — prevents recurrence",
    },
    {
      name: "Diclofenac",
      dosage: "50 mg",
      timing: "Twice daily for pain",
      note: "NSAID — avoid if kidney function impaired",
    },
  ],
  "Kidney Failure": [
    {
      name: "Epoetin Alfa",
      dosage: "As prescribed",
      timing: "Injection as directed",
      note: "For anemia of CKD",
    },
    {
      name: "Sevelamer",
      dosage: "800 mg",
      timing: "With meals",
      note: "Phosphate binder",
    },
    {
      name: "Furosemide",
      dosage: "40 mg",
      timing: "Once daily",
      note: "Diuretic — monitor fluid balance",
    },
  ],
  UTI: [
    {
      name: "Nitrofurantoin",
      dosage: "100 mg",
      timing: "Twice daily for 5 days",
      note: "First-line uncomplicated UTI",
    },
    {
      name: "Ciprofloxacin",
      dosage: "250 mg",
      timing: "Twice daily for 3 days",
      note: "Alternative — avoid in pregnancy",
    },
    {
      name: "Cranberry Extract",
      dosage: "500 mg",
      timing: "Twice daily",
      note: "Prevention of recurrent UTIs",
    },
  ],
  Nephritis: [
    {
      name: "Prednisolone",
      dosage: "1 mg/kg",
      timing: "Once daily",
      note: "Immunosuppression — taper per nephrologist",
    },
    {
      name: "Cyclophosphamide",
      dosage: "As prescribed",
      timing: "Monthly IV pulses",
      note: "For severe lupus nephritis",
    },
  ],
  Acne: [
    {
      name: "Benzoyl Peroxide",
      dosage: "2.5%",
      timing: "Once daily",
      note: "Start low to reduce irritation",
    },
    {
      name: "Clindamycin Gel",
      dosage: "1%",
      timing: "Twice daily",
      note: "Topical antibiotic — combine with benzoyl peroxide",
    },
    {
      name: "Isotretinoin",
      dosage: "0.5 mg/kg",
      timing: "Once daily with food",
      note: "Severe acne — mandatory contraception, monitor lipids",
    },
  ],
  Eczema: [
    {
      name: "Hydrocortisone Cream",
      dosage: "1%",
      timing: "Twice daily on affected areas",
      note: "Mild potency — avoid face long-term",
    },
    {
      name: "Cetirizine",
      dosage: "10 mg",
      timing: "Once daily at night",
      note: "For itching",
    },
    {
      name: "Moisturizer",
      dosage: "Liberal",
      timing: "Multiple times daily",
      note: "Emollient therapy is cornerstone",
    },
  ],
  Vitiligo: [
    {
      name: "Tacrolimus Ointment",
      dosage: "0.1%",
      timing: "Twice daily",
      note: "For face and neck — avoid sun after application",
    },
    {
      name: "Topical Corticosteroid",
      dosage: "Mid-potency",
      timing: "Twice daily",
      note: "For body lesions — limit duration",
    },
  ],
  Dermatitis: [
    {
      name: "Hydrocortisone",
      dosage: "1%",
      timing: "Twice daily",
      note: "Short course on affected skin",
    },
    {
      name: "Cetirizine",
      dosage: "10 mg",
      timing: "Once daily",
      note: "For itch relief",
    },
  ],
  Hypothyroidism: [
    {
      name: "Levothyroxine",
      dosage: "50 mcg",
      timing: "Once daily on empty stomach",
      note: "Take 30–60 minutes before breakfast",
    },
    {
      name: "Vitamin D3",
      dosage: "1000 IU",
      timing: "Once daily",
      note: "Often deficient in hypothyroidism",
    },
  ],
  Hyperthyroidism: [
    {
      name: "Methimazole",
      dosage: "10 mg",
      timing: "Three times daily",
      note: "Antithyroid — monitor liver function",
    },
    {
      name: "Propranolol",
      dosage: "40 mg",
      timing: "Twice daily",
      note: "Controls tremor and palpitations",
    },
  ],
  "Diabetes Mellitus": [
    {
      name: "Metformin",
      dosage: "500 mg",
      timing: "Twice daily with meals",
      note: "First-line for Type 2",
    },
    {
      name: "Glimepiride",
      dosage: "1 mg",
      timing: "Once daily before breakfast",
      note: "Sulfonylurea",
    },
    {
      name: "Insulin Glargine",
      dosage: "As prescribed",
      timing: "Once daily",
      note: "For Type 1 or advanced Type 2",
    },
  ],
  Arthritis: [
    {
      name: "Diclofenac",
      dosage: "50 mg",
      timing: "Twice daily after meals",
      note: "NSAID — protect stomach",
    },
    {
      name: "Paracetamol",
      dosage: "500 mg",
      timing: "Every 6 hours",
      note: "For pain if NSAIDs contraindicated",
    },
  ],
  Osteoporosis: [
    {
      name: "Alendronate",
      dosage: "70 mg",
      timing: "Once weekly on empty stomach",
      note: "Stay upright 30 minutes after",
    },
    {
      name: "Calcium Carbonate",
      dosage: "500 mg",
      timing: "Twice daily with meals",
      note: "Combine with Vitamin D",
    },
    {
      name: "Vitamin D3",
      dosage: "2000 IU",
      timing: "Once daily",
      note: "Essential for calcium absorption",
    },
  ],
  Gout: [
    {
      name: "Colchicine",
      dosage: "0.5 mg",
      timing: "Three times daily until relief",
      note: "Acute attack — stop when pain eases or GI upset",
    },
    {
      name: "Allopurinol",
      dosage: "100 mg",
      timing: "Once daily",
      note: "Long-term urate lowering — start after acute attack resolves",
    },
    {
      name: "Indomethacin",
      dosage: "50 mg",
      timing: "Three times daily",
      note: "NSAID for acute pain",
    },
  ],
  Osteoarthritis: [
    {
      name: "Glucosamine",
      dosage: "1500 mg",
      timing: "Once daily",
      note: "Symptom-modifying supplement",
    },
    {
      name: "Diclofenac",
      dosage: "50 mg",
      timing: "Twice daily",
      note: "Topical gel preferred to reduce systemic exposure",
    },
    {
      name: "Paracetamol",
      dosage: "500 mg",
      timing: "Every 6 hours",
      note: "First-line analgesic",
    },
  ],
  "Lung Cancer": [
    {
      name: "Cisplatin",
      dosage: "75 mg/m²",
      timing: "IV every 3 weeks",
      note: "Chemotherapy — oncology only",
    },
    {
      name: "Pemetrexed",
      dosage: "500 mg/m²",
      timing: "IV every 3 weeks",
      note: "For non-squamous NSCLC",
    },
  ],
  "Breast Cancer": [
    {
      name: "Tamoxifen",
      dosage: "20 mg",
      timing: "Once daily",
      note: "Hormone receptor-positive — 5–10 years",
    },
    {
      name: "Letrozole",
      dosage: "2.5 mg",
      timing: "Once daily",
      note: "Aromatase inhibitor — postmenopausal",
    },
  ],
  "Blood Cancer": [
    {
      name: "Imatinib",
      dosage: "400 mg",
      timing: "Once daily",
      note: "CML — targeted therapy",
    },
    {
      name: "Rituximab",
      dosage: "375 mg/m²",
      timing: "Weekly IV for 4 weeks",
      note: "Lymphoma — immunotherapy",
    },
  ],
  "HIV AIDS": [
    {
      name: "Tenofovir-Emtricitabine",
      dosage: "300/200 mg",
      timing: "Once daily",
      note: "NRTI backbone",
    },
    {
      name: "Dolutegravir",
      dosage: "50 mg",
      timing: "Once daily",
      note: "Integrase inhibitor",
    },
    {
      name: "Efavirenz",
      dosage: "600 mg",
      timing: "Once daily at night",
      note: "NNRTI — avoid in first trimester pregnancy",
    },
  ],
  Syphilis: [
    {
      name: "Benzathine Penicillin G",
      dosage: "2.4 million units",
      timing: "IM single dose (early)",
      note: "Drug of choice — desensitize if allergic",
    },
    {
      name: "Doxycycline",
      dosage: "100 mg",
      timing: "Twice daily for 14 days",
      note: "Alternative for penicillin allergy",
    },
  ],
  Gonorrhea: [
    {
      name: "Ceftriaxone",
      dosage: "500 mg",
      timing: "IM single dose",
      note: "First-line — test for chlamydia co-infection",
    },
    {
      name: "Azithromycin",
      dosage: "1 g",
      timing: "Single dose",
      note: "If chlamydia not excluded",
    },
  ],
  Chlamydia: [
    {
      name: "Azithromycin",
      dosage: "1 g",
      timing: "Single dose",
      note: "First-line",
    },
    {
      name: "Doxycycline",
      dosage: "100 mg",
      timing: "Twice daily for 7 days",
      note: "Alternative — equally effective",
    },
  ],
  Anemia: [
    {
      name: "Ferrous Sulfate",
      dosage: "65 mg elemental iron",
      timing: "Once daily with vitamin C",
      note: "Take with orange juice; avoid tea/coffee",
    },
    {
      name: "Folic Acid",
      dosage: "5 mg",
      timing: "Once daily",
      note: "If megaloblastic anemia",
    },
    {
      name: "Vitamin B12",
      dosage: "1000 mcg",
      timing: "Once daily sublingual",
      note: "If B12 deficiency",
    },
  ],
  Scurvy: [
    {
      name: "Vitamin C",
      dosage: "500 mg",
      timing: "Twice daily",
      note: "Rapid resolution of symptoms",
    },
    {
      name: "Multivitamin",
      dosage: "1 tablet",
      timing: "Once daily",
      note: "Prevent recurrence",
    },
  ],
  Rickets: [
    {
      name: "Vitamin D3",
      dosage: "2000 IU",
      timing: "Once daily",
      note: "Cholecalciferol — monitor calcium",
    },
    {
      name: "Calcium Carbonate",
      dosage: "500 mg",
      timing: "Twice daily",
      note: "Combine with Vitamin D",
    },
  ],
  Goiter: [
    {
      name: "Levothyroxine",
      dosage: "As prescribed",
      timing: "Once daily",
      note: "If hypothyroid — dose by TSH",
    },
    {
      name: "Iodine Supplement",
      dosage: "150 mcg",
      timing: "Once daily",
      note: "If iodine deficiency",
    },
  ],
  "Down Syndrome": [
    {
      name: "No specific medication",
      dosage: "N/A",
      timing: "N/A",
      note: "Supportive care and early intervention programs",
    },
  ],
  "Sickle Cell Anemia": [
    {
      name: "Hydroxyurea",
      dosage: "15 mg/kg",
      timing: "Once daily",
      note: "Reduces crises — monitor blood counts",
    },
    {
      name: "Folic Acid",
      dosage: "5 mg",
      timing: "Once daily",
      note: "Supports red blood cell production",
    },
  ],
  Thalassemia: [
    {
      name: "Deferasirox",
      dosage: "20 mg/kg",
      timing: "Once daily",
      note: "Iron chelation — monitor liver/kidney",
    },
    {
      name: "Folic Acid",
      dosage: "5 mg",
      timing: "Once daily",
      note: "Supportive",
    },
  ],
};

// ─── MEDIX AI Engine ────────────────────────────────────────────────────────

function extractSymptoms(input: string): string[] {
  const keywords = [
    "fever",
    "headache",
    "cough",
    "fatigue",
    "rash",
    "vomiting",
    "nausea",
    "chest pain",
    "breathing difficulty",
    "joint pain",
    "swelling",
    "stiffness",
    "sore throat",
    "runny nose",
    "sneezing",
    "body pain",
    "weakness",
    "pale skin",
    "frequent urination",
    "thirst",
    "diarrhea",
    "stomach pain",
    "sadness",
    "hopelessness",
    "anxiety",
    "itching",
    "skin rash",
    "paralysis",
    "seizure",
    "unconscious",
    "stroke",
    "bleeding",
    "cardiac",
    "light sensitivity",
    "migraine",
    "back pain",
    "dizziness",
    "insomnia",
  ];
  const s = input.toLowerCase();
  const found: string[] = [];
  for (const kw of keywords) {
    if (s.includes(kw) && !found.includes(kw)) {
      found.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  }
  if (found.length === 0) {
    const words = input.split(/[,\s]+/).filter((w) => w.length > 3);
    return words
      .slice(0, 6)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }
  return found;
}

function getMedixAIResponse(
  symptoms: string,
  _age: string,
  _gender: string,
  _duration: string,
): MedixReport {
  const s = symptoms.toLowerCase();

  const isEmergency =
    s.includes("chest pain") ||
    s.includes("can't breathe") ||
    s.includes("cannot breathe") ||
    s.includes("difficulty breathing") ||
    s.includes("paralysis") ||
    s.includes("seizure") ||
    s.includes("unconscious") ||
    s.includes("stroke") ||
    s.includes("heavy bleeding") ||
    s.includes("cardiac");

  const extractedSymptoms = extractSymptoms(symptoms);

  if (
    (s.includes("fever") && s.includes("rash")) ||
    (s.includes("fever") && s.includes("joint")) ||
    s.includes("dengue")
  ) {
    return {
      extractedSymptoms,
      isEmergency,
      riskLevel: "High Risk",
      healthInsights: [
        "Drink at least 3 litres of water daily to prevent dehydration.",
        "Rest completely and avoid strenuous activity.",
        "Use mosquito repellent and wear long-sleeved clothing.",
        "Monitor platelet count closely — get a CBC blood test.",
        "Eat iron-rich foods: spinach, lentils, pomegranate.",
      ],
      diseases: [
        {
          name: "Dengue Fever",
          match: 91,
          severity: "Severe",
          symptoms: [
            "High fever (39–40°C)",
            "Severe joint & muscle pain",
            "Skin rash",
            "Behind-eye pain",
            "Nausea & vomiting",
          ],
          causes: [
            "Aedes mosquito bite carrying dengue virus",
            "Urban and suburban environments",
          ],
          prevention: [
            "Use mosquito repellents",
            "Eliminate standing water",
            "Wear protective clothing",
            "Use mosquito nets",
          ],
          homeCare: [
            "Stay hydrated (ORS + fluids)",
            "Monitor platelet count daily",
            "Rest completely",
            "Paracetamol for fever — avoid NSAIDs",
          ],
          specialist: "General Physician / Infectious Disease Specialist",
        },
        {
          name: "Chikungunya",
          match: 74,
          severity: "Moderate",
          symptoms: [
            "High fever",
            "Severe joint pain (polyarthralgia)",
            "Skin rash",
            "Muscle pain",
            "Headache",
          ],
          causes: ["Aedes mosquito bite", "Viral infection (togavirus)"],
          prevention: [
            "Mosquito control",
            "Repellents and protective clothing",
            "Eliminate breeding sites",
          ],
          homeCare: [
            "Rest and fluids",
            "Paracetamol for pain & fever",
            "Warm compresses on joints",
          ],
          specialist: "General Physician / Rheumatologist",
        },
        {
          name: "Malaria",
          match: 62,
          severity: "Severe",
          symptoms: [
            "Cyclical high fever",
            "Chills and rigors",
            "Sweating",
            "Headache",
            "Muscle aches",
          ],
          causes: ["Plasmodium parasite via Anopheles mosquito"],
          prevention: [
            "Anti-malarial medication",
            "Insecticide-treated bed nets",
            "Mosquito repellents",
          ],
          homeCare: [
            "Fluids and rest",
            "Seek immediate medical diagnosis",
            "Blood smear test required",
          ],
          specialist: "General Physician / Infectious Disease Specialist",
        },
      ],
    };
  }

  if (s.includes("fever") && (s.includes("cough") || s.includes("fatigue"))) {
    return {
      extractedSymptoms,
      isEmergency,
      riskLevel: "Moderate Risk",
      healthInsights: [
        "Isolate to avoid spreading infection to others.",
        "Drink 8–10 glasses of water and warm herbal teas daily.",
        "Get adequate sleep — your immune system heals during rest.",
        "Ventilate your room and avoid crowded places.",
        "Consider a PCR test to rule out COVID-19.",
      ],
      diseases: [
        {
          name: "Influenza (Flu)",
          match: 88,
          severity: "Moderate",
          symptoms: [
            "High fever (38–40°C)",
            "Dry cough",
            "Severe fatigue",
            "Muscle aches",
            "Chills",
          ],
          causes: ["Influenza A or B virus", "Airborne droplet transmission"],
          prevention: [
            "Annual flu vaccination",
            "Hand hygiene",
            "Avoid close contact with sick individuals",
          ],
          homeCare: [
            "Rest and hydrate",
            "Paracetamol for fever",
            "Warm soups and honey-ginger tea",
            "Steam inhalation",
          ],
          specialist: "General Physician",
        },
        {
          name: "COVID-19",
          match: 82,
          severity: "Moderate",
          symptoms: [
            "Fever",
            "Persistent dry cough",
            "Fatigue",
            "Loss of taste/smell",
            "Shortness of breath",
          ],
          causes: [
            "SARS-CoV-2 coronavirus",
            "Respiratory droplets and aerosols",
          ],
          prevention: [
            "Vaccination (booster doses)",
            "Masking in crowded areas",
            "Hand sanitisation",
          ],
          homeCare: [
            "Isolate for 5–7 days",
            "Monitor oxygen saturation (SpO2)",
            "Hydration and rest",
            "Seek hospital if SpO2 drops below 94%",
          ],
          specialist: "General Physician / Pulmonologist",
        },
        {
          name: "Common Cold",
          match: 75,
          severity: "Mild",
          symptoms: [
            "Mild fever",
            "Runny nose",
            "Sore throat",
            "Sneezing",
            "Mild fatigue",
          ],
          causes: ["Rhinovirus (most common)", "Other respiratory viruses"],
          prevention: [
            "Hand washing",
            "Avoid touching face",
            "Boost immunity with vitamin C",
          ],
          homeCare: [
            "Rest and warm fluids",
            "Saline nasal spray",
            "Vitamin C and zinc supplements",
          ],
          specialist: "General Physician",
        },
      ],
    };
  }

  if (
    s.includes("headache") ||
    s.includes("migraine") ||
    (s.includes("head") && s.includes("pain"))
  ) {
    return {
      extractedSymptoms,
      isEmergency,
      riskLevel:
        s.includes("nausea") || s.includes("light")
          ? "Moderate Risk"
          : "Low Risk",
      healthInsights: [
        "Stay hydrated — dehydration is a leading trigger for headaches.",
        "Sleep 7–9 hours consistently on a regular schedule.",
        "Reduce screen time and take eye breaks every 20 minutes.",
        "Practice stress reduction: deep breathing, yoga, meditation.",
        "Limit caffeine and alcohol which can trigger migraines.",
      ],
      diseases: [
        {
          name: "Migraine",
          match: 90,
          severity: "Moderate",
          symptoms: [
            "Throbbing one-sided headache",
            "Nausea & vomiting",
            "Light/sound sensitivity",
            "Visual aura",
            "Fatigue",
          ],
          causes: [
            "Hormonal changes",
            "Stress and anxiety",
            "Sleep disruption",
            "Dietary triggers (caffeine, alcohol)",
          ],
          prevention: [
            "Identify and avoid triggers",
            "Regular sleep schedule",
            "Stress management",
            "Stay hydrated",
          ],
          homeCare: [
            "Rest in a dark, quiet room",
            "Cold compress on forehead",
            "Triptans or paracetamol",
            "Ginger tea for nausea",
          ],
          specialist: "Neurologist",
        },
        {
          name: "Tension Headache",
          match: 78,
          severity: "Mild",
          symptoms: [
            "Dull pressure around head",
            "Neck and shoulder stiffness",
            "Sensitivity to light",
            "Scalp tenderness",
          ],
          causes: [
            "Muscle tension",
            "Stress and anxiety",
            "Poor posture",
            "Eye strain",
          ],
          prevention: [
            "Regular breaks from screens",
            "Neck stretching exercises",
            "Stress management",
          ],
          homeCare: [
            "Neck & shoulder massage",
            "Warm compress",
            "Paracetamol / ibuprofen",
            "Relaxation techniques",
          ],
          specialist: "General Physician / Neurologist",
        },
        {
          name: "Meningitis (rule out)",
          match: s.includes("stiff neck") || s.includes("fever") ? 45 : 22,
          severity: "Critical",
          symptoms: [
            "Severe headache",
            "Stiff neck",
            "High fever",
            "Sensitivity to light",
            "Confusion",
          ],
          causes: ["Bacterial or viral infection", "Inflammation of meninges"],
          prevention: [
            "Meningococcal vaccination",
            "Avoid sharing drinks/utensils",
          ],
          homeCare: [
            "Seek emergency medical care immediately",
            "This is a medical emergency",
          ],
          specialist: "Neurologist / Emergency Physician",
        },
      ],
    };
  }

  if (
    s.includes("breathing") ||
    s.includes("asthma") ||
    s.includes("breath") ||
    (s.includes("cough") && !s.includes("fever"))
  ) {
    return {
      extractedSymptoms,
      isEmergency:
        isEmergency || s.includes("can't breathe") || s.includes("severe"),
      riskLevel: "Moderate Risk",
      healthInsights: [
        "Identify and avoid your asthma/allergy triggers (dust, pollen, smoke).",
        "Use an air purifier at home and keep windows closed on high-pollen days.",
        "Practice pursed-lip breathing exercises daily.",
        "Maintain a healthy weight — obesity worsens respiratory symptoms.",
        "Stay away from smoking environments entirely.",
      ],
      diseases: [
        {
          name: "Asthma",
          match: 85,
          severity: "Moderate",
          symptoms: [
            "Wheezing",
            "Shortness of breath",
            "Chest tightness",
            "Persistent cough (especially at night)",
          ],
          causes: [
            "Airway inflammation",
            "Allergens (dust, pollen, pet dander)",
            "Exercise or cold air",
            "Genetic predisposition",
          ],
          prevention: [
            "Avoid known triggers",
            "Regular use of preventer inhaler",
            "Air quality monitoring",
          ],
          homeCare: [
            "Use rescue inhaler immediately",
            "Sit upright and breathe slowly",
            "Avoid trigger environments",
          ],
          specialist: "Pulmonologist / Allergist",
        },
        {
          name: "Bronchitis",
          match: 75,
          severity: "Moderate",
          symptoms: [
            "Persistent cough with mucus",
            "Chest soreness",
            "Mild fever",
            "Fatigue",
            "Wheezing",
          ],
          causes: [
            "Viral infection (most common)",
            "Smoking",
            "Air pollution",
            "Chemical fumes",
          ],
          prevention: [
            "Quit smoking",
            "Annual flu vaccine",
            "Avoid lung irritants",
          ],
          homeCare: [
            "Rest and fluids",
            "Honey in warm water",
            "Steam inhalation",
            "Avoid smoke exposure",
          ],
          specialist: "General Physician / Pulmonologist",
        },
        {
          name: "COPD",
          match: 60,
          severity: "Severe",
          symptoms: [
            "Chronic cough",
            "Shortness of breath",
            "Wheezing",
            "Chest tightness",
            "Mucus production",
          ],
          causes: [
            "Long-term smoking",
            "Prolonged air pollution exposure",
            "Occupational dust/chemicals",
          ],
          prevention: [
            "Stop smoking immediately",
            "Avoid pollutants",
            "Regular lung function tests",
          ],
          homeCare: [
            "Use prescribed inhalers",
            "Pulmonary rehabilitation exercises",
            "Oxygen therapy if prescribed",
          ],
          specialist: "Pulmonologist",
        },
      ],
    };
  }

  if (
    s.includes("stomach") ||
    s.includes("diarrhea") ||
    s.includes("vomiting") ||
    s.includes("nausea")
  ) {
    return {
      extractedSymptoms,
      isEmergency,
      riskLevel: "Moderate Risk",
      healthInsights: [
        "Stay strictly hydrated with ORS (oral rehydration solution).",
        "Follow the BRAT diet: bananas, rice, applesauce, toast.",
        "Avoid dairy, spicy, and fatty foods until recovered.",
        "Wash hands thoroughly before meals and after toilet use.",
        "Food safety: refrigerate perishables and avoid street food during illness.",
      ],
      diseases: [
        {
          name: "Gastroenteritis",
          match: 88,
          severity: "Moderate",
          symptoms: [
            "Nausea & vomiting",
            "Diarrhea",
            "Stomach cramps",
            "Mild fever",
            "Muscle aches",
          ],
          causes: [
            "Viral (norovirus, rotavirus)",
            "Bacterial contamination",
            "Contaminated food or water",
          ],
          prevention: [
            "Hand hygiene",
            "Safe food handling",
            "Clean drinking water",
          ],
          homeCare: [
            "ORS and clear fluids",
            "BRAT diet",
            "Rest",
            "Probiotics after recovery",
          ],
          specialist: "General Physician / Gastroenterologist",
        },
        {
          name: "Food Poisoning",
          match: 80,
          severity: "Moderate",
          symptoms: [
            "Sudden vomiting",
            "Severe diarrhea",
            "Stomach cramps",
            "Fever",
            "Weakness",
          ],
          causes: [
            "Contaminated food (Salmonella, E. coli)",
            "Undercooked meat or eggs",
          ],
          prevention: [
            "Cook food thoroughly",
            "Refrigerate perishables",
            "Avoid cross-contamination",
          ],
          homeCare: [
            "Hydrate with ORS",
            "Rest stomach for 2–4 hours",
            "Seek medical help if persistent > 48 hours",
          ],
          specialist: "General Physician",
        },
        {
          name: "Irritable Bowel Syndrome (IBS)",
          match: 55,
          severity: "Mild",
          symptoms: [
            "Recurring stomach cramps",
            "Bloating",
            "Alternating diarrhea and constipation",
            "Gas",
          ],
          causes: [
            "Gut-brain axis dysfunction",
            "Dietary triggers",
            "Stress",
            "Gut microbiome imbalance",
          ],
          prevention: [
            "Identify food triggers",
            "Stress management",
            "Regular meal times",
          ],
          homeCare: [
            "Low-FODMAP diet trial",
            "Peppermint tea",
            "Regular exercise",
            "Stress reduction",
          ],
          specialist: "Gastroenterologist",
        },
      ],
    };
  }

  if (
    (s.includes("fatigue") || s.includes("tired") || s.includes("weakness")) &&
    (s.includes("pale") || s.includes("anemia"))
  ) {
    return {
      extractedSymptoms,
      isEmergency,
      riskLevel: "Moderate Risk",
      healthInsights: [
        "Increase iron-rich foods: red meat, spinach, lentils, tofu.",
        "Pair iron-rich foods with vitamin C (orange juice) for better absorption.",
        "Avoid tea/coffee with meals as they inhibit iron absorption.",
        "Get regular CBC blood tests to monitor hemoglobin levels.",
        "Sleep 8 hours — anemia worsens with sleep deprivation.",
      ],
      diseases: [
        {
          name: "Iron Deficiency Anemia",
          match: 85,
          severity: "Moderate",
          symptoms: [
            "Extreme fatigue",
            "Pale skin",
            "Shortness of breath",
            "Dizziness",
            "Cold hands/feet",
          ],
          causes: [
            "Inadequate iron intake",
            "Heavy menstrual periods",
            "GI blood loss",
            "Poor absorption",
          ],
          prevention: [
            "Iron-rich diet",
            "Vitamin C with iron foods",
            "Regular blood tests",
          ],
          homeCare: [
            "Iron supplements (as prescribed)",
            "Iron-rich diet",
            "Rest and gentle exercise",
          ],
          specialist: "Hematologist / General Physician",
        },
        {
          name: "B12 Deficiency Anemia",
          match: 72,
          severity: "Moderate",
          symptoms: [
            "Fatigue and weakness",
            "Pale or yellowish skin",
            "Nerve tingling",
            "Memory problems",
          ],
          causes: [
            "Vegan/vegetarian diet",
            "Malabsorption",
            "Pernicious anemia",
          ],
          prevention: [
            "B12 supplements",
            "Fortified foods",
            "Regular blood monitoring",
          ],
          homeCare: [
            "B12 supplements or injections",
            "Dietary changes",
            "Consult doctor",
          ],
          specialist: "General Physician / Hematologist",
        },
        {
          name: "Thalassemia",
          match: 45,
          severity: "Severe",
          symptoms: [
            "Chronic fatigue",
            "Pale skin",
            "Slow growth",
            "Bone deformities",
            "Enlarged spleen",
          ],
          causes: [
            "Genetic mutation (inherited)",
            "Reduced hemoglobin production",
          ],
          prevention: ["Genetic counselling", "Prenatal screening"],
          homeCare: [
            "Follow prescribed transfusion schedule",
            "Iron chelation therapy",
            "Regular specialist visits",
          ],
          specialist: "Hematologist",
        },
      ],
    };
  }

  if (
    s.includes("urination") ||
    s.includes("thirst") ||
    s.includes("diabetes") ||
    (s.includes("frequent") && s.includes("toilet"))
  ) {
    return {
      extractedSymptoms,
      isEmergency,
      riskLevel: "High Risk",
      healthInsights: [
        "Monitor your blood sugar levels regularly with a glucometer.",
        "Follow a low glycemic index (low-GI) diet — whole grains, vegetables, legumes.",
        "Exercise 30 minutes daily — even walking improves insulin sensitivity.",
        "Stay hydrated with water, not sugary beverages.",
        "Check feet daily for cuts or sores due to reduced sensation.",
      ],
      diseases: [
        {
          name: "Type 2 Diabetes Mellitus",
          match: 82,
          severity: "Severe",
          symptoms: [
            "Increased thirst",
            "Frequent urination",
            "Fatigue",
            "Blurred vision",
            "Slow wound healing",
          ],
          causes: [
            "Insulin resistance",
            "Obesity",
            "Sedentary lifestyle",
            "Genetic factors",
          ],
          prevention: [
            "Healthy weight management",
            "Regular exercise",
            "Low sugar diet",
            "Regular blood sugar monitoring",
          ],
          homeCare: [
            "Blood glucose monitoring",
            "Low-GI diet",
            "Exercise routine",
            "Take prescribed medication",
          ],
          specialist: "Endocrinologist / Diabetologist",
        },
        {
          name: "Diabetes Insipidus",
          match: 65,
          severity: "Moderate",
          symptoms: [
            "Extreme thirst",
            "Very frequent urination",
            "Dilute/pale urine",
            "Dehydration",
          ],
          causes: ["Deficiency or resistance to vasopressin (ADH)"],
          prevention: ["Medical management", "Regular monitoring"],
          homeCare: [
            "Prescribed desmopressin",
            "Adequate fluid intake",
            "Sodium-restricted diet",
          ],
          specialist: "Endocrinologist / Nephrologist",
        },
        {
          name: "Urinary Tract Infection (UTI)",
          match: 58,
          severity: "Mild",
          symptoms: [
            "Burning urination",
            "Frequent urge to urinate",
            "Cloudy urine",
            "Pelvic pain",
            "Mild fever",
          ],
          causes: ["E. coli bacteria", "Poor hygiene", "Dehydration"],
          prevention: [
            "Drink 8+ glasses of water daily",
            "Urinate after intercourse",
            "Good hygiene practices",
          ],
          homeCare: [
            "Drink plenty of water",
            "Cranberry juice",
            "Complete antibiotic course as prescribed",
          ],
          specialist: "Urologist / General Physician",
        },
      ],
    };
  }

  if (
    s.includes("sad") ||
    s.includes("hopeless") ||
    s.includes("depression") ||
    s.includes("anxiety") ||
    s.includes("mood")
  ) {
    return {
      extractedSymptoms,
      isEmergency,
      riskLevel: "Moderate Risk",
      healthInsights: [
        "Reach out to a trusted friend or family member — connection heals.",
        "Exercise daily: even a 20-minute walk releases mood-boosting endorphins.",
        "Establish a consistent sleep schedule — mental health depends on rest.",
        "Limit social media and news consumption.",
        "Consider speaking with a mental health professional — therapy works.",
      ],
      diseases: [
        {
          name: "Major Depressive Disorder",
          match: 82,
          severity: "Moderate",
          symptoms: [
            "Persistent low mood",
            "Loss of interest",
            "Fatigue",
            "Sleep changes",
            "Difficulty concentrating",
          ],
          causes: [
            "Neurochemical imbalance",
            "Trauma",
            "Chronic stress",
            "Genetic predisposition",
          ],
          prevention: [
            "Social connection",
            "Exercise and sunlight",
            "Stress management",
            "Early intervention",
          ],
          homeCare: [
            "Daily exercise",
            "Social engagement",
            "Consistent sleep schedule",
            "Seek professional help",
          ],
          specialist: "Psychiatrist / Psychologist",
        },
        {
          name: "Generalised Anxiety Disorder",
          match: 75,
          severity: "Moderate",
          symptoms: [
            "Excessive worry",
            "Restlessness",
            "Fatigue",
            "Muscle tension",
            "Difficulty sleeping",
          ],
          causes: [
            "Chronic stress",
            "Neurochemical factors",
            "Trauma",
            "Medical conditions",
          ],
          prevention: [
            "Mindfulness practice",
            "Regular exercise",
            "Limit caffeine",
            "Cognitive behavioural therapy",
          ],
          homeCare: [
            "Breathing exercises (4-7-8 technique)",
            "Journaling",
            "Reduce screen time",
            "Meditation apps",
          ],
          specialist: "Psychiatrist / Psychologist",
        },
        {
          name: "Burnout Syndrome",
          match: 65,
          severity: "Moderate",
          symptoms: [
            "Emotional exhaustion",
            "Cynicism",
            "Reduced performance",
            "Physical fatigue",
            "Detachment",
          ],
          causes: [
            "Work overload",
            "Lack of boundaries",
            "Insufficient recovery time",
          ],
          prevention: [
            "Work-life balance",
            "Regular breaks",
            "Set clear boundaries",
          ],
          homeCare: [
            "Rest and recovery time",
            "Hobbies and social activities",
            "Professional counselling",
          ],
          specialist: "Psychologist / Occupational Health Physician",
        },
      ],
    };
  }

  if (
    s.includes("rash") ||
    s.includes("itching") ||
    s.includes("itch") ||
    s.includes("skin")
  ) {
    return {
      extractedSymptoms,
      isEmergency,
      riskLevel: "Low Risk",
      healthInsights: [
        "Use fragrance-free, hypoallergenic soaps and detergents.",
        "Moisturise skin twice daily with a non-comedogenic lotion.",
        "Identify potential allergens: new foods, fabrics, cosmetics.",
        "Drink adequate water to keep skin hydrated from within.",
        "Avoid scratching — it damages the skin barrier and risks infection.",
      ],
      diseases: [
        {
          name: "Eczema (Atopic Dermatitis)",
          match: 80,
          severity: "Mild",
          symptoms: [
            "Itchy, inflamed skin",
            "Dry patches",
            "Redness",
            "Cracking or scaling",
            "Blisters",
          ],
          causes: [
            "Genetic predisposition",
            "Immune system dysfunction",
            "Environmental triggers",
          ],
          prevention: [
            "Moisturise regularly",
            "Avoid irritants",
            "Use mild soaps",
          ],
          homeCare: [
            "Hydrocortisone cream",
            "Emollient moisturisers",
            "Cool compresses",
            "Antihistamines for itch",
          ],
          specialist: "Dermatologist",
        },
        {
          name: "Contact Dermatitis",
          match: 75,
          severity: "Mild",
          symptoms: [
            "Red, itchy rash",
            "Blisters or bumps",
            "Swelling",
            "Burning sensation",
            "Dry, cracked skin",
          ],
          causes: [
            "Direct contact with allergen or irritant",
            "Nickel, latex, chemicals, plants",
          ],
          prevention: [
            "Identify and avoid contact triggers",
            "Protective gloves",
            "Patch testing",
          ],
          homeCare: [
            "Remove contact substance",
            "Wash affected area",
            "Hydrocortisone cream",
            "Oral antihistamines",
          ],
          specialist: "Dermatologist / Allergist",
        },
        {
          name: "Psoriasis",
          match: 55,
          severity: "Moderate",
          symptoms: [
            "Thick, scaly plaques",
            "Red patches",
            "Silvery scales",
            "Dry cracked skin",
            "Itching or burning",
          ],
          causes: [
            "Immune system overactivity",
            "Genetic factors",
            "Triggers: stress, infection, medications",
          ],
          prevention: [
            "Stress management",
            "Avoid triggers",
            "Skin care routine",
          ],
          homeCare: [
            "Medicated creams",
            "Coal tar preparations",
            "Moisturisers",
            "Light therapy (under supervision)",
          ],
          specialist: "Dermatologist",
        },
      ],
    };
  }

  if (
    s.includes("joint") ||
    s.includes("arthritis") ||
    s.includes("swelling") ||
    s.includes("stiffness")
  ) {
    return {
      extractedSymptoms,
      isEmergency,
      riskLevel: "Moderate Risk",
      healthInsights: [
        "Maintain a healthy weight to reduce pressure on joints.",
        "Exercise low-impact activities: swimming, cycling, walking.",
        "Apply warm compresses in the morning to ease stiffness.",
        "Anti-inflammatory foods: turmeric, ginger, omega-3 fatty acids.",
        "Stay hydrated — cartilage needs water to function properly.",
      ],
      diseases: [
        {
          name: "Rheumatoid Arthritis",
          match: 80,
          severity: "Severe",
          symptoms: [
            "Joint pain & swelling",
            "Morning stiffness > 1 hour",
            "Fatigue",
            "Low-grade fever",
            "Symmetrical joint involvement",
          ],
          causes: [
            "Autoimmune condition",
            "Immune system attacks joint lining",
            "Genetic and environmental factors",
          ],
          prevention: [
            "No definitive prevention",
            "Quit smoking (strong risk factor)",
            "Omega-3 rich diet",
          ],
          homeCare: [
            "Warm/cold compresses",
            "Gentle range-of-motion exercises",
            "Take prescribed DMARDs",
          ],
          specialist: "Rheumatologist",
        },
        {
          name: "Osteoarthritis",
          match: 72,
          severity: "Moderate",
          symptoms: [
            "Joint pain with activity",
            "Stiffness after inactivity",
            "Grating sensation",
            "Swelling",
            "Loss of flexibility",
          ],
          causes: [
            "Cartilage wear and tear",
            "Aging",
            "Obesity",
            "Joint injury",
          ],
          prevention: [
            "Weight management",
            "Low-impact exercise",
            "Protect joints from injury",
          ],
          homeCare: [
            "Physical therapy",
            "Pain relievers",
            "Weight loss",
            "Joint-strengthening exercises",
          ],
          specialist: "Orthopaedic Surgeon / Rheumatologist",
        },
        {
          name: "Gout",
          match: 65,
          severity: "Moderate",
          symptoms: [
            "Sudden severe joint pain (often big toe)",
            "Redness and swelling",
            "Warmth at joint",
            "Limited mobility",
          ],
          causes: [
            "High uric acid levels",
            "Purines from red meat and alcohol",
            "Dehydration",
          ],
          prevention: [
            "Low-purine diet",
            "Limit alcohol",
            "Stay well-hydrated",
          ],
          homeCare: [
            "Ice pack on joint",
            "Elevate affected limb",
            "NSAIDs for acute attack",
            "Avoid trigger foods",
          ],
          specialist: "Rheumatologist / General Physician",
        },
      ],
    };
  }

  if (
    s.includes("throat") ||
    s.includes("runny nose") ||
    s.includes("sneezing") ||
    (s.includes("cold") && !s.includes("cold hands"))
  ) {
    return {
      extractedSymptoms,
      isEmergency,
      riskLevel: "Low Risk",
      healthInsights: [
        "Gargle with warm salt water 3–4 times daily for throat relief.",
        "Drink warm herbal teas with honey and lemon.",
        "Use a saline nasal spray to flush out allergens and pathogens.",
        "Rest your voice and avoid cold drinks.",
        "Boost immunity: vitamin C, zinc, elderberry.",
      ],
      diseases: [
        {
          name: "Common Cold",
          match: 88,
          severity: "Mild",
          symptoms: [
            "Runny nose",
            "Sneezing",
            "Sore throat",
            "Mild cough",
            "Congestion",
          ],
          causes: ["Rhinovirus (200+ strains)", "Droplet transmission"],
          prevention: [
            "Hand hygiene",
            "Avoid touching face",
            "Vitamin C supplements",
          ],
          homeCare: [
            "Rest and warm fluids",
            "Saline nasal spray",
            "Honey and ginger tea",
            "Zinc lozenges",
          ],
          specialist: "General Physician",
        },
        {
          name: "Allergic Rhinitis",
          match: 75,
          severity: "Mild",
          symptoms: [
            "Sneezing fits",
            "Itchy nose and eyes",
            "Runny nose (watery)",
            "Nasal congestion",
            "Post-nasal drip",
          ],
          causes: [
            "Pollen, dust mites, pet dander",
            "Mold spores",
            "IgE-mediated immune response",
          ],
          prevention: [
            "Allergen avoidance",
            "Air purifiers",
            "Anti-allergy covers on bedding",
          ],
          homeCare: [
            "Antihistamines",
            "Nasal corticosteroid sprays",
            "Keep windows closed",
          ],
          specialist: "Allergist / ENT Specialist",
        },
        {
          name: "Strep Throat",
          match: 60,
          severity: "Moderate",
          symptoms: [
            "Severe sore throat",
            "Red swollen tonsils",
            "White patches on tonsils",
            "Fever",
            "Swollen lymph nodes",
          ],
          causes: ["Group A Streptococcus bacteria"],
          prevention: ["Hand hygiene", "Avoid sharing utensils"],
          homeCare: [
            "Complete prescribed antibiotic course",
            "Warm salt gargles",
            "Pain relievers",
            "Rest voice",
          ],
          specialist: "ENT Specialist / General Physician",
        },
      ],
    };
  }

  // Default fallback
  return {
    extractedSymptoms:
      extractedSymptoms.length > 0
        ? extractedSymptoms
        : ["General symptoms reported"],
    isEmergency,
    riskLevel: "Low Risk",
    healthInsights: [
      "Stay well hydrated — drink 8–10 glasses of water daily.",
      "Prioritise 7–9 hours of quality sleep each night.",
      "Exercise at least 150 minutes per week (brisk walking counts).",
      "Eat a balanced diet rich in vegetables, fruits, lean proteins, and whole grains.",
      "Manage stress through mindfulness, deep breathing, or journaling.",
      "Schedule regular health check-ups — prevention is better than cure.",
    ],
    diseases: [
      {
        name: "General Health Assessment",
        match: 70,
        severity: "Mild",
        symptoms: [
          "Non-specific symptoms reported",
          "Further evaluation needed",
          "Monitor symptom progression",
        ],
        causes: [
          "Multiple possible causes",
          "Detailed clinical assessment required",
        ],
        prevention: [
          "Regular health screenings",
          "Healthy lifestyle habits",
          "Adequate sleep and hydration",
        ],
        homeCare: [
          "Rest and observe symptoms",
          "Stay hydrated",
          "Track symptoms over 24–48 hours",
          "Consult a doctor if symptoms worsen",
        ],
        specialist: "General Physician",
      },
    ],
  };
}

// ─── UI Helpers ──────────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<
  Severity,
  { bg: string; text: string; border: string }
> = {
  Mild: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-500/40",
  },
  Moderate: {
    bg: "bg-yellow-500/15",
    text: "text-yellow-400",
    border: "border-yellow-500/40",
  },
  Severe: {
    bg: "bg-orange-500/15",
    text: "text-orange-400",
    border: "border-orange-500/40",
  },
  Critical: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500/40",
  },
};

const RISK_CONFIG: Record<
  RiskLevel,
  { bg: string; text: string; icon: string; borderColor: string }
> = {
  "Low Risk": {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    icon: "✅",
    borderColor: "border-emerald-500/40",
  },
  "Moderate Risk": {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    icon: "⚠️",
    borderColor: "border-yellow-500/40",
  },
  "High Risk": {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    icon: "🔴",
    borderColor: "border-orange-500/40",
  },
  Critical: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    icon: "🚨",
    borderColor: "border-red-500/40",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SymptomCheckerPage() {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<MedixReport | null>(null);

  async function handleAnalyze() {
    if (!symptoms.trim()) return;
    setLoading(true);
    setReport(null);
    await new Promise((res) => setTimeout(res, 1800));
    const result = getMedixAIResponse(symptoms, age, gender, duration);
    setReport(result);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* ── MEDIX AI Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-[var(--glass-border-accent)] bg-[var(--card-bg)] backdrop-blur-xl p-8 text-center"
          style={{ boxShadow: "0 0 60px rgba(249,168,201,0.12)" }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(249,168,201,0.12) 0%, transparent 70%)",
            }}
          />
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-primary/20"
            />
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="relative flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30"
            >
              <Brain className="w-8 h-8 text-primary" />
            </motion.div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold mb-3 tracking-widest uppercase">
            <Zap className="w-3 h-3" />
            AI-Powered Medical Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-2">
            <span className="text-primary">MEDIX</span> AI
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
            World-Class AI Symptom Checker &amp; Disease Intelligence System
          </p>
          <div className="mt-6 flex items-center justify-center gap-1 opacity-30">
            {(["b1", "b2", "b3", "b4", "b5", "b6", "b7"] as const).map(
              (key, i) => (
                <motion.div
                  key={key}
                  animate={{ scaleY: [1, 1.8, 1] }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.15,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="w-1 bg-primary rounded-full"
                  style={{ height: `${8 + i * 3}px` }}
                />
              ),
            )}
          </div>
        </motion.div>

        {/* ── Input Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] backdrop-blur-xl p-6 space-y-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 border border-primary/20">
              <Stethoscope className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-foreground font-bold text-lg">
                Describe Your Symptoms
              </h2>
              <p className="text-muted-foreground text-xs">
                Be as detailed as possible for the most accurate analysis
              </p>
            </div>
          </div>
          <textarea
            data-ocid="symptom.textarea"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe your symptoms in detail... (e.g. fever, headache, body pain, vomiting, skin rash)"
            rows={5}
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-foreground placeholder-[var(--text-muted)] px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="age-input"
                className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium"
              >
                <User className="w-3 h-3" /> Age (optional)
              </label>
              <input
                id="age-input"
                data-ocid="symptom.age_input"
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 28"
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-foreground placeholder-[var(--text-muted)] px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="gender-select"
                className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium"
              >
                <Heart className="w-3 h-3" /> Gender (optional)
              </label>
              <select
                id="gender-select"
                data-ocid="symptom.gender_select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="duration-select"
                className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium"
              >
                <Calendar className="w-3 h-3" /> Duration (optional)
              </label>
              <select
                id="duration-select"
                data-ocid="symptom.duration_select"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all"
              >
                <option value="">Select duration</option>
                <option value="under24h">Less than 24 hours</option>
                <option value="1to3days">1–3 days</option>
                <option value="4to7days">4–7 days</option>
                <option value="moreThanWeek">More than a week</option>
              </select>
            </div>
          </div>
          <motion.button
            data-ocid="symptom.analyze_button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAnalyze}
            disabled={loading || !symptoms.trim()}
            type="button"
            className="w-full py-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-3 bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{
              boxShadow:
                symptoms.trim() && !loading
                  ? "0 0 30px rgba(249,168,201,0.35)"
                  : undefined,
            }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <Brain className="w-5 h-5" />
                </motion.div>
                MEDIX AI is analyzing your symptoms...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze with MEDIX AI
              </>
            )}
          </motion.button>
        </motion.div>

        {/* ── Loading Neural Scan ── */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-2xl border border-primary/30 bg-[var(--card-bg)] backdrop-blur-xl p-8 text-center space-y-5"
            >
              <div className="flex items-center justify-center gap-1 h-10">
                {(
                  [
                    "s1",
                    "s2",
                    "s3",
                    "s4",
                    "s5",
                    "s6",
                    "s7",
                    "s8",
                    "s9",
                  ] as const
                ).map((key, i) => (
                  <motion.div
                    key={key}
                    animate={{ scaleY: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.08,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="w-1.5 bg-primary rounded-full"
                    style={{ height: "32px" }}
                  />
                ))}
              </div>
              <p className="text-primary font-semibold text-base tracking-wide">
                Neural Scanning in Progress...
              </p>
              <p className="text-muted-foreground text-xs">
                MEDIX AI is cross-referencing your symptoms against our
                comprehensive disease intelligence database
              </p>
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                {[
                  "Symptom Analysis",
                  "Disease Matching",
                  "Risk Assessment",
                ].map((step, i) => (
                  <motion.span
                    key={step}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.4 + 0.2 }}
                    className="flex items-center gap-1"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{
                        duration: 1,
                        delay: i * 0.4 + 0.2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                    />
                    {step}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── AI HEALTH ANALYSIS REPORT ── */}
        <AnimatePresence>
          {report && !loading && (
            <motion.div
              key="report"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Report header */}
              <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="rounded-2xl border border-primary/30 bg-[var(--card-bg)] backdrop-blur-xl p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-foreground font-black text-xl">
                      AI HEALTH ANALYSIS REPORT
                    </h2>
                    <p className="text-muted-foreground text-xs">
                      Generated by MEDIX AI —{" "}
                      {new Date().toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 1. USER SYMPTOMS */}
              <motion.div
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] backdrop-blur-xl p-5"
              >
                <SectionHeader icon="🩺" title="USER SYMPTOMS" />
                <div className="flex flex-wrap gap-2 mt-3">
                  {report.extractedSymptoms.map((sym) => (
                    <span
                      key={sym}
                      className="px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold"
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* EMERGENCY WARNING */}
              {report.isEmergency && (
                <motion.div
                  custom={1.5}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="relative overflow-hidden rounded-2xl border-2 border-red-500/60 backdrop-blur-xl p-5"
                  style={{ background: "rgba(239,68,68,0.05)" }}
                >
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="absolute inset-0 rounded-2xl border-2 border-red-500/40 pointer-events-none"
                  />
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex-shrink-0 mt-0.5">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-red-400 font-black text-base tracking-wide mb-1">
                        🚨 EMERGENCY WARNING
                      </p>
                      <p className="text-red-300 text-sm font-medium leading-relaxed">
                        Your symptoms may indicate a medical emergency. Seek
                        immediate medical attention or contact emergency
                        services immediately.
                      </p>
                      <p className="text-red-400/70 text-xs mt-2 font-semibold">
                        Call 112 / 999 / 911 immediately — do not delay.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 2. POSSIBLE DISEASES */}
              <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] backdrop-blur-xl p-5 space-y-4"
              >
                <SectionHeader icon="🔍" title="POSSIBLE DISEASES" />
                <div className="space-y-4">
                  {report.diseases.map((disease, idx) => (
                    <DiseaseCard
                      key={disease.name}
                      disease={disease}
                      index={idx}
                    />
                  ))}
                </div>
              </motion.div>

              {/* 3. HEALTH RISK LEVEL */}
              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className={`rounded-2xl border ${RISK_CONFIG[report.riskLevel].borderColor} ${RISK_CONFIG[report.riskLevel].bg} backdrop-blur-xl p-5`}
              >
                <SectionHeader icon="📊" title="HEALTH RISK LEVEL" />
                <div className="mt-3 flex items-center gap-4">
                  <span className="text-4xl">
                    {RISK_CONFIG[report.riskLevel].icon}
                  </span>
                  <div>
                    <p
                      className={`text-2xl font-black ${RISK_CONFIG[report.riskLevel].text}`}
                    >
                      {report.riskLevel}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {report.riskLevel === "Low Risk" &&
                        "Symptoms are non-urgent. Monitor and follow home care guidelines."}
                      {report.riskLevel === "Moderate Risk" &&
                        "Medical consultation is recommended within 24–48 hours."}
                      {report.riskLevel === "High Risk" &&
                        "Please consult a doctor as soon as possible today."}
                      {report.riskLevel === "Critical" &&
                        "Seek emergency medical care immediately. This is urgent."}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 4. AI HEALTH INSIGHTS */}
              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] backdrop-blur-xl p-5"
              >
                <SectionHeader icon="🧠" title="AI HEALTH INSIGHTS" />
                <ul className="mt-3 space-y-2">
                  {report.healthInsights.map((tip, i) => (
                    <motion.li
                      key={`insight-${tip.slice(0, 20)}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.07 }}
                      className="flex items-start gap-2.5 text-sm text-foreground"
                    >
                      <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {tip}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* 5. MEDICAL DISCLAIMER */}
              <motion.div
                custom={5}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] backdrop-blur-xl p-5"
              >
                <SectionHeader icon="💊" title="MEDICAL DISCLAIMER" />
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  This AI system provides informational health guidance only and
                  is not a replacement for professional medical diagnosis,
                  treatment, or emergency care. Always consult a qualified
                  healthcare professional.
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                custom={6}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row gap-3"
              >
                <motion.button
                  data-ocid="symptom.consult_doctor_button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate({ to: "/doctors" })}
                  type="button"
                  className="flex-1 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-primary text-primary-foreground"
                  style={{ boxShadow: "0 0 24px rgba(249,168,201,0.3)" }}
                >
                  <Stethoscope className="w-4 h-4" />
                  Consult a Doctor
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  data-ocid="symptom.new_analysis_button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setReport(null);
                    setSymptoms("");
                    setAge("");
                    setGender("");
                    setDuration("");
                  }}
                  type="button"
                  className="flex-1 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-[var(--border-subtle)] bg-[var(--card-bg)] text-foreground hover:border-primary/40 transition-all"
                >
                  <Brain className="w-4 h-4 text-primary" />
                  New Analysis
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-lg">{icon}</span>
      <h3 className="text-foreground font-bold text-sm tracking-wider uppercase">
        {title}
      </h3>
      <div className="flex-1 h-px bg-[var(--border-subtle)]" />
    </div>
  );
}

function DiseaseCard({ disease, index }: { disease: Disease; index: number }) {
  const sev = SEVERITY_CONFIG[disease.severity];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.12, duration: 0.45 }}
      className={`rounded-xl border ${sev.border} bg-[var(--bg-secondary)] p-4 space-y-4`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-primary flex-shrink-0" />
          <h4 className="text-foreground font-bold text-base">
            {disease.name}
          </h4>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold border ${sev.bg} ${sev.text} ${sev.border} flex-shrink-0`}
        >
          {disease.severity}
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Match Confidence</span>
          <span className="text-primary font-bold">✅ {disease.match}%</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--border-subtle)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${disease.match}%` }}
            transition={{
              duration: 0.9,
              delay: 0.4 + index * 0.12,
              ease: "easeOut",
            }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #f9a8d4, #c084fc)" }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <InfoBlock icon="📌" label="Main Symptoms" items={disease.symptoms} />
        <InfoBlock icon="⚠️" label="Possible Causes" items={disease.causes} />
        <InfoBlock icon="🛡️" label="Prevention" items={disease.prevention} />
        <InfoBlock icon="🏠" label="Basic Home Care" items={disease.homeCare} />
      </div>

      {/* Medicines Section */}
      <MedicinesSection diseaseName={disease.name} />

      <div className="flex items-center gap-2 pt-1 border-t border-[var(--border-subtle)]">
        <Stethoscope className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <span className="text-muted-foreground text-xs">
          Recommended Specialist:
        </span>
        <span className="text-primary text-xs font-semibold">
          {disease.specialist}
        </span>
      </div>
    </motion.div>
  );
}

function MedicinesSection({ diseaseName }: { diseaseName: string }) {
  const meds =
    MEDICINES_DB[diseaseName] ||
    MEDICINES_DB[diseaseName.replace(/\s+/g, " ")] ||
    [];
  const hasMeds = meds.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-2">
        <Pill
          className="w-3.5 h-3.5 flex-shrink-0"
          style={{ color: "#F9A8D4" }}
        />
        <span className="font-semibold text-xs" style={{ color: "#F9A8D4" }}>
          Recommended Tablets / Medicines
        </span>
      </div>

      {hasMeds ? (
        <>
          <div className="grid grid-cols-1 gap-2">
            {meds.map((med) => (
              <div
                key={med.name}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-2.5 space-y-0.5"
              >
                <p className="text-foreground font-semibold text-xs">
                  {med.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  Dosage:{" "}
                  <span className="text-foreground/80">{med.dosage}</span>
                </p>
                <p className="text-muted-foreground text-xs">
                  Timing:{" "}
                  <span className="text-foreground/80">{med.timing}</span>
                </p>
                {med.note && (
                  <p className="text-muted-foreground text-[11px] italic">
                    Note: {med.note}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="rounded-lg p-3 bg-amber-900/30 dark:bg-amber-900/30 bg-amber-50 light:bg-amber-50">
            <p className="text-amber-300 dark:text-amber-300 text-amber-700 light:text-amber-700 text-xs font-medium">
              ⚠ Always take medicines only under a qualified doctor
              prescription. Self-medication can be dangerous.
            </p>
          </div>
        </>
      ) : (
        <p className="text-gray-400 italic text-xs">
          Consult your doctor for appropriate medication for this condition.
        </p>
      )}
    </motion.div>
  );
}

function InfoBlock({
  icon,
  label,
  items,
}: { icon: string; label: string; items: string[] }) {
  return (
    <div className="space-y-1.5">
      <p className="text-muted-foreground font-semibold flex items-center gap-1">
        <span>{icon}</span> {label}:
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li
            key={item}
            className="text-foreground/80 flex items-start gap-1.5"
          >
            <span className="text-primary mt-0.5 flex-shrink-0">&bull;</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
