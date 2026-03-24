// // features/user/components/UserFormModal.tsx

// "use client";

// import { useEffect, useMemo } from "react";
// import { useForm, useWatch } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { CreateUserRequest } from "../types";
// import { useActiveDepartments } from "@/features/department/hooks/useActiveDepartments";
// import { useRoles } from "@/features/role/hooks/useRoles";
// import { useOfficeDepartments } from "@/features/department/hooks/useOfficeDepartments";
// import { Role } from "@/features/role/types";
// import { Department } from "@/features/department/types";
// import { DepartmentOfficeResponse } from "@/features/department/types";
// import { createUserSchema } from "../schemas";
// import { Loader2, Building2, MapPin, AlertCircle } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// interface UserFormModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: CreateUserRequest) => Promise<void>;
//   isLoading?: boolean;
//   error?: string | null;
// }

// export function UserFormModal({
//   isOpen,
//   onClose,
//   onSubmit,
//   isLoading = false,
//   error = null,
// }: UserFormModalProps) {
//   const {
//     data: roles,
//     isLoading: isLoadingRoles,
//     error: rolesError
//   } = useRoles();

//   const {
//     data: departments,
//     isLoading: isLoadingDepartments,
//     error: departmentsError
//   } = useActiveDepartments();

//   const form = useForm<CreateUserRequest>({
//     resolver: zodResolver(createUserSchema),
//     defaultValues: {
//       email: "",
//       phoneNumber: "",
//       password: "",
//       fullName: "",
//       roleId: undefined,
//       departmentId: "",
//       officeId: "",
//     },
//     mode: "onChange", // Validate on change for better UX
//   });

//   const selectedDepartmentId = useWatch({
//     control: form.control,
//     name: "departmentId",
//   });

//   const selectedRoleId = useWatch({
//     control: form.control,
//     name: "roleId",
//   });

//   const {
//     data: officesData,
//     isLoading: isLoadingOffices,
//     isError: isOfficesError,
//     error: officesError,
//     refetch: refetchOffices,
//   } = useOfficeDepartments(selectedDepartmentId || "", {
//     page: 1,
//     size: 100,
//   });

//   const offices = officesData?.content || [];
//   const hasOffices = offices.length > 0;

//   // Reset office selection when department changes
//   useEffect(() => {
//     if (selectedDepartmentId) {
//       form.setValue("officeId", "");
//     }
//   }, [selectedDepartmentId, form]);

//   // Reset form when modal opens/closes with proper cleanup
//   useEffect(() => {
//     if (!isOpen) {
//       const timeoutId = setTimeout(() => {
//         form.reset({
//           email: "",
//           phoneNumber: "",
//           password: "",
//           fullName: "",
//           roleId: undefined,
//           departmentId: "",
//           officeId: "",
//         });
//       }, 100);

//       return () => clearTimeout(timeoutId);
//     }
//   }, [isOpen, form]);

//   const handleSubmit = async (values: CreateUserRequest) => {
//     try {
//       await onSubmit(values);
//       // Only reset on success
//       form.reset();
//     } catch (err) {
//       // Error is handled by parent component via error prop
//       console.error("Form submission error:", err);
//     }
//   };

//   const isLoadingForm = isLoading || isLoadingRoles || isLoadingDepartments;
//   const isSubmitDisabled = isLoadingForm || !form.formState.isValid || isLoading;

//   // Helper functions
//   const getDepartmentName = (departmentId: string) => {
//     return departments?.find((dept: Department) => dept.id === departmentId)?.name;
//   };

//   const getRoleName = (roleId: number) => {
//     return roles?.find((role: Role) => role.id === roleId)?.name;
//   };

