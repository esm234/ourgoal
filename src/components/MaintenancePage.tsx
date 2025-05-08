import React from 'react';

const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-2">
          <h2 className="text-xl font-bold text-blue-600">Our Goal Is Success</h2>
        </div>
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">الموقع قيد الصيانة</h1>
        <p className="text-gray-600 mb-6">
          نعتذر عن الإزعاج، الموقع حاليًا قيد الصيانة لتحسين خدمتكم. سنعود قريبًا بمميزات جديدة وخدمة أفضل.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          نرجو المحاولة مرة أخرى لاحقًا
        </p>
        <div className="border-t pt-4">
          <p className="text-md font-semibold text-blue-600">Our Goal Is Success</p>
          <p className="text-xs text-gray-500">We'll be back soon with improved services</p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
