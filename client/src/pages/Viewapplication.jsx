import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loading from '../components/Loading';

const Viewapplication = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const [applications, setApplications] = useState(null);

  const fetchCompanyJobApplicants = async () => {
    if (!companyToken) return;

    try {
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { token: companyToken }
      });

      if (data.success && Array.isArray(data.applications)) {
        setApplications([...data.applications].reverse());
      } else {
        setApplications([]);
        toast.error(data.message || 'No applications found');
      }
    } catch (error) {
      setApplications([]);
      toast.error(error?.response?.data?.message || error.message || 'Error fetching applications');
    }
  };

  const changeApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { id, status },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        fetchCompanyJobApplicants();
        toast.success(`Application ${status}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Error updating status');
    }
  };

  useEffect(() => {
    fetchCompanyJobApplicants();
  }, [companyToken]);

  if (applications === null) return <Loading />;
  if (applications.length === 0)
    return <div className="text-center text-gray-500 py-4">No applications found</div>;

  return (
    <div className="container mx-auto p-4">
      <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left">#</th>
            <th className="py-2 px-4 text-left">User Name</th>
            <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
            <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
            <th className="py-2 px-4 text-left">Resume</th>
            <th className="py-2 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {applications
            .filter((item) => item.jobId && item.userId)
            .map((app, index) => (
              <tr key={app._id || index} className="text-gray-700">
                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                <td className="py-2 px-4 border-b text-center flex items-center">
                  <img
                    className="w-10 h-10 rounded-full mr-3 max-sm:hidden"
                    src={app.userId.image || assets.default_profile}
                    alt={app.userId.name || 'Profile'}
                  />
                  <span>{app.userId.name}</span>
                </td>
                <td className="py-2 px-4 border-b max-sm:hidden">{app.jobId.title}</td>
                <td className="py-2 px-4 border-b max-sm:hidden">{app.jobId.location}</td>
                <td className="py-2 px-4 border-b">
                  <a
                    href={app.userId.resume || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center"
                  >
                    Resume <img src={assets.resume_download_icon} alt="resume" />
                  </a>
                </td>
                <td className="py-2 px-4 border-b relative">
                  {app.status === 'Pending' ? (
                    <div className="relative inline-block text-left group">
                      <button className="text-gray-500 action-button">...</button>
                      <div className="z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block">
                        <button
                          onClick={() => changeApplicationStatus(app._id, 'Accepted')}
                          className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => changeApplicationStatus(app._id, 'Rejected')}
                          className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>{app.status}</div>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Viewapplication;
