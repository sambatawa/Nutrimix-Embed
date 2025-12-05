import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dns from "dns/promises";
import { db } from "@/lib/firebase";
import { ref, set, get } from "firebase/database";
import bcrypt from 'bcryptjs';

export const runtime = "nodejs"; 

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Cross-Origin-Embedder-Policy": "unsafe-none",
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    "Cross-Origin-Resource-Policy": "cross-origin",
};

async function verifyEmailWithMailboxLayer(email) {
    const apiKey = process.env.MAILBOXLAYER_API_KEY;
    console.log('Email verification:', { email, apiKey: apiKey ? 'exists' : 'missing' });
    
    if (!apiKey) {
        console.log('No MailboxLayer API key, skipping email verification');
        return { isValid: true };
    }
    try {
        const response = await fetch(`https://apilayer.net/api/check?access_key=${apiKey}&email=${encodeURIComponent(email)}&smtp=1&format=1`);
        const data = await response.json();
        console.log('MailboxLayer response:', data);
        
        const formatValid = data?.format_valid === true;
        const mxFound = data?.mx_found === true;
        const smtpOk = data?.smtp_check === true;
        const notDisposable = data?.disposable === false || data?.disposable == null;
        const notRole = data?.role === false || data?.role == null;
        const noSuggestion = !data?.did_you_mean;
        const scoreOk = typeof data?.score !== "number" || data.score >= 0.6; 
        
        console.log('Email validation checks:', {
            formatValid,
            mxFound,
            smtpOk,
            notDisposable,
            notRole,
            noSuggestion,
            scoreOk,
            score: data?.score
        });
        
        const isValid = Boolean(
            formatValid && mxFound && smtpOk && notDisposable && notRole && noSuggestion && scoreOk
        );
        console.log('Email validation result:', isValid);
        return { isValid, raw: data };
    } catch (error) {
        console.error('MailboxLayer error:', error);
        return { isValid: true }; 
    }
}

const accessMap = new Map();
function rateLimit(ip, ms = 15_000) {
    const now = Date.now();
    const last = accessMap.get(ip) || 0;
    if (now - last < ms) return false;
    accessMap.set(ip, now);
    return true;
}

async function verifyRecap(token) {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    console.log('reCAPTCHA verification:', { 
        token: token?.substring(0, 20) + '...', 
        secret: secret ? 'exists' : 'missing',
        tokenLength: token?.length
    });
    
    if (!secret) {
        console.log('No secret key, skipping reCAPTCHA');
        return true;
    }
    try {
        const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `secret=${secret}&response=${token}`
        });
        const data = await res.json();
        console.log('reCAPTCHA response:', data);
        return data.success === true;
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return true; 
    }
}


export async function OPTIONS() {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const key = searchParams.get('key');
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        
        if (token && email) {
            const firebaseKey = email.replace(/[^a-zA-Z0-9]/g, '_');
            const verificationRef = ref(db, 'pending_verifications/' + firebaseKey);
            const snapshot = await get(verificationRef);
            
            if (!snapshot.exists()) {
                return NextResponse.redirect(
                    new URL('/register?error=not_found', process.env.NEXT_PUBLIC_BASE_URL)
                );
            }
            
            const data = snapshot.val();
            const now = new Date();
            const expiresAt = new Date(data.expiresAt);
            
            if (now > expiresAt) {
                return NextResponse.redirect(
                    new URL('/register?error=expired', process.env.NEXT_PUBLIC_BASE_URL)
                );
            }
            
            if (data.verificationToken !== token) {
                return NextResponse.redirect(
                    new URL('/register?error=invalid_token', process.env.NEXT_PUBLIC_BASE_URL)
                );
            }
            
            try {
                const hashedPassword = await bcrypt.hash(data.password, 12);
                
                const userRef = ref(db, 'users/' + firebaseKey);
                await set(userRef, {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                    referralCode: data.referralCode,
                    createdAt: new Date().toISOString(),
                    isActive: true,
                    emailVerified: true,
                    verifiedAt: new Date().toISOString()
                });
                
                console.log('User account created successfully for:', data.email);
                console.log('Password hashed successfully for:', data.email);
                
                await set(verificationRef, null);
                
            } catch (error) {
                console.error('Error creating user account:', error);
            }
            
            return NextResponse.redirect(
                new URL('/login?verified=true&email=' + encodeURIComponent(email), process.env.NEXT_PUBLIC_BASE_URL)
            );
        }
        
        if (!key) {
            return NextResponse.json(
                { error: "Key is required" },
                { status: 400, headers: corsHeaders }
            );
        }
        
        const verificationRef = ref(db, 'pending_verifications/' + key);
        const snapshot = await get(verificationRef);
        
        if (!snapshot.exists()) {
            return NextResponse.json(
                { error: "Verification not found" },
                { status: 404, headers: corsHeaders }
            );
        }
        
        const data = snapshot.val();
        const now = new Date();
        const expiresAt = new Date(data.expiresAt);
        
        if (now > expiresAt) {
            return NextResponse.json(
                { expired: true, verified: false },
                { headers: corsHeaders }
            );
        }
        
        if (data.status === 'verified') {
            return NextResponse.json(
                { verified: true, expired: false, userData: data },
                { headers: corsHeaders }
            );
        }
        
        return NextResponse.json(
            { verified: false, expired: false, status: 'pending' },
            { headers: corsHeaders }
        );
        
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500, headers: corsHeaders }
        );
    }
}

