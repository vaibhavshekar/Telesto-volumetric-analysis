// Function to initialize Plotly graph with sliders and hover info
async function plotGraph() {
    const response = await fetch('Saturation_Model_Production_Model_Data.csv');
    const csvData = await response.text();
    const parsedData = Papa.parse(csvData, { header: true });

    // Data extraction
    const years = parsedData.data.map(row => parseInt(row.Year, 10)).filter(year => !isNaN(year));
    const modelCumOil = parsedData.data.map(row => parseFloat(row['Predicted Cumulative OIL (MMSKL)']));
    const actualCumOil = parsedData.data.map(row => parseFloat(row['GRPC Cumulative OIL (MMSKL)']));
    const modelOilDiff = parsedData.data.map(row => parseFloat(row['Predicted Yearly OIL rate (MMSKL/yr)']));
    const actualOilDiff = parsedData.data.map(row => parseFloat(row['GRPC Yearly OIL rate (MMSKL/yr)']));

    const customHoverText1 = years.map((year, index) =>
        `Date: ${year}<br>` +
        `Model Cumulative Oil: ${modelCumOil[index].toFixed(2)}<br>` +
        `Actual Cumulative Oil: ${actualCumOil[index].toFixed(2)}`
    );
    const customHoverText2 = years.map((year, index) =>
        `Date: ${year}<br>` +
        `Model Oil Diff: ${modelOilDiff[index].toFixed(2)}<br>` +
        `Actual Oil Diff: ${actualOilDiff[index].toFixed(2)}`
    );
    // Plot 1: Cumulative Oil
    var traceCumulativeModel = {
        x: years,
        y: modelCumOil,
        type: 'line',
        mode: 'lines+markers',
        name: 'Model Cum Oil',
        line: { color: 'green' , shape: 'spline'},
        text: modelCumOil.map(String),
        hoverinfo: 'none'
    };

    var traceCumulativeActual = {
        x: years,
        y: actualCumOil,
        type: 'line',
        mode: 'lines+markers',
        name: 'Actual Cum Oil',
        line: { color: 'blue', dash: 'dot' , shape: 'spline'},
        text: actualCumOil.map(String),
        hoverinfo: 'none'
    };
    var hoverTrace1 = {
        x: years,
        y: modelCumOil,
        mode: 'markers',
        marker: { size: 1, color: 'rgba(0,0,0,0)' },
        hoverinfo: 'text',
        text: customHoverText1,
        showlegend: false
    };

    var layoutCumulative = {
        xaxis: { title: 'Year' },
        yaxis: { title: 'Oil Volume (MMSkL)' },
        margin: { t: 80, b: 100, l: 70, r: 70 },
        height:800
    };

    Plotly.newPlot('plotlyGraph1', [traceCumulativeModel, traceCumulativeActual, hoverTrace1], layoutCumulative);

    // Plot 2: Oil Rate Difference
    var traceRateModel = {
        x: years,
        y: modelOilDiff,
        type: 'line',
        mode: 'lines+markers',
        name: 'Model Oil Diff',
        line: { color: 'green', shape: 'spline'},
        text: modelOilDiff.map(String),
        hoverinfo: 'none'
    };

    var traceRateActual = {
        x: years,
        y: actualOilDiff,
        type: 'line',
        mode: 'lines+markers',
        name: 'Actual Oil Diff',
        line: { color: 'blue', dash: 'dot' },
        text: actualOilDiff.map(String),
        hoverinfo: 'none'
    };

    var hoverTrace2 = {
        x: years,
        y: modelOilDiff,
        mode: 'markers',
        marker: { size: 1, color: 'rgba(0,0,0,0)' },
        hoverinfo: 'text',
        text: customHoverText2,
        showlegend: false
    };

    var layoutRate = {
        xaxis: { title: 'Year' },
        yaxis: { title: 'Oil Rate (klpd)' },
        margin: { t: 80, b: 100, l: 70, r: 70 },
        height: 800
    };

    Plotly.newPlot('plotlyGraph2', [traceRateModel, traceRateActual, hoverTrace2], layoutRate, hoverTrace2);

    // Initialize the slider for each plot
    initSlider(years, 'plotlyGraph1', 'yearSlider1');
    initSlider(years, 'plotlyGraph2', 'yearSlider2');
}

// Function to initialize slider and bind it to the Plotly graph
function initSlider(years, plotId, sliderId) {
    const validYears = [...years].sort((a, b) => a - b);
    const minYear = validYears[0];
    const maxYear = validYears[validYears.length - 1];

    if (!isNaN(minYear) && !isNaN(maxYear)) {
        noUiSlider.create(document.getElementById(sliderId), {
            start: [minYear, maxYear],
            connect: true,
            step: 1,
            range: {
                'min': minYear,
                'max': maxYear
            }
        });

        document.getElementById(sliderId).noUiSlider.on('update', function (values, handle) {
            let newYearRange = values.map(Number);
            Plotly.relayout(plotId, {
                'xaxis.range': [newYearRange[0], newYearRange[1]]
            });
        });
    } else {
        console.error('Invalid year range for slider');
    }
}

plotGraph();
