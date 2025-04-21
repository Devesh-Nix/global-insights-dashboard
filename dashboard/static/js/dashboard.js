// Configuration
const API_URL = '/api/insights/'; // Update with your actual API endpoint

// Global variables
let insightsData = [];
let charts = {};
let filterElements;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function () {
  filterElements = {
    endYear: document.getElementById('endYearFilter'),
    topic: document.getElementById('topicFilter'),
    sector: document.getElementById('sectorFilter'),
    region: document.getElementById('regionFilter'),
    pestle: document.getElementById('pestleFilter'),
    source: document.getElementById('sourceFilter'),
    swot: document.getElementById('swotFilter'),
    country: document.getElementById('countryFilter'),
    city: document.getElementById('cityFilter')

  };

  // Fetch data and initialize dashboard
  fetchData();

  // Set up event listeners
  document.getElementById('applyFilters').addEventListener('click', applyFilters);
  document.getElementById('resetFilters').addEventListener('click', resetFilters);
  document.getElementById('refreshData').addEventListener('click', fetchData);
});

// Fetch data from API
function fetchData(filters = {}) {
  const params = new URLSearchParams(filters);

  showLoading(true);

  fetch(`${API_URL}?${params.toString()}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      insightsData = data;
      processData(data);
      populateFilters(data);
      renderDashboard(data);
      showLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      showLoading(false);
      showError('Failed to load data. Please try again later.');
    });
}

// Process raw data
function processData(data) {
  // Calculate aggregates
  const metrics = data.reduce((acc, item) => {
    // Add intensity if it exists and is a number
    if (item.intensity && !isNaN(item.intensity)) {
      acc.totalIntensity += parseFloat(item.intensity);
      acc.intensityCount++;
    }
    
    // Add likelihood if it exists and is a number
    if (item.likelihood && !isNaN(item.likelihood)) {
      acc.totalLikelihood += parseFloat(item.likelihood);
      acc.likelihoodCount++;
    }
    
    // Add relevance if it exists and is a number
    if (item.relevance && !isNaN(item.relevance)) {
      acc.totalRelevance += parseFloat(item.relevance);
      acc.relevanceCount++;
    }
    
    return acc;
  }, {
    totalIntensity: 0,
    intensityCount: 0,
    totalLikelihood: 0,
    likelihoodCount: 0,
    totalRelevance: 0,
    relevanceCount: 0
  });
  
  // Update metrics in the UI
  document.getElementById('avgIntensity').textContent = 
    (metrics.intensityCount > 0 ? (metrics.totalIntensity / metrics.intensityCount).toFixed(2) : 'N/A');
  
  document.getElementById('avgLikelihood').textContent = 
    (metrics.likelihoodCount > 0 ? (metrics.totalLikelihood / metrics.likelihoodCount).toFixed(2) : 'N/A');
  
  document.getElementById('avgRelevance').textContent = 
    (metrics.relevanceCount > 0 ? (metrics.totalRelevance / metrics.relevanceCount).toFixed(2) : 'N/A');
  
  document.getElementById('totalInsights').textContent = data.length;
}

// Populate filter dropdowns
function populateFilters(data) {
  // Extract unique values for each filter
  const filterValues = {
    endYear: new Set(),
    topic: new Set(),
    sector: new Set(),
    region: new Set(),
    pestle: new Set(),
    source: new Set(),
    swot: new Set(),
    country: new Set(),
    city: new Set()
  };
  
  // Collect all unique values
  data.forEach(item => {
    if (item.end_year) filterValues.endYear.add(item.end_year);
    if (item.topic) filterValues.topic.add(item.topic);
    if (item.sector) filterValues.sector.add(item.sector);
    if (item.region) filterValues.region.add(item.region);
    if (item.pestle) filterValues.pestle.add(item.pestle);
    if (item.source) filterValues.source.add(item.source);
    if (item.swot) filterValues.swot.add(item.swot);
    if (item.country) filterValues.country.add(item.country);
    if (item.city) filterValues.city.add(item.city);
  });
  
  // Populate dropdowns
  populateDropdown(filterElements.endYear, [...filterValues.endYear].sort());
  populateDropdown(filterElements.topic, [...filterValues.topic].sort());
  populateDropdown(filterElements.sector, [...filterValues.sector].sort());
  populateDropdown(filterElements.region, [...filterValues.region].sort());
  populateDropdown(filterElements.pestle, [...filterValues.pestle].sort());
  populateDropdown(filterElements.source, [...filterValues.source].sort());
  populateDropdown(filterElements.swot, [...filterValues.swot].sort());
  populateDropdown(filterElements.country, [...filterValues.country].sort());
  populateDropdown(filterElements.city, [...filterValues.city].sort());
}

// Populate dropdown with options
function populateDropdown(selectElement, values) {
  // Preserve the "All" option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'All';
  
  // Clear existing options
  selectElement.innerHTML = '';
  selectElement.appendChild(defaultOption);

  // Add new options
  values.forEach(value => {
    if (value) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      selectElement.appendChild(option);
    }
  });
}

// Render dashboard charts and tables
function renderDashboard(data) {
  renderIntensityByYearChart(data);
  renderTopicsChart(data);
  renderRelevanceLikelihoodChart(data);
  renderRegionChart(data);
  renderCountryChart(data);
  renderInsightsTable(data);
  renderCityChart(data);
}

// Create Intensity by Year chart
function renderIntensityByYearChart(data) {
  // Group data by year
  const yearData = {};
  
  data.forEach(item => {
    if (item.start_year && !isNaN(item.start_year) && item.intensity) {
      const year = item.start_year;
      if (!yearData[year]) {
        yearData[year] = {
          intensitySum: 0,
          count: 0
        };
      }
      yearData[year].intensitySum += parseFloat(item.intensity);
      yearData[year].count++;
    }
  });
  
  // Prepare chart data
  const years = Object.keys(yearData).sort();
  const intensities = years.map(year => yearData[year].intensitySum / yearData[year].count);
  
  // Create chart
  const ctx = document.getElementById('intensityByYearChart').getContext('2d');
  
  // Destroy existing chart if it exists
  if (charts.intensityByYear) {
    charts.intensityByYear.destroy();
  }
  
  charts.intensityByYear = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [{
        label: 'Average Intensity',
        data: intensities,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Intensity'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Year'
          }
        }
      }
    }
  });
}

// Create Topics Distribution chart
function renderTopicsChart(data) {
  // Count topics
  const topicCounts = {};
  
  data.forEach(item => {
    if (item.topic) {
      if (!topicCounts[item.topic]) {
        topicCounts[item.topic] = 0;
      }
      topicCounts[item.topic]++;
    }
  });
  
  // Sort topics by count and get top 10
  const sortedTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  const topicLabels = sortedTopics.map(entry => entry[0]);
  const topicData = sortedTopics.map(entry => entry[1]);
  
  // Generate colors
  const backgroundColors = [
    'rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)',
    'rgba(199, 199, 199, 0.7)',
    'rgba(83, 102, 255, 0.7)',
    'rgba(40, 159, 64, 0.7)',
    'rgba(210, 105, 30, 0.7)'
  ];
  
  // Create chart
  const ctx = document.getElementById('topicsChart').getContext('2d');
  
  // Destroy existing chart if it exists
  if (charts.topics) {
    charts.topics.destroy();
  }
  
  charts.topics = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: topicLabels,
      datasets: [{
        data: topicData,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12
          }
        }
      }
    }
  });
}

// Create Relevance vs Likelihood chart
function renderRelevanceLikelihoodChart(data) {
  // Filter data with both relevance and likelihood
  const validData = data.filter(item => 
    item.relevance && item.likelihood && 
    !isNaN(item.relevance) && !isNaN(item.likelihood)
  );
  
  // Prepare chart data
  const chartData = validData.map(item => ({
    x: parseFloat(item.relevance),
    y: parseFloat(item.likelihood),
    topic: item.topic || 'Unknown',
    sector: item.sector || 'Unknown'
  }));
  
  // Create chart
  const ctx = document.getElementById('relevanceLikelihoodChart').getContext('2d');
  
  // Destroy existing chart if it exists
  if (charts.relevanceLikelihood) {
    charts.relevanceLikelihood.destroy();
  }
  
  charts.relevanceLikelihood = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Insights',
        data: chartData,
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Relevance'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Likelihood'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              const point = context.raw;
              return [
                `Topic: ${point.topic}`,
                `Sector: ${point.sector}`,
                `Relevance: ${point.x}`,
                `Likelihood: ${point.y}`
              ];
            }
          }
        }
      }
    }
  });
}

// Create Region Distribution chart
function renderRegionChart(data) {
  // Count regions
  const regionCounts = {};
  
  data.forEach(item => {
    if (item.region) {
      if (!regionCounts[item.region]) {
        regionCounts[item.region] = 0;
      }
      regionCounts[item.region]++;
    }
  });
  
  // Sort regions by count
  const sortedRegions = Object.entries(regionCounts)
    .sort((a, b) => b[1] - a[1]);
  
  const regionLabels = sortedRegions.map(entry => entry[0]);
  const regionData = sortedRegions.map(entry => entry[1]);
  
  // Generate colors
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 360 / count) % 360;
      colors.push(`hsla(${hue}, 70%, 60%, 0.7)`);
    }
    return colors;
  };
  
  const backgroundColors = generateColors(regionLabels.length);
  
  // Create chart
  const ctx = document.getElementById('regionChart').getContext('2d');
  
  // Destroy existing chart if it exists
  if (charts.region) {
    charts.region.destroy();
  }
  
  charts.region = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: regionLabels,
      datasets: [{
        label: 'Number of Insights',
        data: regionData,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Count'
          }
        }
      }
    }
  });
}

// Create Country Distribution chart
function renderCountryChart(data) {
  const countryCounts = {};

  data.forEach(item => {
    if (item.country) {
      countryCounts[item.country] = (countryCounts[item.country] || 0) + 1;
    }
  });

  const sorted = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const labels = sorted.map(e => e[0]);
  const values = sorted.map(e => e[1]);
  const colors = labels.map((_, i) => `hsl(${i * 35}, 70%, 60%)`);

  const ctx = document.getElementById('countryChart').getContext('2d');
  if (charts.countryChart) charts.countryChart.destroy();
  charts.countryChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Insights per Country',
        data: values,
        backgroundColor: colors
      }]
    }
  });
}

function renderCityChart(data) {
  const cityCounts = {};

  data.forEach(item => {
    if (item.city) {
      cityCounts[item.city] = (cityCounts[item.city] || 0) + 1;
    }
  });

  const sorted = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);  // Top 10 cities

  const labels = sorted.map(e => e[0]);
  const values = sorted.map(e => e[1]);
  const colors = labels.map((_, i) => `hsl(${i * 30}, 70%, 60%)`);

  const ctx = document.getElementById('cityChart').getContext('2d');

  // Destroy existing chart if needed
  if (charts.cityChart) {
    charts.cityChart.destroy();
  }

  charts.cityChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Insights per City',
        data: values,
        backgroundColor: colors,
        borderColor: colors.map(c => c.replace('0.7', '1')),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Insights'
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Render insights table
function renderInsightsTable(data) {
  const tableBody = document.getElementById('insightsTableBody');
  tableBody.innerHTML = '';

  if (data.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 7;
    cell.textContent = 'No insights available.';
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }

  data.slice(0, 10).forEach(insight => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${insight.title || 'N/A'}</td>
      <td>${insight.topic || 'N/A'}</td>
      <td>${insight.sector || 'N/A'}</td>
      <td>${insight.region || 'N/A'}</td>
      <td>${insight.intensity || 'N/A'}</td>
      <td>${insight.likelihood || 'N/A'}</td>
      <td>${insight.relevance || 'N/A'}</td>
    `;
    tableBody.appendChild(row);
  });
}


