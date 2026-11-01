STUDENT PROGRAM SYSTEM - UPDATED (v2)

HOW TO RUN
Open index.html in Chrome. No server or install needed.

LOGIN DETAILS
Admin:
  Email:    admin@studentprogram.com
  Password: Mna6HCpD4d@97#

Student (demo): create one with "Create account", or have the Admin add one.

CHANGING THE ADMIN EMAIL / PASSWORD
Option 1 (in the app): log in as Admin > Settings > "Admin Login Settings".
  Enter the current password, then the new email and/or password.
  This is saved in that browser only.
Option 2 (in the code): edit ADMIN_EMAIL and ADMIN_PASSWORD at the top of script.js.
  Browsers that already opened the app are updated automatically on next load,
  unless the admin login was changed through Settings in that browser.

WHAT'S NEW IN v2
Admin
- New admin email and password (see above)
- Settings page: change admin email/password, backup and restore all data
- Students: search, edit, reset password, delete, export CSV
- Parents page: add / delete parent accounts and link them to a student
- Reports: delete reports, export CSV
- Dashboard: low attendance alerts (below 75%)
- Analytics: grade distribution chart and top performers
- Dark mode
Student
- Edit phone number and change own password (My Profile)
- CGPA on the dashboard is now calculated from the latest marks
- Print / Save as PDF button on the Results page
- Time table rooms are now fixed (they used to change on every refresh)
Parent
- Parents can now register themselves: choose "Parent" on the register page
  and enter the registered Student Email to link
- Dark mode
Login
- Show password option
- 5 wrong attempts locks login for 30 seconds

ADMIN -> STUDENT CONNECTION
1. Login as Admin and open Reports.
2. Select a student, enter Marks, Attendance and Teacher Remarks.
3. Click Save / Update Report.
4. Login as that Student (or linked Parent) to see the update.

ADMIN FEATURES
Dashboard, Students, Parents, Reports, Notices, Analytics, Settings

STUDENT FEATURES
Dashboard, Profile, Academics, Attendance, Results, Fees, Timetable,
Assignments, Notices, Reports, Dark mode

PARENT FEATURES
Linked student, latest report, marks, attendance, grade, teacher remarks, notices

IMPORTANT NOTES
- This is a frontend prototype. All data is stored in the browser's localStorage,
  so it is not shared between devices or browsers. Use Settings > Download Backup
  to move or keep your data.
- Passwords are stored as plain text in the browser and the login lockout is
  client-side only. For real use, connect the UI to a backend with hashed passwords.
