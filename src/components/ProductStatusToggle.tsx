'use client';

import { useState, useTransition } from 'react';
import { toggleProductStatus } from '@/actions/productActions';

interface ProductStatusToggleProps {
  id: string;
  initialStatus: string;
}

export default function ProductStatusToggle({ id, initialStatus }: ProductStatusToggleProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  const isActive = status === 'ACTIVE';

  const handleToggle = () => {
    const nextStatus = isActive ? 'INACTIVE' : 'ACTIVE';
    // Optimistic update
    setStatus(nextStatus);

    startTransition(async () => {
      const res = await toggleProductStatus(id, status);
      if (res.error) {
        // Revert status on error
        setStatus(status);
        alert(res.error);
      } else if (res.status) {
        setStatus(res.status);
      }
    });
  };

  return (
    <div className="flex items-center space-x-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={isActive}
        disabled={isPending}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isActive ? 'bg-emerald-500' : 'bg-gray-300'
        } ${isPending ? 'opacity-60 cursor-wait' : ''}`}
        title={isActive ? 'Click to turn OFF (Set Inactive)' : 'Click to turn ON (Set Active)'}
      >
        <span className="sr-only">Toggle product status</span>
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isActive ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
          isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {status}
      </span>
    </div>
  );
}
