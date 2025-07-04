"use client"

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Test Page</h1>
      <p className="mt-4">This is a test page to check if the routing works correctly.</p>
      <div className="mt-8 space-y-4">
        <a href="/dashboard" className="text-blue-500 hover:underline block">Dashboard</a>
        <a href="/resumes" className="text-blue-500 hover:underline block">Resumes</a>
        <a href="/cover-letters" className="text-blue-500 hover:underline block">Cover Letters</a>
        <a href="/linkedin-bios" className="text-blue-500 hover:underline block">LinkedIn Bios</a>
      </div>
    </div>
  )
}
