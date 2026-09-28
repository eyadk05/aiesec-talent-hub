import { NextRequest, NextResponse } from 'next/server';
import { MOCK_OPPORTUNITIES } from '../../../lib/aiesec-api';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const resolvedParams = await context.params;
  const id = resolvedParams?.id;
  const mockOpp = MOCK_OPPORTUNITIES.find(o => String(o.id) === String(id));

  if (mockOpp) {
    return NextResponse.json({
      data: mockOpp,
      isDemoMode: false
    });
  }

  return NextResponse.json(
    { error: 'Opportunity not found' },
    { status: 404 }
  );
}
