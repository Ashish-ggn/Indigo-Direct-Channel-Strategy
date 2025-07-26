// IndiGo Presentation App JavaScript
class PresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 18;
        this.charts = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSlideCounter();
        this.updateProgressBar();
        this.updateNavButtons();
        this.initializeCharts();
    }

    setupEventListeners() {
        // Navigation buttons - fixed click handlers
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.previousSlide();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.nextSlide();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
            }
        });

        // Touch/swipe support for mobile
        let startX = null;
        let startY = null;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (startX === null || startY === null) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only handle horizontal swipes
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
            
            startX = null;
            startY = null;
        }, { passive: true });
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;

        // Remove active class from current slide
        const currentSlideEl = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
        if (currentSlideEl) {
            currentSlideEl.classList.remove('active');
        }

        // Add active class to new slide
        const newSlideEl = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
        if (newSlideEl) {
            newSlideEl.classList.add('active');
        }

        this.currentSlide = slideNumber;
        this.updateSlideCounter();
        this.updateProgressBar();
        this.updateNavButtons();

        // Initialize charts for specific slides when they become active
        this.initializeSlideCharts(slideNumber);
    }

    updateSlideCounter() {
        const currentSlideEl = document.getElementById('currentSlide');
        const totalSlidesEl = document.getElementById('totalSlides');
        
        if (currentSlideEl) currentSlideEl.textContent = this.currentSlide;
        if (totalSlidesEl) totalSlidesEl.textContent = this.totalSlides;
    }

    updateProgressBar() {
        const progress = (this.currentSlide / this.totalSlides) * 100;
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    updateNavButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.disabled = this.currentSlide === 1;
        if (nextBtn) nextBtn.disabled = this.currentSlide === this.totalSlides;
    }

    initializeCharts() {
        // Initialize charts that are visible on load
        this.initializeSlideCharts(1);
    }

    initializeSlideCharts(slideNumber) {
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
            switch(slideNumber) {
                case 3:
                    this.createMarketChart();
                    break;
                case 4:
                    this.createCurrentStateChart();
                    break;
                case 6:
                    this.createOpportunityChart();
                    break;
                case 14:
                    this.createKPIChart();
                    break;
                case 15:
                    this.createCompetitiveChart();
                    break;
            }
        }, 100);
    }

    createMarketChart() {
        if (this.charts.marketChart) {
            this.charts.marketChart.destroy();
        }

        const ctx = document.getElementById('marketChart');
        if (!ctx) return;

        this.charts.marketChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Online Bookings', 'Traditional Channels'],
                datasets: [{
                    data: [70, 30],
                    backgroundColor: ['#1FB8CD', '#FFC185'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Global Airline Booking Distribution',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 20
                    }
                }
            }
        });
    }

    createCurrentStateChart() {
        if (this.charts.currentStateChart) {
            this.charts.currentStateChart.destroy();
        }

        const ctx = document.getElementById('currentStateChart');
        if (!ctx) return;

        this.charts.currentStateChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['IndiGo Current', 'Industry Average', 'Target'],
                datasets: [{
                    label: 'Direct Booking Rate (%)',
                    data: [15, 47, 35],
                    backgroundColor: ['#B4413C', '#5D878F', '#1FB8CD'],
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Direct Booking Performance Comparison',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 50,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    createOpportunityChart() {
        if (this.charts.opportunityChart) {
            this.charts.opportunityChart.destroy();
        }

        const ctx = document.getElementById('opportunityChart');
        if (!ctx) return;

        this.charts.opportunityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Current', '3 Months', '6 Months', '9 Months', '12 Months'],
                datasets: [
                    {
                        label: 'Direct Booking Rate (%)',
                        data: [15, 20, 25, 30, 35],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: 'Cost Savings (₹ Crores)',
                        data: [0, 50, 100, 150, 200],
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    title: {
                        display: true,
                        text: 'Projected Growth & Savings',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Direct Booking Rate (%)'
                        },
                        max: 40
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Cost Savings (₹ Crores)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                        max: 250
                    }
                }
            }
        });
    }

    createKPIChart() {
        if (this.charts.kpiChart) {
            this.charts.kpiChart.destroy();
        }

        const ctx = document.getElementById('kpiChart');
        if (!ctx) return;

        this.charts.kpiChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'Direct Booking Rate',
                    'Conversion Rate', 
                    'Customer Lifetime Value',
                    'App Engagement',
                    'Social Media Reach',
                    'Customer Satisfaction'
                ],
                datasets: [
                    {
                        label: 'Current Performance',
                        data: [30, 40, 50, 35, 25, 60],
                        borderColor: '#B4413C',
                        backgroundColor: 'rgba(180, 65, 60, 0.2)',
                        pointBackgroundColor: '#B4413C',
                        pointBorderColor: '#fff',
                        pointRadius: 4
                    },
                    {
                        label: 'Target Performance',
                        data: [70, 80, 75, 85, 75, 85],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.2)',
                        pointBackgroundColor: '#1FB8CD',
                        pointBorderColor: '#fff',
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15
                        }
                    },
                    title: {
                        display: true,
                        text: 'KPI Performance Dashboard',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                elements: {
                    line: {
                        borderWidth: 2
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        grid: {
                            circular: true
                        },
                        pointLabels: {
                            font: {
                                size: 10
                            }
                        },
                        ticks: {
                            display: false
                        },
                        min: 0,
                        max: 100
                    }
                }
            }
        });
    }

    createCompetitiveChart() {
        if (this.charts.competitiveChart) {
            this.charts.competitiveChart.destroy();
        }

        const ctx = document.getElementById('competitiveChart');
        if (!ctx) return;

        this.charts.competitiveChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Ryanair', 'Southwest', 'Industry Average', 'IndiGo Current', 'IndiGo Target'],
                datasets: [{
                    label: 'Direct Booking Rate (%)',
                    data: [95, 60, 47, 15, 35],
                    backgroundColor: [
                        '#ECEBD5',
                        '#5D878F', 
                        '#DB4545',
                        '#B4413C',
                        '#1FB8CD'
                    ],
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Competitive Benchmarking - Direct Booking Rates',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Direct Booking Rate (%)'
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    // Method to handle window resize
    handleResize() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }

    // Cleanup method
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// Utility functions for data formatting
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);
};

