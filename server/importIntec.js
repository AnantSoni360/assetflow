import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Papa from 'papaparse';
import 'dotenv/config';

// Define minimal schemas to interact with the database
const userSchema = new mongoose.Schema({
  company_id: String,
  name: String,
  email: String,
  password_hash: String,
  password_changed: Boolean,
  role: String,
  department: String
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

const assetSchema = new mongoose.Schema({
  company_id: String,
  asset_name: String,
  asset_type: String,
  serial_number: String,
  status: String,
  assigned_to_email: String
});
const Asset = mongoose.models.Asset || mongoose.model('Asset', assetSchema);

const ticketSchema = new mongoose.Schema({
  ticket_number: String,
  company_id: String,
  title: String,
  description: String,
  category: String,
  priority: String,
  status: String,
  requested_by_email: String,
  assigned_to_email: String,
  created_at: Date,
  updated_at: Date
});
const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);

// ── Role mapping (matches the backend upload route logic) ──
const mapRole = (csvRole) => {
  if (csvRole === 'IT Manager') return 'Admin';
  if (csvRole === 'Engineer') return 'IT Engineer';
  return csvRole; // Employee, IT Engineer, Admin stay as-is
};

// ── Status mapping — CSV has "Open" which the app doesn't know ──
const mapStatus = (csvStatus) => {
  if (csvStatus === 'Open') return 'New';
  return csvStatus;
};

const importData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    const companyId = 'intec';
    const hash = await bcrypt.hash('password123', 10);

    const parseCSV = (filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return Papa.parse(content, { header: true, skipEmptyLines: true }).data;
    };

    console.log('Reading CSV files...');
    const users = parseCSV('d:/Asset flow/intecservice hub/users_generated.csv');
    const assets = parseCSV('d:/Asset flow/intecservice hub/assets_generated.csv');
    const tickets = parseCSV('d:/Asset flow/intecservice hub/tickets_generated.csv');

    console.log('Clearing existing intec data...');
    await User.deleteMany({ company_id: companyId });
    await Asset.deleteMany({ company_id: companyId });
    await Ticket.deleteMany({ company_id: companyId });

    console.log(`Inserting ${users.length} users...`);
    const userDocs = users.map(u => ({
      company_id: companyId,
      name: u.Name,
      email: u.Email,
      // ✅ FIX 1: Map CSV roles correctly to app roles
      role: mapRole(u.Role),
      department: u.Department,
      password_hash: hash,
      password_changed: true  // so they are not forced to change password in demo
    }));

    // Ensure the primary admin is always present
    const adminExists = userDocs.find(u => u.email === 'rohit.shah8@intec-demo.com');
    if (!adminExists) {
      userDocs.push({
        company_id: companyId,
        name: 'Rohit Shah',
        email: 'rohit.shah8@intec-demo.com',
        role: 'Admin',
        department: 'Administration',
        password_hash: hash,
        password_changed: true
      });
    }

    await User.insertMany(userDocs, { ordered: false }).catch(() => {});
    console.log(`✅ Inserted ${userDocs.length} users`);

    // Log role counts for verification
    const roleCounts = userDocs.reduce((acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    }, {});
    console.log('  Role distribution:', roleCounts);

    console.log(`Inserting ${assets.length} assets...`);
    const assetDocs = assets.map(a => ({
      company_id: companyId,
      asset_name: a.Asset_Name,
      asset_type: a.Asset_Type,
      serial_number: a.Serial_Number,
      status: a.Status,
      // ✅ Store null for empty assigned_to_email
      assigned_to_email: a.Assigned_To_Email || null
    }));
    await Asset.insertMany(assetDocs, { ordered: false }).catch(() => {});
    console.log(`✅ Inserted ${assetDocs.length} assets`);

    console.log(`Inserting ${tickets.length} tickets...`);
    let ticketCount = 1;
    const ticketDocs = tickets.map(t => {
      const tNum = `INC-${String(ticketCount++).padStart(4, '0')}`;
      return {
        company_id: companyId,
        ticket_number: tNum,
        title: t.Title,
        description: t.Description,
        category: 'Hardware Issue',
        priority: t.Priority,
        // ✅ FIX 2: Map "Open" → "New" so the app understands the status
        status: mapStatus(t.Status),
        requested_by_email: t.Requested_By_Email || null,
        assigned_to_email: t.Assigned_To_Email || null,
        created_at: new Date(),
        updated_at: new Date()
      };
    });
    await Ticket.insertMany(ticketDocs, { ordered: false }).catch(() => {});
    console.log(`✅ Inserted ${ticketDocs.length} tickets`);

    // Log status counts for verification
    const statusCounts = ticketDocs.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {});
    console.log('  Status distribution:', statusCounts);

    console.log('\n✅ Import completed successfully! All passwords: "password123"');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