// Apply filters
function applyFilters() {
  const filters = {
    end_year: filterElements.endYear.value,
    topic: filterElements.topic.value,
    sector: filterElements.sector.value,
    region: filterElements.region.value,
    pestle: filterElements.pestle.value,
    source: filterElements.source.value,
    swot: filterElements.swot.value,
    country: filterElements.country.value,
    city: filterElements.city.value

  };
  
  fetchData(filters);
}

// Reset filters
function resetFilters() {
  Object.values(filterElements).forEach(element => {
    element.selectedIndex = 0;
  });
  fetchData();
}

// Show loading state
function showLoading(isLoading) {
  // Add loading state logic here
  // For example: show/hide a loading spinner
  // or apply disabled state to buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.disabled = isLoading;
  });
}

// Show error message
function showError(message) {
  // Remove existing alerts
  const existingAlert = document.querySelector('.alert');
  if (existingAlert) {
    existingAlert.remove();
  }

  // Create a dismissible alert
  const alertElement = document.createElement('div');
  alertElement.className = 'alert alert-danger alert-dismissible fade show';
  alertElement.role = 'alert';
  
  alertElement.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  // Add to the page - insert after the header
  const header = document.querySelector('h4.fw-bold');
  header.parentNode.insertBefore(alertElement, header.nextSibling);
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    const bsAlert = bootstrap.Alert.getOrCreateInstance(alertElement);
    bsAlert.close();
  }, 5000);
}

