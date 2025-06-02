import dbConnect from '../../../lib/mongodb';
import Trip from '../../../models/Trip';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();
    const trips = await Trip.find({}).lean();

    if (!trips || trips.length === 0) {
      return NextResponse.json({ message: "Trips not found" }, { status: 404 });
    }
    return NextResponse.json(trips, { status: 200 });
  } catch (error) {
    console.error("Error fetching trips list:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Updated validation to include new fields
    const requiredFields = [
      'code', 'name', 'length', 'durationNights', 'start',
      'resort', 'rating', 'perPerson', 'image', 'description'
    ];
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') { // Check for empty string too
        return NextResponse.json({ message: `Missing or empty required field: ${field}` }, { status: 400 });
      }
    }

    // Type checking for new numerical fields
    if (typeof body.durationNights !== 'number' || body.durationNights < 1) {
      return NextResponse.json({ message: 'durationNights must be a positive number.' }, { status: 400 });
    }
    if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ message: 'rating must be a number between 1 and 5.' }, { status: 400 });
    }


    const newTrip = await Trip.create(body);
    return NextResponse.json(newTrip, { status: 201 });
  } catch (error) {
    console.error("Error adding trip:", error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: "Validation Error", errors: error.errors }, { status: 400 });
    }
    if (error.code === 11000) {
      return NextResponse.json({ message: "Duplicate trip code.", field: 'code' }, { status: 409 });
    }
    return NextResponse.json({ message: "Error adding trip", error: error.message }, { status: 500 });
  }
}