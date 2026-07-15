import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

const upload = multer({ storage: multer.memoryStorage() });

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL
].filter(Boolean);

// ─────────────────────────────────────────────────────────
// SOCKET.IO SERVER
// ─────────────────────────────────────────────────────────
const io = new SocketIOServer(httpServer, {
  cors: { origin: allowedOrigins, credentials: true }
});

// Middleware to authenticate socket connections via JWT cookie
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.cookie
    ?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
  if (!token) return next(new Error('Unauthorized'));
  try {
    socket.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  const { workspace, email, role } = socket.user;
  // Join workspace room (all users in same company see company events)
  socket.join(`workspace:${workspace}`);
  // Join personal room (for targeted notifications)
  socket.join(`user:${email}`);

  socket.on('disconnect', () => {});
});

// Helper: emit to everyone in a workspace
const emitToWorkspace = (companyId, event, data) => {
  io.to(`workspace:${companyId}`).emit(event, data);
};

// Helper: emit to a specific user
const emitToUser = (companyId, email, event, data) => {
  io.to(`user:${email}`).emit(event, data);
};

// ─────────────────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// ─────────────────────────────────────────────────────────
// MONGOOSE SCHEMAS
// ─────────────────────────────────────────────────────────
const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  workspace_id: { type: String, required: true, unique: true },
  admin_email: { type: String, required: true },
});
const Company = mongoose.model('Company', companySchema);

const userSchema = new mongoose.Schema({
  company_id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password_hash: { type: String, required: true },
  password_changed: { type: Boolean, default: false },
  role: { type: String, required: true },
  department: { type: String, default: '' },
});
userSchema.index({ company_id: 1, email: 1 }, { unique: true });
const User = mongoose.model('User', userSchema);

const sessionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  device: String, browser: String, ip: String, status: String,
  login_time: { type: Date, default: Date.now },
});
// TTL Index: automatically delete session logs after 90 days
sessionSchema.index({ login_time: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
const Session = mongoose.model('Session', sessionSchema);

const assetSchema = new mongoose.Schema({
  company_id: { type: String, required: true },
  asset_name: { type: String, required: true },
  asset_type: { type: String, required: true },
  serial_number: { type: String, required: true },
  status: { type: String, required: true },
  assigned_to_email: { type: String, default: null },
});
assetSchema.index({ company_id: 1, serial_number: 1 }, { unique: true });
// Performance index for dashboard queries
assetSchema.index({ company_id: 1, status: 1 });
assetSchema.index({ company_id: 1, assigned_to_email: 1 });
const Asset = mongoose.model('Asset', assetSchema);

const ticketSchema = new mongoose.Schema({
  ticket_number: String,
  company_id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Hardware Issue' },
  asset_name: { type: String, default: null },
  priority: { type: String, required: true },
  status: { type: String, default: 'New' },
  requested_by_email: { type: String, required: true },
  assigned_to_email: { type: String, default: null },
  rating: { type: Number, default: null },
  rating_comment: { type: String, default: null },
  rejection_reason: { type: String, default: null },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
// Performance indexes
ticketSchema.index({ company_id: 1, status: 1 });
ticketSchema.index({ company_id: 1, assigned_to_email: 1 });
const Ticket = mongoose.model('Ticket', ticketSchema);

const sparePartSchema = new mongoose.Schema({
  company_id: { type: String, required: true },
  ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  ticket_number: String,
  part_name: { type: String, required: true },
  requested_by_email: { type: String, required: true },
  status: { type: String, default: 'Pending' },
}, { timestamps: { createdAt: 'created_at' } });
const SparePart = mongoose.model('SparePart', sparePartSchema);

const notificationSchema = new mongoose.Schema({
  company_id: { type: String, required: true },
  user_email: { type: String, required: true },
  text: { type: String, required: true },
  type: { type: String, default: 'info' },
  read: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at' } });
// TTL Index: automatically delete notifications after 30 days
notificationSchema.index({ created_at: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
notificationSchema.index({ company_id: 1, user_email: 1, created_at: -1 });
const Notification = mongoose.model('Notification', notificationSchema);

const inventorySchema = new mongoose.Schema({
  company_id: { type: String, required: true },
  item_name: { type: String, required: true },
  category: { type: String, default: 'Accessories' },
  stock: { type: Number, default: 0 },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
inventorySchema.index({ company_id: 1, item_name: 1 }, { unique: true });
const Inventory = mongoose.model('Inventory', inventorySchema);

// ─────────────────────────────────────────────────────────
// MONGODB CONNECTION
// ─────────────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => { console.error('❌ MongoDB connection error:', err); process.exit(1); });

// ─────────────────────────────────────────────────────────
// AUTH MIDDLEWARE
// ─────────────────────────────────────────────────────────
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Access denied.' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(400).json({ error: 'Invalid token.' }); }
};

const authenticatePlatformAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Access denied.' });
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    if (verified.role !== 'Platform_Super_Admin') return res.status(403).json({ error: 'Platform admin only.' });
    req.user = verified; next();
  } catch { res.status(400).json({ error: 'Invalid token.' }); }
};

// Helper: create notification + emit real-time event
const pushNotification = async (company_id, user_email, text, type = 'info') => {
  const notif = await Notification.create({ company_id, user_email, text, type });
  // Real-time push to that specific user
  emitToUser(company_id, user_email, 'notification_created', notif);
  return notif;
};

// ─────────────────────────────────────────────────────────
// AUTH ROUTES
// ─────────────────────────────────────────────────────────
app.post('/api/workspaces', async (req, res) => {
  const { companyName, workspaceId, adminName, adminEmail, password } = req.body;
  try {
    if (await Company.findOne({ workspace_id: workspaceId }))
      return res.status(400).json({ error: 'Workspace ID already taken' });
    await Company.create({ name: companyName, workspace_id: workspaceId, admin_email: adminEmail });
    const hash = await bcrypt.hash(password, 12);
    const newUser = await User.create({ company_id: workspaceId, name: adminName, email: adminEmail, password_hash: hash, password_changed: true, role: 'Admin', department: 'Management' });
    const token = jwt.sign({ id: newUser._id, email: adminEmail, role: 'Admin', name: adminName, workspace: workspaceId }, JWT_SECRET, { expiresIn: '8h' });
    await Session.create({ user_id: newUser._id, device: req.headers['user-agent'], browser: 'Unknown', ip: req.ip, status: 'Success' });
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: isProd, 
      sameSite: isProd ? 'none' : 'lax', 
      maxAge: 8 * 60 * 60 * 1000 
    });
    res.json({ message: 'Workspace created successfully', companyId: workspaceId });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to create workspace' }); }
});

app.post('/api/auth/login', async (req, res) => {
  const { workspace, email, password } = req.body;
  try {
    const user = await User.findOne({ email, company_id: workspace });
    if (!user) return res.status(401).json({ error: 'Invalid workspace or email' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      await Session.create({ user_id: user._id, device: req.headers['user-agent'], browser: 'Unknown', ip: req.ip, status: 'Failed' });
      return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name, workspace: user.company_id }, JWT_SECRET, { expiresIn: '8h' });
    await Session.create({ user_id: user._id, device: req.headers['user-agent'], browser: 'Unknown', ip: req.ip, status: 'Success' });
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: isProd, 
      sameSite: isProd ? 'none' : 'lax', 
      maxAge: 8 * 60 * 60 * 1000 
    });
    res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department, workspace: user.company_id, password_changed: user.password_changed } });
  } catch (err) { res.status(500).json({ error: 'Database error' }); }
});

app.post('/api/auth/logout', (req, res) => { res.clearCookie('token'); res.json({ message: 'Logged out' }); });

app.post('/api/platform/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, company_id: 'SYSTEM' });
    if (!user) return res.status(401).json({ error: 'Invalid platform credentials' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name, workspace: 'SYSTEM' }, JWT_SECRET, { expiresIn: '8h' });
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: isProd, 
      sameSite: isProd ? 'none' : 'lax', 
      maxAge: 8 * 60 * 60 * 1000 
    });
    res.json({ message: 'Platform Login successful', user: { id: user._id, name: user.name, email: user.email, role: user.role, workspace: 'SYSTEM', password_changed: true } });
  } catch (err) { res.status(500).json({ error: 'Database error' }); }
});

