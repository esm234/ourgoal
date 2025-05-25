import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const EventTestSimple: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  console.log('EventTestSimple - eventId:', eventId);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/weekly-events')}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">اختبار الفعالية</h1>
            <p className="text-muted-foreground">معرف الفعالية: {eventId}</p>
          </div>
        </div>

        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ✅ الصفحة تعمل بشكل صحيح! معرف الفعالية: {eventId}
        </div>

        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          ⚠️ هذه صفحة اختبار مؤقتة للتأكد من عمل الروابط
        </div>

        <Button
          onClick={() => navigate('/weekly-events')}
          className="bg-gradient-to-r from-primary to-accent text-black font-bold"
        >
          العودة للفعاليات
        </Button>
      </div>
    </Layout>
  );
};

export default EventTestSimple;
