import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Download
} from 'lucide-react';

export function SurgeryManagement() {
  const [surgeries, setSurgeries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNewSurgeryDialogOpen, setIsNewSurgeryDialogOpen] = useState(false);

  useEffect(() => {
    // Simular dados de cirurgias
    const mockSurgeries = [
      {
        id: 1,
        patient_name: 'Maria Silva',
        patient_cpf: '123.456.789-00',
        patient_phone: '(11) 99999-9999',
        surgery_type: 'Catarata',
        surgery_date: '2024-07-25',
        doctor_name: 'Dr. João Médico',
        hospital_name: 'Hospital São Paulo',
        insurance_company: 'Unimed',
        status: 'approved',
        reimbursement_amount: 3500.00,
        created_at: '2024-07-20'
      },
      {
        id: 2,
        patient_name: 'João Santos',
        patient_cpf: '987.654.321-00',
        patient_phone: '(11) 88888-8888',
        surgery_type: 'Artroscopia',
        surgery_date: '2024-07-24',
        doctor_name: 'Dr. Maria Ortopedista',
        hospital_name: 'Hospital Albert Einstein',
        insurance_company: 'Bradesco Saúde',
        status: 'pending',
        reimbursement_amount: 5200.00,
        created_at: '2024-07-22'
      },
      {
        id: 3,
        patient_name: 'Ana Costa',
        patient_cpf: '456.789.123-00',
        patient_phone: '(11) 77777-7777',
        surgery_type: 'Colecistectomia',
        surgery_date: '2024-07-23',
        doctor_name: 'Dr. Carlos Cirurgião',
        hospital_name: 'Hospital Sírio-Libanês',
        insurance_company: 'SulAmérica',
        status: 'in_analysis',
        reimbursement_amount: 4800.00,
        created_at: '2024-07-21'
      }
    ];
    
    setSurgeries(mockSurgeries);
  }, []);

  const filteredSurgeries = surgeries.filter(surgery => {
    const matchesSearch = surgery.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         surgery.surgery_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || surgery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprovada</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'in_analysis':
        return <Badge variant="outline">Em Análise</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeitada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Cirurgias</h2>
          <p className="text-muted-foreground">
            Gerencie todas as cirurgias e seus processos de reembolso
          </p>
        </div>
        
        <Dialog open={isNewSurgeryDialogOpen} onOpenChange={setIsNewSurgeryDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Cirurgia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Cirurgia</DialogTitle>
              <DialogDescription>
                Preencha os dados da cirurgia para iniciar o processo de reembolso.
              </DialogDescription>
            </DialogHeader>
            <NewSurgeryForm onClose={() => setIsNewSurgeryDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por paciente ou tipo de cirurgia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendente</option>
                <option value="in_analysis">Em Análise</option>
                <option value="approved">Aprovada</option>
                <option value="rejected">Rejeitada</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Cirurgias */}
      <Card>
        <CardHeader>
          <CardTitle>Cirurgias ({filteredSurgeries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data da Cirurgia</TableHead>
                <TableHead>Médico</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSurgeries.map((surgery) => (
                <TableRow key={surgery.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{surgery.patient_name}</p>
                      <p className="text-sm text-muted-foreground">{surgery.patient_phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{surgery.surgery_type}</TableCell>
                  <TableCell>{new Date(surgery.surgery_date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{surgery.doctor_name}</TableCell>
                  <TableCell>{getStatusBadge(surgery.status)}</TableCell>
                  <TableCell>{formatCurrency(surgery.reimbursement_amount)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function NewSurgeryForm({ onClose }) {
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_cpf: '',
    patient_phone: '',
    surgery_type: '',
    surgery_date: '',
    doctor_name: '',
    hospital_name: '',
    insurance_company: '',
    reimbursement_amount: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você faria a chamada para a API
    console.log('Dados da cirurgia:', formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patient_name">Nome do Paciente</Label>
          <Input
            id="patient_name"
            name="patient_name"
            value={formData.patient_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="patient_cpf">CPF</Label>
          <Input
            id="patient_cpf"
            name="patient_cpf"
            value={formData.patient_cpf}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="patient_phone">Telefone</Label>
          <Input
            id="patient_phone"
            name="patient_phone"
            value={formData.patient_phone}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="surgery_type">Tipo de Cirurgia</Label>
          <Input
            id="surgery_type"
            name="surgery_type"
            value={formData.surgery_type}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="surgery_date">Data da Cirurgia</Label>
          <Input
            id="surgery_date"
            name="surgery_date"
            type="date"
            value={formData.surgery_date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="doctor_name">Médico</Label>
          <Input
            id="doctor_name"
            name="doctor_name"
            value={formData.doctor_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="hospital_name">Hospital</Label>
          <Input
            id="hospital_name"
            name="hospital_name"
            value={formData.hospital_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="insurance_company">Convênio</Label>
          <Input
            id="insurance_company"
            name="insurance_company"
            value={formData.insurance_company}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="col-span-2">
          <Label htmlFor="reimbursement_amount">Valor do Reembolso</Label>
          <Input
            id="reimbursement_amount"
            name="reimbursement_amount"
            type="number"
            step="0.01"
            value={formData.reimbursement_amount}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          Cadastrar Cirurgia
        </Button>
      </div>
    </form>
  );
}

