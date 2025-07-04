"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { CoverLetterFormData } from "@/lib/types"

interface CoverLetterFormProps {
  data: CoverLetterFormData
  onChange: (data: CoverLetterFormData) => void
}

export function CoverLetterForm({ data, onChange }: CoverLetterFormProps) {
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Cover Letter Title</Label>
        <Input
          id="title"
          placeholder="Application for Software Developer at Google"
          value={data.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input
          id="jobTitle"
          placeholder="Senior Software Engineer"
          value={data.promptData.jobTitle}
          onChange={(e) => handleChange("jobTitle", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          placeholder="Google"
          value={data.promptData.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Relevant Skills (comma separated)</Label>
        <Input
          id="skills"
          placeholder="JavaScript, React, Node.js, TypeScript"
          value={data.promptData.skills.join(", ")}
          onChange={(e) => handleChange("skills", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobDescription">Job Description</Label>
        <Textarea
          id="jobDescription"
          placeholder="Paste the job description here or summarize key requirements"
          className="min-h-[80px] max-h-[150px]"
          value={data.promptData.jobDescription}
          onChange={(e) => handleChange("jobDescription", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Relevant Experience</Label>
        <Textarea
          id="experience"
          placeholder="Briefly describe your relevant work experience and achievements"
          className="min-h-[60px] max-h-[120px]"
          value={data.promptData.experience}
          onChange={(e) => handleChange("experience", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
        <Textarea
          id="additionalInfo"
          placeholder="Any other information you'd like to include"
          className="min-h-[60px] max-h-[120px]"
          value={data.promptData.additionalInfo}
          onChange={(e) => handleChange("additionalInfo", e.target.value)}
        />
      </div>
    </div>
  )
}
