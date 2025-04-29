import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, School, BookOpen, Search, ArrowRight, BarChart4, GraduationCap, Briefcase, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

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
  { name: "طب القاهرة", minScore: 410.000 },
  { name: "طب أسنان القاهرة", minScore: 410.000 },
  { name: "طب الإسكندرية", minScore: 410.000 },
  { name: "طب أسنان الإسكندرية", minScore: 410.000 },
  { name: "طب عين شمس", minScore: 410.000 },
  { name: "طب أسنان عين شمس", minScore: 410.000 },
  { name: "طب سوهاج", minScore: 410.000 },
  { name: "طب الفيوم", minScore: 410.000 },
  { name: "طب أسيوط", minScore: 410.000 },
  { name: "طب طنطا", minScore: 410.000 },
  { name: "طب أسنان طنطا", minScore: 410.000 },
  { name: "طب المنصورة", minScore: 410.000 },
  { name: "طب أسنان المنصورة", minScore: 410.000 },
  { name: "طب الزقازيق", minScore: 410.000 },
  { name: "طب المنوفية بشبين الكوم", minScore: 410.000 },
  { name: "طب بنها", minScore: 410.000 },
  { name: "طب بني سويف", minScore: 410.000 },
  { name: "طب المنيا", minScore: 410.000 },
  { name: "طب أسنان السويس", minScore: 410.000 },
  { name: "طب فاقوس", minScore: 410.000 },
  { name: "طب أسنان المنوفية", minScore: 410.000 },
  { name: "طب دمياط", minScore: 410.000 },
  { name: "طب الأقصر", minScore: 410.000 },
  { name: "طب كفر الشيخ", minScore: 410.000 },
  { name: "طب حلوان", minScore: 410.000 },
  { name: "طب قناة السويس بالإسماعيلية", minScore: 410.000 },
  { name: "طب بور سعيد", minScore: 410.000 },
  { name: "طب السويس", minScore: 409.975882 },
  { name: "طب الوادي الجديد", minScore: 409.975882 },
  { name: "طب جنوب الوادي", minScore: 409.975882 },
  { name: "طب العريش", minScore: 409.951765 },
  { name: "طب أسوان", minScore: 409.927647 },
  { name: "طب أسنان الزقازيق", minScore: 409.927647 },
  { name: "طب أسنان قناة السويس بالإسماعيلية", minScore: 409.886111 },
  { name: "طب أسنان الفيوم", minScore: 409.884771 },
  { name: "طب أسنان كفر الشيخ", minScore: 409.879412 },
  { name: "طب أسنان بني سويف", minScore: 409.871875 },
  { name: "طب أسنان أسيوط", minScore: 409.863333 },
  { name: "طب أسنان المنيا", minScore: 409.833856 },
  { name: "طب أسنان جنوب الوادي", minScore: 409.807059 },
  { name: "علاج طبيعي القاهرة", minScore: 409.790980 },
  { name: "علاج طبيعي كفر الشيخ", minScore: 409.766863 },
  { name: "صيدلة القاهرة", minScore: 409.758824 },
  { name: "علاج طبيعي بورسعيد", minScore: 409.651215 },
  { name: "علاج طبيعي بنها", minScore: 409.631871 },
  { name: "علاج طبيعي السويس", minScore: 409.468072 },
  { name: "علاج طبيعي قناة السويس", minScore: 409.452328 },
  { name: "علاج طبيعي بني سويف", minScore: 409.359375 },
  { name: "صيدلة وتصنيع دوائي كفر الشيخ", minScore: 409.281830 },
  { name: "كلية الهندسة جامعة دمنهور", minScore: 409.276471 },
  { name: "حاسبات وذكاء اصطناعي القاهرة رياضة", minScore: 408.546242 },
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
  { name: "صيدلة بور سعيد", minScore: 407.950000 },
  { name: "كلية مدينة السادات", minScore: 407.925882 },
  { name: "صيدلة سوهاج", minScore: 407.829412 },
  { name: "هندسة عين شمس", minScore: 407.805294 },
  { name: "هندسة إلكترونية المنوفية بمنوف", minScore: 407.777827 },
  { name: "هندسة بني سويف", minScore: 407.684706 },
  { name: "هندسة كفر الشيخ", minScore: 407.507843 },
  { name: "هندسة بنها بشبرا", minScore: 407.440850 },
  { name: "حاسبات وعلوم البيانات الإسكندرية رياضة", minScore: 407.225131 },
  { name: "هندسة طنطا", minScore: 406.882292 },
  { name: "هندسة الطاقة أسوان", minScore: 406.687843 },
  { name: "هندسة بنها", minScore: 405.900000 },
  { name: "هندسة دمياط", minScore: 405.900000 },
  { name: "هندسة حلوان بالمطرية", minScore: 405.900000 },
  { name: "هندسة حلوان", minScore: 405.900000 },
  { name: "هندسة المنوفية بشبين الكوم", minScore: 405.900000 },
  { name: "هندسة المنيا", minScore: 405.900000 },
  { name: "هندسة بورسعيد", minScore: 405.900000 },
  { name: "هندسة أسيوط", minScore: 405.900000 },
  { name: "حاسبات ومعلومات عين شمس رياضة", minScore: 405.900000 },
  { name: "حاسبات ومعلومات المنصورة رياضة", minScore: 405.900000 },
  { name: "طب بيطري عين شمس", minScore: 405.900000 },
  { name: "طب بيطري القاهرة", minScore: 405.900000 },
  { name: "هندسة الفيوم", minScore: 405.854444 },
  { name: "حاسبات وذكاء اصطناعي حلوان رياضة", minScore: 405.827647 },
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
  { name: "الذكاء الاصطناعي كفر الشيخ رياضة", minScore: 403.850000 },
  { name: "حاسبات ومعلومات طنطا رياضة", minScore: 403.850000 },
  { name: "طب بيطري المنوفية", minScore: 403.168676 },
  { name: "المعهد التكنولوجي العالي بالسادس من أكتوبر", minScore: 401.800000 },
  { name: "ذكاء اصطناعي المنوفية شبين الكوم رياضة", minScore: 401.800000 },
  { name: "علوم البترول والتعدين مطروح - علوم", minScore: 401.800000 },
  { name: "حاسبات وذكاء اصطناعي بنها رياضة", minScore: 401.800000 },
  { name: "حاسبات ومعلومات كفر الشيخ رياضة", minScore: 401.800000 },
  { name: "طب بيطري الإسكندرية", minScore: 401.800000 },
  { name: "حاسبات ومعلومات الفيوم رياضة", minScore: 401.800000 },
  { name: "المعهد العالي للهندسة والتكنولوجيا الحديثة بالمرج", minScore: 401.488815 },
  { name: "السن كفر الشيخ", minScore: 401.380286 },
  { name: "معهد الإسكندرية العالي للتكنولوجيا بسموحة بمصروفات", minScore: 401.087190 },
  { name: "حاسبات ومعلومات المنيا رياضة", minScore: 401.079820 },
  { name: "حاسبات وذكاء اصطناعي السادات رياضة", minScore: 401.078145 },
  { name: "حاسبات ومعلومات السويس رياضة", minScore: 399.750000 },
  { name: "معهد عالي هندسة وتكنولوجيا المنيا الجديدة", minScore: 399.750000 },
  { name: "حاسبات ومعلومات قناة السويس بالإسماعيلية رياضة", minScore: 399.750000 },
  { name: "المعهد الكندي العالي للهندسة 6 أكتوبر", minScore: 399.750000 },
  { name: "حاسبات ومعلومات بني سويف رياضة", minScore: 399.750000 },
  { name: "حاسبات وذكاء اصطناعي جنوب الوادي فرع الغردقة رياضة", minScore: 399.750000 },
  { name: "حاسبات ومعلومات العريش رياضة", minScore: 399.750000 },
  { name: "الملاحة وتكنولوجيا القضاء بني سويف", minScore: 399.307843 },
  { name: "حاسبات وذكاء اصطناعي مطروح رياضة", minScore: 399.015082 },
  { name: "طب بيطري بنها", minScore: 397.700000 },
  { name: "حاسبات ومعلومات أسيوط رياضة", minScore: 397.700000 },
  { name: "إعلام القاهرة", minScore: 397.181806 },
  { name: "العلوم الصحية التطبيقية المنوفية", minScore: 396.944649 },
  { name: "حاسبات ومعلومات الأقصر رياضة", minScore: 396.530294 },
  { name: "حاسبات ومعلومات سوهاج رياضة", minScore: 396.269271 },
  { name: "حاسبات ومعلومات قنا رياضة", minScore: 395.650000 },
  { name: "معهد عالي هندسة 6 أكتوبر بمصروفات", minScore: 393.927263 },
  { name: "طب بيطري الزقازيق", minScore: 393.600000 },
  { name: "اقتصاد وعلوم سياسية القاهرة", minScore: 393.600000 },
  { name: "الأكاديمية الدولية للعلوم الإعلام (شعبة هندسة 6 أكتوبر)", minScore: 393.479077 },
  { name: "طب بيطري المنصورة", minScore: 393.254314 },
  { name: "الدراسات الاقتصادية والعلوم السياسية الإسكندرية", minScore: 391.804575 },
  { name: "طب بيطري كفر الشيخ", minScore: 391.550000 },
  { name: "كلية تكنولوجيا الصناعة والطاقة بالقاهرة جامعة مصر الدولية التكنولوجية", minScore: 391.550000 },
  { name: "طب بيطري أسوان", minScore: 387.450000 },
  { name: "طب بيطري أسيوط", minScore: 387.450000 },
  { name: "الأكاديمية المصرية للهندسة والتكنولوجيا المتقدمة وزارة الإنتاج الحربي", minScore: 387.262418 },
  { name: "أكاديمية أخبار اليوم شعبة هندسية 6 أكتوبر", minScore: 385.400000 },
  { name: "سياسة واقتصاد السويس", minScore: 385.400000 },
  { name: "طب بيطري قناة السويس بالإسماعيلية", minScore: 385.400000 },
  { name: "معهد المنصورة العالي للهندسة والتكنولوجيا", minScore: 385.400000 },
  { name: "إعلام عين شمس", minScore: 385.400000 },
  { name: "طب بيطري دمنهور", minScore: 384.029984 },
  { name: "العالي للهندسة والتكنولوجيا التجمع الخامس", minScore: 383.350000 },
  { name: "طب بيطري العريش", minScore: 383.350000 },
  { name: "طب بيطري مدينة السادات", minScore: 381.300000 },
  { name: "الأهرامات العالي للهندسة والتكنولوجيا 6 أكتوبر", minScore: 380.345343 },
  { name: "طب بيطري الوادي الجديد", minScore: 380.335294 },
  { name: "السن قناة السويس بالإسماعيلية", minScore: 379.250000 },
  { name: "معهد هندسة وتكنولوجيا الطيران إمبابة جيزة بمصروفات", minScore: 379.058399 },
  { name: "معهد العبور العالي للهندسة والتكنولوجيا بمصروفات", minScore: 379.032941 },
  { name: "طب بيطري جنوب الوادي", minScore: 377.410694 },
  { name: "العلوم الصحية التطبيقية بني سويف", minScore: 377.200000 },
  { name: "معهد المستقبل العالي للهندسة والتكنولوجيا بالفيوم", minScore: 375.190196 },
  { name: "طب بيطري سوهاج", minScore: 375.150000 },
  { name: "السن عين شمس", minScore: 374.427141 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بالمنزلة", minScore: 373.678824 },
  { name: "طب بيطري بني سويف", minScore: 373.384722 },
  { name: "كلية تكنولوجيا الصناعة والطاقة 6 أكتوبر التكنولوجية", minScore: 371.050000 },
  { name: "تمريض المنصورة", minScore: 371.050000 },
  { name: "تمريض القاهرة", minScore: 371.050000 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بدمياط الجديدة", minScore: 371.050000 },
  { name: "طب بيطري مطروح", minScore: 369.000000 },
  { name: "المصرية الصينية للتكنولوجيا قناة السويس بالإسماعيلية", minScore: 368.083529 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بطنطا", minScore: 367.351291 },
  { name: "السن الفيوم", minScore: 367.066234 },
  { name: "معهد عالي هندسة مدينة الشروق بمصروفات", minScore: 362.850000 },
  { name: "معهد أكتوبر العالي للهندسة والتكنولوجيا 6 أكتوبر بمصروفات", minScore: 361.974479 },
  { name: "حقوق المنيا", minScore: 360.800000 },
  { name: "كلية تكنولوجيا العلوم الصحية 6 أكتوبر التكنولوجية", minScore: 360.800000 },
  { name: "تمريض حلوان", minScore: 360.800000 },
  { name: "تمريض دمياط", minScore: 360.800000 },
  { name: "مصر العالي هندسة وتكنولوجيا منصورة", minScore: 359.504514 },
  { name: "أكاديمية أخبار اليوم 6 أكتوبر شعبة علوم حاسب", minScore: 358.845801 },
  { name: "معهد طيبة العالي للهندسة بالمعادي بمصروفات", minScore: 358.219412 },
  { name: "تجارة انتساب موجه الزقازيق", minScore: 356.700000 },
  { name: "تمريض بورسعيد", minScore: 356.700000 },
  { name: "تكنولوجيا الإدارة ونظم المعلومات بورسعيد", minScore: 356.700000 },
  { name: "عالي إدارة وتكنولوجيا ش علوم حاسب كفر الشيخ", minScore: 356.495000 },
  { name: "كلية تكنولوجيا الصناعة والطاقة 6 أكتوبر التكنولوجية علوم", minScore: 354.650000 },
  { name: "معهد عالي هندسة وتكنولوجيا العريش", minScore: 352.600000 },
  { name: "التكنولوجيا والتعليم الصناعي حلوان", minScore: 352.429167 },
  { name: "كلية تكنولوجيا الصناعة والطاقة - القاهرة الجديدة التكنولوجية", minScore: 352.343750 },
  { name: "معهد عالي كندي تكنولوجيا هندسة ت. خامس", minScore: 350.550000 },
  { name: "المعهد العالي للهندسة والتكنولوجيا ببرج العرب بالإسكندرية", minScore: 350.550000 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بالزقازيق", minScore: 350.379167 },
  { name: "معهد الدلتا العالي للهندسة والتكنولوجيا بالمنصورة", minScore: 349.852431 },
  { name: "كلية تكنولوجيا العلوم الصحية برج العرب التكنولوجية", minScore: 348.638007 },
  { name: "تجارة انتساب موجه قناة السويس بالإسماعيلية", minScore: 348.500000 },
  { name: "المعهد الكندي العالي للحاسب الآلي بالتجمع الخامس القاهرة الجديدة", minScore: 348.500000 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بالمحلة الكبرى", minScore: 348.042770 },
  { name: "تمريض عين شمس", minScore: 346.450000 },
  { name: "تجارة انتساب موجه الإسكندرية", minScore: 344.400000 },
  { name: "السن بني سويف", minScore: 344.400000 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بالبحيرة", minScore: 344.400000 },
  { name: "علوم القاهرة", minScore: 344.400000 },
  { name: "المعهد العالي للهندسة بمدينة 15 مايو", minScore: 339.058611 },
  { name: "معهد المستقبل العالي للهندسة والتكنولوجيا بالمنصورة", minScore: 338.250000 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بالمنوفية", minScore: 338.250000 },
  { name: "معهد المدينة العالي للهندسة والتكنولوجيا طريق سفارة الهرم", minScore: 338.250000 },
  { name: "تمريض طنطا", minScore: 338.032606 },
  { name: "القاهرة العالي ش هندسية بالتجمع الأول القاهرة الجديدة", minScore: 336.832083 },
  { name: "تجارة انتساب موجه القاهرة", minScore: 335.875752 },
  { name: "تمريض الإسكندرية", minScore: 331.955294 },
  { name: "تجارة انتساب موجه المنصورة", minScore: 325.950000 },
  { name: "معهد راية العالي للإدارة والتجارة الخارجية شعبة نظم معلومات", minScore: 324.768235 },
  { name: "تمريض المنوفية بشبين الكوم", minScore: 324.339477 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بكنج مريوط", minScore: 318.793758 },
  { name: "المعهد الكندي العالي للحاسب الآلي بالتجمع الخامس", minScore: 316.251356 },
  { name: "معهد النيل العالي للهندسة والتكنولوجيا بالمنصورة", minScore: 315.508734 },
  { name: "معهد عالي هندسة وتكنولوجيا كفر الشيخ", minScore: 315.261863 },
  { name: "معهد عالي تكنولوجيا 10 رمضان شعبة علوم الحاسب بمصروفات", minScore: 314.855547 },
  { name: "الفراعنة العالي إدارة أعمال", minScore: 312.197723 },
  { name: "معهد الوادي العالي للهندسة والتكنولوجيا قليوبية", minScore: 311.449935 },
  { name: "المعهد العالي للهندسة والتكنولوجيا ببرج العرب بالأسكندرية", minScore: 309.485351 }
];

const collegesFemale = [
  { name: "طب أسنان القاهرة", minScore: 410.000000 },
  { name: "طب أسنان الإسكندرية", minScore: 410.000000 },
  { name: "طب القاهرة", minScore: 410.000000 },
  { name: "طب الإسكندرية", minScore: 410.000000 },
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
  { name: "إعلام المنوفية", minScore: 409.975882 },
  { name: "طب فاقوس", minScore: 409.975882 },
  { name: "طب دمياط", minScore: 409.975882 },
  { name: "طب جنوب الوادي", minScore: 409.975882 },
  { name: "طب كفر الشيخ", minScore: 409.975882 },
  { name: "طب أسنان المنوفية", minScore: 409.954444 },
  { name: "صيدلة المنيا", minScore: 409.951765 },
  { name: "طب حلوان", minScore: 409.951765 },
  { name: "طب أسنان كفر الشيخ", minScore: 409.951765 },
  { name: "طب بور سعيد", minScore: 409.948761 },
  { name: "طب السويس", minScore: 409.948750 },
  { name: "علاج طبيعي القاهرة", minScore: 409.930327 },
  { name: "طب العريش", minScore: 409.930327 },
  { name: "طب الأقصر", minScore: 409.927647 },
  { name: "طب أسوان", minScore: 409.927647 },
  { name: "طب الوادي الجديد", minScore: 409.908889 },
  { name: "طب أسنان الفيوم", minScore: 409.906209 },
  { name: "طب أسنان الزقازيق", minScore: 409.906209 },
  { name: "طب أسنان السويس", minScore: 409.906209 },
  { name: "طب أسنان أسيوط", minScore: 409.903529 },
  { name: "طب أسنان بني سويف", minScore: 409.903194 },
  { name: "علاج طبيعي قناة السويس", minScore: 409.900515 },
  { name: "علاج طبيعي بنها", minScore: 409.897500 },
  { name: "صيدلة دمنهور", minScore: 409.882092 },
  { name: "علاج طبيعي السويس", minScore: 409.882092 },
  { name: "صيدلة المنصورة", minScore: 409.879412 },
  { name: "صيدلة طنطا", minScore: 409.879412 },
  { name: "صيدلة القاهرة", minScore: 409.876397 },
  { name: "علاج طبيعي بني سويف", minScore: 409.836536 },
  { name: "علاج طبيعي كفر الشيخ", minScore: 409.829167 },
  { name: "علاج طبيعي بورسعيد", minScore: 409.807059 },
  { name: "صيدلة حلوان", minScore: 409.782941 },
  { name: "صيدلة عين شمس", minScore: 409.775000 },
  { name: "علاج طبيعي جنوب الوادي", minScore: 409.766555 },
  { name: "صيدلة و تصنيع دوائي كفر الشيخ", minScore: 409.752780 },
  { name: "صيدلة الزقازيق", minScore: 409.745135 },
  { name: "صيدلة قناة السويس بالإسماعيلية", minScore: 409.782941 },
  { name: "صيدلة المنوفية", minScore: 409.782941 },
  { name: "صيدلة بور سعيد", minScore: 409.758824 },
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
  { name: "هندسة بترول و تعدين السويس", minScore: 407.950000 },
  { name: "هندسة أسيوط", minScore: 407.950000 },
  { name: "هندسة الإسكندرية", minScore: 407.950000 },
  { name: "طب بيطري الإسكندرية", minScore: 407.950000 },
  { name: "هندسة عين شمس", minScore: 407.925882 },
  { name: "هندسة إلكترونية المنوفية بمنوف", minScore: 407.858889 },
  { name: "هندسة القاهرة", minScore: 407.836111 },
  { name: "طب بيطري القاهرة", minScore: 407.821875 },
  { name: "هندسة كفر الشيخ", minScore: 407.813333 },
  { name: "هندسة دمياط", minScore: 407.804959 },
  { name: "هندسة السويس", minScore: 407.796250 },
  { name: "هندسة الزقازيق", minScore: 407.705139 },
  { name: "حاسبات و ذكاء اصطناعي القاهرة رياضة", minScore: 407.684706 },
  { name: "هندسة المنصورة", minScore: 407.566127 },
  { name: "هندسة طنطا", minScore: 407.472672 },
  { name: "هندسة بني سويف", minScore: 407.454248 },
  { name: "هندسة المنوفية بشبين الكوم", minScore: 406.505621 },
  { name: "العلوم الصحية التطبيقية المنوفية", minScore: 405.900000 },
  { name: "هندسة بنها", minScore: 405.900000 },
  { name: "هندسة بنها بشبرا", minScore: 405.900000 },
  { name: "هندسة قناة السويس بالإسماعيلية", minScore: 405.900000 },
  { name: "هندسة حلوان", minScore: 405.900000 },
  { name: "هندسة الفيوم", minScore: 405.900000 },
  { name: "هندسة حلوان بالمطرية", minScore: 405.609918 },
  { name: "هندسة بور سعيد", minScore: 405.575752 },
  { name: "هندسة أسوان", minScore: 405.571397 },
  { name: "طب بيطري كفر الشيخ", minScore: 405.335580 },
  { name: "طب بيطري عين شمس", minScore: 404.924575 },
  { name: "هندسة سوهاج", minScore: 404.715221 },
  { name: "تخطيط عمراني القاهرة", minScore: 403.850000 },
  { name: "معهد العبور العالي للهندسة والتكنولوجيا بمصروفات", minScore: 403.850000 },
  { name: "حاسبات ومعلومات المنيا رياضة", minScore: 403.850000 },
  { name: "حاسبات و علوم البيانات الإسكندرية رياضة", minScore: 403.850000 },
  { name: "حاسبات ومعلومات دمياط رياضة", minScore: 403.850000 },
  { name: "السن كفر الشيخ", minScore: 403.850000 },
  { name: "طب بيطري المنصورة", minScore: 403.850000 },
  { name: "حاسبات و ذكاء اصطناعي حلوان رياضة", minScore: 403.850000 },
  { name: "حاسبات ومعلومات عين شمس رياضة", minScore: 403.850000 },
  { name: "فنون جميلة (عمارة) المنصورة", minScore: 403.850000 },
  { name: "حاسبات ومعلومات المنصورة رياضة", minScore: 403.850000 },
  { name: "طب بيطري المنوفية", minScore: 403.850000 },
  { name: "الذكاء الاصطناعي كفر الشيخ رياضة", minScore: 403.850000 },
  { name: "حاسبات ومعلومات الزقازيق رياضة", minScore: 403.850000 },
  { name: "حاسبات ومعلومات دمنهور بالنوبارية رياضة", minScore: 403.850000 },
  { name: "دار العلوم أسوان", minScore: 403.850000 },
  { name: "العلوم الصحية التطبيقية بني سويف", minScore: 403.850000 },
  { name: "طب بيطري دمنهور", minScore: 403.850000 },
  { name: "فنون جميلة (عمارة) حلوان", minScore: 403.850000 },
  { name: "حاسبات و ذكاء اصطناعي بنها رياضة", minScore: 403.850000 },
  { name: "فنون جميلة (عمارة) الإسكندرية", minScore: 403.850000 },
  { name: "حاسبات ومعلومات المنوفية بشبين الكوم رياضة", minScore: 403.850000 },
  { name: "طب بيطري الزقازيق", minScore: 403.850000 },
  { name: "حاسبات ومعلومات سوهاج رياضة", minScore: 403.801765 },
  { name: "حاسبات ومعلومات طنطا رياضة", minScore: 403.756209 },
  { name: "طب بيطري بنها", minScore: 403.602794 },
  { name: "حاسبات ومعلومات كفر الشيخ رياضة", minScore: 403.519722 },
  { name: "حاسبات وذكاء اصطناعي جنوب الوادي فرع الغردقة رياضة", minScore: 403.025980 },
  { name: "حاسبات وذكاء اصطناعي السادات رياضة", minScore: 401.992188 },
  { name: "ذكاء إصطناعي المنوفية شبين الكوم رياضة", minScore: 401.800000 },
  { name: "علوم البترول والتعدين مطروح - علوم", minScore: 401.800000 },
  { name: "حاسبات وذكاء اصطناعي بنها رياضة", minScore: 401.800000 },
  { name: "حاسبات ومعلومات كفر الشيخ رياضة", minScore: 401.800000 },
  { name: "طب بيطري الإسكندرية", minScore: 401.800000 },
  { name: "حاسبات ومعلومات الفيوم رياضة", minScore: 401.800000 },
  { name: "المعهد العالي للهندسة والتكنولوجيا الحديثة بالمرج", minScore: 401.488815 },
  { name: "السن كفر الشيخ", minScore: 401.380286 },
  { name: "معهد الإسكندرية العالي للتكنولوجيا بسموحة بمصروفات", minScore: 401.087190 },
  { name: "حاسبات ومعلومات المنيا رياضة", minScore: 401.079820 },
  { name: "حاسبات وذكاء اصطناعي السادات رياضة", minScore: 401.078145 },
  { name: "حاسبات ومعلومات السويس رياضة", minScore: 399.750000 },
  { name: "معهد عالي هندسة وتكنولوجيا المنيا الجديدة", minScore: 399.750000 },
  { name: "حاسبات ومعلومات قناة السويس بالإسماعيلية رياضة", minScore: 399.750000 },
  { name: "المعهد الكندي العالي للهندسة 6 أكتوبر", minScore: 399.750000 },
  { name: "حاسبات ومعلومات بني سويف رياضة", minScore: 399.750000 },
  { name: "حاسبات وذكاء اصطناعي جنوب الوادي فرع الغردقة رياضة", minScore: 399.750000 },
  { name: "حاسبات ومعلومات العريش رياضة", minScore: 399.750000 },
  { name: "الملاحة وتكنولوجيا القضاء بني سويف", minScore: 399.307843 },
  { name: "حاسبات وذكاء اصطناعي مطروح رياضة", minScore: 399.015082 },
  { name: "طب بيطري بنها", minScore: 397.700000 },
  { name: "حاسبات ومعلومات أسيوط رياضة", minScore: 397.700000 },
  { name: "إعلام القاهرة", minScore: 397.181806 },
  { name: "العلوم الصحية التطبيقية المنوفية", minScore: 396.944649 },
  { name: "حاسبات ومعلومات الأقصر رياضة", minScore: 396.530294 },
  { name: "حاسبات ومعلومات سوهاج رياضة", minScore: 396.269271 },
  { name: "حاسبات ومعلومات قنا رياضة", minScore: 395.650000 },
  { name: "معهد عالي هندسة 6 أكتوبر بمصروفات", minScore: 393.927263 },
  { name: "طب بيطري الزقازيق", minScore: 393.600000 },
  { name: "اقتصاد وعلوم سياسية القاهرة", minScore: 393.600000 },
  { name: "الأكاديمية الدولية للعلوم الإعلام (شعبة هندسة 6 أكتوبر)", minScore: 393.479077 },
  { name: "طب بيطري المنصورة", minScore: 393.254314 },
  { name: "الدراسات الاقتصادية والعلوم السياسية الإسكندرية", minScore: 391.804575 },
  { name: "طب بيطري كفر الشيخ", minScore: 391.550000 },
  { name: "كلية تكنولوجيا الصناعة والطاقة بالقاهرة جامعة مصر الدولية التكنولوجية", minScore: 391.550000 },
  { name: "طب بيطري أسوان", minScore: 387.450000 },
  { name: "طب بيطري أسيوط", minScore: 387.450000 },
  { name: "الأكاديمية المصرية للهندسة والتكنولوجيا المتقدمة وزارة الإنتاج الحربي", minScore: 387.262418 },
  { name: "أكاديمية أخبار اليوم شعبة هندسية 6 أكتوبر", minScore: 385.400000 },
  { name: "سياسة واقتصاد السويس", minScore: 385.400000 },
  { name: "طب بيطري قناة السويس بالإسماعيلية", minScore: 385.400000 },
  { name: "معهد المنصورة العالي للهندسة والتكنولوجيا", minScore: 385.400000 },
  { name: "إعلام عين شمس", minScore: 385.400000 },
  { name: "طب بيطري دمنهور", minScore: 384.029984 },
  { name: "العالي للهندسة والتكنولوجيا التجمع الخامس", minScore: 383.350000 },
  { name: "طب بيطري العريش", minScore: 383.350000 },
  { name: "طب بيطري مدينة السادات", minScore: 381.300000 },
  { name: "الأهرامات العالي للهندسة والتكنولوجيا 6 أكتوبر", minScore: 380.345343 },
  { name: "طب بيطري الوادي الجديد", minScore: 380.335294 },
  { name: "السن قناة السويس بالإسماعيلية", minScore: 379.250000 },
  { name: "معهد هندسة وتكنولوجيا الطيران إمبابة جيزة بمصروفات", minScore: 379.058399 },
  { name: "معهد العبور العالي للهندسة والتكنولوجيا بمصروفات", minScore: 379.032941 },
  { name: "طب بيطري جنوب الوادي", minScore: 377.410694 },
  { name: "العلوم الصحية التطبيقية بني سويف", minScore: 377.200000 },
  { name: "معهد المستقبل العالي للهندسة والتكنولوجيا بالفيوم", minScore: 375.190196 },
  { name: "طب بيطري سوهاج", minScore: 375.150000 },
  { name: "السن عين شمس", minScore: 374.427141 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بالمنزلة", minScore: 373.678824 },
  { name: "طب بيطري بني سويف", minScore: 373.384722 },
  { name: "كلية تكنولوجيا الصناعة والطاقة 6 أكتوبر التكنولوجية", minScore: 371.050000 },
  { name: "تمريض المنصورة", minScore: 371.050000 },
  { name: "تمريض القاهرة", minScore: 371.050000 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بدمياط الجديدة", minScore: 371.050000 },
  { name: "طب بيطري مطروح", minScore: 369.000000 },
  { name: "المصرية الصينية للتكنولوجيا قناة السويس بالإسماعيلية", minScore: 368.083529 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بطنطا", minScore: 367.351291 },
  { name: "السن الفيوم", minScore: 367.066234 },
  { name: "معهد عالي هندسة مدينة الشروق بمصروفات", minScore: 362.850000 },
  { name: "معهد أكتوبر العالي للهندسة والتكنولوجيا 6 أكتوبر بمصروفات", minScore: 361.974479 },
  { name: "حقوق المنيا", minScore: 360.800000 },
  { name: "كلية تكنولوجيا العلوم الصحية 6 أكتوبر التكنولوجية", minScore: 360.800000 },
  { name: "تمريض حلوان", minScore: 360.800000 },
  { name: "تمريض دمياط", minScore: 360.800000 },
  { name: "مصر العالي هندسة وتكنولوجيا منصورة", minScore: 359.504514 },
  { name: "أكاديمية أخبار اليوم 6 أكتوبر شعبة علوم حاسب", minScore: 358.845801 },
  { name: "معهد طيبة العالي للهندسة بالمعادي بمصروفات", minScore: 358.219412 },
  { name: "تجارة انتساب موجه الزقازيق", minScore: 356.700000 },
  { name: "تمريض بورسعيد", minScore: 356.700000 },
  { name: "تكنولوجيا الإدارة ونظم المعلومات بورسعيد", minScore: 356.700000 },
  { name: "عالي إدارة وتكنولوجيا ش علوم حاسب كفر الشيخ", minScore: 356.495000 },
  { name: "كلية تكنولوجيا الصناعة والطاقة 6 أكتوبر التكنولوجية علوم", minScore: 354.650000 },
  { name: "معهد عالي هندسة وتكنولوجيا العريش", minScore: 352.600000 },
  { name: "التكنولوجيا والتعليم الصناعي حلوان", minScore: 352.429167 },
  { name: "كلية تكنولوجيا الصناعة والطاقة - القاهرة الجديدة التكنولوجية", minScore: 352.343750 },
  { name: "معهد عالي كندي تكنولوجيا هندسة ت. خامس", minScore: 350.550000 },
  { name: "المعهد العالي للهندسة والتكنولوجيا ببرج العرب بالإسكندرية", minScore: 350.550000 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بالزقازيق", minScore: 350.379167 },
  { name: "معهد الدلتا العالي للهندسة والتكنولوجيا بالمنصورة", minScore: 349.852431 },
  { name: "كلية تكنولوجيا العلوم الصحية برج العرب التكنولوجية", minScore: 348.638007 },
  { name: "تجارة انتساب موجه قناة السويس بالإسماعيلية", minScore: 348.500000 },
  { name: "المعهد الكندي العالي للحاسب الآلي بالتجمع الخامس القاهرة الجديدة", minScore: 348.500000 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بالمحلة الكبرى", minScore: 348.042770 },
  { name: "تمريض عين شمس", minScore: 346.450000 },
  { name: "تجارة انتساب موجه الإسكندرية", minScore: 344.400000 },
  { name: "السن بني سويف", minScore: 344.400000 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بالبحيرة", minScore: 344.400000 },
  { name: "علوم القاهرة", minScore: 344.400000 },
  { name: "المعهد العالي للهندسة بمدينة 15 مايو", minScore: 339.058611 },
  { name: "معهد المستقبل العالي للهندسة والتكنولوجيا بالمنصورة", minScore: 338.250000 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بالمنوفية", minScore: 338.250000 },
  { name: "معهد المدينة العالي للهندسة والتكنولوجيا طريق سفارة الهرم", minScore: 338.250000 },
  { name: "تمريض طنطا", minScore: 338.032606 },
  { name: "القاهرة العالي ش هندسية بالتجمع الأول القاهرة الجديدة", minScore: 336.832083 },
  { name: "تجارة انتساب موجه القاهرة", minScore: 335.875752 },
  { name: "تمريض الإسكندرية", minScore: 331.955294 },
  { name: "تجارة انتساب موجه المنصورة", minScore: 325.950000 },
  { name: "معهد راية العالي للإدارة والتجارة الخارجية شعبة نظم معلومات", minScore: 324.768235 },
  { name: "تمريض المنوفية بشبين الكوم", minScore: 324.339477 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بكنج مريوط", minScore: 318.793758 },
  { name: "المعهد الكندي العالي للحاسب الآلي بالتجمع الخامس", minScore: 316.251356 },
  { name: "معهد النيل العالي للهندسة والتكنولوجيا بالمنصورة", minScore: 315.508734 },
  { name: "معهد عالي هندسة وتكنولوجيا كفر الشيخ", minScore: 315.261863 },
  { name: "معهد عالي تكنولوجيا 10 رمضان شعبة علوم الحاسب بمصروفات", minScore: 314.855547 },
  { name: "الفراعنة العالي إدارة أعمال", minScore: 312.197723 },
  { name: "معهد الوادي العالي للهندسة والتكنولوجيا قليوبية", minScore: 311.449935 },
  { name: "المعهد العالي للهندسة والتكنولوجيا ببرج العرب بالأسكندرية", minScore: 309.485351 }
];

const EquivalencyCalculator = () => {
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
  
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert string values to numbers
    const hsPercentage = typeof highSchoolPercentage === 'string' 
      ? parseFloat(highSchoolPercentage) 
      : highSchoolPercentage;
      
    const qScore = typeof qiyasScore === 'string'
      ? parseFloat(qiyasScore)
      : qiyasScore;
    
    // Check if values are valid numbers
    if (isNaN(hsPercentage) || isNaN(qScore)) {
      return;
    }
    
    const score = calculateFinalEquivalencyScore(hsPercentage, qScore);
    setFinalScore(score);
    setShowResult(true);
  };

  const resetCalculator = () => {
    setHighSchoolPercentage("");
    setQiyasScore("");
    setFinalScore(null);
    setEligibleColleges([]);
    setSearchTerm("");
    setActiveTab("calculator");
  };

  // Filter colleges based on search term
  const filteredColleges = eligibleColleges.filter(college =>
    college.name.includes(searchTerm)
  );

  return (
    <Layout>
      <style>{hideSpinnerStyle}</style>
      <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-background via-background to-background/80">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full text-sm font-medium bg-primary/10 text-primary">
              <Calculator size={16} />
              <span>أداة مساعدة</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">حاسبة المعادلة التقديرية</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              احسب معدلك التقديري للمعادلة المصرية بناء على نسبة الثانوية العامة ودرجة اختبار القدرات
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Calculator Form - Make it responsive */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg border border-border/50 h-full">
                <CardHeader className="bg-primary/5 border-b border-border/20">
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    حاسبة المعدل التقديري
                  </CardTitle>
                  <CardDescription>أدخل نسبة الثانوية ودرجة اختبار القدرات</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleCalculate} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="highSchoolPercentage" className="text-right block mb-2">
                          نسبة الثانوية العامة (%)
                        </Label>
                        <div className="relative">
                          <Input
                            id="highSchoolPercentage"
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            placeholder="أدخل نسبة الثانوية (مثال: 98.5)"
                            value={highSchoolPercentage}
                            onChange={(e) => setHighSchoolPercentage(e.target.value)}
                            className="text-left w-full pr-10"
                            dir="ltr"
                            required
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="qiyasScore" className="text-right block mb-2">
                          درجة اختبار القدرات
                        </Label>
                        <div className="relative">
                          <Input
                            id="qiyasScore"
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            placeholder="أدخل درجة قياس (مثال: 85)"
                            value={qiyasScore}
                            onChange={(e) => setQiyasScore(e.target.value)}
                            className="text-left w-full"
                            dir="ltr"
                            required
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <Label htmlFor="gender" className="text-right block mb-2">
                          الجنس
                        </Label>
                        <Select value={gender} onValueChange={(value) => setGender(value as "male" | "female")}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="اختر الجنس" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">ذكر</SelectItem>
                            <SelectItem value="female">أنثى</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      احسب المعدل التقديري
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="bg-muted/20 border-t border-border/20 flex justify-center">
                  <Button variant="outline" size="sm" onClick={resetCalculator} className="text-sm">
                    إعادة ضبط
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Results Card - Improved responsiveness */}
            <div className="lg:col-span-2">
              {finalScore !== null && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="shadow-lg border border-primary/20 overflow-hidden h-full">
                    <CardHeader className="bg-primary/10 border-b border-primary/10">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart4 className="h-5 w-5 text-primary" />
                            نتيجة المعادلة التقديرية
                          </CardTitle>
                          <CardDescription>النتيجة بناء على البيانات المدخلة</CardDescription>
                        </div>
                        <div className="text-center sm:text-right">
                          <div className="text-sm text-muted-foreground">المعدل النهائي</div>
                          <div className="text-3xl font-bold text-primary">{finalScore}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="p-6 grid gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                          <div className="bg-muted/20 rounded-lg p-4">
                            <div className="text-sm text-muted-foreground mb-1">نسبة الثانوية</div>
                            <div className="text-2xl font-semibold">{highSchoolPercentage}%</div>
                          </div>
                          <div className="bg-muted/20 rounded-lg p-4">
                            <div className="text-sm text-muted-foreground mb-1">درجة اختبار القدرات</div>
                            <div className="text-2xl font-semibold">{qiyasScore}</div>
                          </div>
                        </div>

                        <Separator />
                        
                        <div>
                          <Tabs defaultValue="suitable">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="suitable">الكليات المناسبة</TabsTrigger>
                              <TabsTrigger value="all">جميع الكليات</TabsTrigger>
                            </TabsList>
                            <TabsContent value="suitable" className="mt-4">
                              <div className="max-h-[300px] overflow-y-auto px-1 py-2">
                                {(gender === "male" ? collegesMale : collegesFemale)
                                  .filter(college => college.minScore <= finalScore)
                                  .sort((a, b) => b.minScore - a.minScore)
                                  .map((college, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-border/10 hover:bg-muted/10 rounded-md px-2">
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:text-green-700">
                                          متاح
                                        </Badge>
                                        <span>{college.name}</span>
                                      </div>
                                      <span className="text-sm text-muted-foreground">{college.minScore}</span>
                                    </div>
                                  ))}
                              </div>
                            </TabsContent>
                            <TabsContent value="all" className="mt-4">
                              <div className="max-h-[300px] overflow-y-auto px-1 py-2">
                                {(gender === "male" ? collegesMale : collegesFemale)
                                  .sort((a, b) => b.minScore - a.minScore)
                                  .map((college, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-border/10 hover:bg-muted/10 rounded-md px-2">
                                      <div className="flex items-center gap-2">
                                        {college.minScore <= finalScore ? (
                                          <Badge variant="outline" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:text-green-700">
                                            متاح
                                          </Badge>
                                        ) : (
                                          <Badge variant="outline" className="bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700">
                                            غير متاح
                                          </Badge>
                                        )}
                                        <span>{college.name}</span>
                                      </div>
                                      <span className="text-sm text-muted-foreground">{college.minScore}</span>
                                    </div>
                                  ))}
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {!finalScore && (
                <Card className="shadow-lg border border-border/50 h-full flex flex-col justify-center items-center p-8 text-center bg-muted/10">
                  <div className="mb-6 bg-primary/10 p-4 rounded-full">
                    <Calculator className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">قم بإدخال بياناتك</h3>
                  <p className="text-muted-foreground max-w-md">
                    أدخل نسبة الثانوية العامة ودرجة اختبار القدرات في النموذج المجاور للحصول على المعدل التقديري والكليات المتاحة.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EquivalencyCalculator;
