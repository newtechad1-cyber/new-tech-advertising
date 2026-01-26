import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Industry() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/industries'); }, [navigate]);
  return null;
}