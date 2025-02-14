const width = 800, height = 500, margin = {top: 40, right: 30, bottom: 50, left: 60};

const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);


d3.csv("data_estrus_hourly.csv").then(data => {

  data.forEach(d => {
    d.HourOfDay = +d.HourOfDay;
    d.MeanMeasurement = +d.MeanMeasurement;
    d.Estrus = d.Estrus === "true" ? true : false;
  });

  const x = d3.scaleLinear()
      .domain([0, 23])  
      .range([margin.left, width - margin.right]);

  const yMin = d3.min(data, d => d.MeanMeasurement);
  const yMax = d3.max(data, d => d.MeanMeasurement);
  const y = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([height - margin.bottom, margin.top]);

  const estrusData = data.filter(d => d.Estrus === true);
  const nonEstrusData = data.filter(d => d.Estrus === false);

  const lineGen = d3.line()
    .x(d => x(d.HourOfDay))
    .y(d => y(d.MeanMeasurement))
    .curve(d3.curveMonotoneX);  

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(24));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));


  svg.append("path")
     .datum(estrusData)
     .attr("fill", "none")
     .attr("stroke", "red")
     .attr("stroke-width", 2)
     .attr("d", lineGen);

  svg.append("path")
     .datum(nonEstrusData)
     .attr("fill", "none")
     .attr("stroke", "blue")
     .attr("stroke-width", 2)
     .attr("d", lineGen);


});
