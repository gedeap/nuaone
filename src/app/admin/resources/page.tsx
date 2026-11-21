import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getResourceBudgetSummary } from '@/lib/costProtection';
import { AdminResourcesClient } from './AdminResourcesClient';

export default async function AdminResourcesPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    redirect('/login');
  }

  const summary = await getResourceBudgetSummary();

  return <AdminResourcesClient summary={summary} />;
}
