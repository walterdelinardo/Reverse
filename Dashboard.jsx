import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  TrendingUp,
  Users,
  FileText
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#7c3aed', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    summary: {
      total_surgeries: 0,
      pending_surgeries: 0,
      approved_surgeries: 0,
      rejected_surgeries: 0,
      total_reimbursement: 0
    },
    monthly_surgeries: [],
    surgeries_by_type: [],
    surgeries_by_status: []
  });

  useEffect(() => {
    // Simular dados do dashboard
    const mockData = {
      summary: {
        total_surgeries: 156,
        pending_surgeries: 23,
        approved_surgeries: 98,
        rejected_surgeries: 12,
        total_reimbursement: 485750.00
      },
      monthly_surgeries: [
        { month: '2024-01', count: 18 },
        { month: '2024-02', count: 25 },
        { month: '2024-03', count: 32 },
        { month: '2024-04', count: 28 },
        { month: '2024-05', count: 35 },
        { month: '2024-06', count: 18 }
      ],
      surgeries_by_type: [
        { type: 'Catarata', count: 45 },
        { type: 'Artroscopia', count: 32 },
        { type: 'Colecistectomia', count: 28 },
        { type: 'Hernia', count: 25 },
        { type: 'Outros', count: 26 }
      ],
      surgeries_by_status: [
        { status: 'approved', count: 98 },
        { status: 'pending', count: 23 },
        { status: 'in_analysis', count: 23 },
        { status: 'rejected', count: 12 }
      ]
    };
    
    setDashboardData(mockData);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do sistema de reembolsos cirúrgicos
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cirurgias</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.summary.total_surgeries}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.summary.pending_surgeries}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando análise
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.summary.approved_surgeries}</div>
            <p className="text-xs text-muted-foreground">
              {((dashboardData.summary.approved_surgeries / dashboardData.summary.total_surgeries) * 100).toFixed(1)}% de aprovação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardData.summary.total_reimbursement)}
            </div>
            <p className="text-xs text-muted-foreground">
              Reembolsos aprovados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cirurgias por Mês</CardTitle>
            <CardDescription>
              Evolução mensal do número de cirurgias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.monthly_surgeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipos de Cirurgia</CardTitle>
            <CardDescription>
              Distribuição por tipo de procedimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.surgeries_by_type}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {dashboardData.surgeries_by_type.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Cirurgias Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Cirurgias Recentes</CardTitle>
          <CardDescription>
            Últimas cirurgias cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: 1, patient: 'Maria Silva', type: 'Catarata', date: '2024-07-25', status: 'approved' },
              { id: 2, patient: 'João Santos', type: 'Artroscopia', date: '2024-07-24', status: 'pending' },
              { id: 3, patient: 'Ana Costa', type: 'Colecistectomia', date: '2024-07-23', status: 'in_analysis' },
              { id: 4, patient: 'Carlos Oliveira', type: 'Hernia', date: '2024-07-22', status: 'approved' },
              { id: 5, patient: 'Lucia Ferreira', type: 'Catarata', date: '2024-07-21', status: 'rejected' },
            ].map((surgery) => (
              <div key={surgery.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{surgery.patient}</p>
                    <p className="text-sm text-muted-foreground">{surgery.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-muted-foreground">{surgery.date}</p>
                  <Badge 
                    variant={
                      surgery.status === 'approved' ? 'default' :
                      surgery.status === 'pending' ? 'secondary' :
                      surgery.status === 'in_analysis' ? 'outline' : 'destructive'
                    }
                  >
                    {surgery.status === 'approved' ? 'Aprovada' :
                     surgery.status === 'pending' ? 'Pendente' :
                     surgery.status === 'in_analysis' ? 'Em Análise' : 'Rejeitada'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

