import React, { useLayoutEffect, useRef } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

interface RevenuePieChartProps {
    data: any[];
    categoryField: string;
    valueField: string;
    chartId: string;
}

const RevenuePieChart: React.FC<RevenuePieChartProps> = ({ data, categoryField, valueField, chartId }) => {
    const chartRef = useRef<am4charts.PieChart3D | null>(null);

    useLayoutEffect(() => {
        // Create chart instance
        let chart = am4core.create(chartId, am4charts.PieChart3D);

        // Add data
        chart.data = data;

        // Set inner radius
        chart.innerRadius = am4core.percent(40);

        // Add legend
        chart.legend = new am4charts.Legend();
        chart.legend.position = "right";
        chart.legend.scrollable = true;

        // Add series
        let series = chart.series.push(new am4charts.PieSeries3D());
        series.dataFields.value = valueField;
        series.dataFields.category = categoryField;

        // Configure slices
        series.slices.template.cornerRadius = 6;
        series.colors.step = 3;
        series.slices.template.tooltipText = "{category}: ${value.value}";

        // Initial animation
        chart.hiddenState.properties.opacity = 0;

        chartRef.current = chart;

        return () => {
            chart.dispose();
        };
    }, [data, categoryField, valueField, chartId]);

    return (
        <div id={chartId} style={{ width: "100%", height: "400px" }}></div>
    );
};

export default RevenuePieChart;
