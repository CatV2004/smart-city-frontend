"use client";

import { useFormContext } from "react-hook-form";
import { CreateUserRequest } from "../../types";
import { Role } from "@/features/role/types";
import { Department } from "@/features/department/types";
import { DepartmentOfficeResponse } from "@/features/department/types";
import { CheckCircle2, User, Mail, Phone, Key, Shield, Building2, MapPin } from "lucide-react";

interface StepReviewProps {
  roles?: Role[];
  departments?: Department[];
  offices: DepartmentOfficeResponse[];
  getDepartmentName: (id: string) => string;
  getRoleName: (id: number) => string;
}

export function StepReview({
  roles,
  departments,
  offices,
  getDepartmentName,
  getRoleName,
}: StepReviewProps) {
  const { getValues } = useFormContext<CreateUserRequest>();
  const values = getValues();
  const selectedOffice = offices.find(o => o.id === values.officeId);

  const reviewSections = [
    {
      title: "Personal Information",
      icon: <User className="h-4 w-4" />,
      items: [
        { label: "Full Name", value: values.fullName, key: "fullName" },
        { label: "Email", value: values.email, key: "email" },
        { label: "Phone Number", value: values.phoneNumber, key: "phoneNumber" },
        { label: "Password", value: "••••••••", key: "password" },
      ],
    },
    {
      title: "Role & Department",
      icon: <Shield className="h-4 w-4" />,
      items: [
        { label: "Role", value: getRoleName(values.roleId!), key: "roleId" },
        { label: "Department", value: getDepartmentName(values.departmentId!), key: "departmentId" },
      ],
    },
    {
      title: "Office Assignment",
      icon: <MapPin className="h-4 w-4" />,
      items: [
        { label: "Office", value: selectedOffice?.name, key: "officeId" },
        { label: "Address", value: selectedOffice?.address, key: "address" },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <div className="flex items-center gap-2 text-primary mb-2">
          <CheckCircle2 className="h-5 w-5" />
          <p className="text-sm font-medium">Please review all information before submitting</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Make sure all details are correct. You can go back to previous steps to make changes.
        </p>
      </div>

      {reviewSections.map((section, idx) => (
        <div key={idx} className="border rounded-lg overflow-hidden">
          <div className="bg-muted/30 px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              {section.icon}
              <h3 className="font-medium text-sm">{section.title}</h3>
            </div>
          </div>
          <div className="divide-y">
            {section.items.map((item, itemIdx) => (
              item.value && (
                <div key={itemIdx} className="px-4 py-3">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-sm font-medium break-words">{item.value}</p>
                </div>
              )
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}