const formatPercentage = (value) => {
    return `${value}%`;
};

const formatNumber = (value) => {
    return new Intl.NumberFormat('en-IN').format(value);
};

// Initialize the presentation app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PresentationApp();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        app.handleResize();
    });
    
    // Handle visibility change (for when presentation is minimized/maximized)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // Refresh charts when presentation becomes visible again
            setTimeout(() => {
                app.initializeSlideCharts(app.currentSlide);
            }, 100);
        }
    });

    // Add fullscreen support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F11' || (e.key === 'f' && e.ctrlKey)) {
            e.preventDefault();
            toggleFullscreen();
        }
        if (e.key === 'Escape' && document.fullscreenElement) {
            document.exitFullscreen();
        }
    });

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable full-screen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Add smooth scrolling and animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe elements for animations
    document.querySelectorAll('.card, .stat-card, .challenge-card, .framework-pillar').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Auto-advance slides function (disabled by default)
    let autoAdvanceInterval = null;
    
    function startAutoAdvance(intervalMs = 30000) { // 30 seconds default
        if (autoAdvanceInterval) {
            clearInterval(autoAdvanceInterval);
        }
        
        autoAdvanceInterval = setInterval(() => {
            if (app.currentSlide < app.totalSlides) {
                app.nextSlide();
            } else {
                clearInterval(autoAdvanceInterval);
                autoAdvanceInterval = null;
            }
        }, intervalMs);
    }
    
    function stopAutoAdvance() {
        if (autoAdvanceInterval) {
            clearInterval(autoAdvanceInterval);
            autoAdvanceInterval = null;
        }
    }

    // Export functions to global scope for external control
    window.presentationApp = app;
    window.startAutoAdvance = startAutoAdvance;
    window.stopAutoAdvance = stopAutoAdvance;
    window.toggleFullscreen = toggleFullscreen;

    // Add presentation mode indicator
    const presentationModeIndicator = document.createElement('div');
    presentationModeIndicator.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1001;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    presentationModeIndicator.textContent = 'Presentation Mode';
    document.body.appendChild(presentationModeIndicator);

    // Show/hide presentation mode indicator
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            presentationModeIndicator.style.opacity = '1';
            setTimeout(() => {
                presentationModeIndicator.style.opacity = '0';
            }, 3000);
        } else {
            presentationModeIndicator.style.opacity = '0';
        }
    });

    // Add keyboard shortcuts help
    document.addEventListener('keydown', (e) => {
        if (e.key === 'h' || e.key === 'H') {
            showKeyboardShortcuts();
        }
    });

    function showKeyboardShortcuts() {
        const helpModal = document.createElement('div');
        helpModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1002;
        `;
        
        helpModal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 10px; max-width: 400px; color: black;">
                <h3 style="margin-top: 0; color: #1FB8CD;">Keyboard Shortcuts</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                    <div><strong>→ / ↓ / Space</strong></div><div>Next slide</div>
                    <div><strong>← / ↑</strong></div><div>Previous slide</div>
                    <div><strong>Home</strong></div><div>First slide</div>
                    <div><strong>End</strong></div><div>Last slide</div>
                    <div><strong>F11</strong></div><div>Fullscreen</div>
                    <div><strong>Esc</strong></div><div>Exit fullscreen</div>
                    <div><strong>H</strong></div><div>Show this help</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="margin-top: 20px; padding: 8px 16px; background: #1FB8CD; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Close
                </button>
            </div>
        `;
        
        document.body.appendChild(helpModal);
        
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.remove();
            }
        });
    }

    console.log('IndiGo Direct Channel Strategy Presentation Loaded');
    console.log('Press H for keyboard shortcuts, F11 for fullscreen');
});