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
  console.log('--- STARTING E2E TEST: DUPLICATE TICKET MERGE (CASE 3) ---\n');

  try {
    const employeeToken = await login('aarti.chopra8@intec-demo.com');
    const adminToken = await login('rohit.shah8@intec-demo.com');

    // 1. Employee raises first ticket
    console.log('1. Employee raises original ticket...');
    const createRes1 = await api('POST', '/api/tickets', employeeToken, {
      title: 'Monitor flickering',
      description: 'The screen keeps flashing white.',
      priority: 'Medium'
    });
    const ticket1 = createRes1.ticket;
    console.log(`   ✅ Original ticket created! Number: ${ticket1.TicketNumber}, ID: ${ticket1._id}\n`);

    // 2. Employee raises duplicate ticket
    console.log('2. Employee raises duplicate ticket by mistake...');
    const createRes2 = await api('POST', '/api/tickets', employeeToken, {
      title: 'Screen flashing',
      description: 'My monitor flashes white sometimes.',
      priority: 'Low'
    });
    const ticket2 = createRes2.ticket;
    console.log(`   ✅ Duplicate ticket created! Number: ${ticket2.TicketNumber}, ID: ${ticket2._id}\n`);

    // 3. Admin merges the duplicate into the original
    console.log('3. Admin detects duplicate and merges it...');
    const mergeRes = await api('POST', `/api/tickets/${ticket2._id}/merge`, adminToken, {
      parent_ticket_number: ticket1.TicketNumber
    });
    
    if (mergeRes.error) throw new Error(mergeRes.error);
    console.log(`   ✅ Ticket merged successfully! New Status: ${mergeRes.ticket.Status}`);
    console.log(`   ✅ Rejection Reason: ${mergeRes.ticket.rejection_reason}\n`);

    console.log('🎉 DUPLICATE TICKET MERGE FLOW PASSED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ TEST FAILED:', error);
  }
}

runTest();
