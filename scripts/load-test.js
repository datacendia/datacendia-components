/**
 * Load Testing Script for Datacendia Platform
 * Run with: node scripts/load-test.js
 * 
 * For more comprehensive load testing, use k6:
 * k6 run scripts/k6-load-test.js
 */

const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const CONCURRENT_USERS = parseInt(process.env.CONCURRENT_USERS || '10');
const DURATION_SECONDS = parseInt(process.env.DURATION_SECONDS || '30');
const REQUESTS_PER_SECOND = parseInt(process.env.RPS || '50');

const endpoints = [
  { method: 'GET', path: '/api/v1/health', name: 'Health Check' },
  { method: 'GET', path: '/api/v1/council/status', name: 'Council Status' },
  { method: 'GET', path: '/api/v1/crucible/status', name: 'Crucible Status' },
  { method: 'GET', path: '/api/v1/panopticon/status', name: 'Panopticon Status' },
  { method: 'GET', path: '/api/v1/aegis/status', name: 'Aegis Status' },
  { method: 'GET', path: '/api/v1/scheduler/status', name: 'Scheduler Status' },
  { method: 'GET', path: '/metrics', name: 'Prometheus Metrics' },
];

const stats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalLatency: 0,
  minLatency: Infinity,
  maxLatency: 0,
  errors: {},
  endpointStats: {},
};

async function makeRequest(endpoint) {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}${endpoint.path}`, {
      method: endpoint.method,
      headers: { 'Content-Type': 'application/json' },
    });
    
    const latency = Date.now() - start;
    stats.totalRequests++;
    stats.totalLatency += latency;
    stats.minLatency = Math.min(stats.minLatency, latency);
    stats.maxLatency = Math.max(stats.maxLatency, latency);
    
    if (!stats.endpointStats[endpoint.name]) {
      stats.endpointStats[endpoint.name] = { success: 0, failed: 0, totalLatency: 0 };
    }
    
    if (response.ok) {
      stats.successfulRequests++;
      stats.endpointStats[endpoint.name].success++;
    } else {
      stats.failedRequests++;
      stats.endpointStats[endpoint.name].failed++;
      const errorKey = `${response.status}`;
      stats.errors[errorKey] = (stats.errors[errorKey] || 0) + 1;
    }
    stats.endpointStats[endpoint.name].totalLatency += latency;
    
    return { success: response.ok, latency, status: response.status };
  } catch (error) {
    const latency = Date.now() - start;
    stats.totalRequests++;
    stats.failedRequests++;
    stats.totalLatency += latency;
    
    const errorKey = error.code || 'UNKNOWN';
    stats.errors[errorKey] = (stats.errors[errorKey] || 0) + 1;
    
    return { success: false, latency, error: error.message };
  }
}

async function runLoadTest() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║           DATACENDIA LOAD TEST                             ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log(`║ Target URL: ${BASE_URL.padEnd(46)}║`);
  console.log(`║ Concurrent Users: ${String(CONCURRENT_USERS).padEnd(40)}║`);
  console.log(`║ Duration: ${String(DURATION_SECONDS + 's').padEnd(48)}║`);
  console.log(`║ Target RPS: ${String(REQUESTS_PER_SECOND).padEnd(46)}║`);
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Starting load test...');
  
  const startTime = Date.now();
  const endTime = startTime + (DURATION_SECONDS * 1000);
  const intervalMs = 1000 / REQUESTS_PER_SECOND;
  
  const workers = [];
  
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    workers.push((async () => {
      while (Date.now() < endTime) {
        const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
        await makeRequest(endpoint);
        await new Promise(resolve => setTimeout(resolve, intervalMs * CONCURRENT_USERS));
      }
    })());
  }
  
  // Progress indicator
  const progressInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    const rps = stats.totalRequests / elapsed;
    process.stdout.write(`\rProgress: ${Math.round(elapsed)}s | Requests: ${stats.totalRequests} | RPS: ${rps.toFixed(1)} | Errors: ${stats.failedRequests}`);
  }, 1000);
  
  await Promise.all(workers);
  clearInterval(progressInterval);
  
  // Print results
  const duration = (Date.now() - startTime) / 1000;
  const avgLatency = stats.totalLatency / stats.totalRequests;
  const rps = stats.totalRequests / duration;
  const successRate = (stats.successfulRequests / stats.totalRequests * 100).toFixed(2);
  
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                      RESULTS                               ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log(`║ Total Requests: ${String(stats.totalRequests).padEnd(42)}║`);
  console.log(`║ Successful: ${String(stats.successfulRequests).padEnd(46)}║`);
  console.log(`║ Failed: ${String(stats.failedRequests).padEnd(50)}║`);
  console.log(`║ Success Rate: ${String(successRate + '%').padEnd(44)}║`);
  console.log(`║ Requests/sec: ${String(rps.toFixed(2)).padEnd(44)}║`);
  console.log(`║ Avg Latency: ${String(avgLatency.toFixed(2) + 'ms').padEnd(45)}║`);
  console.log(`║ Min Latency: ${String(stats.minLatency + 'ms').padEnd(45)}║`);
  console.log(`║ Max Latency: ${String(stats.maxLatency + 'ms').padEnd(45)}║`);
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log('║ ENDPOINT BREAKDOWN                                         ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  
  for (const [name, data] of Object.entries(stats.endpointStats)) {
    const total = data.success + data.failed;
    const avg = total > 0 ? (data.totalLatency / total).toFixed(0) : 0;
    console.log(`║ ${name.padEnd(20)} ${String(data.success).padEnd(8)} ok ${String(avg + 'ms').padEnd(10)}║`);
  }
  
  if (Object.keys(stats.errors).length > 0) {
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║ ERRORS                                                     ║');
    for (const [code, count] of Object.entries(stats.errors)) {
      console.log(`║ ${code.padEnd(20)} ${String(count).padEnd(37)}║`);
    }
  }
  
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  // Exit with error if success rate is below threshold
  if (parseFloat(successRate) < 95) {
    console.log('\n⚠️  Warning: Success rate below 95% threshold');
    process.exit(1);
  }
}

runLoadTest().catch(console.error);
