import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixCompletedJobs() {
  console.log('🔍 Finding jobs that should be marked as completed...');

  // Find all jobs with status ACCEPTED
  const acceptedJobs = await prisma.job.findMany({
    where: {
      status: 'ACCEPTED',
    },
    include: {
      acceptedBid: {
        include: {
          pro: true,
        },
      },
    },
  });

  console.log(`Found ${acceptedJobs.length} accepted jobs`);

  let updatedCount = 0;

  for (const job of acceptedJobs) {
    if (!job.acceptedBid) {
      console.log(`⚠️  Job ${job.id} has no accepted bid, skipping`);
      continue;
    }

    // Check if there's a completed booking for this job
    const completedBooking = await prisma.booking.findFirst({
      where: {
        customerId: job.customerId,
        proId: job.acceptedBid.proId,
        status: 'COMPLETED',
      },
    });

    if (completedBooking) {
      console.log(`✅ Updating job ${job.id} (${job.title}) to COMPLETED`);
      await prisma.job.update({
        where: { id: job.id },
        data: { status: 'COMPLETED' },
      });
      updatedCount++;
    }
  }

  console.log(`\n✨ Updated ${updatedCount} jobs to COMPLETED status`);
}

fixCompletedJobs()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
