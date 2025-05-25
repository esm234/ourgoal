import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onGoToPage?: (page: number) => void;
  loading?: boolean;
}

export const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  hasNextPage,
  hasPrevPage,
  onNextPage,
  onPrevPage,
  onGoToPage,
  loading = false
}) => {
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalCount);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(0);
      
      if (currentPage > 2) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 0 && i !== totalPages - 1) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 3) {
        pages.push('...');
      }
      
      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          عرض {totalCount} من النتائج
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-2 py-4 border-t">
      <div className="text-sm text-muted-foreground">
        عرض {startItem} إلى {endItem} من أصل {totalCount} نتيجة
      </div>
      
      <div className="flex items-center space-x-2 space-x-reverse">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={!hasPrevPage || loading}
          className="flex items-center gap-1"
        >
          <ChevronRight className="h-4 w-4" />
          السابق
        </Button>

        {/* Page Numbers */}
        {onGoToPage && (
          <div className="flex items-center space-x-1 space-x-reverse">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-2 py-1 text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onGoToPage(page as number)}
                    disabled={loading}
                    className="min-w-[32px] h-8"
                  >
                    {(page as number) + 1}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!hasNextPage || loading}
          className="flex items-center gap-1"
        >
          التالي
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// مكون مبسط للـ pagination
export const SimplePagination: React.FC<{
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  loading?: boolean;
  currentPage: number;
  totalPages: number;
}> = ({
  hasNextPage,
  hasPrevPage,
  onNextPage,
  onPrevPage,
  loading = false,
  currentPage,
  totalPages
}) => {
  return (
    <div className="flex items-center justify-center space-x-4 space-x-reverse py-4">
      <Button
        variant="outline"
        onClick={onPrevPage}
        disabled={!hasPrevPage || loading}
        className="flex items-center gap-2"
      >
        <ChevronRight className="h-4 w-4" />
        السابق
      </Button>
      
      <span className="text-sm text-muted-foreground px-4">
        صفحة {currentPage + 1} من {totalPages}
      </span>
      
      <Button
        variant="outline"
        onClick={onNextPage}
        disabled={!hasNextPage || loading}
        className="flex items-center gap-2"
      >
        التالي
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  );
};

// مكون لعرض معلومات الصفحة
export const PageInfo: React.FC<{
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}> = ({ currentPage, totalPages, totalCount, pageSize }) => {
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalCount);

  return (
    <div className="text-sm text-muted-foreground">
      عرض {startItem} إلى {endItem} من أصل {totalCount} نتيجة
      {totalPages > 1 && (
        <span className="mr-2">
          (صفحة {currentPage + 1} من {totalPages})
        </span>
      )}
    </div>
  );
};
