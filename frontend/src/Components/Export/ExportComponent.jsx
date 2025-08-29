import React, { useState } from 'react';
import { ExportUtils } from '../../utils/ExportUtils';
import { toast } from 'react-toastify';

const ExportComponent = ({ course, chapters }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCourse = async () => {
    if (!course) {
      toast.error('No course data available');
      return;
    }

    // Debug: Log course data to see what we're working with
    console.log('Course data for export:', course);
    console.log('Chapters data for export:', chapters);

    setIsExporting(true);
    try {
      const result = await ExportUtils.exportCourseToPDF(course, chapters);
      toast.success(`Course exported successfully as ${result.filename}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export course: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="my-6 flex flex-col items-center">
      <span className="font-semibold text-gray-700 mb-2">Export Course Content</span>
      <div className="flex gap-2 p-4 sm:p-6 md:p-10 border rounded-xl shadow-sm mt-5 bg-white max-w-full md:max-w-3xl mx-auto">
        {course ? (
          <button
            onClick={handleExportCourse}
            disabled={isExporting}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            )}
            Export Course as PDF
          </button>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No course content available for export
          </p>
        )}
      </div>
    </div>
  );
};

export default ExportComponent;
