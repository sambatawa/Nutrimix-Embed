import { NextRequest, NextResponse } from 'next/server';
import MidtransClient from 'midtrans-client';

// Initialize Midtrans client
const midtransClient = new MidtransClient.Snap({
  isProduction: false, // Set to true for production
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'YOUR_MIDTRANS_SERVER_KEY',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || 'YOUR_MIDTRANS_CLIENT_KEY'
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerDetails, itemDetails } = body;

    // Validate required fields
    if (!customerDetails?.firstName || !customerDetails?.email || !customerDetails?.phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required customer details' },
        { status: 400 }
      );
    }

    // Create transaction parameters
    const parameter = {
      transaction_details: {
        order_id: 'NUTRIMIX-' + Date.now(),
        gross_amount: itemDetails.price,
      },
      item_details: [{
        id: itemDetails.id,
        price: itemDetails.price,
        quantity: itemDetails.quantity || 1,
        name: itemDetails.name,
        brand: 'Nutrimix',
        category: 'Machinery'
      }],
      customer_details: {
        first_name: customerDetails.firstName,
        last_name: customerDetails.lastName || '',
        email: customerDetails.email,
        phone: customerDetails.phone,
        billing_address: {
          first_name: customerDetails.firstName,
          last_name: customerDetails.lastName || '',
          email: customerDetails.email,
          phone: customerDetails.phone,
          address: customerDetails.address || '',
          city: customerDetails.city || '',
          postal_code: customerDetails.postalCode || '',
          country: customerDetails.country || 'Indonesia'
        }
      },
      enabled_payments: [
        'gopay',
        'dana', 
        'qris',
        'shopeepay',
        'bank_transfer',
        'credit_card'
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/error`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/pending`
      }
    };

    // Create transaction
    const transaction = await midtransClient.createTransaction(parameter);
    
    return NextResponse.json({
      success: true,
      snapToken: transaction.token,
      redirectUrl: transaction.redirect_url,
      orderId: parameter.transaction_details.order_id
    });

  } catch (error) {
    console.error('Midtrans API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create payment transaction' 
      },
      { status: 500 }
    );
  }
}