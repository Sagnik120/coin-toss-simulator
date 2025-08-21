// Initialize variables
let headCount = 0;
let tailCount = 0;
let tossHistory = [];
let resultsChart = null;
let normalDistributionChart = null;
let isAnimating = false;

// DOM elements
const tossCountInput = document.getElementById('tossCount');
const tossButton = document.getElementById('tossButton');
const tossSingleButton = document.getElementById('tossSingleButton');
const resetButton = document.getElementById('resetButton');
const headCountElement = document.getElementById('headCount');
const tailCountElement = document.getElementById('tailCount');
const headPercentElement = document.getElementById('headPercent');
const tailPercentElement = document.getElementById('tailPercent');
const historyListElement = document.getElementById('historyList');
const animatedCoin = document.getElementById('animatedCoin');

// Initialize charts
function initCharts() {
    initResultsChart();
    initNormalDistributionChart();
}

// Initialize results chart
function initResultsChart() {
    const ctx = document.getElementById('resultsChart').getContext('2d');
    resultsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Heads', 'Tails'],
            datasets: [{
                label: 'Number of Tosses',
                data: [0, 0],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(231, 76, 60, 0.7)'
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Coin Toss Results'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = headCount + tailCount;
                            const percentage = total > 0 ? 
                                ((context.parsed.y / total) * 100).toFixed(1) + '%' : '0%';
                            return `${context.dataset.label}: ${context.parsed.y} (${percentage})`;
                        }
                    }
                }
            }
        }
    });
}

// Initialize normal distribution chart
function initNormalDistributionChart() {
    const ctx = document.getElementById('normalDistributionChart').getContext('2d');
    normalDistributionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Normal Distribution',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Number of Heads'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Probability'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Theoretical Normal Distribution'
                }
            }
        }
    });
}

// Update normal distribution chart
function updateNormalDistributionChart() {
    const totalTosses = headCount + tailCount;
    
    if (totalTosses === 0) {
        // Clear the chart if no tosses
        normalDistributionChart.data.labels = [];
        normalDistributionChart.data.datasets[0].data = [];
        normalDistributionChart.update();
        return;
    }
    
    // Calculate parameters for normal distribution
    const n = totalTosses;
    const p = 0.5; // Probability of heads for a fair coin
    const mean = n * p;
    const stdDev = Math.sqrt(n * p * (1 - p));
    
    // Generate data points for normal distribution
    const minX = Math.max(0, Math.floor(mean - 3 * stdDev));
    const maxX = Math.min(n, Math.ceil(mean + 3 * stdDev));
    
    const labels = [];
    const data = [];
    
    for (let x = minX; x <= maxX; x++) {
        labels.push(x);
        // Calculate normal distribution probability density function
        const probability = normalPDF(x, mean, stdDev);
        data.push(probability);
    }
    
    // Update chart
    normalDistributionChart.data.labels = labels;
    normalDistributionChart.data.datasets[0].data = data;
    normalDistributionChart.update();
}

// Normal distribution probability density function
function normalPDF(x, mean, stdDev) {
    const variance = stdDev * stdDev;
    if (variance === 0) return 0;
    
    const m = 1 / (Math.sqrt(2 * Math.PI * variance));
    const e = Math.exp(-((x - mean) * (x - mean)) / (2 * variance));
    return m * e;
}

// Toss single coin with animation
function tossSingleCoin() {
    if (isAnimating) return;
    
    isAnimating = true;
    
    // Remove any existing animation classes
    animatedCoin.classList.remove('flipping');
    animatedCoin.classList.remove('heads-result');
    animatedCoin.classList.remove('tails-result');
    
    // Force reflow
    void animatedCoin.offsetWidth;
    
    // Add flipping animation class
    animatedCoin.classList.add('flipping');
    
    // Determine result after animation completes
    setTimeout(() => {
        const result = Math.random() < 0.5 ? 'H' : 'T';
        
        if (result === 'H') {
            headCount++;
            animatedCoin.classList.add('heads-result');
        } else {
            tailCount++;
            animatedCoin.classList.add('tails-result');
        }
        
        tossHistory.push(result);
        updateDisplay();
        
        // Allow another toss after animation completes
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }, 1000);
}

// Toss multiple coins
function tossMultipleCoins() {
    const tossCount = parseInt(tossCountInput.value);
    
    if (isNaN(tossCount) || tossCount <= 0) {
        alert('Please enter a valid number of tosses');
        return;
    }
    
    // Animate the coin for the first toss
    if (tossCount > 0) {
        animatedCoin.classList.remove('flipping');
        void animatedCoin.offsetWidth;
        animatedCoin.classList.add('flipping');
    }
    
    for (let i = 0; i < tossCount; i++) {
        // Add a small delay between each toss for visual effect
        setTimeout(() => {
            const result = Math.random() < 0.5 ? 'H' : 'T';
            
            if (result === 'H') {
                headCount++;
            } else {
                tailCount++;
            }
            
            tossHistory.push(result);
            
            // Update display after the last toss
            if (i === tossCount - 1) {
                setTimeout(() => {
                    updateDisplay();
                    animatedCoin.classList.remove('flipping');
                    
                    // Show the result on the animated coin
                    if (result === 'H') {
                        animatedCoin.classList.add('heads-result');
                    } else {
                        animatedCoin.classList.add('tails-result');
                    }
                }, 500);
            }
        }, i * 100);
    }
}

// Update display with current results
function updateDisplay() {
    // Update counters
    headCountElement.textContent = headCount;
    tailCountElement.textContent = tailCount;
    
    // Calculate percentages and fractions
    const total = headCount + tailCount;
    
    let headPercentage = 0;
    let headFraction = "0/0";
    
    let tailPercentage = 0;
    let tailFraction = "0/0";
    
    if (total > 0) {
        headPercentage = ((headCount / total) * 100).toFixed(1);
        headFraction = `${headCount}/${total}`;
        
        tailPercentage = ((tailCount / total) * 100).toFixed(1);
        tailFraction = `${tailCount}/${total}`;
    }
    
    headPercentElement.textContent = `(${headPercentage}% - ${headFraction})`;
    tailPercentElement.textContent = `(${tailPercentage}% - ${tailFraction})`;
    
    // Update charts
    if (resultsChart) {
        resultsChart.data.datasets[0].data = [headCount, tailCount];
        resultsChart.update();
    }
    
    updateNormalDistributionChart();
    
    // Update history display (show last 50 tosses)
    historyListElement.innerHTML = '';
    const displayHistory = tossHistory.slice(-50);
    
    displayHistory.forEach(result => {
        const coinElement = document.createElement('div');
        coinElement.classList.add('coin');
        coinElement.classList.add(result === 'H' ? 'head-coin' : 'tail-coin');
        
        const front = document.createElement('div');
        front.classList.add('front');
        front.textContent = 'H';
        
        const back = document.createElement('div');
        back.classList.add('back');
        back.textContent = 'T';
        
        coinElement.appendChild(front);
        coinElement.appendChild(back);
        historyListElement.appendChild(coinElement);
    });
}

// Reset everything
function resetSimulator() {
    headCount = 0;
    tailCount = 0;
    tossHistory = [];
    
    // Reset animation coin
    animatedCoin.classList.remove('flipping');
    animatedCoin.classList.remove('heads-result');
    animatedCoin.classList.remove('tails-result');
    
    updateDisplay();
}

// Event listeners
tossButton.addEventListener('click', tossMultipleCoins);
tossSingleButton.addEventListener('click', tossSingleCoin);
resetButton.addEventListener('click', resetSimulator);

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
    updateDisplay();
});