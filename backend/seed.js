const { sequelize, Project, Task, User } = require('./models'); // Adjust the path if needed

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('Connection established.');

        // Recreate tables, drop existing ones
        await sequelize.sync({ force: true });

        console.log('Database tables recreated.');

        // Create sample projects with direct user ID references
        const project1 = await Project.create({
            name: 'Sample Project 1',
            description: 'A sample project for demonstration purposes.',
            startDate: new Date('2024-10-01'),
            endDate: new Date('2024-12-01'),
            duration: 8,
            status: 'in_progress',
            progress: 0,
            wbsElement: '6401C30014627.1.7',
            projectManagerId: 7, // Felicia Candice Naicker
            directorId: 1 // Zusake Bangani
        });

        const project2 = await Project.create({
            name: 'Sample Project 2',
            description: 'Another sample project for testing.',
            startDate: new Date('2024-11-01'),
            endDate: new Date('2025-01-01'),
            duration: 8,
            status: 'not_started',
            progress: 0,
            wbsElement: '6401C30014627.1.8',
            projectManagerId: 8, // Siwa Langton Mautsa
            directorId: 2 // Vhuhulu Kwinda
        });

        console.log('Sample Projects created.');

        // Define task code mappings with provided task IDs and descriptions
        const taskCodeMapping = {
            'SAP': { taskId: 'App-01', description: 'SAP application (SAP ECC, SAP4 Hana, GRC, SM, etc)' },
            'JDE': { taskId: 'App-02', description: 'JDE E1 or Previous version' },
            'Oracle': { taskId: 'App-03', description: 'Oracle EBS' },
            'Generic Application': { taskId: 'App-04', description: 'All other applications except for SAP, JDE or Oracle' },
            'Microsoft SQL': { taskId: 'DB-01', description: 'Microsoft SQL database' },
            'Oracle DB': { taskId: 'DB-02', description: 'Oracle SQL database' },
            'Linux': { taskId: 'OS-01', description: 'Linux OS' },
            'Microsoft OS': { taskId: 'OS-02', description: 'Microsoft OS' },
            'Active Directory': { taskId: 'OS-03', description: 'Active Directory' },
            'Cyber memo': { taskId: 'P-01', description: 'Cyber memo' },
            'CTRA': { taskId: 'P-02', description: 'CTRA' },
            'DCNO': { taskId: 'P-03', description: 'DCNO' },
            'SAP-AUTO': { taskId: 'Auto-01', description: 'SAP-AUTO' },
            'AUTO': { taskId: 'Auto-02', description: 'Auto controls for generic applications' },
            'REVIEW': { taskId: 'M-01/D-01', description: 'Review task' },
            'Project Management': { taskId: 'M-02', description: 'Project management task' }
        };

        // Create tasks for Project 1
        const tasksProject1 = [
            { taskName: 'SAP', hours: 2.0, assignedToUserId: 3, projectId: project1.id }, // Nicole Kudzaishe Matiyenga
            { taskName: 'SAP', hours: 8.0, assignedToUserId: 4, projectId: project1.id }, // Andile Felicia Msibi
            { taskName: 'Oracle', hours: 2.0, assignedToUserId: 5, projectId: project1.id }, // Concetta Ciccone
            { taskName: 'Microsoft SQL', hours: 1.0, assignedToUserId: 5, projectId: project1.id }, // Concetta Ciccone
            { taskName: 'Oracle DB', hours: 2.0, assignedToUserId: 5, projectId: project1.id }, // Concetta Ciccone
            { taskName: 'Project Management', hours: 1.0, assignedToUserId: 5, projectId: project1.id }, // Concetta Ciccone
            { taskName: 'Project Management', hours: 3.0, assignedToUserId: 5, projectId: project1.id }, // Concetta Ciccone
            { taskName: 'Project Management', hours: 2.0, assignedToUserId: 5, projectId: project1.id }, // Concetta Ciccone
            { taskName: 'Microsoft SQL', hours: 8.0, assignedToUserId: 6, projectId: project1.id } // Ruan Ettiene Roux
        ];

        for (const task of tasksProject1) {
            const { taskId, description } = taskCodeMapping[task.taskName];
            await Task.create({
                taskId,
                taskName: task.taskName,
                description,
                hours: task.hours,
                assignedToUserId: task.assignedToUserId,
                projectId: task.projectId,
                dueDate: new Date('2024-12-01'), // Adjust if needed
                status: 'in_progress' // Set status based on the task
            });
        }

        // Create tasks for Project 2
        const tasksProject2 = [
            { taskName: 'Microsoft SQL', hours: 8.0, assignedToUserId: 6, projectId: project2.id }, // Ruan Ettiene Roux
            { taskName: 'Project Management', hours: 8.0, assignedToUserId: 6, projectId: project2.id } // Ruan Ettiene Roux
        ];

        for (const task of tasksProject2) {
            const { taskId, description } = taskCodeMapping[task.taskName];
            await Task.create({
                taskId,
                taskName: task.taskName,
                description,
                hours: task.hours,
                assignedToUserId: task.assignedToUserId,
                projectId: task.projectId,
                dueDate: new Date('2025-01-01'), // Adjust if needed
                status: 'not_started' // Set status based on the task
            });
        }

        console.log('Sample tasks created.');
        console.log('Seeding completed successfully.');
    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        await sequelize.close();
    }
}

seed();
