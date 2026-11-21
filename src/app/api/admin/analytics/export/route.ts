import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

/**
 * DuckDB Analytical Export Endpoint
 *
 * Mandate: Section 20.B
 * Provides scheduled or on-demand transactional data export structured for DuckDB OLAP
 * ingestion and Parquet conversion without imposing locks on the primary database.
 */
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract read-only transactional datasets for analytics
    const [orders, invitations, rsvps, guests, templates] = await Promise.all([
      prisma.order.findMany({
        select: {
          id: true,
          orderNumber: true,
          amount: true,
          status: true,
          packageId: true,
          createdAt: true,
          updatedAt: true,
          package: {
            select: {
              code: true,
              name: true,
              price: true,
            },
          },
        },
      }),
      prisma.invitation.findMany({
        select: {
          id: true,
          slug: true,
          brideNickname: true,
          groomNickname: true,
          status: true,
          templateId: true,
          createdAt: true,
          updatedAt: true,
          template: {
            select: {
              slug: true,
              name: true,
              tier: true,
              category: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
          _count: {
            select: {
              views: true,
              guests: true,
              rsvps: true,
              guestbookMessages: true,
            },
          },
        },
      }),
      prisma.rsvp.findMany({
        select: {
          id: true,
          invitationId: true,
          guestId: true,
          attendanceStatus: true,
          attendeeCount: true,
          submittedAt: true,
        },
      }),
      prisma.guest.findMany({
        select: {
          id: true,
          invitationId: true,
          category: true,
          isSent: true,
          createdAt: true,
          token: {
            select: {
              totalVisits: true,
              lastOpenedAt: true,
            },
          },
        },
      }),
      prisma.template.findMany({
        select: {
          id: true,
          slug: true,
          name: true,
          tier: true,
          isActive: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      }),
    ]);

    // Analytics summary
    const totalRevenue = orders
      .filter((o) => o.status === 'PAID')
      .reduce((sum, o) => sum + o.amount, 0);

    const rsvpStats = {
      totalResponses: rsvps.length,
      attending: rsvps.filter((r) => r.attendanceStatus === 'ATTENDING').length,
      declined: rsvps.filter((r) => r.attendanceStatus === 'DECLINED').length,
      undecided: rsvps.filter((r) => r.attendanceStatus === 'UNDECIDED').length,
      totalAttendees: rsvps
        .filter((r) => r.attendanceStatus === 'ATTENDING')
        .reduce((sum, r) => sum + r.attendeeCount, 0),
    };

    const openedGuests = guests.filter((g) => (g.token?.totalVisits ?? 0) > 0);
    const guestEngagement = {
      totalGuests: guests.length,
      openedInvitations: openedGuests.length,
      openRatePercentage: guests.length > 0
        ? Math.round((openedGuests.length / guests.length) * 100)
        : 0,
    };

    const totalViews = invitations.reduce((sum, i) => sum + i._count.views, 0);

    const exportedAt = new Date().toISOString();
    const payload = {
      metadata: {
        platform: 'Nuaone Studio',
        environment: process.env.NODE_ENV || 'production',
        exportedAt,
        targetEngine: 'DuckDB / Parquet OLAP',
        duckdbIngestExample: [
          `-- 1. Ingest JSON directly into DuckDB table:`,
          `CREATE TABLE analytics_orders AS SELECT * FROM read_json_auto('nuaone-analytics-orders-${exportedAt.slice(0, 10)}.json');`,
          `-- 2. Export to high-performance Parquet:`,
          `COPY analytics_orders TO 'nuaone_orders.parquet' (FORMAT PARQUET, COMPRESSION ZSTD);`,
        ],
      },
      summary: {
        totalRevenue,
        totalOrders: orders.length,
        paidOrders: orders.filter((o) => o.status === 'PAID').length,
        totalInvitations: invitations.length,
        publishedInvitations: invitations.filter((i) => i.status === 'PUBLISHED').length,
        totalViews,
        rsvpStats,
        guestEngagement,
      },
      datasets: {
        orders: orders.map((o) => ({
          order_id: o.id,
          order_number: o.orderNumber,
          amount: o.amount,
          status: o.status,
          package_code: o.package.code,
          package_name: o.package.name,
          created_at: o.createdAt.toISOString(),
          updated_at: o.updatedAt.toISOString(),
        })),
        invitations: invitations.map((i) => ({
          invitation_id: i.id,
          slug: i.slug,
          couple: `${i.groomNickname} & ${i.brideNickname}`,
          status: i.status,
          views: i._count.views,
          total_guests: i._count.guests,
          total_rsvps: i._count.rsvps,
          template_slug: i.template.slug,
          template_tier: i.template.tier,
          template_category: i.template.category.name,
          created_at: i.createdAt.toISOString(),
        })),
        rsvps: rsvps.map((r) => ({
          rsvp_id: r.id,
          invitation_id: r.invitationId,
          attendance_status: r.attendanceStatus,
          attendee_count: r.attendeeCount,
          submitted_at: r.submittedAt.toISOString(),
        })),
        guest_engagement: guests.map((g) => ({
          guest_id: g.id,
          invitation_id: g.invitationId,
          category: g.category,
          is_sent: g.isSent,
          total_visits: g.token?.totalVisits ?? 0,
          last_opened_at: g.token?.lastOpenedAt ? g.token.lastOpenedAt.toISOString() : null,
          created_at: g.createdAt.toISOString(),
        })),
        templates: templates.map((t) => ({
          template_id: t.id,
          slug: t.slug,
          name: t.name,
          tier: t.tier,
          category: t.category.name,
          is_active: t.isActive,
        })),
      },
    };

    const fileName = `nuaone-duckdb-analytics-${exportedAt.slice(0, 10)}.json`;

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating DuckDB analytics export:', error);
    return NextResponse.json(
      { error: 'Gagal membuat file export analitik' },
      { status: 500 }
    );
  }
}
