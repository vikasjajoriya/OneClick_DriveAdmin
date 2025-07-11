import { use, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const router = useRouter()
  const {isAuthenticated} = useAuth();
  // console.log('isAuthenticated:', isAuthenticated);
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  return null
}
