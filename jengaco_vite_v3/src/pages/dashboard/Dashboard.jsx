import React from 'react'
import { useAuth } from '../../context/AuthContext'
import ClientDashboard       from '../../components/dashboard/ClientDashboard'
import ProfessionalDashboard from '../../components/dashboard/ProfessionalDashboard'

export default function Dashboard() {
  const { user } = useAuth()
  return user?.role === 'professional'
    ? <ProfessionalDashboard />
    : <ClientDashboard />
}