app.get('/api/auth/me', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: { ...user.toObject(), workspace: user.company_id } });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.get('/api/auth/sessions', authenticateJWT, async (req, res) => {
  try {
    const rows = await Session.find({ user_id: req.user.id }).sort({ login_time: -1 }).limit(10);
    res.json({ sessions: rows });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.post('/api/auth/change-password', authenticateJWT, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!await bcrypt.compare(currentPassword, user.password_hash))
      return res.status(400).json({ error: 'Current password is incorrect' });
    const policy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!policy.test(newPassword)) return res.status(400).json({ error: 'Password does not meet security policy' });
    user.password_hash = await bcrypt.hash(newPassword, 12);
    user.password_changed = true;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch { res.status(500).json({ error: 'Failed to update password' }); }
});

// ─────────────────────────────────────────────────────────
// CSV UPLOAD ROUTES
// ─────────────────────────────────────────────────────────
const arraysEqual = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

app.post('/api/upload/users', authenticateJWT, upload.single('file'), async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admins only' });
  try {
    const records = parse(req.file.buffer.toString('utf8'), { columns: true, skip_empty_lines: true, trim: true });
    if (!records.length) return res.status(400).json({ error: 'CSV is empty' });
    if (!arraysEqual(Object.keys(records[0]), ['Name', 'Email', 'Role', 'Department']))
      return res.status(400).json({ error: 'Invalid columns. Expected: Name, Email, Role, Department' });
    const roles = ['Employee', 'Engineer', 'IT Engineer', 'Admin', 'IT Manager'];
    const emails = new Set();
    for (let i = 0; i < records.length; i++) {
      const r = records[i];
      if (!r.Name || !r.Email || !r.Role || !r.Department) return res.status(400).json({ error: `Missing data in row ${i + 1}` });
      if (!roles.includes(r.Role)) return res.status(400).json({ error: `Invalid role "${r.Role}" in row ${i + 1}` });
      if (emails.has(r.Email)) return res.status(400).json({ error: `Duplicate email "${r.Email}"` });
      emails.add(r.Email);
    }
    const tempHash = await bcrypt.hash('Password@123', 12);
    for (const r of records) {
      let role = r.Role === 'IT Manager' ? 'Admin' : r.Role === 'Engineer' ? 'IT Engineer' : r.Role;
      await User.updateOne({ company_id: req.user.workspace, email: r.Email },
        { $setOnInsert: { company_id: req.user.workspace, name: r.Name, email: r.Email, password_hash: tempHash, password_changed: false, role, department: r.Department } },
        { upsert: true });
    }
    res.json({ message: 'Users imported successfully' });
  } catch (err) { console.error(err); res.status(400).json({ error: 'Failed to process CSV' }); }
});

app.post('/api/upload/assets', authenticateJWT, upload.single('file'), async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admins only' });
  try {
    const records = parse(req.file.buffer.toString('utf8'), { columns: true, skip_empty_lines: true, trim: true });
    if (!records.length) return res.status(400).json({ error: 'CSV is empty' });
    if (!arraysEqual(Object.keys(records[0]), ['Asset_Name', 'Asset_Type', 'Serial_Number', 'Status', 'Assigned_To_Email']))
      return res.status(400).json({ error: 'Invalid columns' });
    for (let i = 0; i < records.length; i++) {
      const r = records[i];
      if (!r.Asset_Name || !r.Asset_Type || !r.Serial_Number || !r.Status) return res.status(400).json({ error: `Missing data in row ${i + 1}` });
      if (r.Assigned_To_Email && !await User.findOne({ email: r.Assigned_To_Email, company_id: req.user.workspace }))
        return res.status(400).json({ error: `User ${r.Assigned_To_Email} not found` });
    }
    for (const r of records) {
      await Asset.updateOne({ company_id: req.user.workspace, serial_number: r.Serial_Number },
        { $setOnInsert: { company_id: req.user.workspace, asset_name: r.Asset_Name, asset_type: r.Asset_Type, serial_number: r.Serial_Number, status: r.Status, assigned_to_email: r.Assigned_To_Email || null } },
        { upsert: true });
    }
    res.json({ message: 'Assets imported successfully' });
  } catch { res.status(400).json({ error: 'Failed to process CSV' }); }
});