//   // Memoized validation messages
//   const validationMessages = useMemo(() => {
//     const messages: string[] = [];
//     if (!form.formState.isValid && form.formState.isSubmitted) {
//       const errors = form.formState.errors;
//       if (errors.fullName) messages.push("Full name is required");
//       if (errors.email) messages.push("Valid email is required");
//       if (errors.phoneNumber) messages.push("Phone number is required");
//       if (errors.password) messages.push("Password must be at least 6 characters");
//       if (errors.roleId) messages.push("Role selection is required");
//       if (errors.departmentId) messages.push("Department selection is required");
//       if (errors.officeId) messages.push("Office selection is required");
//     }
//     return messages;
//   }, [form.formState.errors, form.formState.isValid, form.formState.isSubmitted]);

//   // Show loading state for initial data fetch
//   if (isOpen && (isLoadingRoles || isLoadingDepartments)) {
//     return (
//       <Dialog open={isOpen} onOpenChange={onClose}>
//         <DialogContent className="sm:max-w-[550px]">
//           <div className="flex flex-col items-center justify-center py-12">
//             <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
//             <p className="text-muted-foreground">Loading form data...</p>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
//         <DialogHeader className="px-6 pt-6 pb-4 border-b">
//           <DialogTitle className="text-xl">Create New User</DialogTitle>
//           <DialogDescription>
//             Add a new user to the system. They will receive a welcome email with their credentials.
//           </DialogDescription>
//         </DialogHeader>

//         {/* Global error alert */}
//         {error && (
//           <div className="px-6 pt-4">
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           </div>
//         )}

//         {/* Data fetch errors */}
//         {(rolesError || departmentsError) && (
//           <div className="px-6 pt-4">
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>
//                 Failed to load required data. Please refresh the page or try again later.
//               </AlertDescription>
//             </Alert>
//           </div>
//         )}

