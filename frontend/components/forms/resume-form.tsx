"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ResumeFormData } from "@/lib/types"

interface ResumeFormProps {
  data: ResumeFormData
  onChange: (data: ResumeFormData) => void
}

export function ResumeForm({ data, onChange }: ResumeFormProps) {
  const handleChange = (field: string, value: string) => {
    if (field === "title") {
      onChange({ ...data, title: value })
    } else if (field === "skills") {
      onChange({
        ...data,
        promptData: {
          ...data.promptData,
          skills: value.split(",").map((skill) => skill.trim()),
        },
      })
    } else {
      onChange({
        ...data,
        promptData: {
          ...data.promptData,
          [field]: value,
        },
      })
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Resume Title</Label>
        <Input
          id="title"
          placeholder="Software Developer Resume"
          value={data.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="text-base sm:text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitle">Target Job Title</Label>
        <Input
          id="jobTitle"
          placeholder="Senior Software Engineer"
          value={data.promptData.jobTitle}
          onChange={(e) => handleChange("jobTitle", e.target.value)}
          className="text-base sm:text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma separated)</Label>
        <Input
          id="skills"
          placeholder="JavaScript, React, Node.js, TypeScript"
          value={data.promptData.skills.join(", ")}
          onChange={(e) => handleChange("skills", e.target.value)}
          className="text-base sm:text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Professional Experience</Label>
        <Textarea
          id="experience"
          placeholder="Briefly describe your work experience, achievements, and responsibilities"
          className="min-h-[100px] max-h-[200px] text-base sm:text-sm"
          value={data.promptData.experience}
          onChange={(e) => handleChange("experience", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="education">Education</Label>
        <Textarea
          id="education"
          placeholder="List your educational background, degrees, certifications"
          className="min-h-[80px] max-h-[150px] text-base sm:text-sm"
          value={data.promptData.education}
          onChange={(e) => handleChange("education", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
        <Textarea
          id="additionalInfo"
          placeholder="Any other information you'd like to include"
          className="min-h-[80px] max-h-[150px] text-base sm:text-sm"
          value={data.promptData.additionalInfo}
          onChange={(e) => handleChange("additionalInfo", e.target.value)}
        />
      </div>
    </div>
  )
}
