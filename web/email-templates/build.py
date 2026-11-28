#!/usr/bin/env python3
"""Builds the Supabase Auth email templates in this folder.

Run:  python3 build.py
Then paste each .html file into Supabase > Authentication > Emails > Templates
(the file header comment says which template and subject it belongs to).

The header is one image (white logo on a dark band). Gmail's dark mode flips
background colours but never images, so this looks the same in every inbox.
"""
from pathlib import Path

HEADER = "https://homewodrx.com/brand/email-header.png"  # white logo baked onto #161616, 1040x208
TAGLINE = "The training platform for functional fitness athletes, at the box, the health club, or at home."
RED = "#C41212"


def shell(title: str, preheader: str, content: str, reason: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>{title}</title>
<style>
  :root {{ color-scheme: light dark; supported-color-schemes: light dark; }}
  @media (prefers-color-scheme: dark) {{
    .bg {{ background-color:#111111 !important; }}
    .card {{ background-color:#1f1f1f !important; border-color:#333333 !important; }}
    .ink {{ color:#f2f2f2 !important; }}
    .ink2 {{ color:#bbbbbb !important; }}
    .box {{ background-color:#2a2a2a !important; border-color:#3a3a3a !important; }}
    .rule {{ border-color:#333333 !important; }}
  }}
</style>
</head>
<body class="bg" style="margin:0;padding:0;background-color:#f3f3f3;">
<div style="display:none;max-height:0;overflow:hidden;">{preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg" style="background-color:#f3f3f3;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="card" style="max-width:520px;background-color:#ffffff;border:1px solid #e5e5e5;border-radius:16px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <!-- Logo and its dark band are one image, so Gmail dark mode can't flip the band -->
        <tr>
          <td style="padding:0;line-height:0;font-size:0;">
            <img src="{HEADER}" alt="HomeWODRx" width="520" style="display:block;width:100%;max-width:520px;height:auto;border:0;">
          </td>
        </tr>
{content}
        <!-- Footer -->
        <tr><td style="padding:0 40px;"><div class="rule" style="border-top:1px solid #e5e5e5;"></div></td></tr>
        <tr>
          <td style="padding:20px 40px 28px;">
            <p class="ink" style="margin:0 0 4px;font-size:13px;font-weight:700;color:#1a1a1a;">HomeWODRx</p>
            <p class="ink2" style="margin:0 0 4px;font-size:12px;color:#666666;line-height:1.6;">{TAGLINE}</p>
            <p style="margin:0 0 12px;font-size:12px;"><a href="https://homewodrx.com" style="color:{RED};text-decoration:none;">homewodrx.com</a></p>
            <p class="ink2" style="margin:0;font-size:11px;color:#999999;line-height:1.6;">{reason}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
"""


def heading(h: str, p: str) -> str:
    return f"""        <tr>
          <td style="padding:32px 40px 8px;">
            <h1 class="ink" style="margin:0 0 12px;font-size:26px;font-weight:800;color:#1a1a1a;line-height:1.2;letter-spacing:-0.3px;">{h}</h1>
            <p class="ink2" style="margin:0 0 24px;font-size:15px;color:#444444;line-height:1.7;">{p}</p>
          </td>
        </tr>
"""


CODE = """        <tr>
          <td align="center" style="padding:0 40px 24px;">
            <div class="box ink" style="display:inline-block;padding:16px 28px;background-color:#f8f8f8;border:1px solid #e5e5e5;border-radius:10px;font-size:32px;font-weight:800;letter-spacing:8px;color:#1a1a1a;font-family:'SFMono-Regular',Menlo,Consolas,monospace;">{{ .Token }}</div>
          </td>
        </tr>
"""


def button(label: str) -> str:
    return f"""        <tr>
          <td align="center" style="padding:0 40px 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td bgcolor="{RED}" style="background-color:{RED};border-radius:10px;">
                <a href="{{{{ .ConfirmationURL }}}}" style="display:inline-block;padding:15px 36px;font-size:16px;font-weight:800;color:#ffffff;text-decoration:none;border-radius:10px;">{label}</a>
              </td>
            </tr></table>
          </td>
        </tr>
"""


def note(*lines: str) -> str:
    ps = "".join(
        f'<p class="ink2" style="margin:0 0 4px;font-size:13px;color:#555555;line-height:1.6;">{l}</p>' for l in lines
    )
    return f"""        <tr>
          <td style="padding:0 40px 28px;">{ps}</td>
        </tr>
"""


TEMPLATES = {
    # file: (Supabase template, subject, title/preheader, content, footer reason)
    "signup-code.html": (
        "Confirm signup",
        "Your HomeWODRx sign-up code",
        heading("Welcome to HomeWODRx", "Type this code on the sign-up screen to finish creating your free account.")
        + CODE
        + note("The code works once and expires in 1 hour.", "If you didn't sign up, you can ignore this email."),
        "You received this because someone signed up at homewodrx.com with this address.",
    ),
    "login-code.html": (
        "Magic link or OTP",
        "Your HomeWODRx login code",
        heading("Your login code", "Type this code on HomeWODRx to log in.")
        + CODE
        + note("The code works once and expires in 1 hour.", "If you didn't ask for it, you can ignore this email. Your account is safe."),
        "You received this because someone asked for a login code for this address.",
    ),
    "email-change.html": (
        "Change email address",
        "Confirm your new HomeWODRx email",
        heading("Confirm your new email", "Tap the button to use this address for your HomeWODRx account.")
        + button("Confirm new email")
        + note("The link works once and expires in 1 hour.", "If you didn't ask for this, ignore this email and nothing will change."),
        "You received this because someone asked to change a HomeWODRx account's email to this address.",
    ),
}

here = Path(__file__).parent
for name, (slot, subject, content, reason) in TEMPLATES.items():
    html = shell(subject, subject, content, reason)
    header = f"<!-- Supabase template: {slot}. Subject: {subject} -->\n"
    (here / name).write_text(html.replace("<head>\n", "<head>\n" + header, 1))
    print(f"{name:20} -> {slot!r}  subject: {subject}")