//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(handleSubmit)}
//             className="space-y-5 px-6 pb-6"
//           >
//             {/* Full Name */}
//             <FormField
//               control={form.control}
//               name="fullName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="flex items-center gap-1">
//                     Full Name <span className="text-destructive">*</span>
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="e.g., John Doe"
//                       {...field}
//                       disabled={isLoadingForm}
//                       autoComplete="name"
//                       className="transition-all focus:ring-2"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Email */}
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="flex items-center gap-1">
//                     Email <span className="text-destructive">*</span>
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       type="email"
//                       placeholder="user@example.com"
//                       {...field}
//                       disabled={isLoadingForm}
//                       autoComplete="email"
//                       className="transition-all focus:ring-2"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Phone Number */}
//             <FormField
//               control={form.control}
//               name="phoneNumber"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="flex items-center gap-1">
//                     Phone Number <span className="text-destructive">*</span>
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="e.g., 0912345678"
//                       {...field}
//                       disabled={isLoadingForm}
//                       autoComplete="tel"
//                       className="transition-all focus:ring-2"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Password */}
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="flex items-center gap-1">
//                     Password <span className="text-destructive">*</span>
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       type="password"
//                       placeholder="Minimum 6 characters"
//                       {...field}
//                       disabled={isLoadingForm}
//                       autoComplete="new-password"
//                       className="transition-all focus:ring-2"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Role */}
//             <FormField
//               control={form.control}
//               name="roleId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="flex items-center gap-1">
//                     Role <span className="text-destructive">*</span>
//                   </FormLabel>
//                   <Select
//                     onValueChange={(value) => field.onChange(parseInt(value))}
//                     value={field.value?.toString()}
//                     disabled={isLoadingForm || !roles?.length}
//                   >
//                     <FormControl>
//                       <SelectTrigger className="transition-all focus:ring-2">
//                         <SelectValue placeholder="Select a role" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {roles?.map((role: Role) => (
//                         <SelectItem key={role.id} value={role.id.toString()}>
//                           {role.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {!roles?.length && !isLoadingRoles && (
//                     <p className="text-xs text-amber-600 mt-1">
//                       No roles available. Please create roles first.
//                     </p>
//                   )}
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Department */}
//             <FormField
//               control={form.control}
//               name="departmentId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="flex items-center gap-1">
//                     Department <span className="text-destructive">*</span>
//                   </FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     value={field.value}
//                     disabled={isLoadingForm || !departments?.length}
//                   >
//                     <FormControl>
//                       <SelectTrigger className="transition-all focus:ring-2">
//                         <SelectValue placeholder="Select a department" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {departments?.map((dept: Department) => (
//                         <SelectItem key={dept.id} value={dept.id}>
//                           <div className="flex items-center gap-2">
//                             <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
//                             <span className="truncate">
//                               {dept.name} ({dept.code})
//                             </span>
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {!departments?.length && !isLoadingDepartments && (
//                     <p className="text-xs text-amber-600 mt-1">
//                       No departments available. Please create departments first.
//                     </p>
//                   )}
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Office - Dynamic based on selected department */}
//             <FormField
//               control={form.control}
//               name="officeId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="flex items-center gap-1">
//                     Office <span className="text-destructive">*</span>
//                   </FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     value={field.value}
//                     disabled={
//                       isLoadingForm ||
//                       !selectedDepartmentId ||
//                       isLoadingOffices ||
//                       !hasOffices
//                     }
//                   >
//                     <FormControl>
//                       <SelectTrigger className="transition-all focus:ring-2">
//                         <SelectValue>
//                           {!selectedDepartmentId ? (
//                             "Select a department first"
//                           ) : isLoadingOffices ? (
//                             <div className="flex items-center gap-2">
//                               <Loader2 className="h-4 w-4 animate-spin" />
//                               <span>Loading offices...</span>
//                             </div>
//                           ) : !hasOffices ? (
//                             "No offices available"
//                           ) : (
//                             <SelectValue placeholder="Select an office" />
//                           )}
//                         </SelectValue>
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {offices.map((office: DepartmentOfficeResponse) => (
//                         <SelectItem key={office.id} value={office.id}>
//                           <div className="flex items-start gap-2">
//                             <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
//                             <div className="flex flex-col min-w-0">
//                               <span className="truncate">{office.name}</span>
//                               {office.address && (
//                                 <span className="text-xs text-muted-foreground truncate">
//                                   {office.address}
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>

//                   {/* Contextual help messages */}
//                   {!selectedDepartmentId && (
//                     <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
//                       <AlertCircle className="h-3 w-3" />
//                       Select a department first to see available offices
//                     </p>
//                   )}

//                   {selectedDepartmentId && !hasOffices && !isLoadingOffices && (
//                     <Alert className="mt-2 bg-amber-50 border-amber-200">
//                       <AlertCircle className="h-4 w-4 text-amber-600" />
//                       <AlertDescription className="text-amber-800 text-xs">
//                         No offices found for {getDepartmentName(selectedDepartmentId)}.
//                         Please create an office for this department first.
//                       </AlertDescription>
//                     </Alert>
//                   )}

//                   {isOfficesError && (
//                     <Alert variant="destructive" className="mt-2">
//                       <AlertCircle className="h-4 w-4" />
//                       <AlertDescription className="flex items-center justify-between">
//                         <span>Failed to load offices: {officesError?.message || "Unknown error"}</span>
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => refetchOffices()}
//                           className="h-auto px-2 py-1 text-xs"
//                         >
//                           Retry
//                         </Button>
//                       </AlertDescription>
//                     </Alert>
//                   )}
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Selected information summary */}
//             {(selectedDepartmentId || selectedRoleId) && (
//               <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
//                 <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Summary
//                 </p>
//                 {selectedRoleId && (
//                   <p className="text-sm">
//                     <span className="font-medium">Role:</span> {getRoleName(selectedRoleId)}
//                   </p>
//                 )}
//                 {selectedDepartmentId && (
//                   <>
//                     <p className="text-sm">
//                       <span className="font-medium">Department:</span> {getDepartmentName(selectedDepartmentId)}
//                     </p>
//                     {form.watch("officeId") && (
//                       <p className="text-sm">
//                         <span className="font-medium">Office:</span>{" "}
//                         {offices.find(o => o.id === form.watch("officeId"))?.name}
//                       </p>
//                     )}
//                   </>
//                 )}
//               </div>
//             )}

//             {/* Validation errors summary */}
//             {validationMessages.length > 0 && form.formState.isSubmitted && (
//               <Alert variant="destructive" className="mt-2">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>
//                   <p className="font-medium mb-1">Please fix the following:</p>
//                   <ul className="list-disc list-inside text-xs space-y-0.5">
//                     {validationMessages.map((msg, idx) => (
//                       <li key={idx}>{msg}</li>
//                     ))}
//                   </ul>
//                 </AlertDescription>
//               </Alert>
//             )}

//             {/* Action Buttons */}
//             <div className="flex gap-3 justify-end pt-4 border-t mt-6">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={onClose}
//                 disabled={isLoading}
//                 className="min-w-[100px]"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={isSubmitDisabled}
//                 className="min-w-[120px]"
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Creating...
//                   </>
//                 ) : (
//                   "Create User"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
// features/user/components/UserFormModal.tsx

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm, useWatch, FormProvider } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { CreateUserRequest } from "../types";
import { useActiveDepartments } from "@/features/department/hooks/useActiveDepartments";
import { useRoles } from "@/features/role/hooks/useRoles";
import { useOfficeDepartments } from "@/features/department/hooks/useOfficeDepartments";
import { createUserSchema } from "../schemas";

import { StepIndicator } from "./UserFormModal/StepIndicator";
import { StepPersonalInfo } from "./UserFormModal/StepPersonalInfo";
import { StepRoleDepartment } from "./UserFormModal/StepRoleDepartment";
import { StepOffice } from "./UserFormModal/StepOffice";
import { StepReview } from "./UserFormModal/StepReview";
import { WIZARD_STEPS, WizardState } from "./UserFormModal/types";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserRequest) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const WIZARD_STORAGE_KEY = "user_creation_wizard_state";

