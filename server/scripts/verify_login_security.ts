
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyLoginSecurity() {
    console.log('--- Starting Login Security Verification ---');

    // 1. Ensure a test user exists
    const email = 'security.test@example.com';
    // Clean up if exists
    await prisma.enrollment.deleteMany({ where: { user: { email } } });
    await prisma.badge.deleteMany({ where: { user: { email } } });
    await prisma.profile.deleteMany({ where: { user: { email } } });
    await prisma.user.deleteMany({ where: { email } });

    // Create user with a KNOWN hashed password (e.g. 'password123')
    // We can just use the register implementation or manual create.
    // Register is easier if we want to bypass hashing logic here, but let's do manual to be pure.
    // Actually, let's use the API to register to ensure we get a "real" user state.

    console.log('1. Registering User...');
    const registerResponse = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Security Test',
            email: email,
            password: 'CorrectPassword123',
            role: 'EMPLOYEE',
            department: 'IT'
        })
    });

    if (!registerResponse.ok) {
        console.error('Failed to register:', await registerResponse.text());
        return;
    }
    console.log('User registered.');

    // 2a. Attempt Standard Login with EMPTY password (Should FAIL now)
    console.log('2a. Attempting Standard Login with EMPTY password...');
    const standardEmptyResponse = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            password: ''
            // isQuickLogin undefined/false
        })
    });

    if (standardEmptyResponse.status === 401) {
        console.log('SUCCESS: Standard login rejected empty password (401).');
    } else {
        console.error(`FAIL: Standard login accepted empty password! Status: ${standardEmptyResponse.status}`);
    }

    // 2b. Attempt Quick Login with EMPTY password (Should SUCCEED)
    console.log('2b. Attempting Quick Login with EMPTY password...');
    const quickResponse = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            password: '',
            isQuickLogin: true
        })
    });

    if (quickResponse.status === 200) {
        console.log('SUCCESS: Quick Login succeeded without password.');
    } else {
        console.error(`FAIL: Quick Login failed! Status: ${quickResponse.status}`);
    }

    // 3. Attempt Login with WRONG Password
    console.log('3. Attempting Login with WRONG password...');
    const wrongResponse = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            password: 'WrongPassword'
        })
    });

    if (wrongResponse.status === 200) {
        console.error('CRITICAL FAIL: Login succeeded with wrong password!');
    } else if (wrongResponse.status === 401) {
        console.log('SUCCESS: Login rejected (401) as expected.');
    }

    // 4. Attempt Login with CORRECT Password
    console.log('4. Attempting Login with CORRECT password...');
    const correctResponse = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            password: 'CorrectPassword123'
        })
    });

    if (correctResponse.status === 200) {
        console.log('SUCCESS: Login succeeded with correct password.');
    } else {
        console.error('FAIL: Valid login failed.');
    }

    // Cleanup
    await prisma.enrollment.deleteMany({ where: { user: { email } } });
    await prisma.badge.deleteMany({ where: { user: { email } } });
    await prisma.profile.deleteMany({ where: { user: { email } } });
    await prisma.user.deleteMany({ where: { email } });
}

verifyLoginSecurity();
