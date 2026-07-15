const BASE_URL = 'http://localhost:3001';

async function login(email, password = 'password123') {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspace: 'intec', email, password })
  });
  const cookieStr = res.headers.get('set-cookie');
  return cookieStr.split(';')[0].split('=')[1];
}

async function api(method, path, token, body = null) {
  const options = {
    method,
    headers: { 'Cookie': `token=${token}` }
  };
  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  const res = await fetch(`${BASE_URL}${path}`, options);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

async function runTest() {
  console.log('--- STARTING E2E TEST: REJECTED TICKET (CASE 4) ---\n');

  try {
    const employeeToken = await login('aarti.chopra8@intec-demo.com');
    const adminToken = await login('rohit.shah8@intec-demo.com');

    // 1. Employee raises a ticket
    console.log('1. Employee raises an invalid ticket...');
    const createRes = await api('POST', '/api/tickets', employeeToken, {
      title: 'Need a new gaming mouse',
      description: 'I want it for playing games.',
      priority: 'Low'
    });
    const ticketId = createRes.ticket._id;
    console.log(`   ✅ Ticket created! ID: ${ticketId}\n`);

    // 2. Admin rejects the ticket
    console.log('2. Admin rejects the ticket with a reason...');
    const rejectRes = await api('PATCH', `/api/tickets/${ticketId}`, adminToken, {
      status: 'Closed',
      rejection_reason: 'Not a valid business requirement.'
    });
    
    if (rejectRes.error) throw new Error(rejectRes.error);
    console.log(`   ✅ Ticket rejected! New Status: ${rejectRes.ticket.Status}`);
    console.log(`   ✅ Rejection Reason: ${rejectRes.ticket.rejection_reason}\n`);

    console.log('🎉 REJECTED TICKET FLOW PASSED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ TEST FAILED:', error);
  }
}

runTest();
