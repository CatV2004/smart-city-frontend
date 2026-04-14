<div id="top">

<!-- HEADER STYLE: CLASSIC -->
<div align="center">

<img src="https://github.com/CatV2004/smart-city-frontend/blob/main/urban-management/public/logo_company.png" width="30%" style="position: relative; top: 0; right: 0;" alt="Project Logo"/>

# URBAN MANAGEMENT FE

<em>Smart Citizen Report Management - Frontend Application</em>

<!-- BADGES -->
<!-- local repository, no metadata badges. -->

<em>Built with the tools and technologies:</em>

<img src="https://img.shields.io/badge/JSON-000000.svg?style=default&logo=JSON&logoColor=white" alt="JSON">
<img src="https://img.shields.io/badge/npm-CB3837.svg?style=default&logo=npm&logoColor=white" alt="npm">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=default&logo=JavaScript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/Leaflet-199900.svg?style=default&logo=Leaflet&logoColor=white" alt="Leaflet">
<img src="https://img.shields.io/badge/React-61DAFB.svg?style=default&logo=React&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/Docker-2496ED.svg?style=default&logo=Docker&logoColor=white" alt="Docker">
<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=default&logo=TypeScript&logoColor=white" alt="TypeScript">
<br>
<img src="https://img.shields.io/badge/Zod-3E67B1.svg?style=default&logo=Zod&logoColor=white" alt="Zod">
<img src="https://img.shields.io/badge/Radix%20UI-161618.svg?style=default&logo=Radix-UI&logoColor=white" alt="Radix%20UI">
<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=default&logo=ESLint&logoColor=white" alt="ESLint">
<img src="https://img.shields.io/badge/Axios-5A29E4.svg?style=default&logo=Axios&logoColor=white" alt="Axios">
<img src="https://img.shields.io/badge/CSS-663399.svg?style=default&logo=CSS&logoColor=white" alt="CSS">
<img src="https://img.shields.io/badge/Socket-C93CD7.svg?style=default&logo=Socket&logoColor=white" alt="Socket">
<img src="https://img.shields.io/badge/React%20Hook%20Form-EC5990.svg?style=default&logo=React-Hook-Form&logoColor=white" alt="React%20Hook%20Form">

</div>
<br>

