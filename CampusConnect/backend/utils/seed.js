require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");
const Complaint = require("../models/Complaint");

const sample = [
  { title: "Hostel WiFi is very slow after 8 PM", category: "Hostel", priority: "High",
    description: "The WiFi bandwidth drops drastically in Block C after 8 PM making it impossible to attend online lectures." },
  { title: "Broken chairs in CSE-204", category: "Infrastructure", priority: "Medium",
    description: "At least 6 chairs are broken and unsafe. Requesting immediate replacement before mid-sems." },
  { title: "Library AC not working", category: "Library", priority: "Low",
    description: "AC on the 2nd floor of the central library has been down for a week." },
  { title: "Bus route change to Kalyanpur needed", category: "Transport", priority: "Medium",
    description: "The 5:30 PM bus skips the Kalyanpur stop. Many students are stranded." },
  { title: "Attendance not updated on portal", category: "Academic", priority: "High",
    description: "My attendance in DBMS is showing 34% but I have attended all classes. Please verify." },
];

(async () => {
  await connectDB();
  console.log("Seeding…");

  await User.deleteMany({});
  await Complaint.deleteMany({});

  const admin = await User.create({
    name: "Admin",
    email: process.env.ADMIN_EMAIL || "admin@campusconnect.edu",
    password: process.env.ADMIN_PASSWORD || "Admin@12345",
    role: "admin",
    department: "Administration",
    avatarColor: "#7c3aed",
  });

  const student = await User.create({
    name: "Ayush Kumar",
    email: "ayush@student.edu",
    password: "Student@123",
    role: "student",
    rollNo: "22CS10045",
    department: "Computer Science",
    avatarColor: "#0ea5e9",
  });

  const faculty = await User.create({
    name: "Dr. Meera Sharma",
    email: "meera@faculty.edu",
    password: "Faculty@123",
    role: "faculty",
    department: "Computer Science",
    avatarColor: "#10b981",
  });

  for (const s of sample) {
    await Complaint.create({
      ...s,
      createdBy: student._id,
      status: ["Open", "In Progress", "Resolved"][Math.floor(Math.random() * 3)],
    });
  }

  console.log("✅ Seed complete.");
  console.log("Admin login:   ", admin.email, "/", process.env.ADMIN_PASSWORD || "Admin@12345");
  console.log("Student login: ", student.email, "/ Student@123");
  console.log("Faculty login: ", faculty.email, "/ Faculty@123");
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
