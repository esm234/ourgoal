import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calculator,
  School,
  BookOpen,
  Search,
  ArrowRight,
  BarChart4,
  GraduationCap,
  Briefcase,
  Check,
  Target,
  TrendingUp,
  Award,
  Users,
  Zap,
  Brain,
  Star,
  Filter,
  RefreshCw,
  ChevronDown,
  Info
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

// Add CSS to hide number input spinners
const hideSpinnerStyle = `
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
`;

function calculateFinalEquivalencyScore(highSchoolPercentage: number, qiyasScore: number): number {
  const average = (highSchoolPercentage + qiyasScore) / 2;
  const finalScore = average * 4.1;
  return Math.round(finalScore * 100) / 100; // rounded to 2 decimal places
}

// Complete colleges data
const collegesMale = [
  { name: "طب القاهرة", minScore: 410.000000 },
  { name: "طب أسنان القاهرة", minScore: 410.000000 },
  { name: "طب الإسكندرية", minScore: 410.000000 },
  { name: "طب أسنان الإسكندرية", minScore: 410.000000 },
  { name: "طب عين شمس", minScore: 410.000000 },
  { name: "طب أسنان عين شمس", minScore: 410.000000 },
  { name: "طب سوهاج", minScore: 410.000000 },
  { name: "طب الفيوم", minScore: 410.000000 },
  { name: "طب أسيوط", minScore: 410.000000 },
  { name: "طب طنطا", minScore: 410.000000 },
  { name: "طب أسنان طنطا", minScore: 410.000000 },
  { name: "طب المنصورة", minScore: 410.000000 },
  { name: "طب أسنان المنصورة", minScore: 410.000000 },
  { name: "طب الزقازيق", minScore: 410.000000 },
  { name: "طب المنوفية بشبين الكوم", minScore: 410.000000 },
  { name: "طب بنها", minScore: 410.000000 },
  { name: "طب بني سويف", minScore: 410.000000 },
  { name: "طب المنيا", minScore: 410.000000 },
  { name: "طب أسنان السويس", minScore: 410.000000 },
  { name: "طب فاقوس", minScore: 410.000000 },
  { name: "طب أسنان المنوفية", minScore: 410.000000 },
  { name: "طب دمياط", minScore: 410.000000 },
  { name: "طب الاقصر", minScore: 410.000000 },
  { name: "طب كفر الشيخ", minScore: 410.000000 },
  { name: "طب حلوان", minScore: 409.975882 },
  { name: "طب قناة السويس بالإسماعيلية", minScore: 409.975882 },
  { name: "طب بورسعيد", minScore: 409.975882 },
  { name: "طب السويس", minScore: 409.951765 },
  { name: "طب الوادي الجديد", minScore: 409.927647 },
  { name: "طب جنوب الوادي", minScore: 409.927647 },
  { name: "طب العريش", minScore: 409.886111 },
  { name: "طب أسوان", minScore: 409.884771 },
  { name: "طب أسنان الزقازيق", minScore: 409.879412 },
  { name: "طب أسنان قناة السويس بالإسماعيلية", minScore: 409.871875 },
  { name: "طب أسنان الفيوم", minScore: 409.863333 },
  { name: "طب أسنان كفر الشيخ", minScore: 409.833856 },
  { name: "طب أسنان بني سويف", minScore: 409.807059 },
  { name: "طب أسنان أسيوط", minScore: 409.790980 },
  { name: "طب أسنان المنيا", minScore: 409.766863 },
  { name: "طب أسنان جنوب الوادي", minScore: 409.758824 },
  { name: "علاج طبيعي القاهرة", minScore: 409.651215 },
  { name: "علاج طبيعي كفر الشيخ", minScore: 409.631871 },
  { name: "صيدلة القاهرة", minScore: 409.468072 },
  { name: "علاج طبيعي بورسعيد", minScore: 409.452328 },
  { name: "علاج طبيعي بنها", minScore: 409.359375 },
  { name: "علاج طبيعي السويس", minScore: 409.281830 },
  { name: "علاج طبيعي قناة السويس", minScore: 409.276471 },
  { name: "علاج طبيعي بني سويف", minScore: 408.546242 },
  { name: "صيدلة و تصنيع دوائي كفر الشيخ", minScore: 407.950000 },
  { name: "كلية الهندسة جامعة دمنهور", minScore: 407.950000 },
  { name: "حاسبات و ذكاء إصطناعي القاهرة رياضة", minScore: 407.950000 },
  { name: "صيدلة المنصورة", minScore: 407.950000 },
  { name: "هندسة المنصورة", minScore: 407.950000 },
  { name: "صيدلة الزقازيق", minScore: 407.950000 },
  { name: "صيدلة المنوفية", minScore: 407.950000 },
  { name: "صيدلة عين شمس", minScore: 407.950000 },
  { name: "صيدلة طنطا", minScore: 407.950000 },
  { name: "صيدلة أسيوط", minScore: 407.950000 },
  { name: "صيدلة جنوب الوادي", minScore: 407.950000 },
  { name: "صيدلة المنيا", minScore: 407.950000 },
  { name: "صيدلة حلوان", minScore: 407.950000 },
  { name: "هندسة بترول وتعدين السويس", minScore: 407.950000 },
  { name: "صيدلة بني سويف", minScore: 407.950000 },
  { name: "صيدلة قناة السويس بالإسماعيلية", minScore: 407.950000 },
  { name: "هندسة القاهرة", minScore: 407.950000 },
  { name: "صيدلة الإسكندرية", minScore: 407.950000 },
  { name: "هندسة الإسكندرية", minScore: 407.950000 },
  { name: "صيدلة الفيوم", minScore: 407.950000 },
  { name: "صيدلة دمنهور", minScore: 407.950000 },
  { name: "علاج طبيعي جنوب الوادي", minScore: 407.950000 },
  { name: "صيدلة بورسعيد", minScore: 407.925882 },
  { name: "صيدلة مدينة السادات", minScore: 407.925882 },
  { name: "هندسة الزقازيق", minScore: 407.880327 },
  { name: "صيدلة ج الوادي الجديد", minScore: 407.877647 },
  { name: "صيدلة سوهاج", minScore: 407.829412 },
  { name: "هندسة عين شمس", minScore: 407.805294 },
  { name: "هندسة إلكترونية المنوفية بمنوف", minScore: 407.777827 },
  { name: "هندسة بني سويف", minScore: 407.684706 },
  { name: "هندسة كفر الشيخ", minScore: 407.507843 },
  { name: "هندسة بنها بشبرا", minScore: 407.440850 },
  { name: "حاسبات و علوم البيانات الإسكندرية رياضة", minScore: 407.225131 },
  { name: "هندسة طنطا", minScore: 406.882292 },
  { name: "هندسة الطاقة أسوان", minScore: 406.687843 },
  { name: "هندسة بنها", minScore: 405.900000 },
  { name: "هندسة دمياط", minScore: 405.900000 },
  { name: "هندسة حلوان بالمطرية", minScore: 405.900000 },
  { name: "هندسة حلوان", minScore: 405.900000 },
  { name: "هندسة المنوفية بشبين الكوم", minScore: 405.900000 },
  { name: "هندسة المنيا", minScore: 405.900000 },
  { name: "هندسة بور سعيد", minScore: 405.900000 },
  { name: "هندسة أسيوط", minScore: 405.900000 },
  { name: "حاسبات ومعلومات عين شمس رياضة", minScore: 405.900000 },
  { name: "حاسبات ومعلومات المنصورة رياضة", minScore: 405.900000 },
  { name: "طب بيطري عين شمس", minScore: 405.900000 },
  { name: "طب بيطري القاهرة", minScore: 405.900000 },
  { name: "هندسة الفيوم", minScore: 405.854444 },
  { name: "حاسبات و ذكاء إصطناعي حلوان رياضة", minScore: 405.827647 },
  { name: "هندسة قناة السويس بالإسماعيلية", minScore: 405.803529 },
  { name: "هندسة السويس", minScore: 405.729167 },
  { name: "هندسة جنوب الوادي", minScore: 405.682271 },
  { name: "هندسة أسوان", minScore: 405.586471 },
  { name: "هندسة سوهاج", minScore: 404.262010 },
  { name: "تخطيط عمراني القاهرة", minScore: 403.850000 },
  { name: "علوم البترول والتعدين مطروح", minScore: 403.850000 },
  { name: "حاسبات ومعلومات الزقازيق رياضة", minScore: 403.850000 },
  { name: "حاسبات ومعلومات المنوفية بشبين الكوم رياضة", minScore: 403.850000 },
  { name: "طب بيطري المنيا", minScore: 403.850000 },
  { name: "حاسبات ومعلومات دمياط رياضة", minScore: 403.850000 },
  { name: "حاسبات ومعلومات دمنهور بالنوبارية رياضة", minScore: 403.850000 },
  { name: "الذكاء الاصطناعى كفر الشيخ رياضة", minScore: 403.850000 },
  { name: "حاسبات ومعلومات طنطا رياضة", minScore: 403.850000 },
  { name: "طب بيطري المنوفية", minScore: 403.168676 },
  { name: "المعهد التكنولوجي العالي بالسادس من أكتوبر", minScore: 401.800000 },
  { name: "ذكاء إصطناعي المنوفية شبين الكوم رياضة", minScore: 401.800000 },
  { name: "علوم البترول والتعدين مطروح - علوم", minScore: 401.800000 },
  { name: "حاسبات و ذكاء إصطناعي بنها رياضة", minScore: 401.800000 },
  { name: "حاسبات ومعلومات كفر الشيخ رياضة", minScore: 401.800000 },
  { name: "طب بيطري الإسكندرية", minScore: 401.800000 },
  { name: "حاسبات ومعلومات الفيوم رياضة", minScore: 401.488815 },
  { name: "المعهد العالى للهندسة والتكنولوجيا الحديثة بالمرج", minScore: 401.380286 },
  { name: "ألسن كفر الشيخ", minScore: 401.087190 },
  { name: "معهد الإسكندرية العالي للتكنولوجيا بسموحة بمصروفات", minScore: 401.079820 },
  { name: "حاسبات ومعلومات المنيا رياضة", minScore: 401.078145 },
  { name: "حاسبات وذكاء اصطناعي السادات رياضة", minScore: 399.750000 },
  { name: "حاسبات ومعلومات السويس رياضة", minScore: 399.750000 },
  { name: "معهد عالي هندسة وتكنولوجيا المنيا الجديدة", minScore: 399.750000 },
  { name: "حاسبات ومعلومات قناة السويس بالإسماعيلية رياضة", minScore: 399.750000 },
  { name: "المعهد الكندى العالى للهندسة 6 اكتوبر", minScore: 399.750000 },
  { name: "حاسبات ومعلومات بني سويف رياضة", minScore: 399.750000 },
  { name: "حاسبات و ذكاء إصطناعي جنوب الوادي فرع الغردقة رياضة", minScore: 399.750000 },
  { name: "حاسبات ومعلومات العريش رياضة", minScore: 399.307843 },
  { name: "الملاحة وتكنولوجيا الفضاء بني سويف", minScore: 399.015082 },
  { name: "حاسبات وذكاء اصطناعي مطروح رياضة", minScore: 397.700000 },
  { name: "طب بيطري بنها", minScore: 397.700000 },
  { name: "حاسبات ومعلومات أسيوط رياضة", minScore: 397.181806 },
  { name: "إعلام القاهرة", minScore: 396.944649 },
  { name: "العلوم الصحية التطبيقية المنوفية", minScore: 396.530294 },
  { name: "حاسبات ومعلومات الأقصر رياضة", minScore: 396.269271 },
  { name: "حاسبات ومعلومات سوهاج رياضة", minScore: 395.650000 },
  { name: "حاسبات ومعلومات قنا رياضة", minScore: 393.927263 },
  { name: "معهد عالي هندسه 6 اكتوبر بمصروفات", minScore: 393.600000 },
  { name: "طب بيطري الزقازيق", minScore: 393.600000 },
  { name: "اقتصاد وعلوم سياسية القاهرة", minScore: 393.479077 },
  { name: "الأكاديمية الدولية لعلوم الإعلام (شعبة هندسة )6اكتوبر", minScore: 393.254314 },
  { name: "طب بيطري المنصورة", minScore: 391.804575 },
  { name: "الدراسات الاقتصادية والعلوم السياسية الإسكندرية", minScore: 391.550000 },
  { name: "طب بيطري كفر الشيخ", minScore: 391.550000 },
  { name: "كلية تكنولوجيا الصناعة و الطاقة بالقاهرة جامعة مصر الدولية التكنولوجية", minScore: 391.550000 },
  { name: "طب بيطري أسوان", minScore: 387.450000 },
  { name: "طب بيطري أسيوط", minScore: 387.450000 },
  { name: "معهد تكنولوجي عالي العاشر من رمضان شعبة (هندسة) بمصروفات", minScore: 387.358889 },
  { name: "الاكاديمية المصرية للهندسة والتكنولوجيا المتقدمة وزارة الانتاج الحربى", minScore: 387.262418 },
  { name: "أكاديمية أخبار اليوم شعبة هندسية 6 أكتوبر", minScore: 385.400000 },
  { name: "سياسة واقتصاد السويس", minScore: 385.400000 },
  { name: "طب بيطري قناة السويس بالإسماعيلية", minScore: 385.400000 },
  { name: "معهد المنصورة العالى للهندسة والتكنولوجيا", minScore: 385.400000 },
  { name: "إعلام عين شمس", minScore: 385.400000 },
  { name: "طب بيطري دمنهور", minScore: 384.029984 },
  { name: "العالي للهندسة والتكنولوجيا التجمع الخامس", minScore: 383.350000 },
  { name: "طب بيطري العريش", minScore: 383.350000 },
  { name: "طب بيطري مدينة السادات", minScore: 381.300000 },
  { name: "الاهرامات العالي للهندسة والتكنولوجيا -6 اكتوبر", minScore: 380.345343 },
  { name: "طب بيطري الوادي الجديد", minScore: 380.335294 },
  { name: "ألسن قناة السويس بالإسماعيلية", minScore: 379.250000 },
  { name: "معهد هندسة وتكنولوجيا الطيران إمبابة جيزة بمصروفات", minScore: 379.058399 },
  { name: "معهد العبور العالي للهندسه والتكنولوجيا بمصروفات", minScore: 379.032941 },
  { name: "طب بيطري جنوب الوادي", minScore: 377.410694 },
  { name: "العلوم الصحية التطبيقية بني سويف", minScore: 377.200000 },
  { name: "معهد المستقبل العالى للهندسة والتكنولوجيا بالفيوم", minScore: 375.190196 },
  { name: "طب بيطري سوهاج", minScore: 375.150000 },
  { name: "ألسن عين شمس", minScore: 374.427141 },
  { name: "المعهد العالى للهندسه والتكنولوجيا بالمنزلة", minScore: 373.678824 },
  { name: "طب بيطري بني سويف", minScore: 373.384722 },
  { name: "كلية تكنولوجيا الصناعة والطاقة 6 أكتوبر التكنولوجية", minScore: 371.050000 },
  { name: "تمريض المنصورة", minScore: 371.050000 },
  { name: "تمريض القاهرة", minScore: 371.050000 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بدمياط الجديدة", minScore: 371.050000 },
  { name: "طب بيطري مطروح", minScore: 369.000000 },
  { name: "المصرية الصينية للتكنولوجيا قناة السويس بالإسماعيلية", minScore: 368.083529 },
  { name: "المعهد العالى للهندسة والتكنولوجيا بطنطا", minScore: 367.351291 },
  { name: "ألسن الفيوم", minScore: 367.066234 },
  { name: "معهد عالي هندسه مدينه الشروق بمصروفات", minScore: 362.850000 },
  { name: "معهد أكتوبر العالي للهندسه والتكنولوجيا م 6 اكتوبر بمصروفات", minScore: 361.974479 },
  { name: "حقوق المنيا", minScore: 360.800000 },
  { name: "كلية تكنولوجيا العلوم الصحية 6 أكتوبر التكنولوجية", minScore: 360.800000 },
  { name: "تمريض حلوان", minScore: 360.800000 },
  { name: "تمريض دمياط", minScore: 359.504514 },
  { name: "مصر العالي هندسة وتكنولوجيا منصورة", minScore: 358.845801 },
  { name: "أكاديمية أخبار اليوم 6اكتوبر شعبة علوم حاسب", minScore: 358.219412 },
  { name: "معهد طيبة العالي للهندسه بالمعادى بمصروفات", minScore: 356.700000 },
  { name: "تجارة انتساب موجه الزقازيق", minScore: 356.700000 },
  { name: "تمريض بور سعيد", minScore: 356.700000 },
  { name: "تكنولوجيا الإدارة ونظم المعلومات بورسعيد", minScore: 356.495000 },
  { name: "عالي إدارة وتكنولوجيا ش علوم حاسب كفر الشيخ", minScore: 354.650000 },
  { name: "كلية تكنولوجيا الصناعة والطاقة 6 أكتوبر التكنولوجية علوم", minScore: 352.600000 },
  { name: "معهد عالي هندسة وتكنولوجيا العريش", minScore: 352.429167 },
  { name: "التكنولوجيا والتعليم الصناعي حلوان", minScore: 352.343750 },
  { name: "كلية تكنولوجيا الصناعة والطاقة ج القاهرة الجديدة التكنولوجية", minScore: 350.550000 },
  { name: "معهد عالي كندي تكنولوجيا هندسة ت.خامس", minScore: 350.550000 },
  { name: "المعهد العالى للهندسة والتكنولوجيا ببرج العرب بالاسكندرية", minScore: 350.379167 },
  { name: "المعهد العالى للهندسة والتكنولوجيا بالزقازيق", minScore: 349.852431 },
  { name: "معهد الدلتا العالي للهندسة والتكنولوجيا بالمنصورة", minScore: 348.638007 },
  { name: "كلية تكنولوجيا العلوم الصحية برج العرب التكنولوجية", minScore: 348.500000 },
  { name: "تجارة انتساب موجه قناة السويس بالإسماعيلية", minScore: 348.500000 },
  { name: "المعهد الكندي العالي للحاسب الآلي بالتجمع الخامس القاهرة الجديدة", minScore: 348.042770 },
  { name: "المعهد العالى للهندسة والتكنولوجيا بالمحلة الكبرى", minScore: 346.450000 },
  { name: "تمريض عين شمس", minScore: 344.400000 },
  { name: "تجارة انتساب موجه الإسكندرية", minScore: 344.400000 },
  { name: "ألسن بني سويف", minScore: 344.400000 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بالبحيرة", minScore: 344.400000 },
  { name: "علوم القاهرة", minScore: 339.058611 },
  { name: "المعهد العالي للهندسة بمدينة 15 مايو", minScore: 338.250000 },
  { name: "معهد المستقبل العالى للهندسة والتكنولوجيا بالمنصورة", minScore: 338.250000 },
  { name: "المعهد العالى للهندسة والتكنولوجيا بالمنوفية", minScore: 338.250000 },
  { name: "معهد المدينة العالي للهندسة والتكنولوجيا طريق سقارة الهرم", minScore: 338.032606 },
  { name: "تمريض طنطا", minScore: 336.832083 },
  { name: "القاهرة العالي ش هندسية بالتجمع الاول القاهرة الجديدة", minScore: 335.875752 },
  { name: "تجارة انتساب موجه القاهرة", minScore: 331.955294 },
  { name: "تمريض الإسكندرية", minScore: 325.950000 },
  { name: "تجارة انتساب موجه المنصورة", minScore: 324.768235 },
  { name: "معهد راية العالي للإدارة والتجارة الخارجية شعبة نظم معلومات", minScore: 324.339477 },
  { name: "تمريض المنوفية بشبين الكوم", minScore: 318.793758 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بكنج مريوط", minScore: 316.251356 },
  { name: "المعهد الكندي العالي للحاسب الآلي بالتجمع الخامس", minScore: 315.508734 },
  { name: "معهد النيل العالي للهندسة والتكنولوجيا بالمنصورة", minScore: 315.261863 },
  { name: "معهد عالي هندسة وتكنولوجيا كفر الشيخ", minScore: 314.855547 },
  { name: "معهد عالي تكنولوجيا 10 رمضان شعبة علوم الحاسب بمصروفات", minScore: 312.197723 },
  { name: "الفراعنة العالي إدارة أعمال", minScore: 311.449935 },
  { name: "معهد الوادي العالي للهندسة والتكنولوجيا قليوبية", minScore: 309.485351 },
  { name: "معهد الإسكندرية العالي للإعلام بسموحة", minScore: 303.405359 },
  { name: "المجمع التكنولوجي المتكامل بالسلام", minScore: 300.710205 },
  { name: "تجارة القاهرة", minScore: 299.602475 },
  { name: "ع. هندسة وتكنولوجيا العبور ك21 طريق بلبيس الصحراوي", minScore: 298.275000 },
  { name: "حقوق انتساب موجه القاهرة", minScore: 295.888693 },
  { name: "المعهد العالي للهندسة ببلبيس", minScore: 288.921708 },
  { name: "تجارة انتساب موجه دمياط", minScore: 288.025000 },
  { name: "المعهد التكنولوجي العالي ببني سويف", minScore: 286.098938 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بالطود الأقصر", minScore: 283.336462 },
  { name: "تجارة انتساب موجه كفر الشيخ", minScore: 275.672075 },
  { name: "أداب انتساب موجه المنصورة", minScore: 267.483185 }
];

const collegesFemale = [
  { name: "طب القاهرة", minScore: 410.000000 },
  { name: "طب أسنان القاهرة", minScore: 410.000000 },
  { name: "طب الإسكندرية", minScore: 410.000000 },
  { name: "طب أسنان الإسكندرية", minScore: 410.000000 },
  { name: "صيدلة الإسكندرية", minScore: 410.000000 },
  { name: "طب عين شمس", minScore: 410.000000 },
  { name: "طب أسنان عين شمس", minScore: 410.000000 },
  { name: "طب سوهاج", minScore: 410.000000 },
  { name: "طب الفيوم", minScore: 410.000000 },
  { name: "طب أسنان جنوب الوادي", minScore: 410.000000 },
  { name: "طب أسيوط", minScore: 410.000000 },
  { name: "طب طنطا", minScore: 410.000000 },
  { name: "طب أسنان طنطا", minScore: 410.000000 },
  { name: "طب المنصورة", minScore: 410.000000 },
  { name: "طب أسنان المنصورة", minScore: 410.000000 },
  { name: "طب الزقازيق", minScore: 410.000000 },
  { name: "طب أسنان قناة السويس بالإسماعيلية", minScore: 410.000000 },
  { name: "طب قناة السويس بالإسماعيلية", minScore: 410.000000 },
  { name: "طب المنوفية بشبين الكوم", minScore: 410.000000 },
  { name: "طب بنها", minScore: 410.000000 },
  { name: "طب بني سويف", minScore: 410.000000 },
  { name: "طب المنيا", minScore: 410.000000 },
  { name: "طب أسنان المنيا", minScore: 410.000000 },
  { name: "إعلام المنوفية", minScore: 410.000000 },
  { name: "طب فاقوس", minScore: 410.000000 },
  { name: "طب دمياط", minScore: 410.000000 },
  { name: "طب جنوب الوادي", minScore: 410.000000 },
  { name: "طب كفر الشيخ", minScore: 410.000000 },
  { name: "طب أسنان المنوفية", minScore: 409.975882 },
  { name: "صيدلة المنيا", minScore: 409.975882 },
  { name: "طب حلوان", minScore: 409.975882 },
  { name: "طب أسنان كفر الشيخ", minScore: 409.975882 },
  { name: "طب بورسعيد", minScore: 409.975882 },
  { name: "طب السويس", minScore: 409.954444 },
  { name: "علاج طبيعي القاهرة", minScore: 409.951765 },
  { name: "طب العريش", minScore: 409.951765 },
  { name: "طب الاقصر", minScore: 409.951765 },
  { name: "طب أسوان", minScore: 409.948761 },
  { name: "طب الوادي الجديد", minScore: 409.948750 },
  { name: "طب أسنان الفيوم", minScore: 409.930327 },
  { name: "طب أسنان الزقازيق", minScore: 409.930327 },
  { name: "طب أسنان السويس", minScore: 409.927647 },
  { name: "طب أسنان أسيوط", minScore: 409.927647 },
  { name: "طب أسنان بني سويف", minScore: 409.908889 },
  { name: "علاج طبيعي قناة السويس", minScore: 409.906209 },
  { name: "علاج طبيعي بنها", minScore: 409.906209 },
  { name: "صيدلة دمنهور", minScore: 409.906209 },
  { name: "علاج طبيعي السويس", minScore: 409.903529 },
  { name: "صيدلة المنصورة", minScore: 409.903194 },
  { name: "صيدلة طنطا", minScore: 409.900515 },
  { name: "صيدلة القاهرة", minScore: 409.897500 },
  { name: "علاج طبيعي بني سويف", minScore: 409.882092 },
  { name: "علاج طبيعي كفر الشيخ", minScore: 409.882092 },
  { name: "علاج طبيعي بورسعيد", minScore: 409.879412 },
  { name: "صيدلة حلوان", minScore: 409.879412 },
  { name: "صيدلة عين شمس", minScore: 409.876397 },
  { name: "علاج طبيعي جنوب الوادي", minScore: 409.836536 },
  { name: "صيدلة و تصنيع دوائي كفر الشيخ", minScore: 409.829167 },
  { name: "صيدلة الزقازيق", minScore: 409.807059 },
  { name: "صيدلة قناة السويس بالإسماعيلية", minScore: 409.782941 },
  { name: "صيدلة المنوفية", minScore: 409.782941 },
  { name: "صيدلة بورسعيد", minScore: 409.758824 },
  { name: "صيدلة الفيوم", minScore: 409.728676 },
  { name: "صيدلة أسيوط", minScore: 409.721307 },
  { name: "صيدلة مدينة السادات", minScore: 409.673072 },
  { name: "صيدلة بني سويف", minScore: 409.658333 },
  { name: "صيدلة سوهاج", minScore: 409.571242 },
  { name: "صيدلة جنوب الوادي", minScore: 409.570572 },
  { name: "صيدلة ج الوادي الجديد", minScore: 409.541765 },
  { name: "كلية الهندسة جامعة دمنهور", minScore: 407.950000 },
  { name: "هندسة الطاقة أسوان", minScore: 407.950000 },
  { name: "هندسة جنوب الوادي", minScore: 407.950000 },
  { name: "هندسة المنيا", minScore: 407.950000 },
  { name: "هندسة بترول وتعدين السويس", minScore: 407.950000 },
  { name: "هندسة أسيوط", minScore: 407.950000 },
  { name: "هندسة الإسكندرية", minScore: 407.950000 },
  { name: "طب بيطري الإسكندرية", minScore: 407.950000 },
  { name: "هندسة عين شمس", minScore: 407.950000 },
  { name: "هندسة إلكترونية المنوفية بمنوف", minScore: 407.950000 },
  { name: "هندسة القاهرة", minScore: 407.950000 },
  { name: "طب بيطري القاهرة", minScore: 407.950000 },
  { name: "هندسة كفر الشيخ", minScore: 407.950000 },
  { name: "هندسة دمياط", minScore: 407.950000 },
  { name: "هندسة السويس", minScore: 407.950000 },
  { name: "هندسة الزقازيق", minScore: 407.950000 },
  { name: "حاسبات و ذكاء إصطناعي القاهرة رياضة", minScore: 407.950000 },
  { name: "هندسة المنصورة", minScore: 407.950000 },
  { name: "هندسة طنطا", minScore: 407.950000 },
  { name: "هندسة بني سويف", minScore: 407.950000 },
  { name: "هندسة المنوفية بشبين الكوم", minScore: 407.925882 },
  { name: "العلوم الصحية التطبيقية المنوفية", minScore: 407.858889 },
  { name: "هندسة بنها", minScore: 407.836111 },
  { name: "هندسة بنها بشبرا", minScore: 407.821875 },
  { name: "هندسة قناة السويس بالإسماعيلية", minScore: 407.813333 },
  { name: "هندسة حلوان", minScore: 407.804959 },
  { name: "هندسة الفيوم", minScore: 407.796250 },
  { name: "هندسة حلوان بالمطرية", minScore: 407.705139 },
  { name: "هندسة بور سعيد", minScore: 407.684706 },
  { name: "هندسة أسوان", minScore: 407.566127 },
  { name: "طب بيطري كفر الشيخ", minScore: 407.472672 },
  { name: "طب بيطري عين شمس", minScore: 407.454248 },
  { name: "هندسة سوهاج", minScore: 406.505621 },
  { name: "تخطيط عمراني القاهرة", minScore: 405.900000 },
  { name: "معهد العبور العالي للهندسه والتكنولوجيا بمصروفات", minScore: 405.900000 },
  { name: "حاسبات ومعلومات المنيا رياضة", minScore: 405.900000 },
  { name: "حاسبات و علوم البيانات الإسكندرية رياضة", minScore: 405.900000 },
  { name: "حاسبات ومعلومات دمياط رياضة", minScore: 405.900000 },
  { name: "ألسن كفر الشيخ", minScore: 405.900000 },
  { name: "طب بيطري المنصورة", minScore: 405.900000 },
  { name: "حاسبات و ذكاء إصطناعي حلوان رياضة", minScore: 405.900000 },
  { name: "حاسبات ومعلومات عين شمس رياضة", minScore: 405.900000 },
  { name: "فنون جميلة (عمارة) المنصورة", minScore: 405.900000 },
  { name: "حاسبات ومعلومات المنصورة رياضة", minScore: 405.900000 },
  { name: "طب بيطري المنوفية", minScore: 405.900000 },
  { name: "الذكاء الاصطناعى كفر الشيخ رياضة", minScore: 405.609918 },
  { name: "حاسبات ومعلومات الزقازيق رياضة", minScore: 405.575752 },
  { name: "حاسبات ومعلومات دمنهور بالنوبارية رياضة", minScore: 405.571397 },
  { name: "دار العلوم أسوان", minScore: 405.335580 },
  { name: "العلوم الصحية التطبيقية بني سويف", minScore: 404.924575 },
  { name: "طب بيطري دمنهور", minScore: 404.715221 },
  { name: "فنون جميلة (عمارة) حلوان", minScore: 403.850000 },
  { name: "حاسبات و ذكاء إصطناعي بنها رياضة", minScore: 403.850000 },
  { name: "فنون جميلة (عمارة) الإسكندرية", minScore: 403.850000 },
  { name: "حاسبات ومعلومات المنوفية بشبين الكوم رياضة", minScore: 403.850000 },
  { name: "طب بيطري الزقازيق", minScore: 403.850000 },
  { name: "حاسبات ومعلومات سوهاج رياضة", minScore: 403.850000 },
  { name: "حاسبات ومعلومات طنطا رياضة", minScore: 403.801765 },
  { name: "طب بيطري بنها", minScore: 403.756209 },
  { name: "حاسبات ومعلومات كفر الشيخ رياضة", minScore: 403.602794 },
  { name: "حاسبات و ذكاء إصطناعي جنوب الوادي فرع الغردقة رياضة", minScore: 403.519722 },
  { name: "حاسبات وذكاء اصطناعي السادات رياضة", minScore: 403.025980 },
  { name: "ذكاء إصطناعي المنوفية شبين الكوم رياضة", minScore: 401.992188 },
  { name: "حاسبات و معلومات العريش رياضة", minScore: 401.800000 },
  { name: "حاسبات وذكاء اصطناعي مطروح رياضة", minScore: 401.800000 },
  { name: "ألسن عين شمس", minScore: 401.800000 },
  { name: "المعهد العالى للهندسة والتكنولوجيا بكنج مريوط", minScore: 401.800000 },
  { name: "حاسبات ومعلومات قناة السويس بالإسماعيلية رياضة", minScore: 401.800000 },
  { name: "حاسبات ومعلومات السويس رياضة", minScore: 401.649265 },
  { name: "إعلام القاهرة", minScore: 401.633521 },
  { name: "حاسبات ومعلومات الفيوم رياضة", minScore: 401.293529 },
  { name: "ألسن قناة السويس بالإسماعيلية", minScore: 400.942484 },
  { name: "إعلام عين شمس", minScore: 400.804812 },
  { name: "المعهد العالى للهندسة والتكنولوجيا بالزقازيق", minScore: 399.750000 },
  { name: "حاسبات ومعلومات أسيوط رياضة", minScore: 399.750000 },
  { name: "حاسبات ومعلومات الأقصر رياضة", minScore: 399.564667 },
  { name: "فنون جميلة (عمارة) أسيوط", minScore: 399.449869 },
  { name: "حاسبات ومعلومات قنا رياضة", minScore: 399.417377 },
  { name: "تمريض طنطا", minScore: 398.481144 },
  { name: "طب بيطري أسوان", minScore: 397.700000 },
  { name: "ألسن الفيوم", minScore: 397.700000 },
  { name: "علوم البترول والتعدين مطروح", minScore: 397.700000 },
  { name: "اقتصاد وعلوم سياسية القاهرة", minScore: 397.700000 },
  { name: "علوم القاهرة", minScore: 397.346275 },
  { name: "علوم البترول والتعدين مطروح - علوم", minScore: 397.076626 },
  { name: "ألسن أسوان", minScore: 395.650000 },
  { name: "طب بيطري مدينة السادات", minScore: 395.650000 },
  { name: "طب بيطري المنيا", minScore: 395.650000 },
  { name: "معهد الصفوة العالي هندسة وتكنولوجيا بالقليوبية", minScore: 395.429592 },
  { name: "كلية تكنولوجيا الصناعة و الطاقة بالقاهرة جامعة مصر الدولية التكنولوجية", minScore: 395.393750 },
  { name: "الدراسات الاقتصادية والعلوم السياسية الإسكندرية", minScore: 395.309338 },
  { name: "طب بيطري أسيوط", minScore: 394.326042 },
  { name: "المجمع التكنولوجي المتكامل بالسلام", minScore: 393.600000 },
  { name: "ألسن الأقصر", minScore: 393.600000 },
  { name: "فنون جميلة (عمارة) المنيا", minScore: 393.508889 },
  { name: "ألسن بني سويف", minScore: 393.192010 },
  { name: "معهد أكتوبر العالي للهندسه والتكنولوجيا م 6 اكتوبر بمصروفات", minScore: 391.525882 },
  { name: "معهد عالي كندي تكنولوجيا هندسة ت.خامس", minScore: 389.500000 },
  { name: "كلية تكنولوجيا العلوم الصحية 6 أكتوبر التكنولوجية", minScore: 389.500000 },
  { name: "فنون جميلة (فنون) حلوان", minScore: 389.475882 },
  { name: "إعلام بني سويف", minScore: 389.397500 },
  { name: "ألسن المنيا", minScore: 389.140580 },
  { name: "ألسن جنوب الوادي فرع الغردقة", minScore: 388.803603 },
  { name: "طب بيطري قناة السويس بالإسماعيلية", minScore: 388.799248 },
  { name: "سياسة واقتصاد السويس", minScore: 387.450000 },
  { name: "ألسن سوهاج", minScore: 387.450000 },
  { name: "طب بيطري بني سويف", minScore: 387.128766 },
  { name: "تمريض المنصورة", minScore: 385.400000 },
  { name: "علوم بنات عين شمس", minScore: 385.400000 },
  { name: "سياسة واقتصاد بني سويف", minScore: 385.021822 },
  { name: "آداب انتساب موجه القاهرة", minScore: 384.759375 },
  { name: "طب بيطري العريش", minScore: 379.250000 },
  { name: "إعلام وتكنولوجيا اتصال السويس", minScore: 377.200000 },
  { name: "طب بيطري الوادي الجديد", minScore: 377.200000 },
  { name: "المعهد التكنولوجي العالي بالسادس من أكتوبر", minScore: 376.687500 },
  { name: "معهد تكنولوجي عالي العاشر من رمضان شعبة (هندسة) بمصروفات", minScore: 375.150000 },
  { name: "طب بيطري مطروح", minScore: 375.150000 },
  { name: "تمريض القاهرة", minScore: 375.150000 },
  { name: "طب بيطري جنوب الوادي", minScore: 374.975147 },
  { name: "المصرية الصينية للتكنولوجيا قناة السويس بالإسماعيلية", minScore: 373.100000 },
  { name: "كلية تكنولوجيا الصناعة والطاقة ج القاهرة الجديدة التكنولوجية", minScore: 373.100000 },
  { name: "كلية تكنولوجيا الصناعة والطاقة 6 أكتوبر التكنولوجية", minScore: 371.828464 },
  { name: "الاعاقة والتأهيل الزقازيق", minScore: 370.181430 },
  { name: "تمريض بور سعيد", minScore: 368.903529 },
  { name: "تمريض دمياط", minScore: 368.597704 },
  { name: "تربية (طفولة) كفر الشيخ", minScore: 368.316681 },
  { name: "كلية تكنولوجيا العلوم الصحية برج العرب التكنولوجية", minScore: 366.829412 },
  { name: "العالي للهندسة والتكنولوجيا التجمع الخامس", minScore: 365.289567 },
  { name: "دار العلوم القاهرة", minScore: 364.736201 },
  { name: "معهد الجزيرة العالى للهندسة والتكنولوجيا بالمقطم", minScore: 362.850000 },
  { name: "المعهد الكندى العالى للهندسة 6 اكتوبر", minScore: 361.088072 },
  { name: "علوم عين شمس", minScore: 359.134208 },
  { name: "المعهد الكندي العالي للحاسب الآلي بالتجمع الخامس القاهرة الجديدة", minScore: 358.621875 },
  { name: "علوم التغذية حلوان", minScore: 355.832100 },
  { name: "تمريض حلوان", minScore: 354.625882 },
  { name: "معهد هندسة وتكنولوجيا الطيران إمبابة جيزة بمصروفات", minScore: 353.625000 },
  { name: "تمريض عين شمس", minScore: 353.496875 },
  { name: "علوم المنصورة", minScore: 353.151691 },
  { name: "تجارة انتساب موجه عين شمس", minScore: 350.426732 },
  { name: "فنون تطبيقية طنطا", minScore: 350.194265 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بدمياط الجديدة", minScore: 346.695196 },
  { name: "علوم حلوان", minScore: 344.400000 },
  { name: "كلية تكنولوجيا الصناعة والطاقة 6 أكتوبر التكنولوجية علوم", minScore: 339.394248 },
  { name: "معهد عالي هندسه 6 اكتوبر بمصروفات", minScore: 336.108554 },
  { name: "التكنولوجيا والتعليم الصناعي حلوان", minScore: 334.642737 },
  { name: "علوم كفر الشيخ", minScore: 334.150000 },
  { name: "الاهرامات العالي للهندسة والتكنولوجيا -6 اكتوبر", minScore: 333.955719 },
  { name: "تمريض الزقازيق", minScore: 332.922010 },
  { name: "معهد عالي هندسة وتكنولوجيا العريش", minScore: 329.658758 },
  { name: "آداب انتساب موجه المنصورة", minScore: 319.657974 },
  { name: "تمريض كفر الشيخ", minScore: 317.683342 },
  { name: "المدينةالعالي للإدارة والتكنولوجيا شبرامنت ش نظم معلومات إدارية", minScore: 310.444698 },
  { name: "آداب انتساب موجه الفيوم", minScore: 309.291740 },
  { name: "تجارة انتساب موجه المنصورة", minScore: 305.798492 },
  { name: "تمريض بنها", minScore: 304.774371 },
  { name: "حقوق انتساب موجه المنصورة", minScore: 302.311356 },
  { name: "علوم طنطا", minScore: 300.493154 },
  { name: "فنون تطبيقية حلوان", minScore: 294.484161 },
  { name: "آداب انتساب موجه بنات عين شمس", minScore: 287.419044 },
  { name: "تمريض الإسكندرية", minScore: 264.670074 }
];

const EquivalencyCalculator = () => {
  const { toast } = useToast();
  const [gender, setGender] = useState<"male" | "female">("male");
  const [highSchoolPercentage, setHighSchoolPercentage] = useState<number | string>("");
  const [qiyasScore, setQiyasScore] = useState<number | string>("");
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [eligibleColleges, setEligibleColleges] = useState<Array<{ name: string; minScore: number }>>([]);
  const [activeTab, setActiveTab] = useState("calculator");
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [collegeFilter, setCollegeFilter] = useState<"all" | "available" | "unavailable">("all");

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert string values to numbers
    const hsPercentage = typeof highSchoolPercentage === 'string'
      ? parseFloat(highSchoolPercentage)
      : highSchoolPercentage;

    const qScore = typeof qiyasScore === 'string'
      ? parseFloat(qiyasScore)
      : qiyasScore;

    // Validation
    if (isNaN(hsPercentage) || isNaN(qScore)) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال قيم صحيحة للنسبة ودرجة القياس",
        variant: "destructive"
      });
      return;
    }

    if (hsPercentage < 0 || hsPercentage > 100) {
      toast({
        title: "خطأ في نسبة الثانوية",
        description: "يجب أن تكون نسبة الثانوية بين 0 و 100",
        variant: "destructive"
      });
      return;
    }

    if (qScore < 0 || qScore > 100) {
      toast({
        title: "خطأ في درجة القياس",
        description: "يجب أن تكون درجة القياس بين 0 و 100",
        variant: "destructive"
      });
      return;
    }

    // Start calculation with animation
    setIsCalculating(true);
    setProgress(0);

    // Simulate calculation progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    const score = calculateFinalEquivalencyScore(hsPercentage, qScore);
    setFinalScore(score);
    setShowResult(true);
    setIsCalculating(false);
    setActiveTab("results");

    toast({
      title: "تم حساب المعدل بنجاح",
      description: `معدلك التقديري هو ${score}`,
    });
  };

  const resetCalculator = () => {
    setHighSchoolPercentage("");
    setQiyasScore("");
    setFinalScore(null);
    setEligibleColleges([]);
    setSearchTerm("");
    setActiveTab("calculator");
    setShowResult(false);
    setProgress(0);
    setCollegeFilter("all");

    toast({
      title: "تم إعادة تعيين الحاسبة",
      description: "يمكنك الآن إدخال بيانات جديدة",
    });
  };

  // Get colleges based on gender
  const getColleges = () => gender === "male" ? collegesMale : collegesFemale;

  // Filter colleges based on search term and availability
  const getFilteredColleges = () => {
    const colleges = getColleges();
    let filtered = colleges;

    // Filter by availability if score is calculated
    if (finalScore !== null && collegeFilter !== "all") {
      if (collegeFilter === "available") {
        filtered = colleges.filter(college => college.minScore <= finalScore);
      } else if (collegeFilter === "unavailable") {
        filtered = colleges.filter(college => college.minScore > finalScore);
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(college =>
        college.name.includes(searchTerm)
      );
    }

    return filtered.sort((a, b) => b.minScore - a.minScore);
  };

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 400) return "text-green-500";
    if (score >= 350) return "text-yellow-500";
    if (score >= 300) return "text-orange-500";
    return "text-red-500";
  };

  // Get score description
  const getScoreDescription = (score: number) => {
    if (score >= 400) return "ممتاز - يمكنك دخول معظم الكليات";
    if (score >= 350) return "جيد جداً - خيارات متنوعة متاحة";
    if (score >= 300) return "جيد - خيارات محدودة متاحة";
    return "يحتاج تحسين - خيارات قليلة متاحة";
  };

  const filteredColleges = getFilteredColleges();

  const calculatorStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "حاسبة المعادلة التقديرية - اور جول",
    "description": "احسب معدلك التقديري للمعادلة المصرية بناء على نسبة الثانوية العامة ودرجة اختبار القدرات",
    "url": "https://ourgoal.site/equivalency-calculator",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "SAR"
    },
    "featureList": [
      "حساب المعدل التقديري",
      "عرض الكليات المتاحة",
      "مقارنة الدرجات",
      "نتائج فورية",
      "واجهة سهلة الاستخدام"
    ],
    "creator": {
      "@type": "Organization",
      "name": "اور جول - Our Goal"
    }
  };

  return (
    <Layout>
      <SEO
        title="حاسبة المعادلة التقديرية | اور جول - Our Goal"
        description="احسب معدلك التقديري للمعادلة المصرية بناء على نسبة الثانوية العامة ودرجة اختبار القدرات. أداة مجانية وسهلة الاستخدام مع عرض الكليات المتاحة."
        keywords="حاسبة المعادلة, المعدل التقديري, اختبار القدرات, الثانوية العامة, الكليات المتاحة, حساب المعدل, اور جول, قياس"
        url="/equivalency-calculator"
        type="website"
        structuredData={calculatorStructuredData}
      />
      <style>{hideSpinnerStyle}</style>



      {/* Main Content Section */}
      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_75%)]"></div>

        <div className="container mx-auto relative z-10">
          {/* Simple Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20">
                أداة مساعدة
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
              حاسبة المعادلة التقديرية
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              احسب معدلك التقديري للمعادلة المصرية بناء على نسبة الثانوية العامة ودرجة اختبار القدرات
            </p>
          </div>

          {/* Tabbed Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Tabs
              defaultValue="calculator"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {/* Tab Navigation - Clean style without background */}
              <div className="flex justify-center mb-12">
                <TabsList className="grid grid-cols-2 w-[400px] bg-transparent p-2">
                  <TabsTrigger
                    value="calculator"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground font-bold py-3 px-6 rounded-xl transition-all duration-300 data-[state=inactive]:text-muted-foreground hover:text-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      الحاسبة
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="results"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground font-bold py-3 px-6 rounded-xl transition-all duration-300 data-[state=inactive]:text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!showResult}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart4 className="w-5 h-5" />
                      النتائج
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Calculator Tab Content */}
              <TabsContent value="calculator" className="mt-8">
                <div className="max-w-2xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Card className="p-8 bg-gradient-to-br from-card/80 to-card/40 border border-primary/20 rounded-3xl backdrop-blur-sm">
                      {/* Card Header */}
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Calculator className="w-8 h-8 text-black" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">حاسبة المعدل التقديري</h2>
                        <p className="text-muted-foreground">أدخل بياناتك للحصول على معدلك التقديري والكليات المتاحة</p>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleCalculate} className="space-y-6">
                        <div className="space-y-6">
                          {/* High School Percentage */}
                          <div className="space-y-2">
                            <Label htmlFor="highSchoolPercentage" className="text-foreground font-medium flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-primary" />
                              نسبة الثانوية العامة (%)
                            </Label>
                            <Input
                              id="highSchoolPercentage"
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              placeholder="أدخل نسبة الثانوية (مثال: 98.5)"
                              value={highSchoolPercentage}
                              onChange={(e) => setHighSchoolPercentage(e.target.value)}
                              className="text-left w-full py-3 bg-background/50 border-primary/20 rounded-xl"
                              dir="ltr"
                              required
                            />
                          </div>

                          {/* Qiyas Score */}
                          <div className="space-y-2">
                            <Label htmlFor="qiyasScore" className="text-foreground font-medium flex items-center gap-2">
                              <Target className="w-4 h-4 text-primary" />
                              درجة اختبار القدرات
                            </Label>
                            <div className="relative">
                              <Input
                                id="qiyasScore"
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder="أدخل درجة القدرات (مثال: 85)"
                                value={qiyasScore}
                                onChange={(e) => setQiyasScore(e.target.value)}
                                className="text-left w-full py-3 bg-background/50 border-primary/20 rounded-xl"
                                dir="ltr"
                                required
                              />
                            </div>
                          </div>

                          {/* Gender Selection */}
                          <div className="space-y-2">
                            <Label htmlFor="gender" className="text-foreground font-medium flex items-center gap-2">
                              <Users className="w-4 h-4 text-primary" />
                              الجنس
                            </Label>
                            <Select value={gender} onValueChange={(value) => setGender(value as "male" | "female")}>
                              <SelectTrigger className="w-full py-3 bg-background/50 border-primary/20 rounded-xl">
                                <SelectValue placeholder="اختر الجنس" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">ذكر</SelectItem>
                                <SelectItem value="female">أنثى</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {isCalculating && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">جاري الحساب...</span>
                              <span className="text-primary font-medium">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                          <Button
                            type="submit"
                            disabled={isCalculating}
                            className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold py-3 rounded-xl transition-all duration-300 group relative overflow-hidden"
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              {isCalculating ? (
                                <>
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                  جاري الحساب...
                                </>
                              ) : (
                                <>
                                  <Calculator className="h-4 w-4" />
                                  احسب المعدل التقديري
                                </>
                              )}
                            </span>
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={resetCalculator}
                            className="border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-foreground font-bold py-3 px-6 rounded-xl transition-all duration-300"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </form>

                      {/* Info Section */}
                      <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-medium text-foreground mb-1">كيف يتم الحساب؟</h4>
                            <p className="text-sm text-muted-foreground">
                              المعدل التقديري = ((نسبة الثانوية + درجة القياس) ÷ 2) × 4.1
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              {/* Results Tab Content */}
              <TabsContent value="results" className="mt-8">
                {finalScore !== null ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                {/* Score Summary Card */}
                <Card className="p-8 bg-gradient-to-br from-card/80 to-card/40 border border-primary/20 rounded-3xl backdrop-blur-sm">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Award className="w-10 h-10 text-black" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">معدلك التقديري</h2>
                    <div className={`text-5xl font-bold mb-2 ${getScoreColor(finalScore)}`}>
                      {finalScore}
                    </div>
                    <p className="text-muted-foreground text-lg">
                      {getScoreDescription(finalScore)}
                    </p>
                  </div>

                  {/* Input Summary */}
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-xl">
                      <GraduationCap className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground mb-1">نسبة الثانوية</div>
                      <div className="text-2xl font-bold text-foreground">{highSchoolPercentage}%</div>
                    </div>
                    <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-xl">
                      <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground mb-1">درجة القياس</div>
                      <div className="text-2xl font-bold text-foreground">{qiyasScore}</div>
                    </div>
                    <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-xl">
                      <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground mb-1">الجنس</div>
                      <div className="text-2xl font-bold text-foreground">{gender === "male" ? "ذكر" : "أنثى"}</div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <div className="text-2xl font-bold text-green-500">
                        {getColleges().filter(college => college.minScore <= finalScore).length}
                      </div>
                      <div className="text-xs text-green-600">كلية متاحة</div>
                    </div>
                    <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <div className="text-2xl font-bold text-red-500">
                        {getColleges().filter(college => college.minScore > finalScore).length}
                      </div>
                      <div className="text-xs text-red-600">كلية غير متاحة</div>
                    </div>
                    <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <div className="text-2xl font-bold text-blue-500">
                        {Math.round((getColleges().filter(college => college.minScore <= finalScore).length / getColleges().length) * 100)}%
                      </div>
                      <div className="text-xs text-blue-600">نسبة النجاح</div>
                    </div>
                    <div className="text-center p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                      <div className="text-2xl font-bold text-purple-500">
                        {getColleges().length}
                      </div>
                      <div className="text-xs text-purple-600">إجمالي الكليات</div>
                    </div>
                  </div>
                </Card>

                {/* Colleges List */}
                <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 border border-primary/20 rounded-3xl backdrop-blur-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">الكليات المتاحة</h3>
                      <p className="text-muted-foreground">قائمة بجميع الكليات وحالة القبول</p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="البحث عن كلية..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pr-10 w-full sm:w-[200px] bg-background/50 border-primary/20 rounded-xl"
                        />
                      </div>

                      <Select value={collegeFilter} onValueChange={(value) => setCollegeFilter(value as "all" | "available" | "unavailable")}>
                        <SelectTrigger className="w-full sm:w-[150px] bg-background/50 border-primary/20 rounded-xl">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع الكليات</SelectItem>
                          <SelectItem value="available">المتاحة فقط</SelectItem>
                          <SelectItem value="unavailable">غير المتاحة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Colleges Grid */}
                  <div className="max-h-[500px] overflow-y-auto">
                    <div className="space-y-2">
                      {filteredColleges.length > 0 ? (
                        filteredColleges.map((college, idx) => {
                          const isAvailable = college.minScore <= finalScore;
                          return (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.02 }}
                              className={`flex justify-between items-center p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                                isAvailable
                                  ? "bg-green-500/5 border-green-500/20 hover:bg-green-500/10"
                                  : "bg-red-500/5 border-red-500/20 hover:bg-red-500/10"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant="outline"
                                  className={`${
                                    isAvailable
                                      ? "bg-green-500/10 text-green-600 border-green-500/30"
                                      : "bg-red-500/10 text-red-600 border-red-500/30"
                                  }`}
                                >
                                  {isAvailable ? (
                                    <>
                                      <Check className="w-3 h-3 mr-1" />
                                      متاح
                                    </>
                                  ) : (
                                    "غير متاح"
                                  )}
                                </Badge>
                                <span className="font-medium text-foreground">{college.name}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">الحد الأدنى</div>
                                <div className="font-bold text-foreground">{college.minScore}</div>
                              </div>
                            </motion.div>
                          );
                        })
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-8 w-8 text-primary" />
                          </div>
                          <h4 className="text-lg font-medium text-foreground mb-2">لا توجد نتائج</h4>
                          <p className="text-muted-foreground">لم يتم العثور على كليات تطابق معايير البحث</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
                  </motion.div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calculator className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">لا توجد نتائج</h3>
                    <p className="text-muted-foreground mb-6">قم بحساب معدلك التقديري أولاً لعرض النتائج</p>
                    <Button onClick={() => setActiveTab("calculator")} variant="outline">
                      العودة للحاسبة
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default EquivalencyCalculator;