app.post('/api/upload/tickets', authenticateJWT, upload.single('file'), async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admins only' });
  try {
    const records = parse(req.file.buffer.toString('utf8'), { columns: true, skip_empty_lines: true, trim: true });
    if (!records.length) return res.status(400).json({ error: 'CSV is empty' });
    if (!arraysEqual(Object.keys(records[0]), ['Title', 'Description', 'Priority', 'Status', 'Requested_By_Email', 'Assigned_To_Email']))
      return res.status(400).json({ error: 'Invalid columns' });
    const validP = ['Low', 'Medium', 'High', 'Critical'];
    const validS = ['Open', 'New', 'Assigned', 'In Progress', 'Waiting Parts', 'Resolved', 'Closed'];
    for (let i = 0; i < records.length; i++) {
      const r = records[i];
      if (!r.Title || !r.Priority || !r.Status || !r.Requested_By_Email) return res.status(400).json({ error: `Missing data in row ${i + 1}` });
      if (!validP.includes(r.Priority)) return res.status(400).json({ error: `Invalid priority "${r.Priority}" in row ${i + 1}` });
      if (!validS.includes(r.Status)) return res.status(400).json({ error: `Invalid status "${r.Status}" in row ${i + 1}` });
      if (!await User.findOne({ email: r.Requested_By_Email, company_id: req.user.workspace })) return res.status(400).json({ error: `User ${r.Requested_By_Email} not found` });
    }
    const count = await Ticket.countDocuments({ company_id: req.user.workspace });
    let idx = count;
    for (const r of records) {
      idx++;
      await Ticket.create({ ticket_number: `INC-${String(idx).padStart(4, '0')}`, company_id: req.user.workspace, title: r.Title, description: r.Description, priority: r.Priority, status: r.Status, requested_by_email: r.Requested_By_Email, assigned_to_email: r.Assigned_To_Email || null });
    }
    res.json({ message: 'Tickets imported successfully' });
  } catch { res.status(400).json({ error: 'Failed to process CSV' }); }
});

