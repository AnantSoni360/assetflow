const BASE_URL = 'http://localhost:3001';

async function login(email, password = 'password123') {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspace: 'intec', email, password })
  });
  const data = await res.json();
  const cookieStr = res.headers.get('set-cookie');
  const token = cookieStr.split(';')[0].split('=')[1];
  return token;
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
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function runTest() {
  console.log('--- STARTING E2E TEST: NORMAL TICKET FLOW ---\n');

  try {
    // 1. Authenticate users
    console.log('1. Logging in users...');
    const employeeToken = await login('aarti.chopra8@intec-demo.com');
    console.log('   ✅ Employee (Aarti) logged in');
    
    const adminToken = await login('rohit.shah8@intec-demo.com');
    console.log('   ✅ Admin (Rohit) logged in');
    
    const engineerToken = await login('rohit.chopra1@intec-demo.com');
    console.log('   ✅ IT Engineer (Rohit C.) logged in\n');

    // 2. Employee raises a ticket
    console.log('2. Employee raises a new ticket...');
    const createRes = await api('POST', '/api/tickets', employeeToken, {
      title: 'E2E Test: Laptop won\'t turn on',
      description: 'Pressing power button does nothing.',
      priority: 'High',
      category: 'Hardware Issue',
      asset_name: 'Dell XPS 15'
    });
    
    if (!createRes.ticket) throw new Error('Ticket creation failed');
    const ticketId = createRes.ticket._id;
    console.log(`   ✅ Ticket created! ID: ${ticketId}, Status: ${createRes.ticket.Status}\n`);

    // 3. Admin assigns ticket to Engineer
    console.log('3. Admin assigns ticket to Engineer...');
    const assignRes = await api('PATCH', `/api/tickets/${ticketId}`, adminToken, {
      status: 'Assigned',
      assigned_to_email: 'rohit.chopra1@intec-demo.com'
    });
    console.log(`   ✅ Ticket assigned! New Status: ${assignRes.ticket.Status}, Assigned To: ${assignRes.ticket.Assigned_To_Email}\n`);

    // 4. Engineer accepts ticket (In Progress)
    console.log('4. Engineer starts working on ticket...');
    const progressRes = await api('PATCH', `/api/tickets/${ticketId}`, engineerToken, {
      status: 'In Progress'
    });
    console.log(`   ✅ Ticket in progress! New Status: ${progressRes.ticket.Status}\n`);

    // 5. Engineer resolves ticket
    console.log('5. Engineer resolves the ticket...');
    const resolveRes = await api('PATCH', `/api/tickets/${ticketId}`, engineerToken, {
      status: 'Resolved'
    });
    console.log(`   ✅ Ticket resolved! New Status: ${resolveRes.ticket.Status}\n`);

    // 6. Employee closes ticket and provides a rating
    console.log('6. Employee verifies and closes ticket...');
    const closeRes = await api('PATCH', `/api/tickets/${ticketId}`, employeeToken, {
      status: 'Closed',
      rating: 5,
      rating_comment: 'Excellent and fast support!'
    });
    console.log(`   ✅ Ticket closed! New Status: ${closeRes.ticket.Status}, Rating: ${closeRes.ticket.Rating} stars\n`);

    console.log('🎉 NORMAL TICKET FLOW TEST PASSED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ TEST FAILED:', error);
  }
}

runTest();
