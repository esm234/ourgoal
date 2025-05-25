import ArabicCertificate from '@/components/ArabicCertificate';
import React from 'react';
import { createRoot } from 'react-dom/client';

interface CertificateData {
  userName: string;
  completionDate: Date;
  planName: string;
  totalDays: number;
}

export const generateCompletionCertificate = async (data: CertificateData) => {
  const { userName, completionDate, planName, totalDays } = data;

  try {
    console.log('Starting Arabic certificate generation...', data);

    // Create a temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.top = '-9999px';
    tempContainer.style.left = '-9999px';
    document.body.appendChild(tempContainer);

    // Create React root and render certificate
    const root = createRoot(tempContainer);

    return new Promise<void>((resolve, reject) => {
      const handleGenerate = () => {
        // Cleanup
        setTimeout(() => {
          root.unmount();
          document.body.removeChild(tempContainer);
          resolve();
        }, 100);
      };

      root.render(
        React.createElement(ArabicCertificate, {
          userName,
          completionDate,
          planName,
          totalDays,
          onGenerate: handleGenerate
        })
      );

      // Auto-trigger PDF generation after render
      setTimeout(() => {
        const button = tempContainer.querySelector('button');
        if (button) {
          button.click();
        } else {
          reject(new Error('Certificate button not found'));
        }
      }, 2000); // Increased timeout to allow logo to load
    });

  } catch (error) {
    console.error('Error generating certificate:', error);
    throw new Error('فشل في توليد الشهادة');
  }
};
