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
  console.log('--- STARTING E2E TEST: SPARE PART FLOW (CASE B) ---\n');

  try {
    const employeeToken = await login('aarti.chopra8@intec-demo.com');
    const adminToken = await login('rohit.shah8@intec-demo.com');
    const engineerToken = await login('rohit.chopra1@intec-demo.com');

    // 1. Employee raises ticket
    console.log('1. Employee raises ticket for broken keyboard...');
    const createRes = await api('POST', '/api/tickets', employeeToken, {
      title: 'E2E Test: Broken Keyboard',
      description: 'Keys A and S are missing.',
      priority: 'Medium'
    });
    const ticketId = createRes.ticket._id;
    console.log(`   ✅ Ticket created! ID: ${ticketId}\n`);

    // 2. Admin assigns
    console.log('2. Admin assigns ticket to Engineer...');
    await api('PATCH', `/api/tickets/${ticketId}`, adminToken, {
      status: 'Assigned', assigned_to_email: 'rohit.chopra1@intec-demo.com'
    });
    console.log(`   ✅ Ticket assigned to rohit.chopra1\n`);

    // 3. Engineer requests spare part
    console.log('3. Engineer requests a spare part (Keyboard)...');
    await api('PATCH', `/api/tickets/${ticketId}`, engineerToken, { status: 'Waiting Parts' });
    const partRes = await api('POST', '/api/spare-parts', engineerToken, {
      ticket_id: ticketId,
      part_name: 'Wireless Keyboard'
    });
    
    if (partRes.error) throw new Error(partRes.error);
    const partRequestId = partRes.part._id;
    console.log(`   ✅ Spare part requested! Request ID: ${partRequestId}, Status: Pending\n`);

    // 4. Admin approves part
    console.log('4. Admin approves the spare part request...');
    const approveRes = await api('PATCH', `/api/spare-parts/${partRequestId}`, adminToken, {
      status: 'Approved'
    });
    console.log(`   ✅ Spare part approved! New Status: ${approveRes.part.status}\n`);

    // 5. Engineer resolves ticket
    console.log('5. Engineer installs part and resolves ticket...');
    await api('PATCH', `/api/tickets/${ticketId}`, engineerToken, { status: 'Resolved' });
    console.log(`   ✅ Ticket resolved!\n`);

    console.log('🎉 SPARE PART FLOW TEST PASSED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ TEST FAILED:', error);
  }
}

runTest();
