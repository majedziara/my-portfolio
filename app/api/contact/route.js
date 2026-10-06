import { NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // تحقق من البيانات الأساسية
    if (!data.firstName || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Please fill all fields' },
        { status: 400 }
      );
    }

    const client = await getMongoClient();
    const db = client.db(process.env.DATABASE_NAME);
    
    // أدخل البيانات في المجموعة
    const result = await db.collection('contacts').insertOne({
      firstName: data.firstName,
      lastName: data.lastName || '',
      email: data.email,
      phone: data.phone || '',
      service: data.service || '',
      message: data.message,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message was sent', 
        id: result.insertedId 
      },
      { status: 201 }
    );
    
  } catch (error) {
    // console.error('error:', error);
    return NextResponse.json(
      { error: 'Something wrong' },
      { status: 500 }
    );
  }
}
