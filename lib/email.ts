/**
 * Email Automation Engine for CodeQuiz Arena
 * Powered by Resend API (Direct REST Integration)
 * 
 * Features:
 * 1. Welcome / Login Onboarding Email
 * 2. 1v1 Realtime Duel Challenge Notification Email
 * 3. Leaderboard Top Rank & Score Milestone Email
 * 4. Platform Update & Student News Broadcast Email
 */

const RESEND_API_URL = 'https://api.resend.com/emails';
const DEFAULT_API_KEY = process.env.RESEND_API_KEY || '';
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || 'CodeQuiz Arena <onboarding@resend.dev>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
}

interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Base email dispatcher communicating silently in the background with Resend
 */
export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY || DEFAULT_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;

  const recipients = Array.isArray(to) ? to : [to];
  const validRecipients = recipients
    .map((r) => r.trim())
    .filter((r) => r.length > 3 && r.includes('@'));

  if (validRecipients.length === 0) {
    console.warn('[Resend Email] No valid recipient email provided.');
    return { success: false, error: 'No valid recipient' };
  }

  try {
    const payload = {
      from,
      to: validRecipients,
      subject,
      html,
    };

    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.warn(`[Resend Email] Delivery status ${response.status}:`, data.message || data);
      return { success: false, error: data.message || 'Failed to send' };
    }

    console.log(`[Resend Email] Successfully dispatched email "${subject}" to [${validRecipients.join(', ')}]. ID:`, data.id);
    return { success: true, id: data.id };
  } catch (err) {
    console.error('[Resend Email] Background execution error:', err);
    return { success: false, error: String(err) };
  }
}

/**
 * Modern Cyber-Dark Glassmorphic Email Container
 */
