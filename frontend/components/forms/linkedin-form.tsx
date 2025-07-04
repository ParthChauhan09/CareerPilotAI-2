"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { LinkedInBioFormData } from "@/lib/types"

interface LinkedInFormProps {
  data: LinkedInBioFormData
  onChange: (data: LinkedInBioFormData) => void
}

export function LinkedInForm({ data, onChange }: LinkedInFormProps) {
  const handleProfileChange = (field: string, value: string) => {
    onChange({
      ...data,
      profile: {
        ...data.profile,
        [field]: value,
      },
    })
  }

  const handleExperienceChange = (field: string, value: string) => {
    onChange({
      ...data,
      experience: {
        ...data.experience,
        [field]: value,
      },
    })
  }

  const handlePreferencesChange = (field: string, value: string) => {
    onChange({
      ...data,
      preferences: {
        ...data.preferences,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">LinkedIn Bio Title</Label>
        <Input
          id="title"
          placeholder="Professional LinkedIn Profile"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Profile Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="John"
              value={data.profile.firstName}
              onChange={(e) => handleProfileChange("firstName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={data.profile.lastName}
              onChange={(e) => handleProfileChange("lastName", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="headline">Headline</Label>
        <Input
          id="headline"
          placeholder="Senior Software Engineer | React Expert | Tech Lead"
          value={data.profile.headline}
          onChange={(e) => handleProfileChange("headline", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="San Francisco, CA"
            value={data.profile.location}
            onChange={(e) => handleProfileChange("location", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            placeholder="Technology"
            value={data.profile.industry}
            onChange={(e) => handleProfileChange("industry", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentPosition">Current Position</Label>
        <Input
          id="currentPosition"
          placeholder="Senior Developer at Tech Co"
          value={data.profile.currentPosition}
          onChange={(e) => handleProfileChange("currentPosition", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Experience</h3>
        <div className="space-y-2">
          <Label htmlFor="skills">Skills</Label>
          <Input
            id="skills"
            placeholder="JavaScript, React, Node.js, Leadership"
            value={data.experience.skills}
            onChange={(e) => handleExperienceChange("skills", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="professionalExperience">Professional Experience</Label>
        <Textarea
          id="professionalExperience"
          placeholder="Summarize your professional experience, achievements, and expertise"
          className="min-h-[80px] max-h-[150px]"
          value={data.experience.professionalExperience}
          onChange={(e) => handleExperienceChange("professionalExperience", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="education">Education</Label>
        <Textarea
          id="education"
          placeholder="List your educational background, degrees, certifications"
          className="min-h-[60px] max-h-[120px]"
          value={data.experience.education}
          onChange={(e) => handleExperienceChange("education", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="certifications">Certifications</Label>
        <Input
          id="certifications"
          placeholder="AWS Certified Developer, Google Cloud Professional"
          value={data.experience.certifications}
          onChange={(e) => handleExperienceChange("certifications", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Preferences</h3>
        <div className="space-y-2">
          <Label htmlFor="tone">Tone</Label>
          <Select value={data.preferences.tone} onValueChange={(value) => handlePreferencesChange("tone", value)}>
            <SelectTrigger id="tone">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetRole">Target Role</Label>
        <Input
          id="targetRole"
          placeholder="Senior Software Engineer"
          value={data.preferences.targetRole}
          onChange={(e) => handlePreferencesChange("targetRole", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="focusPoints">Focus Points</Label>
        <Input
          id="focusPoints"
          placeholder="Leadership, technical expertise"
          value={data.preferences.focusPoints}
          onChange={(e) => handlePreferencesChange("focusPoints", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="keywords">Keywords</Label>
        <Input
          id="keywords"
          placeholder="software engineering, leadership, architecture"
          value={data.preferences.keywords}
          onChange={(e) => handlePreferencesChange("keywords", e.target.value)}
        />
      </div>
    </div>
  )
}