export async function POST(req) {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        return NextResponse.json(
            { message: "Content-Type harus application/json", success: false },
            { status: 400, headers: corsHeaders }
        );
    }
    
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimit(ip)) {
        return NextResponse.json(
            { message: "Maximum Limit access", success: false },
            { status: 429, headers: corsHeaders }
        );
    }

    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { message: "JSON tidak valid", success: false },
            { status: 400, headers: corsHeaders }
        );
    }

    const { name, email, subject, message, token } = body; 
    
    if (!name || !email || !subject || !message || !token) { 
        return NextResponse.json(
            { message: "Semua field wajib diisi", success: false },
            { status: 400, headers: corsHeaders }
        );
    }

    const recapValid = await verifyRecap(String(token));
    if (!recapValid) {
        return NextResponse.json({ message: "reCAPTCHA gagal.", success: false }, { status: 400, headers: corsHeaders });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email))) {
        return NextResponse.json(
            { message: "Format email tidak valid", success: false },
            { status: 400, headers: corsHeaders }
        );
    }
    
    try {
        const domain = String(email).split("@")[1];
        const mxRecords = await dns.resolveMx(domain);

        if (!mxRecords || mxRecords.length === 0) {
            return NextResponse.json(
                { message: "Domain email tidak memiliki server email (MX record)", success: false },
                { status: 400, headers: corsHeaders }
            );
        }
    } catch (e) {
        return NextResponse.json(
            { message: "Domain email tidak valid atau tidak dapat diverifikasi", success: false },
            { status: 400, headers: corsHeaders }
        );
    }
    
    console.log('Skipping email verification for testing');

    if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
        return NextResponse.json(
            { message: "Server configuration error: Email credentials missing", success: false },
            { status: 500, headers: corsHeaders }
        );
    }
    
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        
        const time = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
        const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/validation?token=${verificationToken}&email=${encodeURIComponent(email)}`;
        
        const firebaseKey = email.replace(/[^a-zA-Z0-9]/g, '_'); 
        const tempDataRef = ref(db, 'pending_verifications/' + firebaseKey);
        
        await set(tempDataRef, {
            name: String(name),
            email: String(email),
            subject: String(subject),
            message: String(message),
            password: body.password,
            referralCode: body.referralCode,
            verificationToken: verificationToken,
            timestamp: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
        });
        
        await transporter.sendMail({
            from: { name: "Nutrimix System", address: String(process.env.EMAIL_USERNAME) },
            to: String(email),
            subject: "Verifikasi Email Pendaftaran Anda",
            html: `
                <div style="font-family: Arial, Helvetica, sans-serif; color: #111; line-height: 1.6; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Verifikasi Email Anda</h2>
                    <p>Hi <strong>${String(name)}</strong>,</p>
                    <p>
                        Untuk melanjutkan registrasi, silakan klik tombol verifikasi di bawah ini. Halaman pendaftaran akan otomatis diperbarui setelah verifikasi:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationLink}" 
                           style="background: linear-gradient(135deg, #D4A574, #C17A4F); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 15px rgba(212, 165, 116, 0.3);">
                            Verifikasi Email Saya
                        </a>
                    </div>
                    <p style="color: #999; font-size: 12px; text-align: center;">Link verifikasi berlaku selama 24 jam.</p>
                </div>`,
        });
        
        return NextResponse.json({ 
            message: "Tautan verifikasi telah dikirim ke email Anda. Silakan cek inbox dan klik tautan untuk melanjutkan pendaftaran.", 
            success: true,
            requiresLinkVerification: true,
            pendingKey: firebaseKey
        }, 
        { headers: corsHeaders }); 
        
    } catch (error) {
        console.error("Error dalam proses pengiriman email atau penyimpanan Firebase:", error);
        return NextResponse.json({ message: "Gagal memproses pendaftaran.", success: false }, { status: 500, headers: corsHeaders });
    }
}

export async function handleVerification(req) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        
        if (!token || !email) {
            return NextResponse.redirect(
                new URL('/register?error=missing_params', process.env.NEXT_PUBLIC_BASE_URL)
            );
        }
        
        const firebaseKey = email.replace(/[^a-zA-Z0-9]/g, '_');
        const verificationRef = ref(db, 'pending_verifications/' + firebaseKey);
        const snapshot = await get(verificationRef);
        
        if (!snapshot.exists()) {
            return NextResponse.redirect(
                new URL('/register?error=not_found', process.env.NEXT_PUBLIC_BASE_URL)
            );
        }
        
        const data = snapshot.val();
        const now = new Date();
        const expiresAt = new Date(data.expiresAt);
        
        // Check if expired
        if (now > expiresAt) {
            return NextResponse.redirect(
                new URL('/register?error=expired', process.env.NEXT_PUBLIC_BASE_URL)
            );
        }
        
        // Check if token matches
        if (data.verificationToken !== token) {
            return NextResponse.redirect(
                new URL('/register?error=invalid_token', process.env.NEXT_PUBLIC_BASE_URL)
            );
        }
        
        await set(verificationRef, {
            ...data,
            status: 'verified',
            verifiedAt: new Date().toISOString()
        });
        
        return NextResponse.redirect(
            new URL('/register?verified=true&email=' + encodeURIComponent(email), process.env.NEXT_PUBLIC_BASE_URL)
        );
        
    } catch (error) {
        return NextResponse.redirect(
            new URL('/register?error=server_error', process.env.NEXT_PUBLIC_BASE_URL)
        );
    }
}