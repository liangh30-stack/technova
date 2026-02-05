import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

interface NotFoundProps {
  onBack?: () => void;
  title?: string;
  message?: string;
}

const NotFound: React.FC<NotFoundProps> = ({
  onBack,
  title = '页面未找到',
  message = '抱歉，您访问的页面不存在或已被移除。',
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl font-black text-slate-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{title}</h1>
        <p className="text-slate-600 mb-8">{message}</p>
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 text-white font-medium rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            返回首页
          </button>
        )}
        {!onBack && (
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 text-white font-medium rounded-lg transition-colors"
          >
            <Home size={20} />
            返回首页
          </a>
        )}
      </div>
    </div>
  );
};

export default NotFound;
