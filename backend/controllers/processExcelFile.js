const XLSX = require('xlsx');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { Users, Projects, Tasks } = require('../models');
const { Op } = require('sequelize');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Replace with your email service provider
    auth: {
        user: process.env.EMAIL_USER, // Your email address from environment variables
        pass: process.env.EMAIL_PASS, // Your email password from environment variables
    },
});

const taskCodeMapping = {
    'SAP': 'App-01',
    'JDE': 'App-02',
    'Oracle': 'App-03',
    'Microsoft SQL': 'DB-01',
    'Oracle DB': 'DB-02',
    'Linux': 'OS-01',
    'Microsoft OS': 'OS-02',
    'Active Directory': 'OS-03',
    'Cyber memo': 'P-01',
    'CTRA': 'P-02',
    'DCNO': 'P-03',
    'SAP-AUTO': 'Auto-01',
    'AUTO': 'Auto-02',
    'REVIEW': 'M-01/D-01',
    'Project Management': 'M-02'
};

function generateRandomPassword(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

async function processExcelFile(filePath) {
    console.log('processExcelFile called with filePath:', filePath);

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log('Data extracted from Excel file:', data);

    for (const row of data) {
        try {
            const postingDate = new Date(row['Posting Date']);
            const taskText = row['Journal Entry Item Text/Task'];
            const hoursString = row['Quantity/Hours'];
            const employeeName = row['Employee Name'];
            const wbsCode = row['WBS Element/Project ID'];

            if (!postingDate || !taskText || !employeeName || !wbsCode || !hoursString) {
                console.error('Missing required fields in row:', row);
                continue; // Skip this row
            }

            // Extract numeric value from hours (e.g., '2.000 H')
            const hours = parseFloat(hoursString);

            // Find or create project
            let [project, projectCreated] = await Projects.findOrCreate({
                where: { wbs_element: wbsCode },
                defaults: {
                    name: `Project ${wbsCode}`,
                    startDate: postingDate,
                    status: 'in_progress'
                }
            });
            console.log(`Project ${project.name} ${projectCreated ? 'created' : 'found'}`);

            // Generate a base username
            let usernameBase = employeeName.toLowerCase().replace(/\s+/g, '.');

            // Find or create user
            let user = await Users.findOne({
                where: {
                    [Op.or]: [
                        { username: usernameBase },
                        { full_name: employeeName }
                    ]
                },
            });

            if (!user) {
                // Generate random password
                const randomPassword = generateRandomPassword();

                // Hash the password
                const hashedPassword = await bcrypt.hash(randomPassword, 10);

                // Generate unique email
                let emailBase = usernameBase;
                let email = `${emailBase}@example.com`;
                let emailSuffix = 1;

                // Ensure email uniqueness
                while (await Users.findOne({ where: { email } })) {
                    email = `${emailBase}${emailSuffix}@example.com`;
                    emailSuffix++;
                }

                // Create the user
                user = await Users.create({
                    username: usernameBase,
                    full_name: employeeName,
                    email: email,
                    role: 'Consultant', // Set appropriate role
                    password: hashedPassword,
                });

                console.log(`User ${user.username} created.`);

                // Send email to user with their credentials
                const mailOptions = {
                    from: process.env.EMAIL_USER, // Use your email
                    to: user.email,
                    subject: 'Your Account Credentials',
                    text: `Hello ${user.full_name},

Your account has been created.

Username: ${user.username}
Password: ${randomPassword}

Please change your password upon first login.

Regards,
Dynamo App Team`,
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log(`Email sent to ${user.email}`);
                } catch (emailError) {
                    console.error(`Failed to send email to ${user.email}:`, emailError.message);
                    // Decide if you want to rollback or continue
                }
            } else {
                console.log(`User ${user.username} found.`);
            }

            // Get task code
            const taskCode = taskCodeMapping[taskText] || taskText;

            // Create or update task
            let [task, taskCreated] = await Tasks.findOrCreate({
                where: {
                    taskName: taskCode,
                    projectId: project.id,
                    assigned_to_user_id: user.id,
                    start_date: postingDate
                },
                defaults: {
                    description: taskText,
                    endDate: postingDate,
                    status: 'completed',
                    hours: hours
                }
            });
            console.log(`Task ${task.task_name} ${taskCreated ? 'created' : 'found'}`);

        } catch (error) {
            console.error('Error processing row:', error);
            console.error('Row data:', row);
        }
    }
}

module.exports = { processExcelFile };
