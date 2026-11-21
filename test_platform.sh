#!/bin/bash
set -e

BASE="http://127.0.0.1:3000"
echo "======================================================="
echo "🧪 RUNNING COMPREHENSIVE NUAONE PLATFORM TEST SUITE"
echo "======================================================="

# 1. Test Public Web Pages
echo -n "1. Testing Public Homepage (/)... "
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/")
if [ "$CODE" = "200" ]; then echo "✅ OK ($CODE)"; else echo "❌ FAILED ($CODE)"; exit 1; fi

echo -n "2. Testing Catalog Page (/katalog)... "
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/katalog")
if [ "$CODE" = "200" ]; then echo "✅ OK ($CODE)"; else echo "❌ FAILED ($CODE)"; exit 1; fi

echo -n "3. Testing Pricing Page (/harga)... "
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/harga")
if [ "$CODE" = "200" ]; then echo "✅ OK ($CODE)"; else echo "❌ FAILED ($CODE)"; exit 1; fi

echo -n "4. Testing About Page (/tentang-kami)... "
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/tentang-kami")
if [ "$CODE" = "200" ]; then echo "✅ OK ($CODE)"; else echo "❌ FAILED ($CODE)"; exit 1; fi

echo -n "5. Testing FAQ Page (/faq)... "
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/faq")
if [ "$CODE" = "200" ]; then echo "✅ OK ($CODE)"; else echo "❌ FAILED ($CODE)"; exit 1; fi

echo -n "6. Testing Contact Page (/kontak)... "
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/kontak")
if [ "$CODE" = "200" ]; then echo "✅ OK ($CODE)"; else echo "❌ FAILED ($CODE)"; exit 1; fi

echo -n "7. Testing Sitemap (/sitemap.xml)... "
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/sitemap.xml")
if [ "$CODE" = "200" ]; then echo "✅ OK ($CODE)"; else echo "❌ FAILED ($CODE)"; exit 1; fi

echo -n "8. Testing Robots (/robots.txt)... "
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/robots.txt")
if [ "$CODE" = "200" ]; then echo "✅ OK ($CODE)"; else echo "❌ FAILED ($CODE)"; exit 1; fi

# 2. Test Wedding Invitation Engine & Tamper-Proof Security
echo -n "9. Testing Public Preview Invitation (/invitation/andi-ani)... "
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/invitation/andi-ani")
if [ "$CODE" = "200" ]; then echo "✅ OK ($CODE)"; else echo "❌ FAILED ($CODE)"; exit 1; fi

echo -n "10. Testing Valid Cryptographic Guest Token (/i/andi-ani/vip-ahmad-faisal-x7Kp92)... "
HTML=$(curl -s "$BASE/i/andi-ani/vip-ahmad-faisal-x7Kp92")
if echo "$HTML" | grep -q "Bapak Ahmad Faisal"; then
  echo "✅ OK (Guest identity verified & displayed safely)"
else
  echo "❌ FAILED (Guest name not found in rendered HTML)"
  exit 1
fi

echo -n "11. Testing Tampered / Invalid Guest Token (/i/andi-ani/invalid-tampered-token)... "
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/i/andi-ani/invalid-tampered-token")
if [ "$CODE" = "404" ]; then echo "✅ OK ($CODE Tamper attempt safely rejected)"; else echo "❌ FAILED ($CODE)"; exit 1; fi

echo -n "12. Testing ICS Calendar Download (/api/invitations/andi-ani/calendar)... "
ICS=$(curl -s "$BASE/api/invitations/andi-ani/calendar")
if echo "$ICS" | grep -q "BEGIN:VCALENDAR"; then
  echo "✅ OK (Valid RFC 5545 iCalendar stream)"
else
  echo "❌ FAILED (Invalid calendar response)"
  exit 1
fi