export function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  error = null,
}: UserFormModalProps) {
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 1,
    formData: {},
    isCompleted: false,
  });
  
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Load saved state from localStorage when modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const savedState = localStorage.getItem(WIZARD_STORAGE_KEY);
        if (savedState) {
          const parsed = JSON.parse(savedState);
          setWizardState(parsed);
          setCompletedSteps(Array.from({ length: parsed.currentStep - 1 }, (_, i) => i + 1));
        }
      } catch (error) {
        console.error("Failed to load wizard state:", error);
      }
    }
  }, [isOpen]);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (isOpen && wizardState.formData && Object.keys(wizardState.formData).length > 0) {
      try {
        localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(wizardState));
      } catch (error) {
        console.error("Failed to save wizard state:", error);
      }
    }
  }, [wizardState, isOpen]);

  const { data: roles, isLoading: isLoadingRoles, error: rolesError } = useRoles();
  const { data: departments, isLoading: isLoadingDepartments, error: departmentsError } =
    useActiveDepartments();

  const form = useForm<CreateUserRequest>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      phoneNumber: "",
      password: "",
      fullName: "",
      roleId: undefined,
      departmentId: "",
      officeId: "",
      ...wizardState.formData,
    },
    mode: "onChange",
  });

  const selectedDepartmentId = useWatch({
    control: form.control,
    name: "departmentId",
  });

  const {
    data: officesData,
    isLoading: isLoadingOffices,
    isError: isOfficesError,
    error: officesError,
    refetch: refetchOffices,
  } = useOfficeDepartments(selectedDepartmentId || "", {
    page: 1,
    size: 100,
  });

  const offices = officesData?.content || [];

  // Save form data to wizard state whenever form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      setWizardState((prev) => ({
        ...prev,
        formData: value as Partial<CreateUserRequest>,
      }));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const currentStepConfig = WIZARD_STEPS.find((step) => step.id === wizardState.currentStep);

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    if (!currentStepConfig) return false;

    const fields = currentStepConfig.fields;
    const result = await form.trigger(fields as any);
    
    if (result) {
      if (!completedSteps.includes(wizardState.currentStep)) {
        setCompletedSteps([...completedSteps, wizardState.currentStep]);
      }
    }
    
    return result;
  }, [form, currentStepConfig, wizardState.currentStep, completedSteps]);

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    
    if (isValid && wizardState.currentStep < WIZARD_STEPS.length) {
      setWizardState((prev) => ({
        ...prev,
        currentStep: prev.currentStep + 1,
      }));
    }
  };

  const handleBack = () => {
    if (wizardState.currentStep > 1) {
      setWizardState((prev) => ({
        ...prev,
        currentStep: prev.currentStep - 1,
      }));
    }
  };

  const handleSubmit = async () => {
    if (wizardState.currentStep === WIZARD_STEPS.length) {
      const isValid = await form.trigger();
      if (isValid) {
        const values = form.getValues();
        try {
          await onSubmit(values);
          localStorage.removeItem(WIZARD_STORAGE_KEY);
          setWizardState({
            currentStep: 1,
            formData: {},
            isCompleted: false,
          });
          setCompletedSteps([]);
          form.reset();
        } catch (err) {
          console.error("Submission error:", err);
        }
      }
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all form data?")) {
      localStorage.removeItem(WIZARD_STORAGE_KEY);
      setWizardState({
        currentStep: 1,
        formData: {},
        isCompleted: false,
      });
      setCompletedSteps([]);
      form.reset({
        email: "",
        phoneNumber: "",
        password: "",
        fullName: "",
        roleId: undefined,
        departmentId: "",
        officeId: "",
      });
    }
  };

  const getDepartmentName = (id: string) => {
    return departments?.find((dept) => dept.id === id)?.name || "";
  };

  const getRoleName = (id: number) => {
    return roles?.find((role) => role.id === id)?.name || "";
  };

  const isLoadingForm = isLoading || isLoadingRoles || isLoadingDepartments;

  if (isOpen && (isLoadingRoles || isLoadingDepartments)) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading form data...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl">
            Create New User - Step {wizardState.currentStep} of {WIZARD_STEPS.length}
          </DialogTitle>
          <DialogDescription>
            {currentStepConfig?.description || "Fill in the required information"}
          </DialogDescription>
        </DialogHeader>

        <StepIndicator
          steps={WIZARD_STEPS.map((step) => ({ id: step.id, title: step.title }))}
          currentStep={wizardState.currentStep}
          completedSteps={completedSteps}
        />

        {(error || rolesError || departmentsError) && (
          <div className="px-6 pt-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "Failed to load required data. Please try again."}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Wrap everything with FormProvider */}
        <FormProvider {...form}>
          <div className="px-6 py-6">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* Step Content */}
              {wizardState.currentStep === 1 && (
                <StepPersonalInfo isLoading={isLoadingForm} />
              )}
              
              {wizardState.currentStep === 2 && (
                <StepRoleDepartment
                  roles={roles}
                  departments={departments}
                  isLoading={isLoadingForm}
                  isLoadingRoles={isLoadingRoles}
                  isLoadingDepartments={isLoadingDepartments}
                />
              )}
              
              {wizardState.currentStep === 3 && (
                <StepOffice
                  selectedDepartmentId={selectedDepartmentId || ""}
                  offices={offices}
                  isLoadingOffices={isLoadingOffices}
                  isOfficesError={isOfficesError}
                  refetchOffices={refetchOffices}
                  isLoading={isLoadingForm}
                  getDepartmentName={getDepartmentName}
                />
              )}
              
              {wizardState.currentStep === 4 && (
                <StepReview
                  roles={roles}
                  departments={departments}
                  offices={offices}
                  getDepartmentName={getDepartmentName}
                  getRoleName={getRoleName}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 justify-between pt-4 border-t mt-6">
                <div className="flex gap-2">
                  {wizardState.currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={isLoading}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  )}
                  
                  {Object.keys(wizardState.formData).length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      disabled={isLoading}
                      className="text-muted-foreground"
                    >
                      Reset
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  
                  {wizardState.currentStep < WIZARD_STEPS.length ? (
                    <Button type="button" onClick={handleNext} disabled={isLoadingForm}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading || !form.formState.isValid}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Create User
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}