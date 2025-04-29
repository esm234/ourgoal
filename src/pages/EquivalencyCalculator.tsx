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
  const [highSchoolPercentage, setHighSchoolPercentage] = useState("");
  const [qiyasScore, setQiyasScore] = useState("");
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [eligibleColleges, setEligibleColleges] = useState<Array<{ name: string; minScore: number }>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("calculator");
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    
    // Simulate calculation with progress
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 50);
    
    setTimeout(() => {
      const hsPercentage = parseFloat(highSchoolPercentage);
      const qsScore = parseFloat(qiyasScore);
      
      if (!isNaN(hsPercentage) && !isNaN(qsScore)) {
        const finalEquivalencyScore = calculateFinalEquivalencyScore(hsPercentage, qsScore);
        setFinalScore(finalEquivalencyScore);
        
        // Filter colleges based on eligibility
        const collegesList = gender === "male" ? collegesMale : collegesFemale;
        const eligible = collegesList.filter(college => college.minScore <= finalEquivalencyScore);
        setEligibleColleges(eligible);
        
        // Switch to results tab
        setActiveTab("result");
      }
      
      setIsCalculating(false);
    }, 600);
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
      <section className="py-16 px-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_75%)]"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-3"
            >
              <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20">
                حاسبة النسبة الموزونة
              </Badge>
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
            >
              حاسبة المعادلة والقبول بالجامعات
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-400 max-w-2xl mx-auto"
            >
              احسب نسبتك الموزونة ومعرفة الكليات المتاحة لك في الجامعات المصرية
            </motion.p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-3xl mx-auto">
            <TabsList className="grid grid-cols-2 w-[400px] mx-auto bg-background/30 p-1 backdrop-blur-sm">
              <TabsTrigger 
                value="calculator"
                className="data-[state=active]:bg-primary/90 data-[state=active]:text-white"
              >
                الحاسبة
              </TabsTrigger>
              <TabsTrigger 
                value="result"
                className="data-[state=active]:bg-primary/90 data-[state=active]:text-white"
                disabled={finalScore === null}
              >
                النتائج
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border border-white/10 bg-gradient-to-br from-gray-950/40 to-gray-900/40 shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl flex items-center gap-2 mb-2">
                      <Calculator className="h-6 w-6 text-primary" />
                      حاسبة النسبة الموزونة
                    </CardTitle>
                    <CardDescription>
                      ادخل نسبة الثانوية العامة ودرجة اختبار القدرات لحساب نسبتك الموزونة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCalculate} className="space-y-6">
                      {/* Gender Selection */}
                      <div className="space-y-2">
                        <Label className="text-right block mb-2">الجنس</Label>
                        <div className="flex justify-center gap-3">
                          <Button
                            type="button"
                            variant={gender === "male" ? "default" : "outline"}
                            className={`flex-1 ${gender === "male" ? "bg-primary/90" : ""}`}
                            onClick={() => setGender("male")}
                          >
                            ذكر
                          </Button>
                          <Button
                            type="button"
                            variant={gender === "female" ? "default" : "outline"}
                            className={`flex-1 ${gender === "female" ? "bg-primary/90" : ""}`}
                            onClick={() => setGender("female")}
                          >
                            أنثى
                          </Button>
                        </div>
                      </div>

                      {/* High School Percentage */}
                      <div className="space-y-2">
                        <Label className="text-right block">نسبة الثانوية العامة (%)</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            value={highSchoolPercentage}
                            onChange={(e) => setHighSchoolPercentage(e.target.value)}
                            className="pr-4 text-right"
                            placeholder="مثال: 98.5"
                            step="0.01"
                            min="0"
                            max="100"
                            required
                          />
                          <School className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      {/* Qiyas Score */}
                      <div className="space-y-2">
                        <Label className="text-right block">درجة اختبار القدرات</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            value={qiyasScore}
                            onChange={(e) => setQiyasScore(e.target.value)}
                            className="pr-4 text-right"
                            placeholder="مثال: 85"
                            step="0.01"
                            min="0"
                            max="100"
                            required
                          />
                          <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <Button 
                        type="submit" 
                        className="w-full bg-primary/90 hover:bg-primary group relative overflow-hidden"
                        size="lg"
                        disabled={isCalculating}
                      >
                        {isCalculating ? (
                          <div className="w-full">
                            <div className="mb-1">جاري الحساب...</div>
                            <Progress value={progress} className="h-1.5" />
                          </div>
                        ) : (
                          <>
                            <span className="relative z-10 flex items-center gap-2">
                              حساب النسبة الموزونة
                              <Calculator className="h-4 w-4" />
                            </span>
                            <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="result" className="mt-8">
              {finalScore !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* Result Card */}
                  <Card className="border border-primary/20 bg-gradient-to-br from-gray-950/60 to-gray-900/60 shadow-lg shadow-primary/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <BarChart4 className="h-5 w-5 text-primary" />
                        نتيجة الحساب
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-4">
                        <div className="text-center md:text-right space-y-2">
                          <p className="text-sm text-muted-foreground">البيانات المدخلة:</p>
                          <div className="flex gap-x-8 gap-y-2 flex-wrap justify-center md:justify-start">
                            <div className="bg-gray-800/50 px-3 py-1.5 rounded-md border border-gray-700/50">
                              <p className="text-xs text-gray-400">الثانوية العامة</p>
                              <p className="font-bold text-white">{highSchoolPercentage}%</p>
                            </div>
                            <div className="bg-gray-800/50 px-3 py-1.5 rounded-md border border-gray-700/50">
                              <p className="text-xs text-gray-400">اختبار القدرات</p>
                              <p className="font-bold text-white">{qiyasScore}</p>
                            </div>
                            <div className="bg-gray-800/50 px-3 py-1.5 rounded-md border border-gray-700/50">
                              <p className="text-xs text-gray-400">الجنس</p>
                              <p className="font-bold text-white">{gender === "male" ? "ذكر" : "أنثى"}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="relative w-28 h-28 mx-auto">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-3xl font-bold text-primary">{finalScore}</span>
                            </div>
                            <svg viewBox="0 0 36 36" className="-rotate-90 w-28 h-28">
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#444"
                                strokeWidth="3"
                                strokeDasharray="100, 100"
                              />
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={finalScore >= 400 ? '#4ade80' : finalScore >= 380 ? '#3b82f6' : finalScore >= 350 ? '#f59e0b' : '#ef4444'}
                                strokeWidth="3"
                                strokeDasharray={`${Math.min((finalScore / 410) * 100, 100)}, 100`}
                                strokeLinecap="round"
                                className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                              />
                            </svg>
                          </div>
                          <p className="mt-2 font-medium text-lg">النسبة الموزونة</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-gray-800/70">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">الكليات المتاحة</h3>
                            <p className="text-sm text-muted-foreground">
                              {eligibleColleges.length > 0 
                                ? `يمكنك التقديم إلى ${eligibleColleges.length} كلية`
                                : "لا توجد كليات متاحة بهذه النسبة"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 my-4">
                          <Badge variant={finalScore >= 400 ? "default" : "outline"} className="text-xs">
                            القمة {finalScore >= 400 ? <Check className="h-3 w-3 ml-1" /> : null}
                          </Badge>
                          <Badge variant={finalScore >= 380 ? "default" : "outline"} className="text-xs">
                            ممتاز {finalScore >= 380 ? <Check className="h-3 w-3 ml-1" /> : null}
                          </Badge>
                          <Badge variant={finalScore >= 350 ? "default" : "outline"} className="text-xs">
                            جيد {finalScore >= 350 ? <Check className="h-3 w-3 ml-1" /> : null}
                          </Badge>
                        </div>
                        
                        <Button 
                          onClick={resetCalculator} 
                          variant="outline" 
                          className="w-full mt-2"
                        >
                          حساب جديد
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Colleges List */}
                  {eligibleColleges.length > 0 && (
                    <Card className="border border-white/10 bg-gradient-to-br from-gray-950/40 to-gray-900/40">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-xl flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary" />
                            الكليات المتاحة
                          </CardTitle>
                          <Badge variant="outline">
                            {eligibleColleges.length} كلية
                          </Badge>
                        </div>
                        <CardDescription>
                          الكليات التي يمكنك التقديم إليها بناءً على نسبتك الموزونة
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="relative mb-4">
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="ابحث عن كلية..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 text-right"
                          />
                        </div>

                        <div className="space-y-2 mt-4 max-h-[400px] overflow-y-auto pr-2 
                          scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-gray-800/20 
                          hover:scrollbar-thumb-primary/60 scrollbar-thumb-rounded-full 
                          scrollbar-track-rounded-full">
                          {filteredColleges.length > 0 ? (
                            filteredColleges.map((college, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.03 }}
                                className="flex justify-between items-center p-3 bg-gray-800/40 rounded-md border border-gray-700/30 hover:border-primary/30 hover:bg-gray-800/60 transition-colors"
                              >
                                <Badge 
                                  variant="outline" 
                                  className={`
                                    ${college.minScore >= 400 ? 'bg-green-900/20 text-green-400 border-green-700/30' : 
                                    college.minScore >= 380 ? 'bg-blue-900/20 text-blue-400 border-blue-700/30' : 
                                    'bg-yellow-900/20 text-yellow-400 border-yellow-700/30'}
                                  `}
                                >
                                  {college.minScore}
                                </Badge>
                                <span className="font-medium text-sm text-right">{college.name}</span>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-muted-foreground">لا توجد نتائج للبحث</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="text-xs text-center text-muted-foreground pt-2 border-t border-gray-800/30">
                        ملاحظة: هذه النتائج تقريبية وقد تختلف النسب الفعلية عن السنوات السابقة
                      </CardFooter>
                    </Card>
                  )}
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Info Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            <Card className="border border-white/10 bg-gray-900/50 hover:bg-gray-900/70 transition-colors hover:border-primary/20">
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                  <Calculator className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">حاسبة دقيقة</CardTitle>
                <CardDescription>تحصل على نتائج دقيقة بناءً على معادلة النسبة الموزونة الرسمية</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border border-white/10 bg-gray-900/50 hover:bg-gray-900/70 transition-colors hover:border-primary/20">
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">معرفة الكليات المتاحة</CardTitle>
                <CardDescription>اكتشف الكليات التي يمكنك التقديم إليها بناءً على نسبتك الموزونة</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border border-white/10 bg-gray-900/50 hover:bg-gray-900/70 transition-colors hover:border-primary/20">
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                  <BarChart4 className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">بيانات محدّثة</CardTitle>
                <CardDescription>نسب القبول مبنية على بيانات السنوات السابقة مع تحديثات دورية</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default EquivalencyCalculator;
