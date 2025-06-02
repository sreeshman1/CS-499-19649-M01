import dbConnect from '../../../../lib/mongodb';
import Trip from '@/models/Trip';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { tripCode } = params;
  try {
    await dbConnect();
    const trip = await Trip.findOne({ code: tripCode }).lean();

    if (!trip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 });
    }
    return NextResponse.json(trip, { status: 200 });
  } catch (error) {
    console.error("Error fetching trip by code:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { tripCode } = params;
  try {
    await dbConnect();
    const body = await request.json();

    const updatedTrip = await Trip.findOneAndUpdate(
      { code: tripCode },
      body,
      { new: true, runValidators: true } // new: true returns the updated document
    );

    if (!updatedTrip) {
      return NextResponse.json({ message: `Trip not found with code ${tripCode}` }, { status: 404 });
    }
    return NextResponse.json(updatedTrip, { status: 200 });
  } catch (error) {
    console.error("Error updating trip:", error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: "Validation Error", errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: "Error updating trip", error: error.message }, { status: 500 });
  }
}