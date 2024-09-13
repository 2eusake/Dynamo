const XLSX = require('xlsx');
const { Users, Projects, Tasks } = require('../models');
const { Op } = require('sequelize');

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

async function processExcelFile(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    for (const row of data) {
        try {
            const postingDate = new Date(row['Posting Date']);
            const taskText = row['Journal Entry Item Text/Task'];
            const hours = parseFloat(row['Quantity/Hours']);
            const employeeName = row['Employee Name'];
            const wbsCode = row['WBS Element/Project ID'];

            // Find or create project
            let [project] = await Projects.findOrCreate({
                where: { wbs_code: wbsCode },
                defaults: {
                    name: `Project ${wbsCode}`,
                    start_date: postingDate,
                    status: 'in_progress'
                }
            });

            // Find or create user
            let [user] = await Users.findOrCreate({
                where: {
                    [Op.or]: [
                        { username: employeeName },
                        { full_name: employeeName }
                    ]
                },
                defaults: {
                    username: employeeName.toLowerCase().replace(/\s+/g, '.'),
                    full_name: employeeName
                }
            });

            // Get task code
            const taskCode = taskCodeMapping[taskText] || taskText;

            // Create or update task
            await Tasks.findOrCreate({
                where: {
                    task_name: taskCode,
                    project_id: project.id,
                    assigned_to_user_id: user.id,
                    start_date: postingDate
                },
                defaults: {
                    description: taskText,
                    end_date: postingDate,
                    status: 'completed',
                    hours: hours
                }
            });

        } catch (error) {
            console.error('Error processing row:', error);
            console.error('Row data:', row);
        }
    }
}

module.exports = { processExcelFile };