// Use sample data (for development/testing)
function useSampleData() {
  // Sample data that matches your model structure
  const sampleData = [
    {
      "title": "Global warming threatens food security",
      "intensity": 6,
      "sector": "Environment",
      "topic": "Climate Change",
      "insight": "Rising temperatures affecting crop yields globally",
      "region": "World",
      "start_year": "2022",
      "end_year": "2030",
      "country": "Global",
      "relevance": 5,
      "pestle": "Environmental",
      "source": "Climate Research Institute",
      "likelihood": 4,
      "swot": "Threat"
    },
    {
      "title": "AI revolution in healthcare diagnostics",
      "intensity": 8,
      "sector": "Healthcare",
      "topic": "Artificial Intelligence",
      "insight": "AI systems detecting diseases with 95% accuracy",
      "region": "North America",
      "start_year": "2023",
      "end_year": "2028",
      "country": "United States",
      "relevance": 7,
      "pestle": "Technological",
      "source": "Medical Innovation Journal",
      "likelihood": 8,
      "swot": "Opportunity"
    },
    {
      "title": "Renewable energy investment surge",
      "intensity": 7,
      "sector": "Energy",
      "topic": "Renewable Energy",
      "insight": "Global investments in renewables reached record high",
      "region": "Europe",
      "start_year": "2022",
      "end_year": "2025",
      "country": "Germany",
      "relevance": 6,
      "pestle": "Economic",
      "source": "Energy Finance Report",
      "likelihood": 7,
      "swot": "Strength"
    },
    // Add more sample data as needed
  ];
  
  // Process sample data
  insightsData = sampleData;
  processData(sampleData);
  populateFilters(sampleData);
  renderDashboard(sampleData);
}

// Add city filter functionality if needed
function addCityFilterFunctionality() {
  const cityFilter = document.createElement('select');
  cityFilter.id = 'cityFilter';
  cityFilter.className = 'form-select';
  
  // Add to the DOM and integrate with existing filters
  // This is a placeholder function - implement as needed
}

// You might need additional functions based on your specific requirements
// For example:
// - Export functionality
// - PDF report generation
// - Data caching
// - Interactive tooltips for charts
// - City-specific visualizations
// - SWOT analysis breakdown
// - End-year trend forecasting