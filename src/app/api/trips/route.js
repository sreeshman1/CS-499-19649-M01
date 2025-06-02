import dbConnect from '../../../lib/mongodb';
import Trip from '@/models/Trip';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect(); // Ensure database connection
    const trips = await Trip.find({}).lean(); // .lean() for plain JS objects

    if (!trips || trips.length === 0) {
      return NextResponse.json({ message: "Trips not found" }, { status: 404 });
    }
    return NextResponse.json(trips, { status: 200 });
  } catch (error) {
    console.error("Error fetching trips list:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

// POST method to add a new trip 
export async function POST(request) {

  try {
    await dbConnect();
    const body = await request.json();

    // Basic validation (more robust validation should be in the model or a validation library)
    const requiredFields = ['code', 'name', 'length', 'start', 'resort', 'perPerson', 'image', 'description'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ message: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const newTrip = await Trip.create(body);
    return NextResponse.json(newTrip, { status: 201 });
  } catch (error) {
    console.error("Error adding trip:", error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: "Validation Error", errors: error.errors }, { status: 400 });
    }
    if (error.code === 11000) { // Duplicate key error (e.g., for unique 'code')
        return NextResponse.json({ message: "Duplicate trip code.", field: 'code' }, { status: 409 });
    }
    return NextResponse.json({ message: "Error adding trip", error: error.message }, { status: 500 });
  }
}