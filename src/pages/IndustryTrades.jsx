import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function IndustryTrades() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/industries/service-trades'); }, [navigate]);
  return null;
}