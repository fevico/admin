const { exec } = require('child_process');
const mysql = require('mysql2/promise');
const stringUtil = require('./utils/stringUtil');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
 
async function runMigrations() {
  return new Promise((resolve, reject) => {
    exec(`npx sequelize-cli db:migrate`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running migrations: ${stderr || stdout}`);
        return reject(error);
      }
      console.log(stdout);
      resolve(); 
    });
  });
}

async function createDefaultAdminIfNotExists() {
    let defaultPassword = undefined; 
    const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1', 
    user: process.env.DB_USER || 'root', 
    // password: process.env.DB_PASSWORD || 'FileOpen@2022',
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || 'screwsan',
    port: process.env.DB_PORT || 3306,
  });   



  const [rows] = await connection.execute('SELECT COUNT(*) AS count FROM users WHERE type = "super_admin"');
  if (rows[0].count === 0) {
    const saltRounds = 10;
    // defaultPassword = stringUtil.generateString();
     defaultPassword = 'password'
    console.info("DEFAULT PASS: ", defaultPassword);
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
    const adminPhone = '9012345678';
    const emailAddress = process.env.ADMIN_EMAIL_ADDRESS || 'screwsspanners@gmail.com';
    const createdAt = new Date();

    await connection.execute(`
      INSERT INTO users (uniq_id,type, firstname, lastname, email, phone, password, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `, [
      uuidv4(),
      'super_admin',
      'S&S',
      'Admin',
      emailAddress,
      adminPhone,
      hashedPassword,
      createdAt
    ]);
    console.log('Default admin created.');

  } else {
    console.log('Admin user already exists.');
  }

  await connection.end();
  return defaultPassword;
}   

async function main() { 
  try {
    await runMigrations();
    const defaultPassword = await createDefaultAdminIfNotExists();

    if(defaultPassword){
        await sendDefaultPasswordToAdmin(defaultPassword);
    }

    console.log('Initialization complete.');
  } catch (error) {
    console.error('Initialization failed:', error.message);
    process.exit(1);
  }
}

async function sendDefaultPasswordToAdmin(defaultPassword) {
    const emailAddress = process.env.ADMIN_EMAIL_ADDRESS || 'screwsspanners@gmail.com';
    const adminPhone = process.env.ADMIN_PHONE || '9012345678';

  const transporter = nodemailer.createTransport({
    host: process.env.ASES_HOST || 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.AWS_ACCESS_KEY_ID || 'AKIAVQN7J6HJW2EWMJND',
      pass: process.env.AWS_SECRET_ACCESS_KEY || 'BA6kqnYoSE5wlS98Ou0ylxNdNlZZuP1vwoFy+E0gGiEL',
    },
  });

  const mailOptions = {
    from: emailAddress,
    to: emailAddress,
    subject: 'Super Admin Created',
    text: `Hello, your default admin credentials are Phone:${adminPhone} and Password: ${defaultPassword}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

main().then(() => {
  const { spawn } = require('child_process');
  const app = spawn('node', ['./bin/www.js'], { stdio: 'inherit' });

  app.on('close', (code) => {
    console.log(`Application exited with code ${code}`);
  });
}).catch(error=>{
    console.info("ERROR", error);
});