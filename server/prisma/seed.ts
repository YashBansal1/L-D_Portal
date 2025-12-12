import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    // Users
    const users = [
        {
            id: "1",
            name: "John Doe",
            email: "employee@example.com",
            role: "EMPLOYEE",
            department: "Engineering"
        },
        {
            id: "2",
            name: "Jane Admin",
            email: "admin@example.com",
            role: "ADMIN",
            department: "HR"
        },
        {
            id: "3",
            name: "Super Admin",
            email: "super@example.com",
            role: "SUPER_ADMIN",
            department: "Management"
        },
        {
            id: "4",
            name: "Jane Smith",
            email: "manager@example.com",
            role: "MANAGER",
            department: "Engineering"
        },
        {
            id: "ghy48807l",
            name: "New Recruit",
            email: "recruit@example.com",
            password: "$2b$10$m2qPgC65W/AwwI./PzQZS.v/jVE/yu4r..6SXbpEsTvGh4ZTtvbtu",
            role: "EMPLOYEE",
            department: "Engineering",
            profile: {
                bio: "",
                avatar: "https://ui-avatars.com/api/?name=New Recruit",
                totalLearningHours: 0
            }
        },
        {
            id: "hhh4w6vor",
            name: "Flow Test",
            email: "flowtest@example.com",
            password: "$2b$10$.kbZdc8QEzIB3kokEdwXBupds30mGRW/MWjctQ4Xjl.Z108UkZUhS",
            role: "EMPLOYEE",
            department: "Sales",
            profile: {
                bio: "",
                avatar: "https://ui-avatars.com/api/?name=Flow Test",
                totalLearningHours: 0
            }
        },
        {
            id: "gjq2on4e5",
            name: "Yash Bansal",
            email: "yashbansal@gmail.com",
            password: "$2b$10$a.beKJB16ItzY1DGzBCEJeghTStuDa.JomxPKCFJML4J.QGwZnuYu",
            role: "EMPLOYEE",
            department: "Engineering",
            profile: {
                bio: "",
                avatar: "https://ui-avatars.com/api/?name=Yash Bansal",
                totalLearningHours: 0
            }
        }
    ];

    for (const u of users) {
        const { profile, ...userData } = u as any;
        const createdUser = await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: {
                ...userData,
                // Default password for mock users who don't have one
                password: userData.password || '$2b$10$EpRnTz/yHK.R/Z5.u.x.E.6.q/.u.u.u.u.u.u.u.u.u.u.u', // 'password' hash placeholder if needed
            }
        });

        if (profile) {
            await prisma.profile.create({
                data: {
                    ...profile,
                    userId: createdUser.id
                }
            });
        }
    }

    // Trainings
    const trainings = [
        {
            id: "1",
            title: "Advanced React Patterns",
            description: "Master advanced React concepts including HOCs, Render Props, and Custom Hooks.",
            instructor: "Sarah Drasner",
            startDate: new Date("2023-11-15T10:00:00Z"),
            endDate: new Date("2023-11-17T17:00:00Z"),
            durationHours: 12,
            type: "technical",
            format: "online",
            maxSeats: 30,
            enrolled: 27,
            isMandatory: false,
            status: "upcoming",
            tags: "React,Frontend,JavaScript"
        },
        {
            id: "x7s2idu0w",
            title: "Java",
            description: "Basic",
            instructor: "Yash",
            startDate: new Date("2025-12-10T08:31:00.000Z"),
            endDate: new Date("2025-12-03T08:31:00.000Z"),
            durationHours: 24,
            type: "technical",
            format: "online",
            maxSeats: 20,
            enrolled: 1,
            isMandatory: true,
            status: "upcoming",
            tags: "Collections"
        },
        {
            id: "q70ylqaht",
            title: "Node",
            description: "Basic",
            instructor: "Yash",
            startDate: new Date("2025-12-11T08:37:00.000Z"),
            endDate: new Date("2025-12-19T08:37:00.000Z"),
            durationHours: 120,
            type: "technical",
            format: "online",
            maxSeats: 20,
            enrolled: 0,
            isMandatory: true,
            status: "upcoming",
            tags: "Basic"
        }
    ];

    for (const t of trainings) {
        await prisma.training.upsert({
            where: { id: t.id },
            update: {},
            create: t
        });
    }

    // Enrollments
    const enrollments = [
        {
            userId: "1",
            trainingId: "1",
            status: "completed",
            progress: 100,
            attendance: 0,
            enrolledAt: new Date("2025-12-12T08:29:24.942Z"),
            completedAt: new Date("2025-12-12T08:30:07.240Z")
        },
        {
            userId: "1",
            trainingId: "x7s2idu0w",
            status: "completed",
            progress: 100,
            attendance: 0,
            enrolledAt: new Date("2025-12-12T08:32:24.746Z"),
            completedAt: new Date("2025-12-12T08:32:36.147Z")
        },
        {
            userId: "gjq2on4e5",
            trainingId: "1",
            status: "completed",
            progress: 100,
            attendance: 0,
            enrolledAt: new Date("2025-12-12T08:44:41.972Z"),
            completedAt: new Date("2025-12-12T08:45:00.988Z")
        }
    ];

    for (const e of enrollments) {
        const exists = await prisma.enrollment.findUnique({
            where: {
                userId_trainingId: {
                    userId: e.userId,
                    trainingId: e.trainingId
                }
            }
        });

        if (!exists) {
            await prisma.enrollment.create({
                data: e
            });
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
