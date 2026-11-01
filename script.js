const KEY_USERS="sps_users", KEY_REPORTS="sps_reports", KEY_SESSION="sps_session", KEY_NOTICE="sps_notices";
const ADMIN_EMAIL=atob("a2FzaXVkYXlraXJh bjMxQGdtYWlsLmNvbQ==".replace(/\s/g,""));
const ADMIN_PASSWORD=atob("S2lyYW5AMTMx");
const demoUsers=[
 {id:"ADM001",name:"Administrator",email:ADMIN_EMAIL,password:ADMIN_PASSWORD,role:"admin"}
];
const demoReports=[
 {email:"student@gmail.com",marks:86,attendance:91,format:"percentage",remarks:"Good performance. Keep improving in problem solving.",updated:"24 Sep 2026"},
 {email:"rahul@gmail.com",marks:78,attendance:84,format:"percentage",remarks:"Good progress. Focus more on attendance and revision.",updated:"23 Sep 2026"}
];
const demoNotices=[
 {title:"Mid-Term Examination",text:"Mid-term examinations begin from 10 October 2026."},
 {title:"Fee Payment",text:"Pay pending semester fees before the due date."},
 {title:"Academic Registration",text:"Course registration window is open."}
];

function getUsers(){let x=JSON.parse(localStorage.getItem(KEY_USERS));if(!Array.isArray(x))x=[];if(!x.some(u=>u.role==="admin")){x.unshift(...demoUsers);localStorage.setItem(KEY_USERS,JSON.stringify(x));}return x}
function getReports(){let x=JSON.parse(localStorage.getItem(KEY_REPORTS));if(!x){x=demoReports;localStorage.setItem(KEY_REPORTS,JSON.stringify(x))}return x}
function getNotices(){let x=JSON.parse(localStorage.getItem(KEY_NOTICE));if(!x){x=demoNotices;localStorage.setItem(KEY_NOTICE,JSON.stringify(x))}return x}
function session(){return JSON.parse(localStorage.getItem(KEY_SESSION)||"null")}
function initials(name){return name.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase()}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function toast(t){const x=document.getElementById("toast");if(!x)return;x.textContent=t;x.className="show";setTimeout(()=>x.className="",2200)}
function logout(){localStorage.removeItem(KEY_SESSION);location.href="index.html"}

document.getElementById("loginForm")?.addEventListener("submit",e=>{
 e.preventDefault();const email=document.getElementById("email").value.trim().toLowerCase(),pass=document.getElementById("password").value;
 const u=getUsers().find(x=>x.email.toLowerCase()===email&&x.password===pass),m=document.getElementById("loginMsg");
 if(!u){m.className="msg error";m.textContent="Invalid email or password.";return}
 localStorage.setItem(KEY_SESSION,JSON.stringify({email:u.email,role:u.role}));
 location.href=u.role==="admin"?"admin.html":u.role==="parent"?"parent.html":"dashboard.html";
});

