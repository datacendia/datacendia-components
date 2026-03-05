import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function check() {
  const user = await prisma.users.findUnique({ 
    where: { email: 'stuart.rainey@datacendia.com' } 
  });
  
  if (user) {
    console.log('User found:');
    console.log('  ID:', user.id);
    console.log('  Email:', user.email);
    
    // Test password
    const testPassword = 'DatacendiaOwner2024!';
    const isValid = await bcrypt.compare(testPassword, user.password_hash || '');
    console.log('  Password Valid:', isValid);
    console.log('  Status:', user.status);
    console.log('  Role:', user.role);
    console.log('  Has Password:', !!user.password_hash);
  } else {
    console.log('User NOT FOUND');
    
    // List all users
    const allUsers = await prisma.users.findMany({ select: { email: true, status: true, role: true } });
    console.log('\nAll users in database:');
    allUsers.forEach(u => console.log('  -', u.email, '|', u.status, '|', u.role));
  }
  
  await prisma.$disconnect();
}

check();
