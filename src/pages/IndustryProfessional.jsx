import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function IndustryProfessional() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/industries/professionals'); }, [navigate]);
  return null;
}