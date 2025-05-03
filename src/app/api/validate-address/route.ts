import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { address } = await req.json();

        if (!address || !address.street || !address.county) {
            return NextResponse.json({
                isValid: false,
                message: 'Address must include both street and county.',
            }, { status: 400 });
        }

        // Simulate address validation logic
        const isValid = address.street.length > 3 && address.county.length > 2;

        if (!isValid) {
            return NextResponse.json({
                isValid: false,
                message: 'Invalid address. Please provide a valid address.',
            }, { status: 400 });
        }

        return NextResponse.json({
            isValid: true,
            message: 'Address is valid.',
        }, { status: 200 });
    } catch (error: any) {
        console.error('Error validating address:', error);
        return NextResponse.json({
            isValid: false,
            message: 'Error validating address.',
            error: error.message,
        }, { status: 500 });
    }
}