function wrapEmailTemplate(content: string, preheader: string = 'CodeQuiz Arena Notification'): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeQuiz Arena</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #080c14;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f1f5f9;
    }
    .wrapper {
      width: 100%;
      background-color: #080c14;
      padding: 32px 12px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(15, 23, 42, 0.95) 100%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
    }
    .header {
      padding: 28px 32px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      text-align: center;
    }
    .brand {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: -0.5px;
      background: linear-gradient(90deg, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: #38bdf8;
      text-decoration: none;
      display: inline-block;
    }
    .brand-sub {
      display: block;
      font-size: 11px;
      font-family: monospace;
      color: #94a3b8;
      margin-top: 4px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .content {
      padding: 32px;
    }
    .btn {
      display: inline-block;
      padding: 14px 28px;
      background: linear-gradient(90deg, #06b6d4, #3b82f6);
      color: #020617 !important;
      font-weight: 800;
      font-size: 14px;
      border-radius: 14px;
      text-decoration: none;
      text-align: center;
      margin: 20px 0;
      box-shadow: 0 8px 24px rgba(6, 182, 212, 0.35);
    }
    .btn-rose {
      background: linear-gradient(90deg, #f43f5e, #fb923c);
      color: #020617 !important;
      box-shadow: 0 8px 24px rgba(244, 63, 94, 0.35);
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      background: rgba(6, 182, 212, 0.15);
      border: 1px solid rgba(6, 182, 212, 0.3);
      color: #38bdf8;
      margin-bottom: 12px;
    }
    .card-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 20px;
      margin: 20px 0;
    }
    .footer {
      padding: 24px 32px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      text-align: center;
      font-size: 11px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#080c14;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader}
  </div>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <span class="brand">⚡ CODEQUIZ ARENA</span>
        <span class="brand-sub">Developer Duel &amp; Assessment Platform</span>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p style="margin: 0 0 6px;">Created by <strong>Malik Software</strong> • Developed by <strong>malikabubakkar</strong></p>
        <p style="margin: 0;">© ${new Date().getFullYear()} CodeQuiz Arena. Realtime Multiplayer Coding Battleground.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * 1. Send Welcome Email on Signup / First Login
 */
export async function sendWelcomeEmail(params: {
  to: string;
  name: string;
  username?: string;
}): Promise<SendEmailResult> {
  const displayName = params.name || 'Developer';
  const displayUser = params.username ? `@${params.username}` : 'Coder';

  const html = wrapEmailTemplate(
    `
    <div style="text-align: center;">
      <span class="badge">WELCOME TO THE ARENA</span>
      <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 10px 0 16px;">
        Welcome aboard, ${displayName}! 🚀
      </h1>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
        Your developer account <strong>${displayUser}</strong> is officially activated. You now have access to our curated question banks, interactive 1v1 friend duels, and the global competitive leaderboard.
      </p>
    </div>

    <div class="card-box">
      <h3 style="color: #38bdf8; font-size: 14px; font-weight: 800; margin: 0 0 10px; text-transform: uppercase;">
        What You Can Do Next:
      </h3>
      <ul style="color: #cbd5e1; font-size: 13px; line-height: 1.8; margin: 0; padding-left: 20px;">
        <li><strong>Practice Technology Tracks:</strong> JavaScript, React, Python, HTML/CSS, SQL, Git, and more.</li>
        <li><strong>1v1 Friend Duels:</strong> Challenge any developer by username with realtime score sync.</li>
        <li><strong>Climb the Global Leaderboard:</strong> Compete for Olympic podium ranks (Grandmaster &amp; Master tiers).</li>
      </ul>
    </div>

    <div style="text-align: center;">
      <a href="${APP_URL}/courses" class="btn">
        Start First Quiz Track →
      </a>
    </div>

    <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 16px;">
      Need to update your profile, school, or avatar? Visit your <a href="${APP_URL}/profile" style="color: #38bdf8; text-decoration: none;">Profile Dashboard</a> anytime.
    </p>
    `,
    `Welcome to CodeQuiz Arena, ${displayName}!`
  );

  return sendEmail({
    to: params.to,
    subject: `⚡ Welcome to CodeQuiz Arena, ${displayName}!`,
    html,
  });
}

/**
 * 2. Send 1v1 Challenge Request Email to Opponent
 */
export async function sendChallengeRequestEmail(params: {
  to: string;
  recipientName: string;
  challengerName: string;
  challengerUsername?: string | null;
  courseName: string;
  duelUrl?: string;
}): Promise<SendEmailResult> {
  const challengerDisplay = params.challengerUsername
    ? `@${params.challengerUsername}`
    : params.challengerName;
  const link = params.duelUrl || `${APP_URL}/challenge-vs`;

  const html = wrapEmailTemplate(
    `
    <div style="text-align: center;">
      <span class="badge" style="background: rgba(244,63,94,0.15); border-color: rgba(244,63,94,0.3); color: #fb7185;">
        ⚔️ 1V1 REALTIME DUEL CHALLENGE
      </span>
      <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 10px 0 16px;">
        ${params.challengerName} has challenged you!
      </h1>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
        Hey <strong>${params.recipientName}</strong>, <strong>${challengerDisplay}</strong> just initiated a 1v1 Code Duel against you in <strong>${params.courseName}</strong> on CodeQuiz Arena!
      </p>
    </div>

    <div class="card-box">
      <div style="display: flex; justify-content: space-between; font-size: 13px; color: #cbd5e1; line-height: 1.8;">
        <div><strong>⚔️ Battle Track:</strong> ${params.courseName}</div>
        <div><strong>👤 Challenger:</strong> ${challengerDisplay}</div>
        <div><strong>⏱️ Rule:</strong> Randomized questions • Highest accuracy &amp; speed wins!</div>
      </div>
    </div>

    <div style="text-align: center;">
      <a href="${link}" class="btn btn-rose">
        Enter Arena &amp; Accept Duel Now →
      </a>
    </div>

    <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 16px;">
      If you cannot duel right now, you can accept or decline from your challenge room dashboard whenever you log in.
    </p>
    `,
    `⚔️ 1v1 Duel Request from ${challengerDisplay} in ${params.courseName}`
  );

  return sendEmail({
    to: params.to,
    subject: `⚔️ 1v1 Duel Challenge from ${challengerDisplay} (${params.courseName})!`,
    html,
  });
}

/**
 * 3. Send Leaderboard Milestone & Rank Achievement Email
 */
export async function sendLeaderboardMilestoneEmail(params: {
  to: string;
  name: string;
  username?: string;
  rank: number;
  totalScore: number;
  ratingPoints: number;
  tier: string;
}): Promise<SendEmailResult> {
  const html = wrapEmailTemplate(
    `
    <div style="text-align: center;">
      <span class="badge" style="background: rgba(245,158,11,0.15); border-color: rgba(245,158,11,0.3); color: #fbbf24;">
        🏆 GLOBAL RANK MILESTONE
      </span>
      <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 10px 0 16px;">
        Rank #${params.rank} Achieved!
      </h1>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
        Congratulations <strong>${params.name}</strong>! Your recent performance has catapulted you to <strong>Rank #${params.rank}</strong> on the international CodeQuiz Leaderboard.
      </p>
    </div>

    <div class="card-box" style="text-align: center;">
      <div style="display: inline-block; margin: 0 12px;">
        <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase;">Rank</div>
        <div style="font-size: 24px; font-weight: 900; color: #fbbf24;">#${params.rank}</div>
      </div>
      <div style="display: inline-block; margin: 0 12px;">
        <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase;">MMR Rating</div>
        <div style="font-size: 24px; font-weight: 900; color: #38bdf8;">${params.ratingPoints}</div>
      </div>
      <div style="display: inline-block; margin: 0 12px;">
        <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase;">Tier</div>
        <div style="font-size: 24px; font-weight: 900; color: #a855f7;">${params.tier}</div>
      </div>
    </div>

    <div style="text-align: center;">
      <a href="${APP_URL}/leaderboard" class="btn">
        View Live Olympic Leaderboard →
      </a>
    </div>

    <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 16px;">
      Remember: The competitive algorithm applies inactivity decay after 7 days without matches. Keep battling to protect your podium spot!
    </p>
    `,
    `🏆 Rank #${params.rank} on CodeQuiz Leaderboard - ${params.name}`
  );

  return sendEmail({
    to: params.to,
    subject: `🏆 You reached Rank #${params.rank} on the Global Leaderboard!`,
    html,
  });
}

/**
 * 4. Send Platform Update / Feature News Email to Users
 */
export async function sendPlatformUpdateEmail(params: {
  to: string | string[];
  name?: string;
  updateTitle: string;
  updateSummary: string;
  features: string[];
}): Promise<SendEmailResult> {
  const featuresList = params.features
    .map((f) => `<li style="margin-bottom: 8px;">${f}</li>`)
    .join('');

  const html = wrapEmailTemplate(
    `
    <div style="text-align: center;">
      <span class="badge">🚀 PLATFORM UPDATE</span>
      <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 10px 0 16px;">
        ${params.updateTitle}
      </h1>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
        ${params.updateSummary}
      </p>
    </div>

    <div class="card-box">
      <h3 style="color: #38bdf8; font-size: 14px; font-weight: 800; margin: 0 0 12px; text-transform: uppercase;">
        What's New in this Release:
      </h3>
      <ul style="color: #cbd5e1; font-size: 13px; line-height: 1.8; margin: 0; padding-left: 20px;">
        ${featuresList}
      </ul>
    </div>

    <div style="text-align: center;">
      <a href="${APP_URL}" class="btn">
        Explore New Features Now →
      </a>
    </div>
    `,
    `CodeQuiz Arena Platform Update: ${params.updateTitle}`
  );

  return sendEmail({
    to: params.to,
    subject: `🚀 What's New in CodeQuiz Arena: ${params.updateTitle}`,
    html,
  });
}

/**
 * 5. Send Login Notification / Welcome Back Email
 */
export async function sendLoginNotificationEmail(params: {
  to: string;
  name?: string;
  username?: string;
  loginTime?: string;
}): Promise<SendEmailResult> {
  const displayName = params.name || params.username || 'Developer';
  const timeStr = params.loginTime || new Date().toLocaleString();

  const html = wrapEmailTemplate(
    `
    <div style="text-align: center;">
      <span class="badge" style="background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.3); color: #34d399;">
        🛡️ SECURITY &amp; LOGIN NOTIFICATION
      </span>
      <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 10px 0 16px;">
        Welcome Back, ${displayName}! ⚡
      </h1>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
        A new session was just authenticated for your CodeQuiz Arena account.
      </p>
    </div>

    <div class="card-box">
      <div style="font-size: 13px; color: #cbd5e1; line-height: 2;">
        <div><strong>👤 Account:</strong> ${displayName} (${params.to})</div>
        <div><strong>🕒 Timestamp:</strong> ${timeStr}</div>
        <div><strong>🚀 Platform:</strong> Web Application Session</div>
        <div><strong>🛡️ Status:</strong> Active &amp; Ready for Duels</div>
      </div>
    </div>

    <div style="text-align: center;">
      <a href="${APP_URL}/dashboard" class="btn">
        Go to Arena Dashboard →
      </a>
    </div>

    <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 16px;">
      If you did not initiate this login, please secure your account immediately.
    </p>
    `,
    `Successful login to CodeQuiz Arena for ${displayName}`
  );

  return sendEmail({
    to: params.to,
    subject: `⚡ Successful Login to CodeQuiz Arena (${displayName})`,
    html,
  });
}

/**
 * 6. Broadcast Platform Update to all registered students in Prisma with email
 */
export async function broadcastPlatformUpdateToAllStudents(params: {
  updateTitle: string;
  updateSummary: string;
  features: string[];
}): Promise<{ totalSent: number; errors: number }> {
  try {
    const { prisma } = await import('@/lib/prisma');
    const users = await prisma.user.findMany({
      where: {
        email: { not: null },
      },
      select: {
        email: true,
        name: true,
      },
    });

    const validEmails = users
      .map((u) => u.email)
      .filter((e): e is string => !!e && e.includes('@'));

    if (validEmails.length === 0) {
      console.log('[Resend Broadcast] No users with email found to broadcast.');
      return { totalSent: 0, errors: 0 };
    }

    let totalSent = 0;
    let errors = 0;

    for (const email of validEmails) {
      try {
        const res = await sendPlatformUpdateEmail({
          to: email,
          updateTitle: params.updateTitle,
          updateSummary: params.updateSummary,
          features: params.features,
        });
        if (res.success) totalSent++;
        else errors++;
      } catch {
        errors++;
      }
    }

    return { totalSent, errors };
  } catch (err) {
    console.error('[Resend Broadcast Error]', err);
    return { totalSent: 0, errors: 1 };
  }
}

