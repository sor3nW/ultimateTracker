// src/app/api/createUser/route.ts
import { db } from '@/lib/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { id, first_name } = await request.json(); // Parse JSON body from Clerk

    // Add the new user to Firestore with an empty teamCodes array
    await setDoc(doc(db, "users", id), {
      name: first_name,
      teamCodes: [] // Start with an empty array for team codes
    });

    return NextResponse.json({ message: "User created successfully in Firestore" });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
