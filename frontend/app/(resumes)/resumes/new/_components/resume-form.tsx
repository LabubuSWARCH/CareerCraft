"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useResumeForm as useNewResumeForm } from "../_providers/resume-form-provider";
import { useEditResumeForm } from "../../[resumeId]/_providers/edit-resume-form-provider";
import { SubmitErrorHandler, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Check, AlertCircle, Download } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { usePDF } from "react-to-pdf";
import { ExperienceFields } from "./experience-fields";
import { EducationFields } from "./education-fields";
import { ProjectFields } from "./project-fields";
import { ResumeFormData } from "../_schema";

const SUCCESS_DISPLAY_TIME = 1;
const ERROR_DISPLAY_TIME = 1;

const textTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

const iconTransition = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
  transition: { duration: 0.3 },
};

type FormSection =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "projects"
  | "skills";

const FORM_SECTIONS: { id: FormSection; label: string }[] = [
  { id: "personal", label: "Personal" },
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
];

const createEmptyExperience = () => ({
  id: crypto.randomUUID(),
  company: "",
  role: "",
  start: "",
  end: "Now",
  bullets: [],
});

const createEmptyEducation = () => ({
  id: crypto.randomUUID(),
  school: "",
  degree: "",
  start: "",
  end: "Now",
  details: "",
});

const createEmptyProject = () => ({
  id: crypto.randomUUID(),
  name: "",
  description: "",
  link: "",
});

function useResumeFormHook() {
  try {
    return { ...useNewResumeForm(), isEditMode: false };
  } catch {
    return { ...useEditResumeForm(), isEditMode: true };
  }
}