function requireRole(role){const s=session();if(!s||s.role!==role){location.href="index.html";return null}return s}
function navCommon(){document.querySelectorAll(".nav[data-page]").forEach(n=>n.addEventListener("click",()=>showPage(n.dataset.page,n)));}
function initApp(){
 const s=requireRole("student");if(!s)return;getUsers();getReports();getNotices();
 const u=getUsers().find(x=>x.email===s.email);window.currentUser=u;
 document.getElementById("sideName").textContent=u.name;document.getElementById("sideId").textContent=u.id;
 document.getElementById("topName").textContent=u.name;document.getElementById("avatar").textContent=initials(u.name);document.getElementById("topAvatar").textContent=initials(u.name);
 navCommon();document.getElementById("hamb").onclick=()=>document.querySelector(".sidebar").classList.toggle("open");
 document.getElementById("darkBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("sps_dark",document.body.classList.contains("dark"))};
 if(localStorage.getItem("sps_dark")==="true")document.body.classList.add("dark");
 showPage("dashboard",document.querySelector('[data-page="dashboard"]'));
}
function showPage(page,node){
 document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));node?.classList.add("active");
 const title={"dashboard":"Student Dashboard","profile":"My Profile","academics":"Academics","attendance":"Attendance","results":"Results","fees":"Fee Details","timetable":"Time Table","assignments":"Assignments","notices":"Notices","reports":"Reports"}[page]||"Student Dashboard";
 document.getElementById("pageTitle").textContent=title;const c=document.getElementById("content");c.innerHTML="";
 if(page==="dashboard")renderStudentDashboard(c);else if(page==="profile")renderProfile(c);else if(page==="academics")renderAcademics(c);else if(page==="attendance")renderAttendance(c);else if(page==="results")renderResults(c);else if(page==="fees")renderFees(c);else if(page==="timetable")renderTimetable(c);else if(page==="assignments")renderAssignments(c);else if(page==="notices")renderNotices(c);else renderReports(c);
}
function renderStudentDashboard(c){
 const u=window.currentUser,r=getReports().find(x=>x.email===u.email)||{marks:0,attendance:0,remarks:"No report yet."};
 c.innerHTML=`<div class="hero"><div><h1>Student Dashboard</h1><p>Track your academic progress, attendance and latest college updates.</p></div><div class="hero-icon">🎓</div></div>
 <div class="cards"><div class="stat"><span class="ico">📚</span><b>8.62</b><small>Current CGPA</small></div><div class="stat"><span class="ico">🎯</span><b>${r.marks}%</b><small>Latest Marks</small></div><div class="stat"><span class="ico">🗓️</span><b>${r.attendance}%</b><small>Attendance</small></div><div class="stat"><span class="ico">📄</span><b>${getReports().filter(x=>x.email===u.email).length}</b><small>Reports</small></div></div>
 <div class="grid"><section class="panel"><div class="panel-title"><div><h3>Semester Performance</h3><p>Your academic performance trend</p></div><span>📈</span></div><div class="chart">${[78,81,84,86].map((v,i)=>`<div class="bar-col"><em>${v/10}</em><div class="bar" style="height:${v}%"></div><label>${["Sem I","Sem II","Sem III","Current"][i]}</label></div>`).join("")}</div></section>
 <section class="panel"><div class="panel-title"><div><h3>Latest Notices</h3><p>Important announcements</p></div>📢</div>${getNotices().map(n=>`<div class="notice"><b>${esc(n.title)}</b><span>${esc(n.text)}</span></div>`).join("")}</section></div>
 <section class="panel"><div class="panel-title"><div><h3>Current Semester Subjects</h3><p>Attendance and status</p></div>📚</div>${subjectTable()}</section>`;
}
function subjectTable(){let rows=[["CSE401","Java Programming",4,"Dr. Rao",91],["CSE402","Data Structures",4,"Dr. Kumar",84],["CSE403","Database Systems",4,"Dr. Priya",87],["MAT401","Engineering Mathematics",4,"Dr. Reddy",74]];return `<div class="table-wrap"><table class="data-table"><tr><th>Code</th><th>Subject</th><th>Credits</th><th>Faculty</th><th>Attendance</th><th>Status</th></tr>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}%</td><td><span class="badge ${r[4]<75?"warn":""}">${r[4]<75?"Improve":"Good"}</span></td></tr>`).join("")}</table></div>`}
function renderProfile(c){let u=window.currentUser;c.innerHTML=`<section class="panel"><div class="panel-title"><div><h3>My Profile</h3><p>Student account information</p></div>👤</div><div class="profile-grid">${[["Student ID",u.id],["Full Name",u.name],["Email",u.email],["Phone",u.phone||"Not added"],["Program",u.program||"B.Tech CSE"],["Year",u.year||"2nd Year"],["Section",u.section||"A"],["Status","Active"]].map(x=>`<div class="info"><small>${x[0]}</small><b>${esc(x[1])}</b></div>`).join("")}</div></section>`}
function renderAcademics(c){c.innerHTML=`<section class="panel"><div class="panel-title"><div><h3>Current Semester Subjects</h3><p>Academic course details</p></div>📚</div><div class="subject-grid">${[["Java Programming","CSE401",91],["Data Structures","CSE402",84],["Database Systems","CSE403",87],["Engineering Mathematics","MAT401",74],["Operating Systems","CSE404",89],["Computer Networks","CSE405",82]].map(x=>`<div class="subject"><b>${x[0]}</b><small>${x[1]} • 4 Credits</small><div class="progress"><i style="width:${x[2]}%"></i></div><small>${x[2]}% attendance</small></div>`).join("")}</div></section>`}
function renderAttendance(c){c.innerHTML=`<section class="panel"><div class="panel-title"><div><h3>Attendance</h3><p>Subject-wise attendance</p></div>🗓️</div>${subjectTable()}</section>`}
function renderResults(c){let r=getReports().find(x=>x.email===window.currentUser.email)||{marks:0,attendance:0,remarks:"No report available."};c.innerHTML=`<section class="panel"><div class="panel-title"><div><h3>Results</h3><p>Latest academic report from admin</p></div>📊</div><div class="big-result"><div class="result-box"><b>${r.marks}%</b><span>Latest Marks</span></div><div class="result-box"><b>${r.attendance}%</b><span>Attendance</span></div><div class="result-box"><b>${r.marks>=90?"A+":r.marks>=80?"A":r.marks>=70?"B":"C"}</b><span>Grade</span></div></div><div class="info" style="margin-top:14px"><small>Teacher Remarks</small><b>${esc(r.remarks)}</b></div></section>`}
function renderFees(c){c.innerHTML=`<section class="panel"><div class="panel-title"><div><h3>Fee Details</h3><p>Semester fee information</p></div>💳</div><div class="big-result"><div class="result-box"><b>₹85,000</b><span>Total Fee</span></div><div class="result-box"><b>₹70,000</b><span>Paid</span></div><div class="result-box"><b>₹15,000</b><span>Pending</span></div></div></section>`}
function renderTimetable(c){let a=[["09:00","Java Programming","Dr. Rao"],["10:00","Data Structures","Dr. Kumar"],["11:00","Database Systems","Dr. Priya"],["02:00","Mathematics","Dr. Reddy"],["03:00","Computer Networks","Dr. Singh"]];c.innerHTML=`<section class="panel"><div class="panel-title"><div><h3>Today's Time Table</h3><p>Monday • Current Semester</p></div>🕘</div><table class="data-table"><tr><th>Time</th><th>Subject</th><th>Faculty</th><th>Room</th></tr>${a.map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td><td>CSE-${Math.floor(Math.random()*10+1)}</td></tr>`).join("")}</table></section>`}
function renderAssignments(c){c.innerHTML=`<section class="panel"><div class="panel-title"><div><h3>Assignments</h3><p>Current semester submissions</p></div>📝</div><table class="data-table"><tr><th>Assignment</th><th>Subject</th><th>Due Date</th><th>Status</th></tr><tr><td>Java OOP Program</td><td>Java</td><td>28 Sep 2026</td><td><span class="badge">Submitted</span></td></tr><tr><td>Binary Search Tree</td><td>Data Structures</td><td>30 Sep 2026</td><td><span class="badge warn">Pending</span></td></tr><tr><td>SQL Queries</td><td>Database</td><td>02 Oct 2026</td><td><span class="badge warn">Pending</span></td></tr></table></section>`}
function renderNotices(c){c.innerHTML=`<section class="panel"><div class="panel-title"><div><h3>Latest Notices</h3><p>College announcements</p></div>📢</div>${getNotices().map(n=>`<div class="notice"><b>${esc(n.title)}</b><span>${esc(n.text)}</span></div>`).join("")}</section>`}
function renderReports(c){let rs=getReports().filter(x=>x.email===window.currentUser.email);c.innerHTML=`<section class="panel"><div class="panel-title"><div><h3>My Reports</h3><p>Reports uploaded by the administrator</p></div>📄</div><table class="data-table"><tr><th>Date</th><th>Marks</th><th>Attendance</th><th>Grade</th><th>Remarks</th></tr>${rs.map(r=>`<tr><td>${r.updated}</td><td>${r.marks}%</td><td>${r.attendance}%</td><td><span class="badge">${r.marks>=90?"A+":r.marks>=80?"A":r.marks>=70?"B":"C"}</span></td><td>${esc(r.remarks)}</td></tr>`).join("")||"<tr><td colspan='5'>No reports available.</td></tr>"}</table></section>`}

