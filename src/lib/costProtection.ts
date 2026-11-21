import { prisma } from '@/lib/prisma';

export type ResourceStatus = 'NORMAL' | 'WARNING' | 'HIGH' | 'CRITICAL' | 'EMERGENCY';

export interface ResourceBudgetSummary {
  status: ResourceStatus;
  percentageUsed: number;
  workers: {
    estimatedToday: number;
    budgetLimit: number; // 50,000 (50% of 100k)
    officialFreeCap: number; // 100,000
    percentage: number;
  };
  d1Reads: {
    estimatedToday: number;
    budgetLimit: number; // 2,500,000 (50% of 5M)
    officialFreeCap: number; // 5,000,000
    percentage: number;
  };
  d1Writes: {
    estimatedToday: number;
    budgetLimit: number; // 50,000 (50% of 100k)
    officialFreeCap: number; // 100,000
    percentage: number;
  };
  storageMb: {
    estimatedUsed: number;
    budgetLimit: number; // 5,000 MB (50% of 10GB)
    officialFreeCap: number; // 10,000 MB
    percentage: number;
  };
  counts: {
    users: number;
    invitations: number;
    publishedInvitations: number;
    guests: number;
    rsvps: number;
    guestbookMessages: number;
  };
  lastChecked: string;
}

// In-memory counter for current day
let dailyRequestCount = 0;
let lastResetDate = new Date().toISOString().split('T')[0];

function checkDailyReset() {
  const today = new Date().toISOString().split('T')[0];
  if (today !== lastResetDate) {
    dailyRequestCount = 0;
    lastResetDate = today;
  }
}

export function recordRequestHit() {
  checkDailyReset();
  dailyRequestCount += 1;
}

/**
 * Assess current infrastructure resource health against Cloudflare Free Tier limits
 */
export async function getResourceBudgetSummary(): Promise<ResourceBudgetSummary> {
  checkDailyReset();

  const [
    usersCount,
    invitationsCount,
    publishedCount,
    guestsCount,
    rsvpsCount,
    guestbookCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.invitation.count(),
    prisma.invitation.count({ where: { status: 'PUBLISHED' } }),
    prisma.guest.count(),
    prisma.rsvp.count(),
    prisma.guestbookMessage.count(),
  ]);

  // Calculations based on actual database metrics
  const estimatedD1Reads = dailyRequestCount * 3 + guestsCount * 2;
  const estimatedD1Writes = rsvpsCount + guestbookCount + dailyRequestCount * 0.05;
  const estimatedStorageMb = Math.round((invitationsCount * 12 + publishedCount * 8) * 10) / 10;

  // Percentages against official Cloudflare free caps
  const workersPct = Math.min(100, Math.round((dailyRequestCount / 100000) * 100));
  const d1ReadPct = Math.min(100, Math.round((estimatedD1Reads / 5000000) * 100));
  const d1WritePct = Math.min(100, Math.round((estimatedD1Writes / 100000) * 100));
  const storagePct = Math.min(100, Math.round((estimatedStorageMb / 10000) * 100));

  const maxPct = Math.max(workersPct, d1ReadPct, d1WritePct, storagePct, 1);

  let status: ResourceStatus = 'NORMAL';
  if (maxPct >= 90) status = 'EMERGENCY';
  else if (maxPct >= 85) status = 'CRITICAL';
  else if (maxPct >= 75) status = 'HIGH';
  else if (maxPct >= 60) status = 'WARNING';

  return {
    status,
    percentageUsed: maxPct,
    workers: {
      estimatedToday: dailyRequestCount,
      budgetLimit: 50000,
      officialFreeCap: 100000,
      percentage: workersPct,
    },
    d1Reads: {
      estimatedToday: estimatedD1Reads,
      budgetLimit: 2500000,
      officialFreeCap: 5000000,
      percentage: d1ReadPct,
    },
    d1Writes: {
      estimatedToday: Math.round(estimatedD1Writes),
      budgetLimit: 50000,
      officialFreeCap: 100000,
      percentage: d1WritePct,
    },
    storageMb: {
      estimatedUsed: estimatedStorageMb,
      budgetLimit: 5000,
      officialFreeCap: 10000,
      percentage: storagePct,
    },
    counts: {
      users: usersCount,
      invitations: invitationsCount,
      publishedInvitations: publishedCount,
      guests: guestsCount,
      rsvps: rsvpsCount,
      guestbookMessages: guestbookCount,
    },
    lastChecked: new Date().toISOString(),
  };
}

/**
 * Feature Circuit Breaker: checks if non-essential feature should be throttled
 */
export async function isFeatureAllowed(featureName: 'VISITOR_TRACKING' | 'NEW_GALLERY_UPLOAD' | 'GUESTBOOK_SUBMISSION'): Promise<boolean> {
  const summary = await getResourceBudgetSummary();

  if (summary.status === 'EMERGENCY') {
    // In emergency, only core invitation view & RSVP allowed
    return false;
  }

  if (summary.status === 'CRITICAL' && featureName === 'NEW_GALLERY_UPLOAD') {
    return false;
  }

  if (summary.status === 'HIGH' && featureName === 'VISITOR_TRACKING') {
    return false;
  }

  return true;
}
