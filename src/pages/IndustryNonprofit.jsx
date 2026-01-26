import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function IndustryNonprofit() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/industries/nonprofits'); }, [navigate]);
  return null;
}