function initAdmin(){
 const s=requireRole("admin");if(!s)return;getUsers();getReports();getNotices();
 document.querySelectorAll(".nav[data-page]").forEach(n=>n.addEventListener("click",()=>adminPage(n.dataset.page,n)));
 document.getElementById("hamb").onclick=()=>document.querySelector(".sidebar").classList.toggle("open");
 adminPage("admin-dashboard",document.querySelector(".nav.active"));
}
function adminPage(page,node){document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));node?.classList.add("active");document.getElementById("adminTitle").textContent=({["admin-dashboard"]:"Admin Dashboard",students:"Manage Students",reports:"Manage Reports",notices:"Manage Notices",analytics:"Analytics"})[page]||"Admin Dashboard";let c=document.getElementById("adminContent");c.innerHTML="";if(page==="admin-dashboard")adminDashboard(c);if(page==="students")adminStudents(c);if(page==="reports")adminReports(c);if(page==="notices")adminNotices(c);if(page==="analytics")adminAnalytics(c)}
function adminDashboard(c){let users=getUsers().filter(x=>x.role==="student"),rs=getReports(),avg=rs.length?Math.round(rs.reduce((a,x)=>a+Number(x.marks),0)/rs.length):0,att=rs.length?Math.round(rs.reduce((a,x)=>a+Number(x.attendance),0)/rs.length):0;c.innerHTML=`<div class="hero"><div><h1>Admin Dashboard</h1><p>Manage student performance, attendance, grades and reports from one place.</p></div><div class="hero-icon">📊</div></div><div class="cards"><div class="stat"><span class="ico">👨‍🎓</span><b>${users.length}</b><small>Total Students</small></div><div class="stat"><span class="ico">📄</span><b>${rs.length}</b><small>Total Reports</small></div><div class="stat"><span class="ico">🎯</span><b>${avg}%</b><small>Average Marks</small></div><div class="stat"><span class="ico">🗓️</span><b>${att}%</b><small>Average Attendance</small></div></div><div class="grid"><section class="panel"><div class="panel-title"><div><h3>Performance Overview</h3><p>Average marks by report</p></div>📈</div><div class="chart">${rs.slice(-6).map((r,i)=>`<div class="bar-col"><em>${r.marks}%</em><div class="bar" style="height:${Math.max(8,r.marks)}%"></div><label>${getUsers().find(u=>u.email===r.email)?.name?.split(" ")[0]||"Student"}</label></div>`).join("")}</div></section><section class="panel"><div class="panel-title"><div><h3>Recent Notices</h3><p>Visible to students</p></div>📢</div>${getNotices().map(n=>`<div class="notice"><b>${esc(n.title)}</b><span>${esc(n.text)}</span></div>`).join("")}</section></div><section class="panel"><div class="panel-title"><div><h3>Recent Reports</h3><p>Connected student records</p></div>📄</div>${reportTable(rs.slice(-6).reverse())}</section>`}
function reportTable(rs){return `<div class="table-wrap"><table class="data-table"><tr><th>Student</th><th>Email</th><th>Marks</th><th>Attendance</th><th>Grade</th><th>Updated</th></tr>${rs.map(r=>{let u=getUsers().find(x=>x.email===r.email);return `<tr><td>${esc(u?.name||"Unknown")}</td><td>${esc(r.email)}</td><td>${r.marks}%</td><td>${r.attendance}%</td><td><span class="badge">${r.marks>=90?"A+":r.marks>=80?"A":r.marks>=70?"B":"C"}</span></td><td>${r.updated}</td></tr>`}).join("")||"<tr><td colspan='6'>No reports.</td></tr>"}</table></div>`}
function adminStudents(c){let users=getUsers().filter(x=>x.role==="student");c.innerHTML=`<section class="panel"><div class="toolbar"><div><h3>Student Accounts</h3><p style="color:var(--muted);font-size:12px">Students registered in the system</p></div><button class="btn primary" onclick="addStudent()">+ Add Student</button></div>${studentTable(users)}</section>`}
function studentTable(us){return `<div class="table-wrap"><table class="data-table"><tr><th>ID</th><th>Name</th><th>Email</th><th>Program</th><th>Year</th><th>Action</th></tr>${us.map(u=>`<tr><td>${u.id}</td><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${esc(u.program||"B.Tech CSE")}</td><td>${esc(u.year||"2nd Year")}</td><td><button class="small-btn red" onclick="deleteStudent('${u.email}')">Delete</button></td></tr>`).join("")}</table></div>`}
function addStudent(){let name=prompt("Student name:");if(!name)return;let email=prompt("Student email:");if(!email)return;let password=prompt("Student password:","student123");if(!password)return;let us=getUsers();if(us.some(u=>u.email.toLowerCase()===email.toLowerCase())){toast("Email already exists");return}us.push({id:"STU"+String(Date.now()).slice(-5),name,email,password,role:"student",program:"B.Tech CSE",year:"2nd Year",section:"A"});localStorage.setItem(KEY_USERS,JSON.stringify(us));toast("Student added");adminPage("students",document.querySelector('[data-page="students"]'))}
function deleteStudent(email){if(!confirm("Delete this student and their report?"))return;localStorage.setItem(KEY_USERS,JSON.stringify(getUsers().filter(u=>u.email!==email)));localStorage.setItem(KEY_REPORTS,JSON.stringify(getReports().filter(r=>r.email!==email)));toast("Student deleted");adminPage("students",document.querySelector('[data-page="students"]'))}
function adminReports(c){let students=getUsers().filter(x=>x.role==="student");c.innerHTML=`<section class="panel"><div class="panel-title"><div><h3>Add / Update Student Report</h3><p>Save a report against the student's email. It will appear in the student's Results and Reports pages.</p></div>✏️</div><form id="reportForm" class="form-grid"><div class="form-group"><label>Student</label><select id="rEmail">${students.map(u=>`<option value="${u.email}">${esc(u.name)} — ${u.email}</option>`).join("")}</select></div><div class="form-group"><label>Marks (%)</label><input id="rMarks" type="number" min="0" max="100" required></div><div class="form-group"><label>Attendance (%)</label><input id="rAtt" type="number" min="0" max="100" required></div><div class="form-group"><label>Grade Format</label><select id="rFormat"><option value="percentage">Percentage</option><option value="10point">10 Point Scale</option></select></div><div class="form-group full"><label>Teacher Remarks</label><textarea id="rRemark" rows="3" placeholder="Enter remarks"></textarea></div><div class="form-group full"><button class="btn primary" type="submit">Save / Update Report</button></div></form><div id="reportMsg" class="msg"></div></section><section class="panel"><div class="panel-title"><div><h3>Saved Reports</h3><p>All student report records</p></div>📋</div>${reportTable(getReports())}</section>`;document.getElementById("reportForm").onsubmit=e=>{e.preventDefault();let email=rEmail.value,rs=getReports(),obj={email,marks:Number(rMarks.value),attendance:Number(rAtt.value),format:rFormat.value,remarks:rRemark.value,updated:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})};let i=rs.findIndex(x=>x.email===email);if(i>=0)rs[i]=obj;else rs.push(obj);localStorage.setItem(KEY_REPORTS,JSON.stringify(rs));document.getElementById("reportMsg").className="msg ok";document.getElementById("reportMsg").textContent="Report saved successfully. Student dashboard is updated.";toast("Report connected to student");setTimeout(()=>adminPage("reports",document.querySelector('[data-page="reports"]')),700)}}
function adminNotices(c){c.innerHTML=`<section class="panel"><div class="panel-title"><div><h3>Manage Notices</h3><p>Notices are displayed on the student dashboard.</p></div>📢</div><form id="noticeForm" class="form-grid"><div class="form-group"><label>Title</label><input id="nTitle" required placeholder="Notice title"></div><div class="form-group"><label>Message</label><input id="nText" required placeholder="Notice message"></div><div class="form-group full"><button class="btn primary">Publish Notice</button></div></form><div id="noticeList">${getNotices().map((n,i)=>`<div class="notice"><b>${esc(n.title)}</b><span>${esc(n.text)}</span> <button class="small-btn red" style="float:right" onclick="deleteNotice(${i})">Delete</button></div>`).join("")}</div></section>`;document.getElementById("noticeForm").onsubmit=e=>{e.preventDefault();let ns=getNotices();ns.unshift({title:nTitle.value,text:nText.value});localStorage.setItem(KEY_NOTICE,JSON.stringify(ns));toast("Notice published");adminPage("notices",document.querySelector('[data-page="notices"]'))}}
function deleteNotice(i){let n=getNotices();n.splice(i,1);localStorage.setItem(KEY_NOTICE,JSON.stringify(n));adminPage("notices",document.querySelector('[data-page="notices"]'))}
function adminAnalytics(c){let rs=getReports(),avg=rs.length?Math.round(rs.reduce((a,r)=>a+r.marks,0)/rs.length):0;let high=rs.filter(r=>r.marks>=80).length;let low=rs.filter(r=>r.marks<60).length;c.innerHTML=`<section class="panel"><div class="panel-title"><div><h3>Performance Analytics</h3><p>Summary based on saved student reports</p></div>📈</div><div class="cards"><div class="stat"><b>${avg}%</b><small>Average Marks</small></div><div class="stat"><b>${high}</b><small>Students ≥ 80%</small></div><div class="stat"><b>${low}</b><small>Students below 60%</small></div><div class="stat"><b>${rs.length}</b><small>Reports Analysed</small></div></div>${reportTable(rs)}</section>`}

