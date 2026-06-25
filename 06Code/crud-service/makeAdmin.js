async function makeAdmin() {
  try {
    // 1. Register the user
    console.log("Registering user...");
    const res = await fetch('http://artisan-business-env.eba-qmrdkji7.us-east-1.elasticbeanstalk.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Admin User',
        email: 'admin@artisanshop.com',
        password: 'admin123',
        phone: '1234567890',
        province: 'Pichincha'
      })
    });
    
    if (res.ok) {
      console.log("User registered.");
    } else {
      const data = await res.json();
      if (data.message && data.message.includes('already exists')) {
        console.log("User already exists, proceeding to make admin...");
      } else {
        console.error("Error registering:", data);
      }
    }
  } catch (e) {
    console.error("Network Error registering:", e.message);
  }

  // 2. We need to set the role to 'admin' in the database directly since there's no endpoint to do it.
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  try {
    await prisma.user.update({
      where: { email: 'admin@artisanshop.com' },
      data: { role: 'admin' }
    });
    console.log("User role updated to admin successfully!");
  } catch(e) {
    console.error("Prisma error:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