---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [UI Screenshots](#ui-screenshots)
- [Features](#features)
- [Project Structure](#project-structure)
  - [Project Index](#project-index)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

**Urban Management FE** is the frontend application for the Smart Citizen Report Management System. Built with **React 18**, **TypeScript**, and **Vite**, it provides an intuitive interface for citizens to submit reports about urban issues, track their status in real-time, and visualize problems on an interactive map.

The application supports three main user roles:

- **Citizens**: Submit reports, track status, receive real-time notifications, and view nearby issues on Mapbox/Leaflet.
- **Staff/Office Workers**: View assigned tasks, update report status, upload completion evidence, and communicate with citizens.
- **Admins**: Full system oversight, category/department management, user management, and analytics dashboard.

> 📸 **UI Screenshots**: See the [UI Screenshots Gallery](#ui-screenshots) below for a visual tour of the application.

---

## UI Screenshots

The application includes the following key interfaces (screenshots available in [`/images-UI`](https://github.com/CatV2004/smart-city-frontend/tree/main/images-UI)):

| Module             | Screens                                                                                         | Description                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Authentication** | Login, Register, Forgot Password                                                                | User authentication and account creation                          |
| **Citizen Portal** | Home Dashboard, Create Report, Report Details, Track Status, Notifications                      | Citizen-facing interfaces for report submission and tracking      |
| **Staff Portal**   | Task List, Task Details, Evidence Upload, Report Assignment                                     | Staff workflow for processing assigned tasks                      |
| **Admin Portal**   | Admin Dashboard, User Management, Category Management, Department Management, Office Management | Administrative controls and system configuration                  |
| **Map Views**      | Citizen Map, Staff Map, Admin Map                                                               | Interactive map visualizations with filters and real-time updates |

> 💡 **View all UI screenshots**: [https://github.com/CatV2004/smart-city-frontend/tree/main/images-UI](https://github.com/CatV2004/smart-city-frontend/tree/main/images-UI)

---

## Features

| Feature                       | Description                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------- |
| **Citizen Report Submission** | Easy-to-use form with image upload, location picker, and category selection     |
| **Real-time Status Tracking** | Citizens can track report progress with live status updates via WebSocket       |
| **Interactive Map**           | Mapbox/Leaflet integration for visualizing nearby reports and office locations  |
| **Role-based Dashboards**     | Separate interfaces for citizens, staff, and admins with tailored functionality |
| **Task Management**           | Staff can view assigned tasks, update status, and upload completion evidence    |
| **Real-time Notifications**   | Instant push notifications for report status changes and task assignments       |
| **Admin Panel**               | Full CRUD operations for users, departments, categories, and offices            |
| **Analytics Dashboard**       | Visual statistics and reports for admin overview                                |
| **Responsive Design**         | Mobile-friendly interface using Tailwind CSS / Radix UI                         |
| **Form Validation**           | Zod + React Hook Form for robust form handling                                  |

---

## Project Structure

```sh
└── repo/
    ├── Dockerfile
    ├── README.md
    ├── app
    │   ├── admin
    │   ├── citizen
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── login
    │   └── staff
    ├── components
    │   ├── admin
    │   ├── common
    │   ├── layout
    │   ├── maps
    │   ├── pagination
    │   ├── providers
    │   └── ui
    ├── components.json
    ├── eslint.config.mjs
    ├── features
    │   ├── attachment
    │   ├── auth
    │   ├── category
    │   ├── dashboard
    │   ├── department
    │   ├── map
    │   ├── notification
    │   ├── office
    │   ├── report
    │   ├── role
    │   ├── task
    │   └── user
    ├── lib
    │   ├── axios.ts
    │   ├── get-initials.ts
    │   ├── hooks
    │   ├── queryClient.ts
    │   ├── realtime
    │   ├── utils
    │   └── utils.ts
    ├── middleware.ts
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    └── tsconfig.json
```

### Project Index

<details open>
    <summary><b><code>REPO/</code></b></summary>
    <!-- __root__ Submodule -->
    <details>
        <summary><b>__root__</b></summary>
        <blockquote>
            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                <code><b>⦿ __root__</b></code>
            <table style='width: 100%; border-collapse: collapse;'>
            <thead>
                <tr style='background-color: #f8f9fa;'>
                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                    <th style='text-align: left; padding: 8px;'>Summary</th>
                </tr>
            </thead>
                <tr style='border-bottom: 1px solid #eee;'>
                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/next.config.ts'>next.config.ts</a></b></td>
                    <td style='padding: 8px;'>Next.js configuration file - defines build settings, image domains, API rewrites, and environment variables for the application</code></td>
                </tr>
                <tr style='border-bottom: 1px solid #eee;'>
                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components.json'>components.json</a></b></td>
                    <td style='padding: 8px;'>shadcn/ui configuration file - defines component aliases, CSS variables, and theme settings for the UI component library</code></td>
                </tr>
                <tr style='border-bottom: 1px solid #eee;'>
                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/package.json'>package.json</a></b></td>
                    <td style='padding: 8px;'>NPM package manifest - lists all dependencies (Next.js, React, Tailwind, Leaflet, Axios, Socket.io-client, Zustand) and scripts for dev/build/start</code></td>
                </tr>
                <tr style='border-bottom: 1px solid #eee;'>
                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/middleware.ts'>middleware.ts</a></b></td>
                    <td style='padding: 8px;'>Next.js middleware for route protection - handles authentication checks, role-based access control (citizen/staff/admin), and redirects</code></td>
                </tr>
                <tr style='border-bottom: 1px solid #eee;'>
                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/eslint.config.mjs'>eslint.config.mjs</a></b></td>
                    <td style='padding: 8px;'>ESLint configuration for code linting - enforces coding standards, TypeScript rules, and React best practices</code></td>
                </tr>
                <tr style='border-bottom: 1px solid #eee;'>
                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/next-env.d.ts'>next-env.d.ts</a></b></td>
                    <td style='padding: 8px;'>Next.js TypeScript declaration file - ensures TypeScript recognizes Next.js specific types (pages, images, etc.)</code></td>
                </tr>
                <tr style='border-bottom: 1px solid #eee;'>
                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/tsconfig.json'>tsconfig.json</a></b></td>
                    <td style='padding: 8px;'>TypeScript configuration - defines compiler options, path aliases (@/ for src), and strict type checking</code></td>
                </tr>
                <tr style='border-bottom: 1px solid #eee;'>
                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/package-lock.json'>package-lock.json</a></b></td>
                    <td style='padding: 8px;'>Lockfile for npm dependencies - ensures consistent dependency versions across all environments</code></td>
                </tr>
                <tr style='border-bottom: 1px solid #eee;'>
                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/Dockerfile'>Dockerfile</a></b></td>
                    <td style='padding: 8px;'>Multi-stage Docker build for Next.js application - includes dependencies installation, build step, and production server with standalone output</code></td>
                </tr>
                <tr style='border-bottom: 1px solid #eee;'>
                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/postcss.config.mjs'>postcss.config.mjs</a></b></td>
                    <td style='padding: 8px;'>PostCSS configuration for Tailwind CSS - processes CSS with Tailwind plugins and autoprefixer for browser compatibility</code></td>
                </tr>
            </table>
        </blockquote>
    </details>
    <!-- app Submodule -->
    <details>
        <summary><b>app</b></summary>
        <blockquote>
            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                <code><b>⦿ app</b></code>
            <table style='width: 100%; border-collapse: collapse;'>
            <thead>
                <tr style='background-color: #f8f9fa;'>
                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                    <th style='text-align: left; padding: 8px;'>Summary</th>
                </tr>
            </thead>
                <tr style='border-bottom: 1px solid #eee;'>
                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/layout.tsx'>layout.tsx</a></b></td>
                    <td style='padding: 8px;'>Root layout component - wraps entire application with providers (React Query, Socket.io, Theme), defines HTML structure, and includes global styles</code></td>
                </tr>
                <tr style='border-bottom: 1px solid #eee;'>
                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/globals.css'>globals.css</a></b></td>
                    <td style='padding: 8px;'>Global CSS styles - includes Tailwind CSS directives, CSS variables for theming, and base component styles</code></td>
                </tr>
            </table>
            <!-- staff Submodule -->
            <details>
                <summary><b>staff</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ app.staff</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/staff/layout.tsx'>layout.tsx</a></b></td>
                            <td style='padding: 8px;'>Staff portal layout - includes sidebar navigation, header with notifications, and role-based access verification for staff users</code></td>
                        </tr>
                    </table>
                    <!-- dashboard Submodule -->
                    <details>
                        <summary><b>dashboard</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ app.staff.dashboard</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/staff/dashboard/page.tsx'>page.tsx</a></b></td>
                                    <td style='padding: 8px;'>Staff dashboard page - displays task statistics, recent assignments, pending reports, and performance metrics for the logged-in staff member</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                    <!-- map Submodule -->
                    <details>
                        <summary><b>map</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ app.staff.map</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/staff/map/page.tsx'>page.tsx</a></b></td>
                                    <td style='padding: 8px;'>Staff map view - shows assigned tasks, nearby reports, and office locations on Leaflet/Mapbox with filtering by status and priority</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                    <!-- tasks Submodule -->
                    <details>
                        <summary><b>tasks</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ app.staff.tasks</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/staff/tasks/page.tsx'>page.tsx</a></b></td>
                                    <td style='padding: 8px;'>Task list page for staff - displays paginated list of assigned tasks with filtering by status, priority, and due date</code></td>
                                </tr>
                            </tr>
                            <!-- [id] Submodule -->
                            <details>
                                <summary><b>[id]</b></summary>
                                <blockquote>
                                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                        <code><b>⦿ app.staff.tasks.[id]</b></code>
                                    <table style='width: 100%; border-collapse: collapse;'>
                                    <thead>
                                        <tr style='background-color: #f8f9fa;'>
                                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                            <th style='text-align: left; padding: 8px;'>Summary</th>
                                        </tr>
                                    </thead>
                                        <tr style='border-bottom: 1px solid #eee;'>
                                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/staff/tasks/[id]/page.tsx'>page.tsx</a></b></td>
                                            <td style='padding: 8px;'>Dynamic task detail page - shows full task information, allows status updates, evidence upload, and communication with citizens</code></td>
                                        </tr>
                                    </table>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
            <!-- admin Submodule -->
            <details>
                <summary><b>admin</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ app.admin</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/admin/layout.tsx'>layout.tsx</a></b></td>
                            <td style='padding: 8px;'>Admin portal layout - includes admin sidebar navigation, header with system stats, and role verification for admin users</code></td>
                        </tr>
                    </table>
                    <!-- users Submodule -->
                    <details>
                        <summary><b>users</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ app.admin.users</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/admin/users/page.tsx'>page.tsx</a></b></td>
                                    <td style='padding: 8px;'>User management page for admin - CRUD operations on users, role assignment (citizen/staff/admin), office assignment, and user status toggling</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                    <!-- dashboard Submodule -->
                    <details>
                        <summary><b>dashboard</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ app.admin.dashboard</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/admin/dashboard/page.tsx'>page.tsx</a></b></td>
                                    <td style='padding: 8px;'>Admin dashboard - displays system-wide statistics (total reports, users, tasks), charts, recent activity, and key performance indicators</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                    <!-- map Submodule -->
                    <details>
                        <summary><b>map</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ app.admin.map</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/admin/map/page.tsx'>page.tsx</a></b></td>
                                    <td style='padding: 8px;'>Admin map view - full system visualization with all reports, offices, tasks, and heatmap layers for problem density analysis</code></td>
                                </tr>
                            </tr>
                        </blockquote>
                    </details>
                    <!-- departments Submodule -->
                    <details>
                        <summary><b>departments</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ app.admin.departments</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/admin/departments/page.tsx'>page.tsx</a></b></td>
                                    <td style='padding: 8px;'>Department management page - list, create, edit, and delete departments, manage department categories and offices</code></td>
                                </tr>
                            </tr>
                            <!-- [code] Submodule -->
                            <details>
                                <summary><b>[code]</b></summary>
                                <blockquote>
                                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                        <code><b>⦿ app.admin.departments.[code]</b></code>
                                    <table style='width: 100%; border-collapse: collapse;'>
                                    <thead>
                                        <tr style='background-color: #f8f9fa;'>
                                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                            <th style='text-align: left; padding: 8px;'>Summary</th>
                                        </tr>
                                    </thead>
                                        <tr style='border-bottom: 1px solid #eee;'>
                                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/admin/departments/[code]/page.tsx'>page.tsx</a></b></td>
                                            <td style='padding: 8px;'>Dynamic department detail page - view and edit department information, manage its categories and offices</code></td>
                                        </tr>
                                    </tr>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                    <!-- reports Submodule -->
                    <details>
                        <summary><b>reports</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ app.admin.reports</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/admin/reports/page.tsx'>page.tsx</a></b></td>
                                    <td style='padding: 8px;'>Admin report management page - view all reports with advanced filtering, bulk actions, and report assignment override</code></td>
                                </tr>
                            </tr>
                            <!-- [id] Submodule -->
                            <details>
                                <summary><b>[id]</b></summary>
                                <blockquote>
                                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                        <code><b>⦿ app.admin.reports.[id]</b></code>
                                    <table style='width: 100%; border-collapse: collapse;'>
                                    <thead>
                                        <tr style='background-color: #f8f9fa;'>
                                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                            <th style='text-align: left; padding: 8px;'>Summary</th>
                                        </tr>
                                    </thead>
                                        <tr style='border-bottom: 1px solid #eee;'>
                                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/admin/reports/[id]/page.tsx'>page.tsx</a></b></td>
                                            <td style='padding: 8px;'>Admin report detail page - full report view with ability to override category, reassign office, add admin notes, and view complete history</code></td>
                                        </tr>
                                    </tr>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                    <!-- categories Submodule -->
                    <details>
                        <summary><b>categories</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ app.admin.categories</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/admin/categories/page.tsx'>page.tsx</a></b></td>
                                    <td style='padding: 8px;'>Category management page - list, create, edit, and delete report categories, assign categories to departments</code></td>
                                </tr>
                            </tr>
                            <!-- [slug] Submodule -->
                            <details>
                                <summary><b>[slug]</b></summary>
                                <blockquote>
                                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                        <code><b>⦿ app.admin.categories.[slug]</b></code>
                                    <table style='width: 100%; border-collapse: collapse;'>
                                    <thead>
                                        <tr style='background-color: #f8f9fa;'>
                                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                            <th style='text-align: left; padding: 8px;'>Summary</th>
                                        </tr>
                                    </thead>
                                        <tr style='border-bottom: 1px solid #eee;'>
                                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/admin/categories/[slug]/page.tsx'>page.tsx</a></b></td>
                                            <td style='padding: 8px;'>Dynamic category detail page - view and edit category information, including name, description, icon, and color coding</code></td>
                                        </tr>
                                    </table>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
            <!-- citizen Submodule -->
            <details>
                <summary><b>citizen</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ app.citizen</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/citizen/layout.tsx'>layout.tsx</a></b></td>
                            <td style='padding: 8px;'>Citizen portal layout - includes bottom navigation bar for mobile, header with notifications, and role verification</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/citizen/page.tsx'>page.tsx</a></b></td>
                            <td style='padding: 8px;'>Citizen home page - displays nearby reports, personal report statistics, recent activity, and quick report submission button</code></td>
                        </tr>
                    </table>
                    <!-- map Submodule -->
                    <details>
                        <summary><b>map</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ app.citizen.map</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/citizen/map/page.tsx'>page.tsx</a></b></td>
                                    <td style='padding: 8px;'>Citizen map view - shows nearby public reports, office locations, and allows location-based report submission with reverse geocoding</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                    <!-- reports Submodule -->
                    <details>
                        <summary><b>reports</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ app.citizen.reports</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/citizen/reports/layout.tsx'>layout.tsx</a></b></td>
                                    <td style='padding: 8px;'>Reports section layout - shared layout for report listing and detail pages</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/citizen/reports/page.tsx'>page.tsx</a></b></td>
                                    <td style='padding: 8px;'>Citizen report list page - displays user's own reports with pagination, filtering by status, and quick status tracking</code></td>
                                </tr>
                            </tr>
                            <!-- [id] Submodule -->
                            <details>
                                <summary><b>[id]</b></summary>
                                <blockquote>
                                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                        <code><b>⦿ app.citizen.reports.[id]</b></code>
                                    <table style='width: 100%; border-collapse: collapse;'>
                                    <thead>
                                        <tr style='background-color: #f8f9fa;'>
                                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                            <th style='text-align: left; padding: 8px;'>Summary</th>
                                        </tr>
                                    </thead>
                                        <tr style='border-bottom: 1px solid #eee;'>
                                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/citizen/reports/[id]/page.tsx'>page.tsx</a></b></td>
                                            <td style='padding: 8px;'>Citizen report detail page - shows full report information, status timeline, assigned office, and allows cancellation if pending</code></td>
                                        </tr>
                                    </table>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                    <!-- profile Submodule -->
                    <details>
                        <summary><b>profile</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ app.citizen.profile</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/citizen/profile/page.tsx'>page.tsx</a></b></td>
                                    <td style='padding: 8px;'>User profile page - view and edit personal information, change password, manage notification preferences</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
            <!-- login Submodule -->
            <details>
                <summary><b>login</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ app.login</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/app/login/page.tsx'>page.tsx</a></b></td>
                            <td style='padding: 8px;'>Login page - email/password authentication form with validation, remember me option, and role-based redirect after successful login</code></td>
                        </tr>
                    </table>
                </blockquote>
            </details>
        </blockquote>
    </details>
    <!-- features Submodule -->
    <details>
        <summary><b>features</b></summary>
        <blockquote>
            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                <code><b>⦿ features</b></code>
            <!-- report Submodule -->
            <details>
                <summary><b>report</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ features.report</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/schemas.ts'>schemas.ts</a></b></td>
                            <td style='padding: 8px;'>Zod validation schemas for report forms - defines validation rules for report creation, status update, category override, and attachments</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/queryKeys.ts'>queryKeys.ts</a></b></td>
                            <td style='padding: 8px;'>React Query key factory for report queries - provides structured keys for reports list, detail, my reports, and filtered queries</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/api.ts'>api.ts</a></b></td>
                            <td style='padding: 8px;'>HTTP API functions for report operations - create, fetch, update status, update category, upload attachments, delete reports</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/service.ts'>service.ts</a></b></td>
                            <td style='padding: 8px;'>Business logic service layer for reports - transforms API responses, handles pagination, and aggregates report data for UI</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/types.ts'>types.ts</a></b></td>
                            <td style='padding: 8px;'>TypeScript type definitions for reports - includes Report, ReportStatus, Priority, Attachment, ReportFilter, and API response types</code></td>
                        </tr>
                    </table>
                    <!-- hooks Submodule -->
                    <details>
                        <summary><b>hooks</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.report.hooks</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/hooks/useReports.ts'>useReports.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching paginated reports list - supports filtering, sorting, and pagination parameters</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/hooks/useReportDetail.ts'>useReportDetail.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching single report details by ID - includes attachments, status history, and assigned office</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/hooks/useUpdateStatusReport.ts'>useUpdateStatusReport.ts</a></b></td>
                                    <td style='padding: 8px;'>Mutation hook for updating report status - invalidates related queries on success and shows toast notifications</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/hooks/useUpdateFinalCategory.ts'>useUpdateFinalCategory.ts</a></b></td>
                                    <td style='padding: 8px;'>Admin mutation hook for overriding report category - updates final category type and triggers reassignment</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/hooks/useMyReports.ts'>useMyReports.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching current user's reports - used in citizen profile and report history pages</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/hooks/useCreateReport.ts'>useCreateReport.ts</a></b></td>
                                    <td style='padding: 8px;'>Mutation hook for creating new report - handles form submission, file upload, and navigation after success</code></td>
                                </tr>
                            </tr>
                        </blockquote>
                    </details>
                    <!-- components Submodule -->
                    <details>
                        <summary><b>components</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.report.components</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/components/CreateReportModal.tsx'>CreateReportModal.tsx</a></b></td>
                                    <td style='padding: 8px;'>Modal component for quick report creation - includes location picker, image upload, and category selection</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/components/create-report-card.tsx'>create-report-card.tsx</a></b></td>
                                    <td style='padding: 8px;'>Card component for report submission form - reusable form layout with validation and progress indicator</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/components/ImageUploader.tsx'>ImageUploader.tsx</a></b></td>
                                    <td style='padding: 8px;'>Drag-and-drop image upload component - supports multiple images, preview, removal, and Cloudinary integration</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/components/report-card.tsx'>report-card.tsx</a></b></td>
                                    <td style='padding: 8px;'>Report card component for list views - displays summary info, status badge, priority indicator, and clickable link</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/components/FormField.tsx'>FormField.tsx</a></b></td>
                                    <td style='padding: 8px;'>Reusable form field component - integrates with React Hook Form, supports validation errors and custom styling</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/components/ReportForm.tsx'>ReportForm.tsx</a></b></td>
                                    <td style='padding: 8px;'>Main report form component - complete form with all fields, uses React Hook Form + Zod for validation</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                    <!-- utils Submodule -->
                    <details>
                        <summary><b>utils</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.report.utils</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/utils/buildSort.ts'>buildSort.ts</a></b></td>
                                    <td style='padding: 8px;'>Helper function to build sort parameters for API requests - converts UI sort state to backend sort format</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                    <!-- constants Submodule -->
                    <details>
                        <summary><b>constants</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.report.constants</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/constants/timeline-config.ts'>timeline-config.ts</a></b></td>
                                    <td style='padding: 8px;'>Configuration for report status timeline - defines status order, display labels, icons, and color mappings</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/constants/report-sort.ts'>report-sort.ts</a></b></td>
                                    <td style='padding: 8px;'>Sort options configuration for report lists - defines available sort fields and their display labels</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/constants/actions-config.ts'>actions-config.ts</a></b></td>
                                    <td style='padding: 8px;'>Action button configuration for reports - defines available actions based on user role and report status</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/report/constants/report-status.ts'>report-status.ts</a></b></td>
                                    <td style='padding: 8px;'>Report status constants and helper functions - status labels, badge colors, and transition validation</code></td>
                                </tr>
                            </tr>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
            <!-- attachment Submodule -->
            <details>
                <summary><b>attachment</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ features.attachment</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/attachment/api.ts'>api.ts</a></b></td>
                            <td style='padding: 8px;'>HTTP API functions for file attachments - upload images to Cloudinary, delete attachments, get attachment URLs for reports and tasks</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/attachment/types.ts'>types.ts</a></b></td>
                            <td style='padding: 8px;'>TypeScript type definitions for attachments - includes Attachment, UploadResponse, AttachmentType (report/task evidence)</code></td>
                        </tr>
                    </table>
                </blockquote>
            </details>
            <!-- category Submodule -->
            <details>
                <summary><b>category</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ features.category</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/schemas.ts'>schemas.ts</a></b></td>
                            <td style='padding: 8px;'>Zod validation schemas for category forms - defines validation rules for category creation and update operations</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/queryKeys.ts'>queryKeys.ts</a></b></td>
                            <td style='padding: 8px;'>React Query key factory for category queries - provides structured keys for categories list, detail, active categories, and department categories</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/api.ts'>api.ts</a></b></td>
                            <td style='padding: 8px;'>HTTP API functions for category operations - fetch categories, create, update, delete, get active categories for public forms</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/types.ts'>types.ts</a></b></td>
                            <td style='padding: 8px;'>TypeScript type definitions for categories - includes Category, CategoryFormData, CategoryFilter, and CategoryApiResponse</code></td>
                        </tr>
                    </tr>
                    <!-- hooks Submodule -->
                    <details>
                        <summary><b>hooks</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.category.hooks</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/hooks/useCategory.ts'>useCategory.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching single category details by ID - used in admin category edit pages</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/hooks/useDeleteCategory.ts'>useDeleteCategory.ts</a></b></td>
                                    <td style='padding: 8px;'>Mutation hook for deleting a category - invalidates category lists and shows confirmation dialog</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/hooks/useCreateCategory.ts'>useCreateCategory.ts</a></b></td>
                                    <td style='padding: 8px;'>Mutation hook for creating new category - handles form submission and invalidates category queries on success</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/hooks/useActiveCategories.ts'>useActiveCategories.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching active categories - used in citizen report submission form for category selection</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/hooks/useCategories.ts'>useCategories.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching paginated categories list - supports filtering, sorting, and pagination for admin panel</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/hooks/useUpdateCategory.ts'>useUpdateCategory.ts</a></b></td>
                                    <td style='padding: 8px;'>Mutation hook for updating category - handles form submission and invalidates category details and lists</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                    <!-- components Submodule -->
                    <details>
                        <summary><b>components</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.category.components</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/components/StatusBadge.tsx'>StatusBadge.tsx</a></b></td>
                                    <td style='padding: 8px;'>Reusable badge component for category status (active/inactive) - shows colored indicator with status label</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/components/CategoryTableRow.tsx'>CategoryTableRow.tsx</a></b></td>
                                    <td style='padding: 8px;'>Table row component for category list - displays category info, status, department, and action buttons (edit/delete)</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/components/CategoryFilters.tsx'>CategoryFilters.tsx</a></b></td>
                                    <td style='padding: 8px;'>Filter bar component for category management - search by name, filter by status and department</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/components/CategoryHeader.tsx'>CategoryHeader.tsx</a></b></td>
                                    <td style='padding: 8px;'>Header component for category pages - includes title, description, and create new category button</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/components/CategoryDetail.tsx'>CategoryDetail.tsx</a></b></td>
                                    <td style='padding: 8px;'>Category detail view component - displays full category information, associated department, and usage statistics</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/components/CategoryModals.tsx'>CategoryModals.tsx</a></b></td>
                                    <td style='padding: 8px;'>Modal components for category operations - create category modal, edit category modal, and delete confirmation modal</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/components/CategoryTable.tsx'>CategoryTable.tsx</a></b></td>
                                    <td style='padding: 8px;'>Main category table component - displays paginated category list with sorting, filtering, and action buttons</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/components/CategoryPreview.tsx'>CategoryPreview.tsx</a></b></td>
                                    <td style='padding: 8px;'>Preview component for category selection - shows icon, name, and description in a card format</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/components/PaginationInfo.tsx'>PaginationInfo.tsx</a></b></td>
                                    <td style='padding: 8px;'>Pagination info component - displays current page, total pages, and items range for category list</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/components/CategoryForm.tsx'>CategoryForm.tsx</a></b></td>
                                    <td style='padding: 8px;'>Reusable category form component - uses React Hook Form + Zod, includes name, description, icon, color, and department assignment</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                    <!-- constants Submodule -->
                    <details>
                        <summary><b>constants</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.category.constants</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/constants/table.ts'>table.ts</a></b></td>
                                    <td style='padding: 8px;'>Table configuration for category management - defines column definitions, sortable fields, and responsive breakpoints</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/constants/icons.ts'>icons.ts</a></b></td>
                                    <td style='padding: 8px;'>Icon mapping for categories - maps category names/IDs to Lucide React icons for visual representation</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/category/constants/config.ts'>config.ts</a></b></td>
                                    <td style='padding: 8px;'>Configuration constants for categories - default pagination settings, filter options, and status color mapping</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
            <!-- dashboard Submodule -->
            <details>
                <summary><b>dashboard</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ features.dashboard</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/dashboard/queryKeys.ts'>queryKeys.ts</a></b></td>
                            <td style='padding: 8px;'>React Query key factory for dashboard queries - provides structured keys for admin and citizen dashboard data</code></td>
                        </tr>
                    </tr>
                    <!-- admin Submodule -->
                    <details>
                        <summary><b>admin</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.dashboard.admin</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/dashboard/admin/api.ts'>api.ts</a></b></td>
                                    <td style='padding: 8px;'>HTTP API functions for admin dashboard - fetch statistics, recent reports, resolved reports analytics, priority reports</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/dashboard/admin/types.ts'>types.ts</a></b></td>
                                    <td style='padding: 8px;'>TypeScript type definitions for admin dashboard - includes DashboardStats, PriorityReport, ResolvedReport, ChartData</code></td>
                                </tr>
                            </table>
                            <!-- hooks Submodule -->
                            <details>
                                <summary><b>hooks</b></summary>
                                <blockquote>
                                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                        <code><b>⦿ features.dashboard.admin.hooks</b></code>
                                    <table style='width: 100%; border-collapse: collapse;'>
                                    <thead>
                                        <tr style='background-color: #f8f9fa;'>
                                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                            <th style='text-align: left; padding: 8px;'>Summary</th>
                                        </tr>
                                    </thead>
                                        <tr style='border-bottom: 1px solid #eee;'>
                                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/dashboard/admin/hooks/useDashboard.ts'>useDashboard.ts</a></b></td>
                                            <td style='padding: 8px;'>React Query hook for admin dashboard data - aggregates stats, priority reports, resolved reports, and recent activity</code></td>
                                        </tr>
                                    </table>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                    <!-- citizen Submodule -->
                    <details>
                        <summary><b>citizen</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.dashboard.citizen</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/dashboard/citizen/api.ts'>api.ts</a></b></td>
                                    <td style='padding: 8px;'>HTTP API functions for citizen dashboard - fetch nearby reports, category statistics, personal report summary</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/dashboard/citizen/types.ts'>types.ts</a></b></td>
                                    <td style='padding: 8px;'>TypeScript type definitions for citizen dashboard - includes NearbyReport, CategoryCount, CitizenStats, RecentReport</code></td>
                                </tr>
                            </table>
                            <!-- hooks Submodule -->
                            <details>
                                <summary><b>hooks</b></summary>
                                <blockquote>
                                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                        <code><b>⦿ features.dashboard.citizen.hooks</b></code>
                                    <table style='width: 100%; border-collapse: collapse;'>
                                    <thead>
                                        <tr style='background-color: #f8f9fa;'>
                                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                            <th style='text-align: left; padding: 8px;'>Summary</th>
                                        </tr>
                                    </thead>
                                        <tr style='border-bottom: 1px solid #eee;'>
                                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/dashboard/citizen/hooks/useCitizenDashboard.ts'>useCitizenDashboard.ts</a></b></td>
                                            <td style='padding: 8px;'>React Query hook for citizen dashboard data - fetches nearby reports, statistics, and personal summary based on user location</code></td>
                                        </tr>
                                    </tr>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                    <!-- constants Submodule -->
                    <details>
                        <summary><b>constants</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.dashboard.constants</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                <tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/dashboard/constants/dashboard-config.ts'>dashboard-config.ts</a></b></td>
                                    <td style='padding: 8px;'>Dashboard configuration constants - chart colors, default date ranges, refresh intervals, and widget configurations</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
            <!-- map Submodule -->
            <details>
                <summary><b>map</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ features.map</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/map/queryKeys.ts'>queryKeys.ts</a></b></td>
                            <td style='padding: 8px;'>React Query key factory for map queries - provides structured keys for map data, staff map data, and routing queries</code></td>
                        </tr>
                    </tr>
                    <!-- hooks Submodule -->
                    <details>
                        <summary><b>hooks</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.map.hooks</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/map/hooks/useStaffMapData.ts'>useStaffMapData.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for staff map data - fetches assigned tasks, nearby reports, and office locations within viewport bounds</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/map/hooks/useMapData.ts'>useMapData.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for general map data - fetches reports, offices, and tasks based on map bounds and filters</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/map/hooks/useMapRouting.ts'>useMapRouting.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for map routing - calculates routes between locations using Mapbox Directions API</code></td>
                                </tr>
                            </tr>
                        </blockquote>
                    </details>
                    <!-- api Submodule -->
                    <details>
                        <summary><b>api</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.map.api</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/map/api/get-map-data.ts'>get-map-data.ts</a></b></td>
                                    <td style='padding: 8px;'>HTTP API function for fetching map data - retrieves GeoJSON features for reports, offices, and tasks within bounds</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/map/api/get-staff-map-data.ts'>get-staff-map-data.ts</a></b></td>
                                    <td style='padding: 8px;'>HTTP API function for staff map data - fetches staff-specific map features including assigned tasks and office reports</code></td>
                                </tr>
                            </tr>
                        </blockquote>
                    </details>
                    <!-- types Submodule -->
                    <details>
                        <summary><b>types</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.map.types</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/map/types/admin-types.ts'>admin-types.ts</a></b></td>
                                    <td style='padding: 8px;'>TypeScript type definitions for admin map - includes AdminMapData, AdminMapFilters, and AdminFeatureCollection</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/map/types/staff-types.ts'>staff-types.ts</a></b></td>
                                    <td style='padding: 8px;'>TypeScript type definitions for staff map - includes StaffMapData, TaskFeature, ReportFeature, and OfficeFeature</code></td>
                                </tr>
                            </tr>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
            <!-- auth Submodule -->
            <details>
                <summary><b>auth</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ features.auth</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/auth/api.ts'>api.ts</a></b></td>
                            <td style='padding: 8px;'>HTTP API functions for authentication - login, register citizen, refresh token, logout, forgot/reset password</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/auth/types.ts'>types.ts</a></b></td>
                            <td style='padding: 8px;'>TypeScript type definitions for auth - includes LoginRequest, RegisterRequest, AuthResponse, User, and JWT payload</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/auth/hooks.ts'>hooks.ts</a></b></td>
                            <td style='padding: 8px;'>React Query hooks for authentication - useLogin, useRegister, useLogout, useRefreshToken, useForgotPassword</code></td>
                        </tr>
                    </table>
                </blockquote>
            </details>
            <!-- department Submodule -->
            <details>
                <summary><b>department</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ features.department</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/schemas.ts'>schemas.ts</a></b></td>
                            <td style='padding: 8px;'>Zod validation schemas for department forms - defines validation rules for department creation and update</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/queryKeys.ts'>queryKeys.ts</a></b></td>
                            <td style='padding: 8px;'>React Query key factory for department queries - provides structured keys for departments list, detail, active, and stats</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/api.ts'>api.ts</a></b></td>
                            <td style='padding: 8px;'>HTTP API functions for department operations - fetch departments, create, update, delete, get department stats, get departments with offices</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/types.ts'>types.ts</a></b></td>
                            <td style='padding: 8px;'>TypeScript type definitions for departments - includes Department, DepartmentFormData, DepartmentStats, DepartmentFilter</code></td>
                        </tr>
                    </tr>
                    <!-- hooks Submodule -->
                    <details>
                        <summary><b>hooks</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.department.hooks</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/hooks/useDepartmentDetail.ts'>useDepartmentDetail.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching single department details by ID - includes categories, offices, and statistics</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/hooks/useDeleteDepartment.ts'>useDeleteDepartment.ts</a></b></td>
                                    <td style='padding: 8px;'>Mutation hook for deleting department - shows confirmation dialog and invalidates department lists</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/hooks/useDepartments.ts'>useDepartments.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching paginated departments list - supports filtering, sorting, and search</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/hooks/useUpdateDepartment.ts'>useUpdateDepartment.ts</a></b></td>
                                    <td style='padding: 8px;'>Mutation hook for updating department - handles form submission and invalidates department queries</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/hooks/useActiveDepartments.ts'>useActiveDepartments.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching active departments - used in category assignment and report filters</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/hooks/useDepartmentStats.ts'>useDepartmentStats.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching department statistics - includes report counts, resolution rates, and performance metrics</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/hooks/useCreateDepartment.ts'>useCreateDepartment.ts</a></b></td>
                                    <td style='padding: 8px;'>Mutation hook for creating new department - handles form submission and invalidates department lists</code></td>
                                </tr>
                            <tr>
                        </blockquote>
                    </details>
                    <!-- components Submodule -->
                    <details>
                        <summary><b>components</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.department.components</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/components/DepartmentCard.tsx'>DepartmentCard.tsx</a></b></td>
                                    <td style='padding: 8px;'>Card component for department preview - displays department name, description, category count, and office count</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/components/DepartmentFilters.tsx'>DepartmentFilters.tsx</a></b></td>
                                    <td style='padding: 8px;'>Filter bar component for department management - search by name, filter by status and category presence</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/components/DepartmentEmptyState.tsx'>DepartmentEmptyState.tsx</a></b></td>
                                    <td style='padding: 8px;'>Empty state component for department list - shown when no departments match filters</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/components/DepartmentFormModal.tsx'>DepartmentFormModal.tsx</a></b></td>
                                    <td style='padding: 8px;'>Modal component for department creation/editing - includes form fields for name, description, contact info</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/components/DepartmentErrorState.tsx'>DepartmentErrorState.tsx</a></b></td>
                                    <td style='padding: 8px;'>Error state component for department queries - shows error message and retry button</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/components/DepartmentDetailSkeleton.tsx'>DepartmentDetailSkeleton.tsx</a></b></td>
                                    <td style='padding: 8px;'>Skeleton loader for department detail page - shows loading placeholders for content</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/components/DepartmentStats.tsx'>DepartmentStats.tsx</a></b></td>
                                    <td style='padding: 8px;'>Statistics component for department - displays report counts, resolution rate, and performance charts</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/components/DepartmentUsers.tsx'>DepartmentUsers.tsx</a></b></td>
                                    <td style='padding: 8px;'>Component for managing department users - lists staff members assigned to the department</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/components/DepartmentSkeleton.tsx'>DepartmentSkeleton.tsx</a></b></td>
                                    <td style='padding: 8px;'>Skeleton loader for department list - shows loading placeholders for table rows</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                    <!-- constants Submodule -->
                    <details>
                        <summary><b>constants</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.department.constants</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/department/constants/config.ts'>config.ts</a></b></td>
                                    <td style='padding: 8px;'>Configuration constants for departments - default pagination, sort options, and status color mapping</code></td>
                                </tr>
                            </tr>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
            <!-- user Submodule -->
            <details>
                <summary><b>user</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ features.user</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/schemas.ts'>schemas.ts</a></b></td>
                            <td style='padding: 8px;'>Zod validation schemas for user forms - defines validation rules for user creation, update, and profile edit</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/api.ts'>api.ts</a></b></td>
                            <td style='padding: 8px;'>HTTP API functions for user operations - fetch users, create user, update user, delete user, change password, update profile</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/querykeys.ts'>querykeys.ts</a></b></td>
                            <td style='padding: 8px;'>React Query key factory for user queries - provides structured keys for users list, current user, users by department, users by office</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/types.ts'>types.ts</a></b></td>
                            <td style='padding: 8px;'>TypeScript type definitions for users - includes User, UserRole, UserFormData, UserFilter, and UserApiResponse</code></td>
                        </tr>
                    </tr>
                    <!-- hooks Submodule -->
                    <details>
                        <summary><b>hooks</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.user.hooks</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/hooks/useCurrentUser.ts'>useCurrentUser.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching current logged-in user profile - used for auth state and user info display</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/hooks/useUsers.ts'>useUsers.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching paginated users list - supports filtering by role, office, status, and search</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/hooks/useUsersByDepartment.ts'>useUsersByDepartment.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching users by department - used for staff assignment and department management</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/hooks/useCreateUser.ts'>useCreateUser.ts</a></b></td>
                                    <td style='padding: 8px;'>Mutation hook for creating new user (admin only) - handles multi-step form submission and role assignment</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/hooks/useUsersByOffice.ts'>useUsersByOffice.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching users by office - used for office staff management</code></td>
                                </tr>
                            </tr>
                        </blockquote>
                    </details>
                    <!-- components Submodule -->
                    <details>
                        <summary><b>components</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.user.components</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/components/UserFormModal.tsx'>UserFormModal.tsx</a></b></td>
                                    <td style='padding: 8px;'>Main modal component for user creation/editing - multi-step form wizard for user data entry</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/components/ResetPasswordDialog.tsx'>ResetPasswordDialog.tsx</a></b></td>
                                    <td style='padding: 8px;'>Dialog component for resetting user password - admin-only action with confirmation</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/components/UserCard.tsx'>UserCard.tsx</a></b></td>
                                    <td style='padding: 8px;'>Card component for user preview in grid/list views - displays avatar, name, role, office, and status</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/components/UserFilters.tsx'>UserFilters.tsx</a></b></td>
                                    <td style='padding: 8px;'>Filter bar component for user management - search by name/email, filter by role, office, and status</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/components/UserStats.tsx'>UserStats.tsx</a></b></td>
                                    <td style='padding: 8px;'>Statistics component for user dashboard - displays total users, by role, active/inactive counts</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/components/UserSkeleton.tsx'>UserSkeleton.tsx</a></b></td>
                                    <td style='padding: 8px;'>Skeleton loader for user list - shows loading placeholders for user cards or table rows</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/components/UserEmptyState.tsx'>UserEmptyState.tsx</a></b></td>
                                    <td style='padding: 8px;'>Empty state component for user list - shown when no users match filters</code></td>
                                </tr>
                            </tr>
                            <!-- UserFormModal Submodule -->
                            <details>
                                <summary><b>UserFormModal</b></summary>
                                <blockquote>
                                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                        <code><b>⦿ features.user.components.UserFormModal</b></code>
                                    <table style='width: 100%; border-collapse: collapse;'>
                                    <thead>
                                        <tr style='background-color: #f8f9fa;'>
                                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                            <th style='text-align: left; padding: 8px;'>Summary</th>
                                        </tr>
                                    </thead>
                                        <tr style='border-bottom: 1px solid #eee;'>
                                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/components/UserFormModal/StepOffice.tsx'>StepOffice.tsx</a></b></td>
                                            <td style='padding: 8px;'>Step 2 of user creation wizard - office assignment step for staff/admin users</code></td>
                                        </tr>
                                        <tr style='border-bottom: 1px solid #eee;'>
                                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/components/UserFormModal/StepIndicator.tsx'>StepIndicator.tsx</a></b></td>
                                            <td style='padding: 8px;'>Visual step indicator component - shows current step in multi-step user form</code></td>
                                        </tr>
                                        <tr style='border-bottom: 1px solid #eee;'>
                                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/components/UserFormModal/types.ts'>types.ts</a></b></td>
                                            <td style='padding: 8px;'>TypeScript type definitions for user form modal - includes form data, step types, and validation schemas</code></td>
                                        </tr>
                                        <tr style='border-bottom: 1px solid #eee;'>
                                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/components/UserFormModal/StepRoleDepartment.tsx'>StepRoleDepartment.tsx</a></b></td>
                                            <td style='padding: 8px;'>Step 3 of user creation wizard - role and department selection step</code></td>
                                        </tr>
                                        <tr style='border-bottom: 1px solid #eee;'>
                                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/components/UserFormModal/StepReview.tsx'>StepReview.tsx</a></b></td>
                                            <td style='padding: 8px;'>Final step of user creation wizard - review all entered information before submission</code></td>
                                        </tr>
                                        <tr style='border-bottom: 1px solid #eee;'>
                                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/components/UserFormModal/StepPersonalInfo.tsx'>StepPersonalInfo.tsx</a></b></td>
                                            <td style='padding: 8px;'>Step 1 of user creation wizard - personal information collection (name, email, phone)</code></td>
                                        </tr>
                                    </tr>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                    <!-- constants Submodule -->
                    <details>
                        <summary><b>constants</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.user.constants</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/user/constants/config.ts'>config.ts</a></b></td>
                                    <td style='padding: 8px;'>Configuration constants for users - role options, status options, default pagination, and user table columns</code></td>
                                </tr>
                            </tr>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
            <!-- role Submodule -->
            <details>
                <summary><b>role</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ features.role</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/role/queryKeys.ts'>queryKeys.ts</a></b></td>
                            <td style='padding: 8px;'>React Query key factory for role queries - provides structured keys for roles list and role details</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/role/api.ts'>api.ts</a></b></td>
                            <td style='padding: 8px;'>HTTP API functions for role operations - fetch all roles, get role by ID, get role permissions</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/role/types.ts'>types.ts</a></b></td>
                            <td style='padding: 8px;'>TypeScript type definitions for roles - includes Role, RoleName, Permission, and RoleAssignment</code></td>
                        </tr>
                    </table>
                    <!-- hooks Submodule -->
                    <details>
                        <summary><b>hooks</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.role.hooks</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/role/hooks/useRoles.ts'>useRoles.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching all available roles - used in user creation/editing for role selection</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                    <!-- constants Submodule -->
                    <details>
                        <summary><b>constants</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.role.constants</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/role/constants/role-label.ts'>role-label.ts</a></b></td>
                                    <td style='padding: 8px;'>Role label mapping constants - maps role names to display labels, icons, and color schemes for UI components</code></td>
                                </tr>
                            </tr>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
            <!-- notification Submodule -->
            <details>
                <summary><b>notification</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ features.notification</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/notification/queryKeys.ts'>queryKeys.ts</a></b></td>
                            <td style='padding: 8px;'>React Query key factory for notification queries - provides structured keys for notifications list, unread count, and paginated queries</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/notification/api.ts'>api.ts</a></b></td>
                            <td style='padding: 8px;'>HTTP API functions for notifications - fetch notifications, mark as read, mark all as read, delete notification, get unread count</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/notification/NotificationListener.tsx'>NotificationListener.tsx</a></b></td>
                            <td style='padding: 8px;'>React component that establishes WebSocket connection for real-time notifications - listens for new notifications and updates React Query cache</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/notification/types.ts'>types.ts</a></b></td>
                            <td style='padding: 8px;'>TypeScript type definitions for notifications - includes Notification, NotificationType, NotificationFilter, and NotificationResponse</code></td>
                        </tr>
                    </table>
                    <!-- hooks Submodule -->
                    <details>
                        <summary><b>hooks</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.notification.hooks</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/notification/hooks/useRealtimeNotifications.ts'>useRealtimeNotifications.ts</a></b></td>
                                    <td style='padding: 8px;'>Custom hook that sets up WebSocket connection and provides real-time notification updates with toast notifications</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/notification/hooks/useClickOutside.ts'>useClickOutside.ts</a></b></td>
                                    <td style='padding: 8px;'>Generic hook for detecting clicks outside a referenced element - used for dropdown closing logic</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/notification/hooks/useUnreadNotificationCount.ts'>useUnreadNotificationCount.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching unread notification count - used for badge display in header</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/notification/hooks/useMarkNotificationAsRead.ts'>useMarkNotificationAsRead.ts</a></b></td>
                                    <td style='padding: 8px;'>Mutation hook for marking a single notification as read - invalidates unread count and notification list</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/notification/hooks/useNotifications.ts'>useNotifications.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching paginated notifications list - supports sorting by date and read status</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/notification/hooks/useInfiniteNotifications.ts'>useInfiniteNotifications.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for infinite scrolling notifications - loads more notifications as user scrolls</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                    <!-- components Submodule -->
                    <details>
                        <summary><b>components</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.notification.components</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/notification/components/NotificationItem.tsx'>NotificationItem.tsx</a></b></td>
                                    <td style='padding: 8px;'>Single notification item component - displays notification icon, title, content, timestamp, and read/unread state</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/notification/components/NotificationList.tsx'>NotificationList.tsx</a></b></td>
                                    <td style='padding: 8px;'>Notification list component - renders paginated or infinite scroll list of notifications with grouping by date</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/notification/components/NotificationDropdown.tsx'>NotificationDropdown.tsx</a></b></td>
                                    <td style='padding: 8px;'>Dropdown component for header notification icon - shows recent notifications, mark all as read button, and link to full notifications page</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
            <!-- task Submodule -->
            <details>
                <summary><b>task</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ features.task</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/queryKeys.ts'>queryKeys.ts</a></b></td>
                            <td style='padding: 8px;'>React Query key factory for task queries - provides structured keys for tasks list, task detail, and task statistics</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/api.ts'>api.ts</a></b></td>
                            <td style='padding: 8px;'>HTTP API functions for task operations - fetch tasks, get task detail, start task, complete task, reassign task, upload evidence</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/types.ts'>types.ts</a></b></td>
                            <td style='padding: 8px;'>TypeScript type definitions for tasks - includes Task, TaskStatus, TaskPriority, TaskEvidence, TaskFilter, and TaskApiResponse</code></td>
                        </tr>
                    </tr>
                    <!-- hooks Submodule -->
                    <details>
                        <summary><b>hooks</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.task.hooks</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/hooks/useTasks.ts'>useTasks.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching paginated tasks list - supports filtering by status, priority, office, and due date</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/hooks/useStartTask.ts'>useStartTask.ts</a></b></td>
                                    <td style='padding: 8px;'>Mutation hook for starting a task - changes task status from PENDING to IN_PROGRESS</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/hooks/useCompleteTask.ts'>useCompleteTask.ts</a></b></td>
                                    <td style='padding: 8px;'>Mutation hook for completing a task - requires evidence upload, changes status to COMPLETED, and closes associated report</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/hooks/useTaskDetail.ts'>useTaskDetail.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching single task details - includes report info, evidence list, and assignment history</code></td>
                                </tr>
                            </tr>
                        </blockquote>
                    </details>
                    <!-- components Submodule -->
                    <details>
                        <summary><b>components</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.task.components</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/components/ReportDetails.tsx'>ReportDetails.tsx</a></b></td>
                                    <td style='padding: 8px;'>Component displaying report details within task view - shows original report information, images, and status</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/components/TaskFilters.tsx'>TaskFilters.tsx</a></b></td>
                                    <td style='padding: 8px;'>Filter bar component for task management - search by title, filter by status, priority, office, and date range</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/components/TaskDetailContent.tsx'>TaskDetailContent.tsx</a></b></td>
                                    <td style='padding: 8px;'>Main content component for task detail page - displays all task information, evidence gallery, and action buttons</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/components/EmptyState.tsx'>EmptyState.tsx</a></b></td>
                                    <td style='padding: 8px;'>Empty state component for task list - shown when no tasks match filters</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/components/TaskCard.tsx'>TaskCard.tsx</a></b></td>
                                    <td style='padding: 8px;'>Card component for task preview in list views - displays task title, status, priority, due date, and assigned office</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/components/TaskTimeline.tsx'>TaskTimeline.tsx</a></b></td>
                                    <td style='padding: 8px;'>Timeline component showing task lifecycle - creation, assignment, start, completion events with timestamps</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/components/TaskList.tsx'>TaskList.tsx</a></b></td>
                                    <td style='padding: 8px;'>Main task list component - renders paginated or infinite scroll list of task cards</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/components/TaskDetailSkeleton.tsx'>TaskDetailSkeleton.tsx</a></b></td>
                                    <td style='padding: 8px;'>Skeleton loader for task detail page - shows loading placeholders for content</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/components/TaskActionPanel.tsx'>TaskActionPanel.tsx</a></b></td>
                                    <td style='padding: 8px;'>Action panel component for task detail - contains Start, Complete, Reassign buttons based on task status and user role</code></td>
                                <tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/components/TaskSkeleton.tsx'>TaskSkeleton.tsx</a></b></td>
                                    <td style='padding: 8px;'>Skeleton loader for task list - shows loading placeholders for task cards</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/components/TaskStatusBadge.tsx'>TaskStatusBadge.tsx</a></b></td>
                                    <td style='padding: 8px;'>Badge component for task status - displays colored badge with status text and icon</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/task/components/TaskDetailError.tsx'>TaskDetailError.tsx</a></b></td>
                                    <td style='padding: 8px;'>Error state component for task detail - shows error message and retry/back navigation buttons</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
            <!-- office Submodule -->
            <details>
                <summary><b>office</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ features.office</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/office/schemas.ts'>schemas.ts</a></b></td>
                            <td style='padding: 8px;'>Zod validation schemas for office forms - defines validation rules for office creation, update, and user assignment</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/office/queryKeys.ts'>queryKeys.ts</a></b></td>
                            <td style='padding: 8px;'>React Query key factory for office queries - provides structured keys for offices list, office detail, offices by department</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/office/api.ts'>api.ts</a></b></td>
                            <td style='padding: 8px;'>HTTP API functions for office operations - fetch offices, create office, update office, delete office, get nearby offices, assign users</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/office/types.ts'>types.ts</a></b></td>
                            <td style='padding: 8px;'>TypeScript type definitions for offices - includes Office, OfficeFormData, OfficeFilter, NearbyOffice, OfficeAssignment</code></td>
                        </tr>
                    </tr>
                    <!-- hooks Submodule -->
                    <details>
                        <summary><b>hooks</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.office.hooks</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/office/hooks/useOfficeDepartments.ts'>useOfficeDepartments.ts</a></b></td>
                                    <td style='padding: 8px;'>React Query hook for fetching offices grouped by department - used for organization charts and office selection</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/office/hooks/useCreateOfficeDepartment.ts'>useCreateOfficeDepartment.ts</a></b></td>
                                    <td style='padding: 8px;'>Mutation hook for creating new office - handles form submission and invalidates office queries</code></td>
                                </tr>
                            </tr>
                        </blockquote>
                    </details>
                    <!-- components Submodule -->
                    <details>
                        <summary><b>components</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ features.office.components</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/office/components/OfficeUsersList.tsx'>OfficeUsersList.tsx</a></b></td>
                                    <td style='padding: 8px;'>Component for listing users assigned to an office - shows staff members with their roles and contact info</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/office/components/OfficeCard.tsx'>OfficeCard.tsx</a></b></td>
                                    <td style='padding: 8px;'>Card component for office preview - displays office name, address, staff count, and department info</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/office/components/OfficeList.tsx'>OfficeList.tsx</a></b></td>
                                    <td style='padding: 8px;'>Main office list component - renders paginated list of office cards with filtering by department</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/features/office/components/CreateOfficeModal.tsx'>CreateOfficeModal.tsx</a></b></td>
                                    <td style='padding: 8px;'>Modal component for office creation - includes form fields for name, address, location coordinates, phone, and department assignment</code></td>
                                </tr>
                            </tr>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
        </blockquote>
    </details>
    <!-- lib Submodule -->
    <details>
        <summary><b>lib</b></summary>
        <blockquote>
            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                <code><b>⦿ lib</b></code>
            <table style='width: 100%; border-collapse: collapse;'>
            <thead>
                <tr style='background-color: #f8f9fa;'>
                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                    <th style='text-align: left; padding: 8px;'>Summary</th>
                </tr>
            </thead>
                <tr style='border-bottom: 1px solid #eee;'>
                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/lib/get-initials.ts'>get-initials.ts</a></b></td>
                    <td style='padding: 8px;'>Utility function to generate user initials from full name - used for avatar fallbacks when no profile image</code></td>
                </tr>
                <tr style='border-bottom: 1px solid #eee;'>
                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/lib/queryClient.ts'>queryClient.ts</a></b></td>
                    <td style='padding: 8px;'>React Query client configuration - sets default options (retry logic, stale time, cache time) and error handling for all API queries</code></td>
                </tr>
                <tr style='border-bottom: 1px solid #eee;'>
                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/lib/utils.ts'>utils.ts</a></b></td>
                    <td style='padding: 8px;'>General utility functions - includes cn() for Tailwind class merging, formatDate, formatCurrency, and other common helpers</code></td>
                </tr>
                <tr style='border-bottom: 1px solid #eee;'>
                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/lib/axios.ts'>axios.ts</a></b></td>
                    <td style='padding: 8px;'>Axios instance configuration - sets base URL from environment, interceptors for JWT token injection, request/response logging, and error handling</code></td>
                </tr>
            </table>
            <!-- hooks Submodule -->
            <details>
                <summary><b>hooks</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ lib.hooks</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/lib/hooks/useDebounceValue.ts'>useDebounceValue.ts</a></b></td>
                            <td style='padding: 8px;'>Custom hook that debounces a value - useful for search inputs to reduce API calls while typing</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/lib/hooks/useDebounce.ts'>useDebounce.ts</a></b></td>
                            <td style='padding: 8px;'>Custom hook that debounces a callback function - delays execution until after specified wait time</code></td>
                        </tr>
                    </table>
                </blockquote>
            </details>
            <!-- realtime Submodule -->
            <details>
                <summary><b>realtime</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ lib.realtime</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/lib/realtime/RealtimeProvider.tsx'>RealtimeProvider.tsx</a></b></td>
                            <td style='padding: 8px;'>React context provider for WebSocket/Socket.io connection - manages connection lifecycle, event listeners, and real-time message distribution to subscribers</code></td>
                        </tr>
                    </tr>
                </blockquote>
            </details>
            <!-- utils Submodule -->
            <details>
                <summary><b>utils</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ lib.utils</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/lib/utils/renderIcon.tsx'>renderIcon.tsx</a></b></td>
                            <td style='padding: 8px;'>Helper function to render Lucide React icons dynamically by icon name string - used for category icons and menu items</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/lib/utils/date.ts'>date.ts</a></b></td>
                            <td style='padding: 8px;'>Date utility functions - format relative time (time ago), format date strings, calculate date differences for deadlines</code></td>
                        </tr>
                    </tr>
                </blockquote>
            </details>
        </blockquote>
    </details>
    <!-- components Submodule -->
    <details>
        <summary><b>components</b></summary>
        <blockquote>
            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                <code><b>⦿ components</b></code>
            <!-- pagination Submodule -->
            <details>
                <summary><b>pagination</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ components.pagination</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/pagination/admin-page-navigator.tsx'>admin-page-navigator.tsx</a></b></td>
                            <td style='padding: 8px;'>Admin-specific pagination navigator - includes page size selector, page buttons, and total items display for admin tables</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/pagination/page-navigator.tsx'>page-navigator.tsx</a></b></td>
                            <td style='padding: 8px;'>Generic pagination navigator component - previous/next buttons, page numbers, and ellipsis for large page counts</code></td>
                        </tr>
                    </table>
                </blockquote>
            </details>
            <!-- layout Submodule -->
            <details>
                <summary><b>layout</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ components.layout</b></code>
                    <!-- citizen Submodule -->
                    <details>
                        <summary><b>citizen</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ components.layout.citizen</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/layout/citizen/PageTransition.tsx'>PageTransition.tsx</a></b></td>
                                    <td style='padding: 8px;'>Wrapper component that adds fade/slide animations when navigating between pages for smoother UX</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/layout/citizen/Sidebar.tsx'>Sidebar.tsx</a></b></td>
                                    <td style='padding: 8px;'>Desktop sidebar navigation for citizen portal - includes menu items (Home, My Reports, Map, Profile)</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/layout/citizen/MobileHeader.tsx'>MobileHeader.tsx</a></b></td>
                                    <td style='padding: 8px;'>Mobile header component for citizen portal - includes hamburger menu button, logo, and notification icon</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/layout/citizen/MobileMenu.tsx'>MobileMenu.tsx</a></b></td>
                                    <td style='padding: 8px;'>Slide-out mobile menu component - contains navigation links and user profile section for citizen portal</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/layout/citizen/MobileBottomNav.tsx'>MobileBottomNav.tsx</a></b></td>
                                    <td style='padding: 8px;'>Bottom tab navigation bar for mobile devices - quick access to main citizen features (Home, Map, Reports, Profile)</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                    <!-- admin-staff Submodule -->
                    <details>
                        <summary><b>admin-staff</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ components.layout.admin-staff</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/layout/admin-staff/Topbar.tsx'>Topbar.tsx</a></b></td>
                                    <td style='padding: 8px;'>Top navigation bar for admin/staff portal - includes page title, search, notification dropdown, and user menu</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/layout/admin-staff/AdminStaffLayout.tsx'>AdminStaffLayout.tsx</a></b></td>
                                    <td style='padding: 8px;'>Main layout wrapper for admin and staff portals - combines sidebar + topbar + content area</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/layout/admin-staff/Sidebar.tsx'>Sidebar.tsx</a></b></td>
                                    <td style='padding: 8px;'>Collapsible sidebar navigation for admin/staff - menu items based on user role (admin sees more options)</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/layout/admin-staff/menu-config.ts'>menu-config.ts</a></b></td>
                                    <td style='padding: 8px;'>Menu configuration file - defines navigation items, icons, paths, and role-based access for sidebar menus</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/layout/admin-staff/AdminStaffLayoutContext.tsx'>AdminStaffLayoutContext.tsx</a></b></td>
                                    <td style='padding: 8px;'>React context for layout state - manages sidebar collapsed/expanded state and mobile menu visibility</code></td>
                                </tr>
                            </tr>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
            <!-- admin Submodule -->
            <details>
                <summary><b>admin</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ components.admin</b></code>
                    <!-- reports Submodule -->
                    <details>
                        <summary><b>reports</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ components.admin.reports</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/admin/reports/ReportFilters.tsx'>ReportFilters.tsx</a></b></td>
                                    <td style='padding: 8px;'>Filter panel for admin report management - filter by status, category, date range, department, and priority</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/admin/reports/ReviewCategoryDialog.tsx'>ReviewCategoryDialog.tsx</a></b></td>
                                    <td style='padding: 8px;'>Dialog for admin to review and override AI-predicted category - shows confidence score and allows manual category selection</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/admin/reports/ReportStatusBadge.tsx'>ReportStatusBadge.tsx</a></b></td>
                                    <td style='padding: 8px;'>Badge component for report status in admin views - color-coded with status text (PENDING, VERIFIED, ASSIGNED, RESOLVED, etc.)</code></td>
                                </tr>
                            </table>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
            <!-- providers Submodule -->
            <details>
                <summary><b>providers</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ components.providers</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/providers/UserProvider.tsx'>UserProvider.tsx</a></b></td>
                            <td style='padding: 8px;'>React context provider for user state - manages current user data, authentication status, and role-based permissions</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/providers/QueryProvider.tsx'>QueryProvider.tsx</a></b></td>
                            <td style='padding: 8px;'>React Query provider wrapper - configures and provides QueryClient to the application</code></td>
                        </tr>
                    </tr>
                </blockquote>
            </details>
            <!-- ui Submodule -->
            <details>
                <summary><b>ui</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ components.ui</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/progress.tsx'>progress.tsx</a></b></td>
                            <td style='padding: 8px;'>Progress bar component - used for loading states and task completion indicators</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/dropdown-menu.tsx'>dropdown-menu.tsx</a></b></td>
                            <td style='padding: 8px;'>Radix UI dropdown menu component - for user menu, notification actions, and context menus</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/select.tsx'>select.tsx</a></b></td>
                            <td style='padding: 8px;'>Custom select/dropdown component - used in filters and forms across the application</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/command.tsx'>command.tsx</a></b></td>
                            <td style='padding: 8px;'>Command palette / searchable select component - for category selection and quick navigation</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/input.tsx'>input.tsx</a></b></td>
                            <td style='padding: 8px;'>Reusable input component with consistent styling - supports validation states and icons</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/alert.tsx'>alert.tsx</a></b></td>
                            <td style='padding: 8px;'>Alert component for displaying success, error, warning, and info messages</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/department-dropdown.tsx'>department-dropdown.tsx</a></b></td>
                            <td style='padding: 8px;'>Dropdown component for department selection - used in filters and user assignment forms</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/map-picker.tsx'>map-picker.tsx</a></b></td>
                            <td style='padding: 8px;'>Interactive map picker component - allows users to select location by clicking on map for report submission</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/alert-dialog.tsx'>alert-dialog.tsx</a></b></td>
                            <td style='padding: 8px;'>Modal dialog for confirmations - used for delete confirmations and critical action warnings</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/card.tsx'>card.tsx</a></b></td>
                            <td style='padding: 8px;'>Card component with header, content, and footer sections - used for report cards, task cards, etc.</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/popover.tsx'>popover.tsx</a></b></td>
                            <td style='padding: 8px;'>Popover component - used for date pickers, filter panels, and tooltip-like content</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/LogoutDialog.tsx'>LogoutDialog.tsx</a></b></td>
                            <td style='padding: 8px;'>Confirmation dialog for logout action - prevents accidental logout</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/switch.tsx'>switch.tsx</a></b></td>
                            <td style='padding: 8px;'>Toggle switch component - used for enabling/disabling features and settings</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/filter-section.tsx'>filter-section.tsx</a></b></td>
                            <td style='padding: 8px;'>Collapsible filter section component - organizes filter controls in a clean layout</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/button.tsx'>button.tsx</a></b></td>
                            <td style='padding: 8px;'>Reusable button component with variants (primary, secondary, destructive, outline, ghost)</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/radio-group.tsx'>radio-group.tsx</a></b></td>
                            <td style='padding: 8px;'>Radio group component - used for mutually exclusive selections in forms</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/label.tsx'>label.tsx</a></b></td>
                            <td style='padding: 8px;'>Form label component - integrates with React Hook Form for error states</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/tooltip.tsx'>tooltip.tsx</a></b></td>
                            <td style='padding: 8px;'>Tooltip component - shows informative text on hover for icons and buttons</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/pagination.tsx'>pagination.tsx</a></b></td>
                            <td style='padding: 8px;'>Pagination component with page buttons, next/prev, and page size selector</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/avatar.tsx'>avatar.tsx</a></b></td>
                            <td style='padding: 8px;'>Avatar component - displays user profile image or initials fallback</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/checkbox.tsx'>checkbox.tsx</a></b></td>
                            <td style='padding: 8px;'>Checkbox component - used in forms and bulk selection tables</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/confirmation-dialog.tsx'>confirmation-dialog.tsx</a></b></td>
                            <td style='padding: 8px;'>Generic confirmation dialog - used for delete, status change, and other destructive actions</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/table.tsx'>table.tsx</a></b></td>
                            <td style='padding: 8px;'>Data table component with sorting, filtering, and pagination support</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/ForceDeleteDialog.tsx'>ForceDeleteDialog.tsx</a></b></td>
                            <td style='padding: 8px;'>Special dialog for force-deleting entities with dependencies - shows affected related records</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/skeleton.tsx'>skeleton.tsx</a></b></td>
                            <td style='padding: 8px;'>Skeleton loading placeholder component - used while content is loading</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/LoadingSpinner.tsx'>LoadingSpinner.tsx</a></b></td>
                            <td style='padding: 8px;'>Loading spinner component - centered spinner for async operations and page loads</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/scroll-area.tsx'>scroll-area.tsx</a></b></td>
                            <td style='padding: 8px;'>Custom scroll area component - styled scrollbar for dropdowns and modals</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/tabs.tsx'>tabs.tsx</a></b></td>
                            <td style='padding: 8px;'>Tab component for switching between different content views</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/dialog.tsx'>dialog.tsx</a></b></td>
                            <td style='padding: 8px;'>Modal dialog component - base for forms, confirmations, and detail views</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/badge.tsx'>badge.tsx</a></b></td>
                            <td style='padding: 8px;'>Badge component - used for status indicators, labels, and counters</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/separator.tsx'>separator.tsx</a></b></td>
                            <td style='padding: 8px;'>Visual separator line component - used to divide content sections</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/form.tsx'>form.tsx</a></b></td>
                            <td style='padding: 8px;'>Form wrapper component - integrates with React Hook Form for validation and error display</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/sheet.tsx'>sheet.tsx</a></b></td>
                            <td style='padding: 8px;'>Side sheet (drawer) component - slides in from right for mobile menus and detail panels</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/textarea.tsx'>textarea.tsx</a></b></td>
                            <td style='padding: 8px;'>Multi-line text input component - used for report descriptions and notes</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/department-combobox.tsx'>department-combobox.tsx</a></b></td>
                            <td style='padding: 8px;'>Searchable combobox for department selection - combines input + dropdown for better UX</code></td>
                        </tr>
                    </table>
                    <!-- toast Submodule -->
                    <details>
                        <summary><b>toast</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ components.ui.toast</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/toast/ToastProvider.tsx'>ToastProvider.tsx</a></b></td>
                                    <td style='padding: 8px;'>Toast notification provider - manages toast queue and renders toasts with auto-dismiss</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/ui/toast/Toast.tsx'>Toast.tsx</a></b></td>
                                    <td style='padding: 8px;'>Individual toast notification component - supports success, error, warning, info variants with icons</code></td>
                                </tr>
                            </tr>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
            <!-- maps Submodule -->
            <details>
                <summary><b>maps</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ components.maps</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/maps/ReportLocationMap.tsx'>ReportLocationMap.tsx</a></b></td>
                            <td style='padding: 8px;'>Map component for displaying a single report location - used in report detail page</code></td>
                        </tr>
                    </tr>
                    <!-- staff Submodule -->
                    <details>
                        <summary><b>staff</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ components.maps.staff</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/maps/staff/MapControls.tsx'>MapControls.tsx</a></b></td>
                                    <td style='padding: 8px;'>Map control buttons for zoom in/out, locate user, and reset view for staff map</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/maps/staff/MapLegend.tsx'>MapLegend.tsx</a></b></td>
                                    <td style='padding: 8px;'>Legend panel explaining map marker colors and icons for reports, tasks, and offices</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/maps/staff/FeaturePopup.tsx'>FeaturePopup.tsx</a></b></td>
                                    <td style='padding: 8px;'>Popup content component when clicking on map markers - shows feature details and action buttons</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/maps/staff/MapboxMap.tsx'>MapboxMap.tsx</a></b></td>
                                    <td style='padding: 8px;'>Main Mapbox map component for staff portal - loads tiles, handles markers, and manages map state</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/maps/staff/RoutePanel.tsx'>RoutePanel.tsx</a></b></td>
                                    <td style='padding: 8px;'>Panel for route planning - allows staff to get directions from office to task location</code></td>
                                </tr>
                            </tr>
                        </blockquote>
                    </details>
                    <!-- admin Submodule -->
                    <details>
                        <summary><b>admin</b></summary>
                        <blockquote>
                            <div class='directory-path' style='padding: 8px 0; color: #666;'>
                                <code><b>⦿ components.maps.admin</b></code>
                            <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr style='background-color: #f8f9fa;'>
                                    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                                    <th style='text-align: left; padding: 8px;'>Summary</th>
                                </tr>
                            </thead>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/maps/admin/MapControls.tsx'>MapControls.tsx</a></b></td>
                                    <td style='padding: 8px;'>Map control buttons for admin map - includes layer toggles and heatmap controls</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/maps/admin/OfficeMapCard.tsx'>OfficeMapCard.tsx</a></b></td>
                                    <td style='padding: 8px;'>Card component displaying office information when clicked on admin map - shows staff count and contact details</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/maps/admin/ReportMapCard.tsx'>ReportMapCard.tsx</a></b></td>
                                    <td style='padding: 8px;'>Card component displaying report information when clicked on admin map - shows status, category, and quick actions</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/maps/admin/FeatureTabs.tsx'>FeatureTabs.tsx</a></b></td>
                                    <td style='padding: 8px;'>Tab component for switching between report, office, and task layers on admin map</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/maps/admin/MapPopup.ts'>MapPopup.ts</a></b></td>
                                    <td style='padding: 8px;'>Popup component for admin map markers - shows summary info and links to detail pages</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/maps/admin/MapboxMap.tsx'>MapboxMap.tsx</a></b></td>
                                    <td style='padding: 8px;'>Main Mapbox map component for admin portal - supports multiple layers and administrative boundaries</code></td>
                                </tr>
                                <tr style='border-bottom: 1px solid #eee;'>
                                    <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/maps/admin/FilterPanel.tsx'>FilterPanel.tsx</a></b></td>
                                    <td style='padding: 8px;'>Side panel for map filters - allows admin to filter displayed features by type, status, and department</code></td>
                                </tr>
                            </tr>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
            <!-- common Submodule -->
            <details>
                <summary><b>common</b></summary>
                <blockquote>
                    <div class='directory-path' style='padding: 8px 0; color: #666;'>
                        <code><b>⦿ components.common</b></code>
                    <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f8f9fa;'>
                            <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
                            <th style='text-align: left; padding: 8px;'>Summary</th>
                        </tr>
                    </thead>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/common/Breadcrumb.tsx'>Breadcrumb.tsx</a></b></td>
                            <td style='padding: 8px;'>Breadcrumb navigation component - shows current page path and allows quick navigation to parent pages</code></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px;'><b><a href='/app/repo/blob/master/components/common/DarkModeToggle.tsx'>DarkModeToggle.tsx</a></b></td>
                            <td style='padding: 8px;'>Dark mode toggle button - switches between light and dark themes across the application</code></td>
                        </tr>
                    </table>
                </blockquote>
            </details>
        </blockquote>
    </details>
</details>
</details>
</details>

---

## Getting Started

### Prerequisites

This project requires the following dependencies:

- **Runtime:** Node.js 18+ / 20+
- **Package Manager:** npm 9+ or yarn 1.22+
- **Framework:** Next.js 14+ (App Router)
- **Container Runtime:** Docker (optional, for containerized deployment)
- **Browser:** Modern browser with ES6 support
- **Backend API:** Running Urban Management BE service (required for API calls)

### Installation

Build the project from the source and install dependencies:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/CatV2004/smart-city-frontend.git
   ```

2. **Navigate to the project directory:**

   ```sh
   ❯ cd urban-management
   ```

3. **Install the dependencies:**

 <!-- SHIELDS BADGE CURRENTLY DISABLED -->

     <!-- [![docker][docker-shield]][docker-link] -->
     <!-- REFERENCE LINKS -->
     <!-- [docker-shield]: https://img.shields.io/badge/Docker-2CA5E0.svg?style={badge_style}&logo=docker&logoColor=white -->
     <!-- [docker-link]: https://www.docker.com/ -->

     **Using [docker](https://www.docker.com/):**

     ```sh
     # Build the Docker image
     docker build -t urban-management-fe .

     # Run the container
     docker run -p 3000:3000 urban-management-fe
     ```

 <!-- SHIELDS BADGE CURRENTLY DISABLED -->

     <!-- [![npm][npm-shield]][npm-link] -->
     <!-- REFERENCE LINKS -->
     <!-- [npm-shield]: https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white -->
     <!-- [npm-link]: https://www.npmjs.com/ -->

     **Using [npm](https://www.npmjs.com/):**

     ```sh
     # Install dependencies
     npm install

     # Or with yarn
     yarn install
     ```

### Usage

Run the project with:

**Using [docker](https://www.docker.com/):**

```sh
# Run with Docker
docker run -p 3000:3000 urban-management-fe

# Or with Docker Compose
docker-compose up
```

**Using [npm](https://www.npmjs.com/):**

```sh
# Development mode
npm run dev

# Production build and start
npm run build
npm run start
```

**Access the application:**

- Local: `http://localhost:3000`
- API Base URL: `http://localhost:8080/api`

### Testing

The project uses **Vitest** and **React Testing Library** test frameworks. Run the test suite with:

**Using [npm](https://www.npmjs.com/):**

```sh
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test -- features/report/hooks/useReports.test.ts
```

---

## Roadmap

- [x] **Authentication UI**: Login, Register, Forgot Password pages
- [x] **Citizen Dashboard**: Report submission and tracking interface
- [x] **Interactive Map**: Mapbox/Leaflet integration for visualization
- [x] **Staff Portal**: Task list, task details, evidence upload
- [x] **Admin Panel**: User, category, department, office management
- [x] **Real-time Notifications**: WebSocket integration for live updates
- [x] **Responsive Design**: Mobile-friendly layouts
- [x] **Dark Mode**: Theme switching support
- [ ] **PWA Support**: Offline capabilities and installable app
- [ ] **E2E Testing**: Cypress/Playwright test suite
- [ ] **Performance Optimization**: Code splitting and lazy loading
- [ ] **i18n**: Multi-language support (Vietnamese/English)

---

## Contributing

- **💬 [Join the Discussions](https://github.com/CatV2004/smart-city-frontend/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/CatV2004/smart-city-frontend/issues)**: Submit bugs found or log feature requests.
- **💡 [Submit Pull Requests](https://github.com/CatV2004/smart-city-frontend/pulls)**: Review open PRs, and submit your own PRs.

 <details closed>
 <summary>Contributing Guidelines</summary>

1.  **Fork the Repository**: Start by forking the project repository to your GitHub account.
2.  **Clone Locally**: Clone the forked repository to your local machine.
    ```sh
    git clone https://github.com/your-username/smart-city-frontend.git
    ```
3.  **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
    ```sh
    git checkout -b feature/your-feature-name
    ```
4.  **Make Your Changes**: Develop and test your changes locally.
    ```sh
    npm run dev
    npm run test
    npm run type-check
    ```
5.  **Commit Your Changes**: Commit with a clear message following conventional commits.
    ```sh
    git commit -m 'feat: add new feature description'
    git commit -m 'fix: resolve bug in report assignment'
    ```
6.  **Push to GitHub**: Push the changes to your forked repository.
    ```sh
    git push origin feature/your-feature-name
    ```
7.  **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8.  **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

 <details closed>
 <summary>Contributor Graph</summary>
 <br>
 <p align="left">
    <a href="https://github.com/CatV2004/smart-city-frontend/graphs/contributors">
       <img src="https://contrib.rocks/image?repo=CatV2004/smart-city-frontend">
    </a>
 </p>
 </details>

---

## License

This project is protected under the **MIT License**. For more details, refer to the [LICENSE](LICENSE) file.

---

## Acknowledgments

- **Next.js Team** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS / shadcn/ui** - Styling and component library
- **Mapbox / Leaflet** - Interactive map visualization
- **Socket.io / WebSocket** - Real-time communication
- **Axios** - HTTP client for API calls
- **React Hook Form + Zod** - Form validation
- **TanStack React Query** - Data fetching and caching
- **Vitest** - Unit testing framework
- **All Contributors** - Thanks to everyone who has contributed to this project
- **UI Screenshots** - View all interfaces in [`/images-UI`](https://github.com/CatV2004/smart-city-frontend/tree/main/images-UI)

 <div align="right">

[![][back-to-top]](#top)

 </div>

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square

---
