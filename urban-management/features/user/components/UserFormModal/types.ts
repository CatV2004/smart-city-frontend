import { CreateUserRequest } from "../../types";

export interface WizardStep {
  id: number;
  title: string;
  description: string;
  fields: Array<keyof CreateUserRequest>;
  icon?: React.ReactNode;
}

export interface WizardState {
  currentStep: number;
  formData: Partial<CreateUserRequest>;
  isCompleted: boolean;
}

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    title: "Personal Information",
    description: "Basic user details",
    fields: ["fullName", "email", "phoneNumber", "password"],
  },
  {
    id: 2,
    title: "Role & Department",
    description: "User permissions and organization",
    fields: ["roleId", "departmentId"],
  },
  {
    id: 3,
    title: "Office Assignment",
    description: "Work location details",
    fields: ["officeId"],
  },
  {
    id: 4,
    title: "Review & Confirm",
    description: "Verify all information",
    fields: ["fullName", "email", "phoneNumber", "roleId", "departmentId", "officeId"],
  },
];