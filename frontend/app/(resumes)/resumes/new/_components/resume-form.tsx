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
import { useResumeForm } from "../_providers/resume-form-provider";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ExperienceFields } from "./experience-fields";
import { EducationFields } from "./education-fields";
import { ProjectFields } from "./project-fields";

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

export function ResumeForm() {
  const { form, onSubmit } = useResumeForm();
  const [activeSection, setActiveSection] = useState<FormSection>("personal");
  const [showWebsite, setShowWebsite] = useState(false);

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
        currentSkills.filter((_, i) => i !== index),
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
    if (!checked) {
      form.setValue("website", "");
    }
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
              <FormItem className="flex items-center gap-2">
                <FormLabel className="!mb-0">Show on resume</FormLabel>
                <FormControl className="!mb-0">
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
          skills.map((skill, index) => (
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {renderActiveSection()}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            Save Resume
          </Button>
        </form>
      </Form>
    </div>
  );
}
