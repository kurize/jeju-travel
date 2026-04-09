import { NextResponse } from 'next/server';
import { seedJejuTrip } from '@/lib/seed';

export async function POST() {
  const result = await seedJejuTrip();
  if (result.success) {
    return NextResponse.json({ message: '种子数据导入成功', tripId: result.tripId });
  }
  return NextResponse.json({ message: '种子数据导入失败', error: result.error }, { status: 500 });
}
