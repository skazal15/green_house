"use client";

import { useState } from 'react';

const ApplyPage = () => {
  const [step, setStep] = useState(1);
  const [candidateData, setCandidateData] = useState({
    first_name: '',
    last_name: '',
    email_addresses: [{ value: '', type: 'personal' }],
    phone_numbers: [{ value: '', type: 'mobile' }],
    applications: [{ job_id: 215725 }], // Ganti dengan ID pekerjaan yang sesuai
  });
  const [resume, setResume] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleCandidateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/submit-candidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidateData),
      });

      const result = await response.json();
      if (response.ok) {
        setStep(2);
        setMessage('Candidate information submitted successfully. Please upload your resume.');
      } else {
        setMessage(result.error || 'Failed to submit candidate information.');
      }
    } catch (error) {
      console.error('Error submitting candidate:', error);
      setMessage('An error occurred while submitting candidate information.');
    }
  };

  const handleResumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) {
      setMessage('Please select a resume file.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resume);

    try {
      const response = await fetch('/api/submit-attachment', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Application submitted successfully!');
      } else {
        setMessage(result.error || 'Failed to submit resume.');
      }
    } catch (error) {
      console.error('Error submitting resume:', error);
      setMessage('An error occurred while submitting the resume.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f9] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#15372c]">
            Apply for the Job
          </h2>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          {step === 1 && (
            <form onSubmit={handleCandidateSubmit} className="space-y-6">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-[#15372c]">
                  First Name
                </label>
                <input
                  id="first_name"
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#00b2a9] focus:border-[#00b2a9]"
                  value={candidateData.first_name}
                  onChange={(e) => setCandidateData({ ...candidateData, first_name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Last Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={candidateData.last_name}
                  onChange={(e) => setCandidateData({ ...candidateData, last_name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={candidateData.email_addresses[0].value}
                  onChange={(e) => setCandidateData({
                    ...candidateData,
                    email_addresses: [{ ...candidateData.email_addresses[0], value: e.target.value }]
                  })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={candidateData.phone_numbers[0].value}
                  onChange={(e) => setCandidateData({
                    ...candidateData,
                    phone_numbers: [{ ...candidateData.phone_numbers[0], value: e.target.value }]
                  })}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00b2a9] hover:bg-[#008c84] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b2a9]"
              >
                Next
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResumeSubmit} className="space-y-6">
              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-[#15372c]">
                  Resume
                </label>
                <input
                  id="resume"
                  type="file"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#00b2a9] focus:border-[#00b2a9]"
                  onChange={(e) => setResume(e.target.files?.[0] || null)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00b2a9] hover:bg-[#008c84] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b2a9]"
              >
                Submit Application
              </button>
            </form>
          )}

          {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;
