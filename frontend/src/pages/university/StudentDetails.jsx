// src/pages/university/StudentDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UniversityService from '../../services/universityService';

const StudentDetails = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);


  const handleBack = () => {
    navigate('/dashboard/university/students');  // Updated with correct path
  };
  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await UniversityService.getStudentDetails(studentId);
      if (response.success) {
        const studentData = {
          ...response.data,
          name: response.data.name || 'Not specified',
          email: response.data.email || 'Not specified',
          department: response.data.department || 'Not specified',
          cgpa: response.data.cgpa || 'N/A',
          status: response.data.status || 'Active'
        };
        setStudent(studentData);
        setFormData(studentData);
        setError(null);
      } else {
        throw new Error('Failed to fetch student details');
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      setError('Failed to load student details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await UniversityService.updateStudent(studentId, formData);
      if (response.success) {
        setStudent(response.data);
        setIsEditing(false);
        setError(null);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setError('Failed to update student details');
    }
  };

  // StudentDetails.jsx
// StudentDetails.jsx
const handleEdit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
        
        const updatedData = {
            name: formData.name || 'Not specified',
            email: formData.email || 'Not specified',
            department: formData.department || 'Not specified',
            cgpa: formData.cgpa || 'N/A',
            status: formData.status || 'Active'
        };

        const response = await UniversityService.updateStudent(studentId, updatedData);
        
        if (response.success) {
            setStudent(response.data);
            setIsEditing(false);
            setError(null);
            
            // Show success message
            alert('Student details updated successfully');
            
            // Navigate back to students list
            navigate('/dashboard/university/students', { state: { refresh: true }});
        }
    } catch (error) {
        console.error('Error updating student:', error);
        setError('Failed to update student details. Please try again.');
    } finally {
        setLoading(false);
    }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-lg m-6">
        {error}
        <button 
          onClick={fetchStudentDetails}
          className="ml-4 text-sm underline hover:text-red-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Student Details</h1>
          <p className="text-gray-600">Manage student information</p>
        </div>
        <div className="space-x-4">
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Back to List
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Details'}
          </button>
        </div>
      </div>

      {isEditing ? (
       <form onSubmit={handleEdit} className="bg-white rounded-lg shadow p-6 space-y-6">
       <div className="grid grid-cols-2 gap-6">
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Full Name*
           </label>
           <input
             type="text"
             name="name"
             value={formData.name}
             onChange={(e) => setFormData({...formData, name: e.target.value})}
             className="w-full border rounded-lg p-2"
             required
           />
         </div>
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Email*
           </label>
           <input
             type="email"
             name="email"
             value={formData.email}
             onChange={(e) => setFormData({...formData, email: e.target.value})}
             className="w-full border rounded-lg p-2"
             required
           />
         </div>
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Department
           </label>
           <select
             name="department"
             value={formData.department}
             onChange={(e) => setFormData({...formData, department: e.target.value})}
             className="w-full border rounded-lg p-2"
           >
             <option value="">Select Department</option>
             <option value="Computer Science">Computer Science</option>
             <option value="Information Technology">Information Technology</option>
             <option value="Electronics">Electronics</option>
             <option value="Mechanical">Mechanical</option>
           </select>
         </div>
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             CGPA
           </label>
           <input
             type="number"
             name="cgpa"
             value={formData.cgpa}
             onChange={(e) => setFormData({...formData, cgpa: e.target.value})}
             className="w-full border rounded-lg p-2"
             step="0.01"
             min="0"
             max="10"
           />
         </div>
       </div>
       <div className="flex justify-end space-x-4">
         <button
           type="button"
           onClick={() => {
             setIsEditing(false);
             setFormData(student); // Reset form data to original values
           }}
           className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
           disabled={loading}
         >
           Cancel
         </button>
         <button
           type="submit"
           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
           disabled={loading}
         >
           {loading ? 'Saving...' : 'Save Changes'}
         </button>
       </div>
     </form>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                <p className="mt-1 text-lg">{student?.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-lg">{student?.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Department</h3>
                <p className="mt-1 text-lg">{student?.department || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">CGPA</h3>
                <p className="mt-1 text-lg">{student?.cgpa || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  student?.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {student?.status || 'Not specified'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;