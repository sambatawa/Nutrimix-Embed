import { NextRequest, NextResponse } from 'next/server';
import MidtransClient from 'midtrans-client';
import { db } from "@/lib/firebase";
import { ref, get, remove, set } from "firebase/database";

const midtransClient = new MidtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'YOUR_MIDTRANS_SERVER_KEY',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || 'YOUR_MIDTRANS_CLIENT_KEY'
});

// Verify Email API
export async function POST(req) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { message: "Content-Type harus application/json", success: false },
      { status: 400 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "JSON tidak valid", success: false },
      { status: 400 }
    );
  }

  const { token, email } = body;
  if (!token || !email) {
    return NextResponse.json(
      { message: "Token dan email wajib diisi", success: false },
      { status: 400 }
    );
  }

  try {
    // Cek pending user di Firebase
    const pendingUserRef = ref(db, 'pending_users/' + email.replace(/[^a-zA-Z0-9]/g, '_'));
    const pendingUserSnapshot = await get(pendingUserRef);
    
    if (!pendingUserSnapshot.exists()) {
      return NextResponse.json(
        { message: "Data registrasi tidak ditemukan atau sudah kadaluarsa", success: false },
        { status: 400 }
      );
    }

    const pendingUserData = pendingUserSnapshot.val();
    const currentTime = new Date().toISOString();
    
    // Cek expired
    if (currentTime > pendingUserData.expiresAt) {
      await remove(pendingUserRef);
      return NextResponse.json(
        { message: "Link verifikasi sudah kadaluarsa. Silakan registrasi kembali.", success: false },
        { status: 400 }
      );
    }

    // Cek token match
    if (pendingUserData.verificationToken !== token) {
      return NextResponse.json(
        { message: "Token verifikasi tidak valid", success: false },
        { status: 400 }
      );
    }

    // Token valid - simpan user ke database utama
    const userRef = ref(db, 'users/' + email.replace(/[^a-zA-Z0-9]/g, '_'));
    
    // Generate referral code
    const generateReferralCode = (name) => {
      const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      return cleanName.slice(0, 4) + random;
    };
    
    const referralCode = generateReferralCode(pendingUserData.name);
    
    const userData = {
      name: pendingUserData.name,
      email: pendingUserData.email,
      password: pendingUserData.password || '',
      deviceCode: pendingUserData.deviceCode || 'Nutrimix1',
      referralCode: referralCode,
      createdAt: new Date().toISOString(),
      isActive: true,
      emailVerified: true
    };
    
    await set(userRef, userData);
    
    // Hapus data pending
    await remove(pendingUserRef);
    
    console.log("User registered successfully:", userData.email);
    
    return NextResponse.json({ 
      message: "Email berhasil diverifikasi dan akun telah dibuat.", 
      success: true,
      userData: {
        name: userData.name,
        email: userData.email,
        referralCode: userData.referralCode
      }
    });

  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat verifikasi email", success: false },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customerDetails, itemDetails } = body;

    if (!customerDetails?.firstName || !customerDetails?.email || !customerDetails?.phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required customer details' },
        { status: 400 }
      );
    }

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
        'qris'
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/error`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/pending`
      }
    };
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