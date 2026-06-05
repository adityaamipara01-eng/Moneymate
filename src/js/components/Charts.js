// SVG Charting Component Helpers

/**
 * Draws a beautiful SVG Donut Chart with legends
 * @param {HTMLElement} container 
 * @param {Array} data - Array of { label, value, color }
 */
export function renderDonutChart(container, data) {
    if (!container) return;
    
    // Clean zero values
    const activeData = data.filter(d => d.value > 0);
    const total = activeData.reduce((sum, d) => sum + d.value, 0);

    if (total === 0) {
        container.innerHTML = `
            <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:200px; color:hsl(var(--text-muted));">
                <i data-lucide="pie-chart" style="width:48px; height:48px; margin-bottom:0.5rem; opacity:0.5;"></i>
                <span>No expense data to display</span>
            </div>
        `;
        return;
    }

    const radius = 38;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius; // ~238.76
    
    let currentOffset = 0;
    const svgSegments = activeData.map((d, index) => {
        const percentage = d.value / total;
        const strokeLength = percentage * circumference;
        const strokeOffset = circumference - currentOffset;
        
        // Accumulate offset (subtracted because SVGs draw clockwise, offset moves start backwards)
        currentOffset += strokeLength;

        return `
            <circle 
                class="donut-segment"
                cx="60" 
                cy="60" 
                r="${radius}" 
                fill="transparent" 
                stroke="${d.color}" 
                stroke-width="${strokeWidth}" 
                stroke-dasharray="${strokeLength} ${circumference - strokeLength}" 
                stroke-dashoffset="${strokeOffset}" 
                transform="rotate(-90 60 60)"
                style="transition: stroke-dashoffset 0.5s ease-out; cursor:pointer;"
                data-index="${index}"
                data-label="${d.label}"
                data-value="${d.value}"
            ></circle>
        `;
    }).join('');

    // Generate Legends
    const legendsHtml = activeData.map((d, index) => {
        const percentage = ((d.value / total) * 100).toFixed(0);
        return `
            <div class="donut-legend-item" style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem; font-size:0.85rem;">
                <span class="legend-color-dot" style="width:10px; height:10px; border-radius:50%; background-color:${d.color}; display:inline-block;"></span>
                <span class="legend-label" style="font-weight:500;">${d.label}</span>
                <span class="legend-pct" style="margin-left:auto; color:hsl(var(--text-muted)); font-weight:600;">${percentage}%</span>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="donut-chart-wrapper" style="display:flex; align-items:center; justify-content:space-around; flex-wrap:wrap; gap:1rem;">
            <div class="donut-svg-container" style="position:relative; width:150px; height:150px;">
                <svg viewBox="0 0 120 120" style="width:100%; height:100%;">
                    <!-- Background Circle -->
                    <circle cx="60" cy="60" r="${radius}" fill="transparent" stroke="hsl(var(--surface-border))" stroke-width="${strokeWidth}"></circle>
                    
                    <!-- Segment Circles -->
                    ${svgSegments}
                </svg>
                <!-- Central Label text -->
                <div class="donut-center-label" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); text-align:center; pointer-events:none; width:70px;">
                    <div style="font-size:0.65rem; text-transform:uppercase; color:hsl(var(--text-muted)); font-weight:600; letter-spacing:0.5px;">Expenses</div>
                    <div id="donut-center-value" style="font-family:var(--font-heading); font-size:0.95rem; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                        ₹${total.toLocaleString()}
                    </div>
                </div>
            </div>
            <div class="donut-legends" style="flex:1; min-width:120px; max-height:160px; overflow-y:auto; padding-right:4px;">
                ${legendsHtml}
            </div>
        </div>
    `;

    // Interactive segment hovers to highlight amounts in center
    const segments = container.querySelectorAll('.donut-segment');
    const centerVal = container.querySelector('#donut-center-value');
    
    segments.forEach(segment => {
        segment.addEventListener('mouseenter', () => {
            const label = segment.getAttribute('data-label');
            const val = parseInt(segment.getAttribute('data-value'));
            segment.style.strokeWidth = `${strokeWidth + 2}`;
            if (centerVal) {
                centerVal.innerHTML = `<span style="font-size:0.85rem; color:${segment.getAttribute('stroke')}">₹${val.toLocaleString()}</span>`;
            }
        });
        
        segment.addEventListener('mouseleave', () => {
            segment.style.strokeWidth = `${strokeWidth}`;
            if (centerVal) {
                centerVal.innerHTML = `₹${total.toLocaleString()}`;
            }
        });
    });
}

/**
 * Draws a responsive SVG Line Chart with gradient fills
 * @param {HTMLElement} container 
 * @param {Array} labels - X-axis labels e.g. ['Jan', 'Feb', 'Mar']
 * @param {Array} datasets - Array of { label, data, color }
 */
export function renderLineChart(container, labels, datasets) {
    if (!container) return;

    // Viewport dimensions
    const width = 600;
    const height = 280;
    const paddingLeft = 50;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Find min/max values
    const allValues = datasets.flatMap(d => d.data);
    const minVal = 0; // Baseline
    const maxVal = Math.max(...allValues, 10000) * 1.15; // Max with 15% headroom

    // Calculate grid values
    const gridLinesCount = 5;
    let yGridHtml = '';
    for (let i = 0; i < gridLinesCount; i++) {
        const pct = i / (gridLinesCount - 1);
        const val = minVal + pct * (maxVal - minVal);
        const y = height - paddingBottom - pct * chartHeight;
        
        yGridHtml += `
            <line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="hsl(var(--surface-border))" stroke-dasharray="3 3"></line>
            <text x="${paddingLeft - 10}" y="${y + 4}" fill="hsl(var(--text-muted))" font-size="10" text-anchor="end" font-weight="500">
                ₹${Math.round(val/1000)}k
            </text>
        `;
    }

    // X Axis Labels
    const pointsCount = labels.length;
    const xPositions = [];
    let xLabelsHtml = '';
    for (let i = 0; i < pointsCount; i++) {
        const pct = i / (pointsCount - 1);
        const x = paddingLeft + pct * chartWidth;
        xPositions.push(x);
        
        xLabelsHtml += `
            <text x="${x}" y="${height - paddingBottom + 20}" fill="hsl(var(--text-secondary))" font-size="11" text-anchor="middle" font-weight="500">
                ${labels[i]}
            </text>
        `;
    }

    // Render paths
    const pathsHtml = datasets.map((dataset, dsIndex) => {
        const points = dataset.data.map((val, idx) => {
            const x = xPositions[idx];
            const y = height - paddingBottom - ((val - minVal) / (maxVal - minVal)) * chartHeight;
            return { x, y, val };
        });

        // Path definitions
        const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
        
        // Area under path (enclosed polyline for gradient)
        const areaPoints = `${polylinePoints} ${points[points.length - 1].x},${height - paddingBottom} ${points[0].x},${height - paddingBottom}`;

        const gradientId = `chart-gradient-${dsIndex}-${Math.round(Math.random()*1000)}`;

        // Interactive dots
        const dotsHtml = points.map((p, idx) => `
            <circle cx="${p.x}" cy="${p.y}" r="4" fill="${dataset.color}" stroke="hsl(var(--surface))" stroke-width="2" class="chart-dot" data-label="${labels[idx]}" data-val="${p.val}" data-ds="${dataset.label}">
                <title>${dataset.label}: ₹${p.val.toLocaleString()}</title>
            </circle>
        `).join('');

        return `
            <defs>
                <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${dataset.color}" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="${dataset.color}" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <!-- Filled Area -->
            <polygon points="${areaPoints}" fill="url(#${gradientId})"></polygon>
            <!-- Border Line -->
            <polyline points="${polylinePoints}" fill="none" stroke="${dataset.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>
            <!-- Value Dots -->
            ${dotsHtml}
        `;
    }).join('');

    // Generate Legend Header
    const legendsHeader = datasets.map(d => `
        <div style="display:flex; align-items:center; gap:0.4rem;">
            <span style="width:12px; height:4px; border-radius:2px; background-color:${d.color}; display:inline-block;"></span>
            <span style="font-size:0.8rem; font-weight:600; color:hsl(var(--text-secondary));">${d.label}</span>
        </div>
    `).join('');

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:0.75rem; width:100%;">
            <div class="line-chart-legend" style="display:flex; justify-content:flex-end; gap:1.25rem; padding-right:10px;">
                ${legendsHeader}
            </div>
            <div class="svg-container" style="position:relative; width:100%; height:auto;">
                <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%; overflow:visible;">
                    <!-- Grid background lines -->
                    ${yGridHtml}
                    
                    <!-- Chart Datasets paths -->
                    ${pathsHtml}
                </svg>
            </div>
        </div>
    `;
}

/**
 * Renders a customizable Progress Bar Meter
 * @param {HTMLElement} container 
 * @param {Number} percentage - 0 to 100
 * @param {String} colorClass - 'primary' | 'success' | 'danger' | 'warning'
 * @param {String} subtitle - Label text
 */
export function renderProgressBar(container, percentage, colorClass, subtitle) {
    if (!container) return;
    
    // Ensure bounds
    const cleanPct = Math.min(Math.max(percentage, 0), 100).toFixed(0);
    
    let colorStyle = 'hsl(var(--primary))';
    if (colorClass === 'success') colorStyle = 'hsl(var(--success))';
    if (colorClass === 'danger') colorStyle = 'hsl(var(--danger))';
    if (colorClass === 'warning') colorStyle = 'hsl(var(--warning))';

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:0.35rem; width:100%;">
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:600;">
                <span style="color:hsl(var(--text-secondary));">${subtitle}</span>
                <span style="color:hsl(var(--text-primary));">${cleanPct}%</span>
            </div>
            <div style="width:100%; height:8px; background-color:hsl(var(--surface-border)); border-radius:10px; overflow:hidden; position:relative;">
                <div style="width:${cleanPct}%; height:100%; background-color:${colorStyle}; border-radius:10px; transition:width 0.6s cubic-bezier(0.4, 0, 0.2, 1);"></div>
            </div>
        </div>
    `;
}
