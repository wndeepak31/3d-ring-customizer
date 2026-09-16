'use client';

import { useState } from 'react';
import { deleteProduct } from '@/actions/productActions';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteProductButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setIsDeleting(true);
      const res = await deleteProduct(id);
      if (res.error) {
        alert(res.error);
        setIsDeleting(false);
      } else {
        router.refresh();
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
      title="Delete Product"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  );
}
