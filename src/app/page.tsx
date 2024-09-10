"use client";

import { useEffect, useState } from 'react';
import Pagination from '../components/pagination';
import Link from 'next/link';

interface Application {
  id: number;
  jobs: { id: number; name: string }[];
  status: string;
  rejection_reason?: {
    name: string;
  };
}

interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  email_addresses: { value: string }[];
  applications: Application[];
}

const AdminPage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/applications?page=${currentPage}&per_page=10`);
        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
          setCandidates(data.candidates);
          setHasMore(data.candidates.length === 10);
        } else {
          setHasMore(false);
          if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
          }
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setCandidates([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, [currentPage]);

  const filteredCandidates = candidates.filter(candidate =>
    `${candidate.first_name} ${candidate.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen bg-[#f5f7f9] p-8">
      <h2 className="text-3xl font-extrabold text-[#15372c] mb-6">Submitted Applications</h2>
      
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name"
          className="w-full max-w-md p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00b2a9] focus:border-[#00b2a9]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link href="/apply" className="bg-[#00b2a9] text-white px-4 py-2 rounded-md hover:bg-[#008c84] transition-colors">
          Add
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <p className="p-4 text-center text-[#15372c]">Loading...</p>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#15372c] uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#15372c] uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#15372c] uppercase tracking-wider">
                    Job Applied
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#15372c] uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#15372c] uppercase tracking-wider">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  candidate.applications.map((application, index) => (
                    <tr key={`${candidate.id}-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#15372c]">
                        {candidate.first_name} {candidate.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#15372c]">
                        {candidate.email_addresses[0]?.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#15372c]">
                        {application.jobs[0]?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#15372c]">
                        {application.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#15372c]">
                        {application.rejection_reason?.name || 'N/A'}
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 bg-gray-50">
              <Pagination
                currentPage={currentPage}
                onPageChange={handlePageChange}
                hasMore={hasMore}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