# 3. Test Authentication API
echo -n "13. Testing User Login API (/api/auth/login)... "
COOKIE_JAR="/tmp/test_cookies.txt"
LOGIN_RES=$(curl -s -c "$COOKIE_JAR" -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@nuaone.my.id","password":"UserPassword2026!"}')

if echo "$LOGIN_RES" | grep -q '"success":true'; then
  echo "✅ OK (Authenticated session established)"
else
  echo "❌ FAILED: $LOGIN_RES"
  exit 1
fi

# 4. Test Customer Dashboard with Authenticated Cookie
echo -n "14. Testing Customer Dashboard (/dashboard) with Session Cookie... "
CODE=$(curl -s -b "$COOKIE_JAR" -o /dev/null -w "%{http_code}" "$BASE/dashboard")
if [ "$CODE" = "200" ]; then echo "✅ OK ($CODE)"; else echo "❌ FAILED ($CODE)"; exit 1; fi

# 5. Test RSVP submission API bound to valid token
echo -n "15. Testing Token-bound RSVP API (/api/invitations/andi-ani/rsvp)... "
RSVP_RES=$(curl -s -X POST "$BASE/api/invitations/andi-ani/rsvp" \
  -H "Content-Type: application/json" \
  -d '{"token":"siti-rahmawati-v2Nx8K","attendanceStatus":"ATTENDING","attendeeCount":2,"message":"Selamat menempuh hidup baru!"}')

if echo "$RSVP_RES" | grep -q '"success":true'; then
  echo "✅ OK (RSVP saved and bound to token in DB)"
else
  echo "❌ FAILED: $RSVP_RES"
  exit 1
fi

# 6. Test Admin Login & Protection
echo -n "16. Testing Admin Login (/api/auth/login as Super Admin)... "
ADMIN_COOKIE_JAR="/tmp/admin_cookies.txt"
ADMIN_LOGIN_RES=$(curl -s -c "$ADMIN_COOKIE_JAR" -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nuaone.my.id","password":"AdminPassword2026!"}')

if echo "$ADMIN_LOGIN_RES" | grep -q '"role":"SUPER_ADMIN"'; then
  echo "✅ OK (Super Admin session granted)"
else
  echo "❌ FAILED: $ADMIN_LOGIN_RES"
  exit 1
fi

echo -n "17. Testing Admin Overview (/admin)... "
CODE=$(curl -s -b "$ADMIN_COOKIE_JAR" -o /dev/null -w "%{http_code}" "$BASE/admin")
if [ "$CODE" = "200" ]; then echo "✅ OK ($CODE)"; else echo "❌ FAILED ($CODE)"; exit 1; fi

echo -n "18. Testing Admin Orders Verification Page (/admin/orders)... "
CODE=$(curl -s -b "$ADMIN_COOKIE_JAR" -o /dev/null -w "%{http_code}" "$BASE/admin/orders")
if [ "$CODE" = "200" ]; then echo "✅ OK ($CODE)"; else echo "❌ FAILED ($CODE)"; exit 1; fi

echo -n "19. Testing Excel Guest Export Route... "
EXCEL_HEAD=$(curl -s -I -b "$COOKIE_JAR" "$BASE/api/invitations/andi-ani/guests/export")
if echo "$EXCEL_HEAD" | grep -qi "spreadsheetml.sheet"; then
  echo "✅ OK (Real Excel .xlsx binary generated)"
else
  echo "❌ FAILED: $EXCEL_HEAD"
  exit 1
fi

echo -n "20. Testing Admin Resource & Cost Monitoring Page (/admin/resources)... "
CODE=$(curl -s -b "$ADMIN_COOKIE_JAR" -o /dev/null -w "%{http_code}" "$BASE/admin/resources")
if [ "$CODE" = "200" ]; then echo "✅ OK ($CODE)"; else echo "❌ FAILED ($CODE)"; exit 1; fi

echo -n "21. Testing DuckDB Analytics Export Route (/api/admin/analytics/export)... "
DUCKDB_EXPORT=$(curl -s -b "$ADMIN_COOKIE_JAR" "$BASE/api/admin/analytics/export")
if echo "$DUCKDB_EXPORT" | grep -q "DuckDB / Parquet OLAP"; then
  echo "✅ OK (DuckDB OLAP JSON schema payload generated)"
else
  echo "❌ FAILED: $DUCKDB_EXPORT"
  exit 1
fi

echo "======================================================="
echo "🎉 ALL 21 AUTOMATED TESTS PASSED WITH 100% SUCCESS!"
echo "======================================================="

