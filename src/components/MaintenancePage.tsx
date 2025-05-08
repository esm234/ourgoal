import React from 'react';

const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-background/95 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,white)] -z-10"></div>
      <div className="absolute top-1/4 right-[5%] w-72 h-72 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 left-[10%] w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="max-w-md w-full p-8 glass-effect rounded-2xl shadow-lg text-center border border-white/20 backdrop-blur-lg">
        <div className="mb-6 flex justify-center">
          <img
            src="https://lh7-us.googleusercontent.com/ZgZiKixuHmh0Qw-bVQVoSL9X1sLPf7vemSMdW_aF8F2o2UBdLemgghmaM_FHnmII7VMOEHswtMgD9GEW1RwfU9bNlZ4Qp6kjVfqvVgW18RqByz0ASipHRicpd6d0CjbWlFAL0kXSsRs6vztFruNKixK76zNpmzbqri-4eJrAY476rGC_o26FVijRGlTeFYNHaFOhrYpW?key=-6GPA2o9SRVVzzH5bmoicQ"
            alt="اسرار للتفوق"
            className="w-20 h-20 object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold mb-2 gradient-text">منصة اسرار للتفوق</h1>
        <h2 className="text-2xl font-bold text-foreground mb-4">الموقع قيد الصيانة</h2>
        <p className="text-muted-foreground mb-6">
          نعتذر عن الإزعاج، الموقع حاليًا قيد الصيانة لتحسين خدمتكم. سنعود قريبًا بمميزات جديدة وخدمة أفضل.
        </p>
        <div className="bg-primary/10 p-4 rounded-xl text-primary mb-4">
          <p className="font-medium">
            يرجى المحاولة مرة أخرى لاحقًا
          </p>
        </div>
        <p className="text-sm text-muted-foreground mt-8">
          © {new Date().getFullYear()}  - Our Goal is Success
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage; 