document.getElementById("registerForm")?.addEventListener("submit", e=>{
  e.preventDefault();
  const name=document.getElementById("regName").value.trim();
  const id=document.getElementById("regId").value.trim();
  const email=document.getElementById("regEmail").value.trim().toLowerCase();
  const phone=document.getElementById("regPhone").value.trim();
  const program=document.getElementById("regProgram").value;
  const year=document.getElementById("regYear").value;
  const section=document.getElementById("regSection").value;
  const password=document.getElementById("regPassword").value;
  const confirm=document.getElementById("regConfirm").value;
  const msg=document.getElementById("registerMsg");
  if(password!==confirm){msg.className="msg error";msg.textContent="Passwords do not match.";return}
  let users=getUsers();
  if(users.some(u=>u.email.toLowerCase()===email)){msg.className="msg error";msg.textContent="Email already registered. Please login.";return}
  if(users.some(u=>u.id.toLowerCase()===id.toLowerCase())){msg.className="msg error";msg.textContent="Student ID already exists.";return}
  users.push({id:id||"STU"+String(Date.now()).slice(-5),name,email,password,role:"student",phone,program,year,section});
  localStorage.setItem(KEY_USERS,JSON.stringify(users));
  msg.className="msg ok";msg.textContent="Account created successfully. Redirecting to login...";
  setTimeout(()=>location.href="index.html",900);
});

