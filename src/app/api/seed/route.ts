import { NextResponse } from 'next/server';
import { seedJejuTrip } from '@/lib/seed';

// Vercel Hobby 计划函数最长 60 秒
export const maxDuration = 60;

export async function POST() {
  try {
    const result = await seedJejuTrip();
    if (result.success) {
      return NextResponse.json({ message: '种子数据导入成功', tripId: result.tripId });
    }
    return NextResponse.json({ message: '种子数据导入失败', error: result.error }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ message: '种子数据导入失败', error: String(e) }, { status: 500 });
  }
}
