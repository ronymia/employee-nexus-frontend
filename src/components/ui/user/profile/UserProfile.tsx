"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_EMPLOYEE_BY_ID } from "@/graphql/employee.api";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTab";
import CustomLoading from "@/components/loader/CustomLoading";
import {
  PaySlipContent,
  ProjectsContent,
  SocialLinksContent,
} from "./profile-tabs";
import ProfileContent from "./profile-tabs/profile/ProfileContent";
import EducationContent from "./profile-tabs/education/EducationContent";
import ExperienceContent from "./profile-tabs/experience/ExperienceContent";
import ScheduleContent from "./profile-tabs/schedule/ScheduleContent";
import AssetsContent from "./profile-tabs/assets/AssetsContent";
import DocumentsContent from "./profile-tabs/documents/DocumentsContent";
import NotesContent from "./profile-tabs/notes/NotesContent";
import AttendanceContent from "./profile-tabs/attendance/AttendanceContent";
import { IEmployee } from "@/types";

interface UserProfileProps {
  userId: number;
}

export default function UserProfile({ userId }: UserProfileProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "profile"
  );

  // Fetch employee data
  const { data, loading, error } = useQuery<{
    employeeById: {
      message: string;
      statusCode: number;
      success: boolean;
      data: IEmployee;
    };
  }>(GET_EMPLOYEE_BY_ID, {
    variables: { id: userId },
  });

  // Update URL when tab changes
  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab !== activeTab) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", activeTab);
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [activeTab, router, searchParams]);

  if (loading) {
    return <CustomLoading />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-error">
          Error loading employee data: {error.message}
        </p>
      </div>
    );
  }

  console.log(data);
  const employee = data?.employeeById?.data;

  // Dummy data for testing UI
  const dummyEducationHistory = [
    {
      id: 1,
      userId: userId,
      degree: "Bachelor of Science in Computer Science",
      fieldOfStudy: "Computer Science",
      institution: "University of Technology",
      country: "Bangladesh",
      city: "Dhaka",
      startDate: "2015",
      endDate: "2019",
      isCurrentlyStudying: false,
      grade: "3.75 GPA",
      description:
        "Focused on software engineering, data structures, algorithms, and web development. Completed final year project on AI-based recommendation system.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      userId: userId,
      degree: "Master of Science in Software Engineering",
      fieldOfStudy: "Software Engineering",
      institution: "International University",
      country: "Bangladesh",
      city: "Dhaka",
      startDate: "2020",
      endDate: "",
      isCurrentlyStudying: true,
      grade: "",
      description:
        "Advanced studies in software architecture, cloud computing, and microservices. Expected graduation in 2025.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const dummyJobHistory = [
    {
      id: 1,
      userId: userId,
      jobTitle: "Junior Software Developer",
      companyName: "Tech Solutions Ltd",
      employmentType: "Full-time",
      country: "Bangladesh",
      city: "Dhaka",
      startDate: "01-2019",
      endDate: "12-2020",
      responsibilities:
        "• Developed and maintained web applications using React and Node.js\n• Collaborated with cross-functional teams to deliver projects on time\n• Participated in code reviews and implemented best practices\n• Fixed bugs and optimized application performance",
      achievements:
        "• Reduced application load time by 40% through optimization\n• Successfully delivered 5+ projects within deadlines\n• Mentored 2 junior developers",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      userId: userId,
      jobTitle: "Senior Software Engineer",
      companyName: "Innovation Hub",
      employmentType: "Full-time",
      country: "Bangladesh",
      city: "Dhaka",
      startDate: "01-2021",
      endDate: "",
      responsibilities:
        "• Lead development of enterprise-level applications\n• Architect and implement scalable microservices\n• Conduct technical interviews and build engineering team\n• Mentor junior and mid-level developers\n• Collaborate with product managers to define technical roadmap",
      achievements:
        "• Architected and deployed microservices serving 100K+ users\n• Reduced system downtime by 60% through improved monitoring\n• Built and led a team of 5 engineers\n• Implemented CI/CD pipeline reducing deployment time by 70%",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const dummyScheduleAssignments = [
    {
      id: 1,
      userId: userId,
      workScheduleId: 1,
      workSchedule: {
        id: 1,
        name: "Regular Office Schedule",
        description:
          "Standard 9-5 office hours with 1 hour lunch break. Monday to Friday working days.",
        status: "ACTIVE" as const,
        scheduleType: "REGULAR" as const,
        breakType: "UNPAID" as const,
        breakHours: 1,
        schedules: [
          {
            id: 1,
            workScheduleId: 1,
            day: "Monday",
            startTime: "09:00",
            endTime: "17:00",
            isWorkingDay: true,
          },
          {
            id: 2,
            workScheduleId: 1,
            day: "Tuesday",
            startTime: "09:00",
            endTime: "17:00",
            isWorkingDay: true,
          },
          {
            id: 3,
            workScheduleId: 1,
            day: "Wednesday",
            startTime: "09:00",
            endTime: "17:00",
            isWorkingDay: true,
          },
          {
            id: 4,
            workScheduleId: 1,
            day: "Thursday",
            startTime: "09:00",
            endTime: "17:00",
            isWorkingDay: true,
          },
          {
            id: 5,
            workScheduleId: 1,
            day: "Friday",
            startTime: "09:00",
            endTime: "17:00",
            isWorkingDay: true,
          },
          {
            id: 6,
            workScheduleId: 1,
            day: "Saturday",
            startTime: "",
            endTime: "",
            isWorkingDay: false,
          },
          {
            id: 7,
            workScheduleId: 1,
            day: "Sunday",
            startTime: "",
            endTime: "",
            isWorkingDay: false,
          },
        ],
      },
      startDate: "2021-01-15T00:00:00.000Z",
      endDate: undefined,
      isActive: true,
      assignedBy: 1,
      assignedByUser: {
        id: 1,
        email: "admin@company.com",
        profile: {
          fullName: "Admin User",
        },
      },
      notes:
        "Assigned standard office schedule upon joining. Employee works on-site.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      userId: userId,
      workScheduleId: 2,
      workSchedule: {
        id: 2,
        name: "Flexible Remote Schedule",
        description:
          "Flexible working hours for remote work. Core hours 10 AM - 3 PM.",
        status: "INACTIVE" as const,
        scheduleType: "FLEXIBLE" as const,
        breakType: "PAID" as const,
        breakHours: 1,
        schedules: [],
      },
      startDate: "2020-03-01T00:00:00.000Z",
      endDate: "2021-01-14T00:00:00.000Z",
      isActive: false,
      assignedBy: 1,
      notes: "Temporary remote schedule during pandemic period.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const dummyProjectMembers = [
    {
      id: 1,
      userId: userId,
      projectId: 1,
      project: {
        id: 1,
        name: "Employee Management System",
        description:
          "Comprehensive HR management platform for tracking employees, attendance, leave, payroll, and performance. Built with Next.js and GraphQL.",
        cover:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
        status: "ACTIVE" as const,
        startDate: "2024-01-15T00:00:00.000Z",
        endDate: "2024-12-31T00:00:00.000Z",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      role: "Full Stack Developer",
      startDate: "2024-01-15T00:00:00.000Z",
      endDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      userId: userId,
      projectId: 2,
      project: {
        id: 2,
        name: "E-Commerce Platform",
        description:
          "Modern e-commerce solution with inventory management, payment gateway integration, and customer analytics dashboard.",
        cover:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
        status: "IN_PROGRESS" as const,
        startDate: "2024-03-01T00:00:00.000Z",
        endDate: "2024-09-30T00:00:00.000Z",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      role: "Backend Developer",
      startDate: "2024-03-01T00:00:00.000Z",
      endDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      userId: userId,
      projectId: 3,
      project: {
        id: 3,
        name: "CRM System",
        description:
          "Customer relationship management system for sales tracking, lead management, and client communication.",
        cover:
          "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&q=80",
        status: "COMPLETED" as const,
        startDate: "2023-05-10T00:00:00.000Z",
        endDate: "2023-12-20T00:00:00.000Z",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      role: "Frontend Developer",
      startDate: "2023-05-10T00:00:00.000Z",
      endDate: "2023-12-20T00:00:00.000Z",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      userId: userId,
      projectId: 4,
      project: {
        id: 4,
        name: "Mobile App Redesign",
        description:
          "Complete UI/UX redesign of the company mobile application. Focus on improving user experience and modern design patterns.",
        cover:
          "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
        status: "ON_HOLD" as const,
        startDate: "2024-02-01T00:00:00.000Z",
        endDate: "2024-08-31T00:00:00.000Z",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      role: "UI/UX Designer",
      startDate: "2024-02-01T00:00:00.000Z",
      endDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const dummyAssetAssignments = [
    {
      id: 1,
      assetId: 1,
      asset: {
        id: 1,
        name: 'MacBook Pro 16"',
        code: "LPT001",
        date: "2024-01-15T00:00:00.000Z",
        note: "Primary development machine. Handle with care.",
        assetTypeId: 1,
        assetType: {
          id: 1,
          name: "Laptop",
        },
        image:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
        status: "assigned",
        businessId: 1,
        createdBy: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      assignedTo: userId,
      assignedBy: 1,
      assignedByUser: {
        id: 1,
        email: "admin@company.com",
        profile: {
          fullName: "Admin User",
        },
      },
      assignedAt: "2024-01-15T09:00:00.000Z",
      returnedAt: null,
      status: "assigned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      assetId: 2,
      asset: {
        id: 2,
        name: "iPhone 14 Pro",
        code: "PH001",
        date: "2024-02-01T00:00:00.000Z",
        note: "Company phone for work communications.",
        assetTypeId: 2,
        assetType: {
          id: 2,
          name: "Mobile Phone",
        },
        image:
          "https://images.unsplash.com/photo-1592286927505-67dfe6e143c5?w=800&q=80",
        status: "assigned",
        businessId: 1,
        createdBy: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      assignedTo: userId,
      assignedBy: 1,
      assignedByUser: {
        id: 1,
        email: "admin@company.com",
        profile: {
          fullName: "Admin User",
        },
      },
      assignedAt: "2024-02-01T10:30:00.000Z",
      returnedAt: null,
      status: "assigned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      assetId: 3,
      asset: {
        id: 3,
        name: 'Dell Monitor 27"',
        code: "MON001",
        date: "2024-01-20T00:00:00.000Z",
        note: "External monitor for workstation.",
        assetTypeId: 3,
        assetType: {
          id: 3,
          name: "Monitor",
        },
        image:
          "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
        status: "assigned",
        businessId: 1,
        createdBy: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      assignedTo: userId,
      assignedBy: 1,
      assignedByUser: {
        id: 1,
        email: "admin@company.com",
        profile: {
          fullName: "Admin User",
        },
      },
      assignedAt: "2024-01-20T11:00:00.000Z",
      returnedAt: null,
      status: "assigned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      assetId: 4,
      asset: {
        id: 4,
        name: "Lenovo ThinkPad",
        code: "LPT002",
        date: "2023-06-01T00:00:00.000Z",
        note: "Previous laptop returned after upgrade.",
        assetTypeId: 1,
        assetType: {
          id: 1,
          name: "Laptop",
        },
        image:
          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
        status: "returned",
        businessId: 1,
        createdBy: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      assignedTo: userId,
      assignedBy: 1,
      assignedByUser: {
        id: 1,
        email: "admin@company.com",
        profile: {
          fullName: "Admin User",
        },
      },
      assignedAt: "2023-06-01T09:00:00.000Z",
      returnedAt: "2024-01-15T16:00:00.000Z",
      status: "returned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const dummyDocuments = [
    {
      id: 1,
      userId: userId,
      title: "Employment Contract",
      description:
        "Official employment contract signed on joining date. Contains terms and conditions, salary details, and benefits information.",
      attachment: "employment_contract_2024.pdf",
      createdAt: "2024-01-15T10:00:00.000Z",
      updatedAt: "2024-01-15T10:00:00.000Z",
    },
    {
      id: 2,
      userId: userId,
      title: "National ID Card",
      description:
        "Copy of national identification card for verification purposes.",
      attachment: "national_id_card.jpg",
      createdAt: "2024-01-16T11:30:00.000Z",
      updatedAt: "2024-01-16T11:30:00.000Z",
    },
    {
      id: 3,
      userId: userId,
      title: "Educational Certificates",
      description:
        "Bachelor's degree certificate and transcripts from University of Technology.",
      attachment: "educational_certificates.pdf",
      createdAt: "2024-01-16T14:00:00.000Z",
      updatedAt: "2024-01-16T14:00:00.000Z",
    },
    {
      id: 4,
      userId: userId,
      title: "Bank Account Details",
      description:
        "Bank account information for salary deposit. Includes bank name, account number, and routing number.",
      attachment: "bank_account_details.pdf",
      createdAt: "2024-01-17T09:00:00.000Z",
      updatedAt: "2024-01-17T09:00:00.000Z",
    },
    {
      id: 5,
      userId: userId,
      title: "Resume / CV",
      description:
        "Professional resume with work experience, skills, and qualifications.",
      attachment: "resume_john_doe.docx",
      createdAt: "2024-01-10T08:00:00.000Z",
      updatedAt: "2024-02-15T10:30:00.000Z",
    },
    {
      id: 6,
      userId: userId,
      title: "Tax Documents",
      description: "Tax identification number and related tax documentation.",
      attachment: "tax_documents_2024.pdf",
      createdAt: "2024-01-20T13:00:00.000Z",
      updatedAt: "2024-01-20T13:00:00.000Z",
    },
  ];

  const dummyNotes = [
    {
      id: 1,
      userId: userId,
      createdBy: 1,
      creator: {
        id: 1,
        email: "manager@company.com",
        profile: {
          fullName: "Sarah Johnson",
        },
      },
      title: "Excellent Performance in Q1",
      content:
        "Employee has demonstrated exceptional performance during the first quarter. Successfully delivered all assigned projects on time with high quality standards. Showed great initiative in proposing improvements to the development workflow which resulted in 20% increase in team productivity. Recommended for salary increment consideration.",
      category: "Performance",
      isPrivate: false,
      createdAt: "2024-03-28T14:30:00.000Z",
      updatedAt: "2024-03-28T14:30:00.000Z",
    },
    {
      id: 2,
      userId: userId,
      createdBy: 1,
      creator: {
        id: 1,
        email: "manager@company.com",
        profile: {
          fullName: "Sarah Johnson",
        },
      },
      title: "Team Collaboration Feedback",
      content:
        "Received positive feedback from team members regarding collaboration skills. Always willing to help colleagues with technical challenges. Actively participates in code reviews and provides constructive feedback. Great team player and mentor for junior developers.",
      category: "Feedback",
      isPrivate: false,
      createdAt: "2024-04-15T10:00:00.000Z",
      updatedAt: "2024-04-15T10:00:00.000Z",
    },
    {
      id: 3,
      userId: userId,
      createdBy: 2,
      creator: {
        id: 2,
        email: "hr@company.com",
        profile: {
          fullName: "HR Department",
        },
      },
      title: "Late Arrival Notice",
      content:
        "Employee arrived late on April 20, 2024 at 10:30 AM. Reason provided: Traffic jam due to road construction. Verbal warning issued as per company policy. This is the first instance this quarter. Please ensure punctuality moving forward.",
      category: "Incident",
      isPrivate: true,
      createdAt: "2024-04-20T11:00:00.000Z",
      updatedAt: "2024-04-20T11:00:00.000Z",
    },
    {
      id: 4,
      userId: userId,
      createdBy: 1,
      creator: {
        id: 1,
        email: "manager@company.com",
        profile: {
          fullName: "Sarah Johnson",
        },
      },
      title: "Training Completion",
      content:
        "Successfully completed Advanced React and Next.js training program on May 5, 2024. Scored 95% in the final assessment. Certificate has been added to employee records. Skills acquired will be beneficial for upcoming projects using Next.js 14.",
      category: "General",
      isPrivate: false,
      createdAt: "2024-05-06T09:00:00.000Z",
      updatedAt: "2024-05-06T09:00:00.000Z",
    },
    {
      id: 5,
      userId: userId,
      createdBy: 1,
      creator: {
        id: 1,
        email: "manager@company.com",
        profile: {
          fullName: "Sarah Johnson",
        },
      },
      title: "Client Appreciation",
      content:
        "Received direct appreciation from client XYZ Corp for outstanding work on their e-commerce platform project. Client specifically mentioned the attention to detail, responsiveness to feedback, and proactive problem-solving approach. This reflects positively on the company and strengthens client relationship.",
      category: "Performance",
      isPrivate: false,
      createdAt: "2024-05-20T16:45:00.000Z",
      updatedAt: "2024-05-20T16:45:00.000Z",
    },
    {
      id: 6,
      userId: userId,
      createdBy: 2,
      creator: {
        id: 2,
        email: "hr@company.com",
        profile: {
          fullName: "HR Department",
        },
      },
      title: "Annual Review Scheduled",
      content:
        "Annual performance review has been scheduled for June 15, 2024 at 2:00 PM. Please prepare self-assessment form and list of achievements for the review period. Meeting will be held in Conference Room B with direct manager and HR representative.",
      category: "General",
      isPrivate: false,
      createdAt: "2024-06-01T10:00:00.000Z",
      updatedAt: "2024-06-01T10:00:00.000Z",
    },
  ];

  const dummySocialLinks = {
    profileId: userId,
    facebook: "https://facebook.com/johndoe.dev",
    twitter: "https://twitter.com/johndoe_dev",
    linkedin: "https://linkedin.com/in/john-doe-developer",
    instagram: "https://instagram.com/johndoe.codes",
    github: "https://github.com/johndoe",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const dummyAttendances = [
    {
      id: 1,
      userId: userId,
      date: new Date().toISOString(),
      totalHours: 8.5,
      breakHours: 0.5,
      status: "present",
      punchRecords: [
        {
          id: 1,
          attendanceId: 1,
          punchIn: new Date(new Date().setHours(9, 0, 0)).toISOString(),
          punchOut: new Date(new Date().setHours(18, 0, 0)).toISOString(),
          breakStart: new Date(new Date().setHours(13, 0, 0)).toISOString(),
          breakEnd: new Date(new Date().setHours(13, 30, 0)).toISOString(),
          workHours: 8.5,
          breakHours: 0.5,
          punchInIp: "192.168.1.100",
          punchOutIp: "192.168.1.100",
          punchInLat: 23.8103,
          punchInLng: 90.4125,
          punchOutLat: 23.8103,
          punchOutLng: 90.4125,
          punchInDevice: "Windows 11 - Chrome 120.0",
          punchOutDevice: "Windows 11 - Chrome 120.0",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      userId: userId,
      date: new Date(
        new Date().setDate(new Date().getDate() - 1)
      ).toISOString(),
      totalHours: 8.0,
      breakHours: 1.0,
      status: "present",
      punchRecords: [
        {
          id: 2,
          attendanceId: 2,
          punchIn: new Date(
            new Date().setHours(8, 55, 0) - 86400000
          ).toISOString(),
          punchOut: new Date(
            new Date().setHours(17, 55, 0) - 86400000
          ).toISOString(),
          breakStart: new Date(
            new Date().setHours(13, 0, 0) - 86400000
          ).toISOString(),
          breakEnd: new Date(
            new Date().setHours(14, 0, 0) - 86400000
          ).toISOString(),
          workHours: 8.0,
          breakHours: 1.0,
          punchInIp: "192.168.1.100",
          punchOutIp: "192.168.1.100",
          punchInLat: 23.8103,
          punchInLng: 90.4125,
          punchInDevice: "Windows 11 - Chrome 120.0",
          punchOutDevice: "Windows 11 - Chrome 120.0",
          createdAt: new Date(
            new Date().setDate(new Date().getDate() - 1)
          ).toISOString(),
          updatedAt: new Date(
            new Date().setDate(new Date().getDate() - 1)
          ).toISOString(),
        },
      ],
      createdAt: new Date(
        new Date().setDate(new Date().getDate() - 1)
      ).toISOString(),
      updatedAt: new Date(
        new Date().setDate(new Date().getDate() - 1)
      ).toISOString(),
    },
    {
      id: 3,
      userId: userId,
      date: new Date(
        new Date().setDate(new Date().getDate() - 2)
      ).toISOString(),
      totalHours: 8.25,
      breakHours: 0.75,
      status: "late",
      punchRecords: [
        {
          id: 3,
          attendanceId: 3,
          punchIn: new Date(
            new Date().setHours(9, 45, 0) - 172800000
          ).toISOString(),
          punchOut: new Date(
            new Date().setHours(18, 45, 0) - 172800000
          ).toISOString(),
          breakStart: new Date(
            new Date().setHours(13, 0, 0) - 172800000
          ).toISOString(),
          breakEnd: new Date(
            new Date().setHours(13, 45, 0) - 172800000
          ).toISOString(),
          workHours: 8.25,
          breakHours: 0.75,
          punchInIp: "192.168.1.105",
          punchOutIp: "192.168.1.105",
          punchInLat: 23.8105,
          punchInLng: 90.4128,
          punchInDevice: "Windows 11 - Edge 120.0",
          punchOutDevice: "Windows 11 - Edge 120.0",
          notes: "Arrived late due to traffic jam",
          createdAt: new Date(
            new Date().setDate(new Date().getDate() - 2)
          ).toISOString(),
          updatedAt: new Date(
            new Date().setDate(new Date().getDate() - 2)
          ).toISOString(),
        },
      ],
      createdAt: new Date(
        new Date().setDate(new Date().getDate() - 2)
      ).toISOString(),
      updatedAt: new Date(
        new Date().setDate(new Date().getDate() - 2)
      ).toISOString(),
    },
    {
      id: 4,
      userId: userId,
      date: new Date(
        new Date().setDate(new Date().getDate() - 3)
      ).toISOString(),
      totalHours: 9.0,
      breakHours: 1.0,
      status: "present",
      punchRecords: [
        {
          id: 4,
          attendanceId: 4,
          punchIn: new Date(
            new Date().setHours(8, 30, 0) - 259200000
          ).toISOString(),
          punchOut: new Date(
            new Date().setHours(18, 30, 0) - 259200000
          ).toISOString(),
          breakStart: new Date(
            new Date().setHours(13, 0, 0) - 259200000
          ).toISOString(),
          breakEnd: new Date(
            new Date().setHours(14, 0, 0) - 259200000
          ).toISOString(),
          workHours: 9.0,
          breakHours: 1.0,
          punchInIp: "192.168.1.100",
          punchOutIp: "192.168.1.100",
          punchInLat: 23.8103,
          punchInLng: 90.4125,
          punchInDevice: "Windows 11 - Chrome 120.0",
          punchOutDevice: "Windows 11 - Chrome 120.0",
          createdAt: new Date(
            new Date().setDate(new Date().getDate() - 3)
          ).toISOString(),
          updatedAt: new Date(
            new Date().setDate(new Date().getDate() - 3)
          ).toISOString(),
        },
      ],
      createdAt: new Date(
        new Date().setDate(new Date().getDate() - 3)
      ).toISOString(),
      updatedAt: new Date(
        new Date().setDate(new Date().getDate() - 3)
      ).toISOString(),
    },
    {
      id: 5,
      userId: userId,
      date: new Date(
        new Date().setDate(new Date().getDate() - 4)
      ).toISOString(),
      totalHours: 4.0,
      breakHours: 0.5,
      status: "half_day",
      punchRecords: [
        {
          id: 5,
          attendanceId: 5,
          punchIn: new Date(
            new Date().setHours(9, 0, 0) - 345600000
          ).toISOString(),
          punchOut: new Date(
            new Date().setHours(13, 30, 0) - 345600000
          ).toISOString(),
          breakStart: new Date(
            new Date().setHours(11, 0, 0) - 345600000
          ).toISOString(),
          breakEnd: new Date(
            new Date().setHours(11, 30, 0) - 345600000
          ).toISOString(),
          workHours: 4.0,
          breakHours: 0.5,
          punchInIp: "192.168.1.100",
          punchOutIp: "192.168.1.100",
          punchInLat: 23.8103,
          punchInLng: 90.4125,
          punchInDevice: "Windows 11 - Chrome 120.0",
          punchOutDevice: "Windows 11 - Chrome 120.0",
          notes: "Half day leave for personal work",
          createdAt: new Date(
            new Date().setDate(new Date().getDate() - 4)
          ).toISOString(),
          updatedAt: new Date(
            new Date().setDate(new Date().getDate() - 4)
          ).toISOString(),
        },
      ],
      createdAt: new Date(
        new Date().setDate(new Date().getDate() - 4)
      ).toISOString(),
      updatedAt: new Date(
        new Date().setDate(new Date().getDate() - 4)
      ).toISOString(),
    },
    {
      id: 6,
      userId: userId,
      date: new Date(
        new Date().setDate(new Date().getDate() - 7)
      ).toISOString(),
      totalHours: 0,
      breakHours: 0,
      status: "on_leave",
      punchRecords: [],
      createdAt: new Date(
        new Date().setDate(new Date().getDate() - 7)
      ).toISOString(),
      updatedAt: new Date(
        new Date().setDate(new Date().getDate() - 7)
      ).toISOString(),
    },
    {
      id: 7,
      userId: userId,
      date: new Date(
        new Date().setDate(new Date().getDate() - 10)
      ).toISOString(),
      totalHours: 8.5,
      breakHours: 0.5,
      status: "present",
      punchRecords: [
        {
          id: 7,
          attendanceId: 7,
          punchIn: new Date(
            new Date().setHours(8, 50, 0) - 864000000
          ).toISOString(),
          punchOut: new Date(
            new Date().setHours(17, 50, 0) - 864000000
          ).toISOString(),
          breakStart: new Date(
            new Date().setHours(13, 0, 0) - 864000000
          ).toISOString(),
          breakEnd: new Date(
            new Date().setHours(13, 30, 0) - 864000000
          ).toISOString(),
          workHours: 8.5,
          breakHours: 0.5,
          punchInIp: "192.168.1.100",
          punchOutIp: "192.168.1.100",
          punchInLat: 23.8103,
          punchInLng: 90.4125,
          punchInDevice: "Windows 11 - Chrome 120.0",
          punchOutDevice: "Windows 11 - Chrome 120.0",
          createdAt: new Date(
            new Date().setDate(new Date().getDate() - 10)
          ).toISOString(),
          updatedAt: new Date(
            new Date().setDate(new Date().getDate() - 10)
          ).toISOString(),
        },
      ],
      createdAt: new Date(
        new Date().setDate(new Date().getDate() - 10)
      ).toISOString(),
      updatedAt: new Date(
        new Date().setDate(new Date().getDate() - 10)
      ).toISOString(),
    },
    {
      id: 8,
      userId: userId,
      date: new Date(
        new Date().setDate(new Date().getDate() - 11)
      ).toISOString(),
      totalHours: 0,
      breakHours: 0,
      status: "absent",
      punchRecords: [],
      createdAt: new Date(
        new Date().setDate(new Date().getDate() - 11)
      ).toISOString(),
      updatedAt: new Date(
        new Date().setDate(new Date().getDate() - 11)
      ).toISOString(),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-800">
          Employee profile
        </h1>
        {/* <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span className="text-xs text-red-500 font-medium">PDF</span>
          </button>
          <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span className="text-xs text-green-600 font-medium">CSV</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Options
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                  Edit Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                  Delete Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                  Export Data
                </button>
              </div>
            )}
          </div>
        </div> */}
      </div>

      {/* Profile Info */}
      <ProfileHeader
        employee={
          employee
            ? {
                fullName: employee.profile?.fullName || "",
                employmentType: employee.employee?.employmentStatus?.name || "",
                designation: employee.employee?.designation?.name || "",
                employeeId: employee.employee?.employeeId || "",
                joiningDate: employee.employee?.joiningDate
                  ? employee.employee.joiningDate
                  : "",
                phone: employee.profile?.phone || "",
                email: employee.email || "",
                dateOfBirth: employee.profile?.dateOfBirth
                  ? employee.profile.dateOfBirth
                  : "",
                department: employee.employee?.department?.name || "",
                gender: employee.profile?.gender || "",
                profileImage: employee.profile?.profilePicture || "",
              }
            : undefined
        }
      />

      {/* Tabs */}
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      <div className="p-6">
        {activeTab === "profile" && <ProfileContent employee={employee} />}
        {activeTab === "education" && <EducationContent userId={userId} />}
        {activeTab === "experience" && <ExperienceContent userId={userId} />}
        {activeTab === "schedule" && <ScheduleContent userId={userId} />}
        {activeTab === "attendance" && (
          <AttendanceContent userId={userId} attendances={dummyAttendances} />
        )}
        {activeTab === "leave" && (
          <div className="bg-base-100 rounded-lg p-6 shadow-sm">
            <p className="text-base-content/60 text-center py-8">
              Leave management coming soon
            </p>
          </div>
        )}
        {activeTab === "payslip" && <PaySlipContent />}
        {activeTab === "projects" && <ProjectsContent userId={userId} />}
        {activeTab === "documents" && <DocumentsContent userId={userId} />}
        {activeTab === "notes" && <NotesContent userId={userId} />}
        {activeTab === "letters" && (
          <div className="bg-base-100 rounded-lg p-6 shadow-sm">
            <p className="text-base-content/60 text-center py-8">
              Letters coming soon
            </p>
          </div>
        )}
        {activeTab === "assets" && <AssetsContent userId={userId} />}
        {activeTab === "social" && <SocialLinksContent userId={userId} />}
      </div>
    </div>
  );
}
