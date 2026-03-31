"use client";

import { useState, useEffect, useCallback } from "react";
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
import { useOfficeDepartments } from "@/features/office/hooks/useOfficeDepartments";
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