function initParent(){
  const s=session();
  if(!s || s.role!=="parent"){location.href="index.html";return}
  const u=getUsers().find(x=>x.email===s.email);
  if(!u){logout();return}
  document.getElementById("parentName").textContent=u.name;
  document.getElementById("parentTopName").textContent=u.name;
  document.getElementById("parentAvatar").textContent=initials(u.name);
  parentHome();
}
function parentHome(){
  const c=document.getElementById("parentContent");
  const u=getUsers().find(x=>x.email===session().email);
  const studentEmail=u.studentEmail;
  const student=getUsers().find(x=>x.email===studentEmail);
  const r=getReports().find(x=>x.email===studentEmail);
  c.innerHTML=`<div class="hero"><div><h1>Welcome, ${esc(u.name)}</h1><p>View your linked student's latest academic performance.</p></div><div class="hero-icon">👨‍👩‍👧</div></div>
  <section class="panel"><div class="panel-title"><div><h3>Linked Student</h3><p>Student connected to this parent account</p></div>🎓</div>
  ${student?`<div class="profile-grid"><div class="info"><small>Name</small><b>${esc(student.name)}</b></div><div class="info"><small>Student ID</small><b>${esc(student.id)}</b></div><div class="info"><small>Program</small><b>${esc(student.program||"B.Tech CSE")}</b></div><div class="info"><small>Section</small><b>${esc(student.section||"A")}</b></div></div>`:`<p>No student is linked yet. Ask the administrator to connect a student email.</p>`}
  </section>
  ${r?`<section class="panel" style="margin-top:18px"><div class="panel-title"><div><h3>Latest Report</h3><p>Latest information entered by Admin</p></div>📊</div><div class="big-result"><div class="result-box"><b>${r.marks}%</b><span>Marks</span></div><div class="result-box"><b>${r.attendance}%</b><span>Attendance</span></div><div class="result-box"><b>${r.marks>=90?"A+":r.marks>=80?"A":r.marks>=70?"B":"C"}</b><span>Grade</span></div></div><div class="info" style="margin-top:14px"><small>Teacher Remarks</small><b>${esc(r.remarks)}</b></div></section>`:""}`;
}
function parentReport(){parentHome()}
function parentNotices(){const c=document.getElementById("parentContent");c.innerHTML=`<section class="panel"><div class="panel-title"><div><h3>Latest Notices</h3><p>College announcements</p></div>📢</div>${getNotices().map(n=>`<div class="notice"><b>${esc(n.title)}</b><span>${esc(n.text)}</span></div>`).join("")}</section>`}
