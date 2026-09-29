import { NextRequest, NextResponse } from 'next/server';
import { syncLiveAiesecDataset } from '../../../lib/aiesec-api';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const resolvedParams = await context.params;
  const id = resolvedParams?.id;

  const dataset = await syncLiveAiesecDataset();
  const opp = dataset.find(o => String(o.id) === String(id));

  if (opp) {
    return NextResponse.json({
      data: opp,
      isDemoMode: false
    });
  }

  return NextResponse.json(
    { error: 'Opportunity not found' },
    { status: 404 }
  );
}
