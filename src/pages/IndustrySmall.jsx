import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function IndustrySmall() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/industries/small-local'); }, [navigate]);
  return null;
}