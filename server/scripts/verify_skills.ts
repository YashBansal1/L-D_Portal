
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifySkills() {
    console.log('--- Starting Skills Verification ---');
    const email = `test.skills.${Date.now()}@example.com`;
    const trainingTitle = `Skill Test Training ${Date.now()}`;

    // 1. Create User
    const user = await prisma.user.create({
        data: {
            email,
            password: 'hashedpassword',
            name: 'Skill Tester',
            role: 'EMPLOYEE',
            department: 'QA',
            profile: {
                create: {
                    totalLearningHours: 0,
                    skills: 'Existing Skill'
                }
            }
        },
        include: { profile: true }
    });
    console.log(`1. Created User: ${user.email} with skills: ${user.profile?.skills}`);

    // 2. Create Training with Tags
    const training = await prisma.training.create({
        data: {
            title: trainingTitle,
            description: 'Test Description',
            instructor: 'Test Instructor',
            startDate: new Date(),
            endDate: new Date(),
            durationHours: 1,
            type: 'technical',
            format: 'online',
            maxSeats: 10,
            tags: 'React,TypeScript', // Stored as comma string in DB
            status: 'ongoing'
        }
    });
    console.log(`2. Created Training with tags: ${training.tags}`);

    // 3. Enroll User
    await prisma.enrollment.create({
        data: {
            userId: user.id,
            trainingId: training.id,
            status: 'enrolled'
        }
    });

    // 4. Simulate completeTraining logic (We can't call controller directly here easily, so we mimic logic or call via fetch if server running)
    // 4. Simulate completeTraining logic via API
    try {
        console.log('3. Calling API to complete training...');
        // Note: URL must NOT have /api prefix based on my previous check of main.ts
        const response = await fetch(`http://localhost:3000/trainings/${training.id}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id })
        });

        if (!response.ok) {
            console.error('Failed to call API:', await response.text());
        } else {
            console.log('3. API called successfully');
        }

    } catch (e) {
        console.error('Error calling API', e);
    }

    // 5. Verify Profile
    const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: { profile: true }
    });

    console.log(`4. Updated Skills: ${updatedUser?.profile?.skills}`);

    if (updatedUser?.profile?.skills?.includes('React') && updatedUser?.profile?.skills?.includes('TypeScript')) {
        console.log('SUCCESS: Skills updated correctly!');
    } else {
        console.error('FAILURE: Skills not updated.');
    }

    // Cleanup
    await prisma.enrollment.deleteMany({ where: { userId: user.id } });
    await prisma.badge.deleteMany({ where: { userId: user.id } });
    await prisma.profile.delete({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.training.delete({ where: { id: training.id } });

    await prisma.$disconnect();
}

verifySkills();