// ─────────────────────────────────────────────────────────
// PLATFORM ADMIN ROUTES
// ─────────────────────────────────────────────────────────
app.get('/api/platform/analytics', authenticatePlatformAdmin, async (req, res) => {
  try {
    const [companies, users, assets, tickets] = await Promise.all([Company.countDocuments(), User.countDocuments({ company_id: { $ne: 'SYSTEM' } }), Asset.countDocuments(), Ticket.countDocuments()]);
    res.json({ companies, users, assets, tickets });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.get('/api/platform/workspaces', authenticatePlatformAdmin, async (req, res) => {
  try {
    const companies = await Company.find();
    const workspaces = await Promise.all(companies.map(async (c) => {
      const [userCount, assetCount, ticketCount] = await Promise.all([User.countDocuments({ company_id: c.workspace_id }), Asset.countDocuments({ company_id: c.workspace_id }), Ticket.countDocuments({ company_id: c.workspace_id })]);
      return { ...c.toObject(), userCount, assetCount, ticketCount };
    }));
    res.json({ workspaces });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.delete('/api/platform/workspaces/:id', authenticatePlatformAdmin, async (req, res) => {
  const wid = req.params.id;
  try {
    const users = await User.find({ company_id: wid });
    await Session.deleteMany({ user_id: { $in: users.map(u => u._id) } });
    await Promise.all([
      Ticket.deleteMany({ company_id: wid }),
      Asset.deleteMany({ company_id: wid }),
      SparePart.deleteMany({ company_id: wid }),
      Notification.deleteMany({ company_id: wid }),
      Inventory.deleteMany({ company_id: wid }),
      User.deleteMany({ company_id: wid }),
      Company.deleteOne({ workspace_id: wid })
    ]);
    res.json({ message: 'Workspace deleted' });
  } catch { res.status(500).json({ error: 'Failed to delete workspace' }); }
});

// ─────────────────────────────────────────────────────────
// DATA ROUTES
// ─────────────────────────────────────────────────────────
app.get('/api/assets', authenticateJWT, async (req, res) => {
  try {
    const assets = await Asset.find({ company_id: req.user.workspace });
    const formattedAssets = assets.map(a => ({
      id: a._id,
      _id: a._id,
      Asset_Name: a.asset_name || 'Unknown Asset',
      Asset_Type: a.asset_type || 'Hardware',
      Serial_Number: a.serial_number || 'N/A',
      Status: a.status || 'Available',
      Assigned_To_Email: a.assigned_to_email || null,
      company_id: a.company_id
    }));
    res.json({ assets: formattedAssets });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.patch('/api/assets/:id', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admins only' });
  const companyId = req.user.workspace;
  try {
    const asset = await Asset.findOne({ _id: req.params.id, company_id: companyId });
    if (!asset) return res.status(404).json({ error: 'Asset not found' });

    const { assigned_to_email, status } = req.body;
    if (assigned_to_email !== undefined) asset.assigned_to_email = assigned_to_email || null;
    if (status !== undefined) asset.status = status;

    // Auto-set status when assigning/unassigning
    if (assigned_to_email) {
      asset.status = 'Assigned';
    } else if (assigned_to_email === null || assigned_to_email === '') {
      asset.status = 'Available';
      asset.assigned_to_email = null;
    }

    await asset.save();
    const formatted = {
      id: asset._id,
      _id: asset._id,
      Asset_Name: asset.asset_name,
      Asset_Type: asset.asset_type,
      Serial_Number: asset.serial_number,
      Status: asset.status,
      Assigned_To_Email: asset.assigned_to_email,
      company_id: asset.company_id
    };
    emitToWorkspace(companyId, 'asset_updated', formatted);
    res.json({ asset: formatted });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to update asset' }); }
});

app.get('/api/tickets', authenticateJWT, async (req, res) => {
  try {
    const tickets = await Ticket.find({ company_id: req.user.workspace }).sort({ created_at: -1 });
    const formattedTickets = tickets.map(t => ({
      id: t._id,
      _id: t._id,
      TicketNumber: t.ticket_number || 'INC-0000',
      Title: t.title || 'Untitled',
      Description: t.description || '',
      Category: t.category || 'General',
      Asset_Name: t.asset_name || null,
      Priority: t.priority || 'Low',
      Status: t.status || 'New',
      Rating: t.rating || null,
      Feedback: t.rating_comment || null,
      Requested_By_Email: t.requested_by_email || '',
      Assigned_To_Email: t.assigned_to_email || null,
      rejection_reason: t.rejection_reason || null,
      created_at: t.created_at || new Date()
    }));
    res.json({ tickets: formattedTickets });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.post('/api/tickets', authenticateJWT, async (req, res) => {
  const { title, description, priority, category, asset_name } = req.body;
  const companyId = req.user.workspace;
  try {
    const count = await Ticket.countDocuments({ company_id: companyId });
    const ticket_number = `INC-${String(count + 1).padStart(4, '0')}`;
    const ticket = await Ticket.create({ ticket_number, company_id: companyId, title, description, category: category || 'Hardware Issue', asset_name: asset_name || null, priority, status: 'New', requested_by_email: req.user.email });

    const formattedTicket = {
      id: ticket._id,
      _id: ticket._id,
      TicketNumber: ticket.ticket_number,
      Title: ticket.title,
      Description: ticket.description,
      Category: ticket.category,
      Asset_Name: ticket.asset_name,
      Priority: ticket.priority,
      Status: ticket.status,
      Rating: ticket.rating,
      Feedback: ticket.rating_comment,
      Requested_By_Email: ticket.requested_by_email,
      Assigned_To_Email: ticket.assigned_to_email,
      rejection_reason: ticket.rejection_reason,
      created_at: ticket.created_at
    };

    // Real-time: broadcast new ticket to whole workspace
    emitToWorkspace(companyId, 'ticket_created', formattedTicket);

    // Notify admins
    const admins = await User.find({ company_id: companyId, role: 'Admin' });
    await Promise.all(admins.map(a => pushNotification(companyId, a.email, `New ticket ${ticket_number}: "${title}" raised by ${req.user.name}`, 'info')));

    res.json({ ticket: formattedTicket });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to create ticket' }); }
});

app.patch('/api/tickets/:id', authenticateJWT, async (req, res) => {
  const companyId = req.user.workspace;
  try {
    const ticket = await Ticket.findOne({ _id: req.params.id, company_id: companyId });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    const { status, assigned_to_email, rating, rating_comment, rejection_reason } = req.body;
    if (status !== undefined) ticket.status = status;
    if (assigned_to_email !== undefined) ticket.assigned_to_email = assigned_to_email;
    if (rating !== undefined) ticket.rating = rating;
    if (rating_comment !== undefined) ticket.rating_comment = rating_comment;
    if (rejection_reason !== undefined) ticket.rejection_reason = rejection_reason;
    await ticket.save();

    const formattedTicket = {
      id: ticket._id,
      _id: ticket._id,
      TicketNumber: ticket.ticket_number,
      Title: ticket.title,
      Description: ticket.description,
      Category: ticket.category,
      Asset_Name: ticket.asset_name,
      Priority: ticket.priority,
      Status: ticket.status,
      Rating: ticket.rating,
      Feedback: ticket.rating_comment,
      Requested_By_Email: ticket.requested_by_email,
      Assigned_To_Email: ticket.assigned_to_email,
      rejection_reason: ticket.rejection_reason,
      created_at: ticket.created_at
    };

    // Real-time: broadcast update to whole workspace
    emitToWorkspace(companyId, 'ticket_updated', formattedTicket);

    const ticketNum = ticket.ticket_number;
    const admins = await User.find({ company_id: companyId, role: 'Admin' });

    if (status === 'Assigned' && assigned_to_email) {
      await pushNotification(companyId, assigned_to_email, `You have been assigned ticket ${ticketNum}: "${ticket.title}". Accept or reject.`, 'info');
      await pushNotification(companyId, ticket.requested_by_email, `Engineer assigned to your ticket ${ticketNum}.`, 'success');
    }
    if (status === 'In Progress') await pushNotification(companyId, ticket.requested_by_email, `Engineer started working on your ticket ${ticketNum}.`, 'info');
    if (status === 'Waiting Parts') await Promise.all(admins.map(a => pushNotification(companyId, a.email, `Spare part requested for ticket ${ticketNum}.`, 'warning')));
    if (status === 'Resolved') await pushNotification(companyId, ticket.requested_by_email, `Your ticket ${ticketNum} is resolved! Please verify and close.`, 'success');
    if (status === 'Reopened') await Promise.all(admins.map(a => pushNotification(companyId, a.email, `Ticket ${ticketNum} was reopened. Please reassign.`, 'warning')));
    if (status === 'New' && rejection_reason) await Promise.all(admins.map(a => pushNotification(companyId, a.email, `Engineer rejected ${ticketNum}: "${rejection_reason}". Please reassign.`, 'error')));
    if (status === 'Closed' && rating) await Promise.all(admins.map(a => pushNotification(companyId, a.email, `Ticket ${ticketNum} closed with ${rating}⭐ rating.`, 'success')));

    res.json({ ticket: formattedTicket });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to update ticket' }); }
});

app.post('/api/tickets/:id/merge', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admins only' });
  const { parent_ticket_number } = req.body;
  try {
    const companyId = req.user.workspace;
    const ticket = await Ticket.findOne({ _id: req.params.id, company_id: companyId });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    
    const parentTicket = await Ticket.findOne({ ticket_number: parent_ticket_number, company_id: companyId });
    if (!parentTicket) return res.status(404).json({ error: 'Parent ticket not found' });

    ticket.status = 'Closed - Duplicate';
    ticket.rejection_reason = `Merged into ${parent_ticket_number}`; 
    await ticket.save();
    
    const formattedTicket = {
      id: ticket._id,
      _id: ticket._id,
      TicketNumber: ticket.ticket_number,
      Title: ticket.title,
      Description: ticket.description,
      Category: ticket.category,
      Asset_Name: ticket.asset_name,
      Priority: ticket.priority,
      Status: ticket.status,
      Rating: ticket.rating,
      Feedback: ticket.rating_comment,
      Requested_By_Email: ticket.requested_by_email,
      Assigned_To_Email: ticket.assigned_to_email,
      rejection_reason: ticket.rejection_reason,
      created_at: ticket.created_at
    };

    emitToWorkspace(companyId, 'ticket_updated', formattedTicket);
    await pushNotification(companyId, ticket.requested_by_email, `Your ticket ${ticket.ticket_number} was marked as a duplicate of ${parent_ticket_number}.`, 'info');
    res.json({ ticket: formattedTicket });
  } catch { res.status(500).json({ error: 'Failed to merge ticket' }); }
});

app.get('/api/spare-parts', authenticateJWT, async (req, res) => {
  try { res.json({ parts: await SparePart.find({ company_id: req.user.workspace }).sort({ created_at: -1 }) }); }
  catch { res.status(500).json({ error: 'Database error' }); }
});

app.post('/api/spare-parts', authenticateJWT, async (req, res) => {
  const { ticket_id, part_name } = req.body;
  const companyId = req.user.workspace;
  try {
    const ticket = await Ticket.findOne({ _id: ticket_id, company_id: companyId });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    const part = await SparePart.create({ company_id: companyId, ticket_id, ticket_number: ticket.ticket_number, part_name, requested_by_email: req.user.email });
    ticket.status = 'Waiting Parts';
    await ticket.save();
    emitToWorkspace(companyId, 'ticket_updated', ticket);
    emitToWorkspace(companyId, 'spare_part_requested', part);
    const admins = await User.find({ company_id: companyId, role: 'Admin' });
    await Promise.all(admins.map(a => pushNotification(companyId, a.email, `Spare part "${part_name}" requested for ticket ${ticket.ticket_number}.`, 'warning')));
    res.json({ message: 'Spare part request submitted', part });
  } catch { res.status(500).json({ error: 'Failed to request spare part' }); }
});

app.patch('/api/spare-parts/:id', authenticateJWT, async (req, res) => {
  const { status } = req.body;
  const companyId = req.user.workspace;
  try {
    const part = await SparePart.findOne({ _id: req.params.id, company_id: companyId });
    if (!part) return res.status(404).json({ error: 'Not found' });
    part.status = status;
    await part.save();
    emitToWorkspace(companyId, 'spare_part_updated', part);

    // Auto-deduct inventory if approved
    if (status === 'Approved') {
      const inventoryItem = await Inventory.findOne({ company_id: companyId, item_name: part.part_name });
      if (inventoryItem && inventoryItem.stock > 0) {
        inventoryItem.stock -= 1;
        await inventoryItem.save();
        emitToWorkspace(companyId, 'inventory_updated', inventoryItem);
      }
    }

    const text = status === 'Approved'
      ? `✅ Spare part "${part.part_name}" approved for ticket ${part.ticket_number}.`
      : `❌ Spare part "${part.part_name}" rejected for ticket ${part.ticket_number}.`;
    await pushNotification(companyId, part.requested_by_email, text, status === 'Approved' ? 'success' : 'error');
    res.json({ message: `Spare part ${status}`, part });
  } catch { res.status(500).json({ error: 'Failed to update spare part' }); }
});

app.get('/api/inventory', authenticateJWT, async (req, res) => {
  try { res.json({ inventory: await Inventory.find({ company_id: req.user.workspace }).sort({ item_name: 1 }) }); }
  catch { res.status(500).json({ error: 'Database error' }); }
});

app.post('/api/inventory', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admins only' });
  const { item_name, category, stock } = req.body;
  try {
    const item = await Inventory.create({ company_id: req.user.workspace, item_name, category, stock });
    emitToWorkspace(req.user.workspace, 'inventory_updated', item);
    res.json({ item });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Item already exists' });
    res.status(500).json({ error: 'Failed to add inventory item' });
  }
});

app.patch('/api/inventory/:id', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admins only' });
  const { stock, category } = req.body;
  try {
    const item = await Inventory.findOne({ _id: req.params.id, company_id: req.user.workspace });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (stock !== undefined) item.stock = stock;
    if (category !== undefined) item.category = category;
    await item.save();
    emitToWorkspace(req.user.workspace, 'inventory_updated', item);
    res.json({ item });
  } catch { res.status(500).json({ error: 'Failed to update item' }); }
});

app.get('/api/notifications', authenticateJWT, async (req, res) => {
  try {
    const notifs = await Notification.find({ company_id: req.user.workspace, user_email: req.user.email }).sort({ created_at: -1 }).limit(30);
    res.json({ notifications: notifs });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.patch('/api/notifications/read-all', authenticateJWT, async (req, res) => {
  try {
    await Notification.updateMany({ company_id: req.user.workspace, user_email: req.user.email }, { $set: { read: true } });
    res.json({ message: 'Marked as read' });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.get('/api/users', authenticateJWT, async (req, res) => {
  try {
    const users = await User.find({ company_id: req.user.workspace }).select('-password_hash');
    const withLoad = await Promise.all(users.map(async (u) => {
      const active_tickets = await Ticket.countDocuments({ assigned_to_email: u.email, company_id: req.user.workspace, status: { $nin: ['Closed', 'Resolved', 'Cancelled'] } });
      return { ...u.toObject(), active_tickets };
    }));
    res.json({ users: withLoad });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// ─────────────────────────────────────────────────────────
// SEED
// ─────────────────────────────────────────────────────────
app.post('/api/dev/seed', async (req, res) => {
  const hash = await bcrypt.hash('password123', 12);
  try {
    await User.deleteOne({ email: 'admin@assetflow.com', company_id: 'SYSTEM' });
    await User.create({ company_id: 'SYSTEM', name: 'AssetFlow Admin', email: 'admin@assetflow.com', password_hash: hash, password_changed: true, role: 'Platform_Super_Admin', department: 'System' });
    await Company.updateOne({ workspace_id: 'intec' }, { $set: { name: 'Intec Service Hub', workspace_id: 'intec', admin_email: 'rohit.shah8@intec-demo.com' } }, { upsert: true });
    await Promise.all([User.deleteMany({ company_id: 'intec' }), Asset.deleteMany({ company_id: 'intec' }), Ticket.deleteMany({ company_id: 'intec' }), Inventory.deleteMany({ company_id: 'intec' })]);
    await User.insertMany([
      { company_id: 'intec', name: 'Rohit Shah', email: 'rohit.shah8@intec-demo.com', password_hash: hash, password_changed: true, role: 'Admin', department: 'IT' },
      { company_id: 'intec', name: 'Rohit Chopra', email: 'rohit.chopra1@intec-demo.com', password_hash: hash, password_changed: true, role: 'IT Engineer', department: 'IT' },
      { company_id: 'intec', name: 'Anant Soni', email: 'anant.soni@intec-demo.com', password_hash: hash, password_changed: true, role: 'Employee', department: 'Engineering' },
      { company_id: 'intec', name: 'Nikhil Shah', email: 'nikhil.shah@intec-demo.com', password_hash: hash, password_changed: true, role: 'Employee', department: 'Marketing' },
    ]);
    await Asset.insertMany([
      { company_id: 'intec', asset_name: 'Dell Latitude 5440', asset_type: 'Laptop', serial_number: 'DL5440123', status: 'Assigned', assigned_to_email: 'anant.soni@intec-demo.com' },
      { company_id: 'intec', asset_name: 'Logitech Keyboard', asset_type: 'Keyboard', serial_number: 'KB987654', status: 'Assigned', assigned_to_email: 'anant.soni@intec-demo.com' },
    ]);
    await Inventory.insertMany([
      { company_id: 'intec', item_name: 'Logitech Keyboard', category: 'Accessories', stock: 45 },
      { company_id: 'intec', item_name: 'Dell 24" Monitor', category: 'Hardware', stock: 12 },
      { company_id: 'intec', item_name: 'HP Mouse', category: 'Accessories', stock: 89 },
      { company_id: 'intec', item_name: '16GB DDR4 RAM', category: 'Components', stock: 24 },
      { company_id: 'intec', item_name: '512GB SSD', category: 'Components', stock: 18 },
    ]);
    await Ticket.create({ ticket_number: 'INC-0001', company_id: 'intec', title: 'Keyboard A key not working', description: 'My Logitech Keyboard is broken', priority: 'Medium', status: 'Assigned', requested_by_email: 'anant.soni@intec-demo.com', assigned_to_email: 'rohit.chopra1@intec-demo.com' });
    res.json({ message: '✅ Database seeded. All passwords: "password123"' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Seed failed', details: err.message }); }
});

httpServer.listen(PORT, () => console.log(`🚀 Backend + Socket.IO running on http://localhost:${PORT}`));
