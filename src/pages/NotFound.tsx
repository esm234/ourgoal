
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-6">
            عذراً، الصفحة التي تبحث عنها غير موجودة
          </p>
          <Link to="/">
            <Button className="bg-primary hover:bg-primary/90">
              العودة إلى الصفحة الرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