export function ResumeForm() {
  const { form, onSubmit, isEditMode } = useResumeFormHook();
  const [activeSection, setActiveSection] = useState<FormSection>("personal");
  const [showWebsite, setShowWebsite] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showPdfSuccess, setShowPdfSuccess] = useState(false);
  const [showPdfError, setShowPdfError] = useState(false);

  const { toPDF, targetRef } = usePDF({
    filename: `${form.getValues("resumeTitle") || "resume"}.pdf`,
  });

  const onInvalid: SubmitErrorHandler<ResumeFormData> = (errors) => {
    if (errors.resumeTitle) {
      return;
    }

    if (
      errors.name ||
      errors.title ||
      errors.email ||
      errors.phone ||
      errors.location
    ) {
      setActiveSection("personal");
    } else if (errors.summary) {
      setActiveSection("summary");
    } else if (errors.experience) {
      setActiveSection("experience");
    } else if (errors.education) {
      setActiveSection("education");
    } else if (errors.projects) {
      setActiveSection("projects");
    } else if (errors.skills) {
      setActiveSection("skills");
    }
  };

  const handleSubmit = async (data: ResumeFormData) => {
    try {
      await onSubmit(data);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, SUCCESS_DISPLAY_TIME * 1000);
    } catch (error) {
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, ERROR_DISPLAY_TIME * 1000);

      form.setError("root", {
        message: (error as Error).message,
      });
    }
  };

  const handleExportPDF = () => {
    try {
      // Find the template preview element
      const previewElement = document.querySelector("[data-resume-preview]");

      if (!previewElement) {
        throw new Error("Preview not found");
      }

      // Temporarily set the targetRef to the preview element
      (targetRef as any).current = previewElement;

      toPDF();
      setShowPdfSuccess(true);

      setTimeout(() => {
        setShowPdfSuccess(false);
      }, SUCCESS_DISPLAY_TIME * 1000);
    } catch (error) {
      setShowPdfError(true);

      setTimeout(() => {
        setShowPdfError(false);
      }, ERROR_DISPLAY_TIME * 1000);
    }
  };

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  const skills = form.watch("skills") || [];

  const skillsManager = {
    add: () => {
      const currentSkills = form.getValues("skills") || [];
      form.setValue("skills", [...currentSkills, ""], {
        shouldValidate: true,
      });
    },
    remove: (index: number) => {
      const currentSkills = form.getValues("skills") || [];
      form.setValue(
        "skills",
        currentSkills.filter((_skill: string, i: number) => i !== index),
        { shouldValidate: true }
      );
    },
    update: (index: number, value: string) => {
      const currentSkills = form.getValues("skills") || [];
      const newSkills = [...currentSkills];
      newSkills[index] = value;
      form.setValue("skills", newSkills, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
  };

  const handleWebsiteToggle = (checked: boolean) => {
    setShowWebsite(checked);
  };

  const renderPersonalSection = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Personal Information</h2>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormDescription>
              This is your full name as you would like it to appear on your
              resume.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Software Engineer" {...field} />
            </FormControl>
            <FormDescription>
              Your professional title or the position you are applying for.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="john.doe@example.com"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input placeholder="+1 (555) 123-4567" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="New York, NY" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex items-center gap-2">
        <Switch checked={showWebsite} onCheckedChange={handleWebsiteToggle} />
        <Label
          className="cursor-pointer"
          onClick={() => handleWebsiteToggle(!showWebsite)}
        >
          Add website (Optional)
        </Label>
      </div>

      {showWebsite && (
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );

  const renderSummarySection = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Summary</h2>

      <FormField
        control={form.control}
        name="summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Summary (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="A brief overview of your professional background and goals..."
                className="min-h-[200px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderExperienceSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Experience</h2>
        <Button
          type="button"
          onClick={() => appendExperience(createEmptyExperience())}
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {experienceFields.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No experience added yet. Click "Add Experience" to get started.
          </p>
        ) : (
          experienceFields.map((field, index) => (
            <ExperienceFields
              key={field.id}
              control={form.control}
              index={index}
              onRemove={() => removeExperience(index)}
            />
          ))
        )}
      </div>
    </div>
  );

  const renderEducationSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Education</h2>
        <Button
          type="button"
          onClick={() => appendEducation(createEmptyEducation())}
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {educationFields.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No education added yet. Click "Add Education" to get started.
          </p>
        ) : (
          educationFields.map((field, index) => (
            <EducationFields
              key={field.id}
              control={form.control}
              index={index}
              onRemove={() => removeEducation(index)}
            />
          ))
        )}
      </div>
    </div>
  );

  const renderProjectsSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Projects</h2>
          <FormField
            control={form.control}
            name="showProjects"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormLabel className="mb-0">Show on resume</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button
          type="button"
          onClick={() => appendProject(createEmptyProject())}
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {projectFields.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No projects added yet. Click "Add Project" to get started.
          </p>
        ) : (
          projectFields.map((field, index) => (
            <ProjectFields
              key={field.id}
              control={form.control}
              index={index}
              onRemove={() => removeProject(index)}
            />
          ))
        )}
      </div>
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Skills</h2>
        <Button type="button" onClick={skillsManager.add} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {skills.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No skills added yet. Click "Add Skill" to get started.
          </p>
        ) : (
          skills.map((skill: string, index: number) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="e.g., JavaScript, React, Node.js"
                  value={skill}
                  onChange={(e) => skillsManager.update(index, e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => skillsManager.remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case "personal":
        return renderPersonalSection();
      case "summary":
        return renderSummarySection();
      case "experience":
        return renderExperienceSection();
      case "education":
        return renderEducationSection();
      case "projects":
        return renderProjectsSection();
      case "skills":
        return renderSkillsSection();
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit, onInvalid)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="resumeTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Software Engineer Resume 2025"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Give your resume a descriptive title to help you identify it
                  later.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="sticky top-0 z-10 bg-background pb-4">
            <ButtonGroup className="w-full flex-wrap">
              {FORM_SECTIONS.map((section) => (
                <Button
                  key={section.id}
                  type="button"
                  variant={activeSection === section.id ? "default" : "outline"}
                  onClick={() => setActiveSection(section.id)}
                  className="flex-1"
                >
                  {section.label}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          <div key={activeSection}>{renderActiveSection()}</div>

          <motion.div
            className="w-full"
            animate={{
              scale: showSuccess || showError ? [1, 1.02, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <Button
              className={cn(
                "w-full",
                showSuccess && "bg-green-600",
                showError && "bg-red-600"
              )}
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting || showSuccess || showError}
            >
              <AnimatePresence mode="wait">
                {form.formState.isSubmitting ? (
                  <motion.div
                    key="saving"
                    {...textTransition}
                    className="flex items-center gap-2"
                  >
                    <Spinner /> Saving Resume...
                  </motion.div>
                ) : showSuccess ? (
                  <motion.div
                    key="success"
                    {...iconTransition}
                    className="flex items-center gap-2"
                  >
                    <Check className="size-5" />
                    Resume Saved!
                  </motion.div>
                ) : showError ? (
                  <motion.div
                    key="error"
                    {...iconTransition}
                    className="flex items-center gap-2"
                  >
                    <AlertCircle className="size-5" />
                    Save Failed!
                  </motion.div>
                ) : (
                  <motion.div key="ready" {...textTransition}>
                    Save Resume
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          {isEditMode && (
            <motion.div
              className="w-full"
              animate={{
                scale: showPdfSuccess || showPdfError ? [1, 1.02, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Button
                className={cn(
                  "w-full",
                  showPdfSuccess && "bg-green-600",
                  showPdfError && "bg-red-600"
                )}
                type="button"
                size="lg"
                variant="outline"
                disabled={showPdfSuccess || showPdfError}
                onClick={handleExportPDF}
              >
                <AnimatePresence mode="wait">
                  {showPdfSuccess ? (
                    <motion.div
                      key="pdf-success"
                      {...iconTransition}
                      className="flex items-center gap-2"
                    >
                      <Check className="size-5" />
                      PDF Exported!
                    </motion.div>
                  ) : showPdfError ? (
                    <motion.div
                      key="pdf-error"
                      {...iconTransition}
                      className="flex items-center gap-2"
                    >
                      <AlertCircle className="size-5" />
                      Export Failed!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="pdf-ready"
                      {...textTransition}
                      className="flex items-center gap-2"
                    >
                      <Download className="size-4" />
                      Export to PDF
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          )}
        </form>
      </Form>
    </div>
  );
}
