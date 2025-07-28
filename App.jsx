import { useState } from 'react';
import './App.css';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SurgeryManagement } from './components/SurgeryManagement';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'surgeries':
        return <SurgeryManagement />;
      case 'documents':
        return <div className="p-6"><h2 className="text-2xl font-bold">Documentos</h2><p>Em desenvolvimento...</p></div>;
      case 'reports':
        return <div className="p-6"><h2 className="text-2xl font-bold">Relatórios</h2><p>Em desenvolvimento...</p></div>;
      case 'whatsapp':
        return <div className="p-6"><h2 className="text-2xl font-bold">WhatsApp</h2><p>Em desenvolvimento...</p></div>;
      case 'patients':
        return <div className="p-6"><h2 className="text-2xl font-bold">Pacientes</h2><p>Em desenvolvimento...</p></div>;
      case 'settings':
        return <div className="p-6"><h2 className="text-2xl font-bold">Configurações</h2><p>Em desenvolvimento...</p></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-shrink-0">
          <Sidebar 
            currentPath={`/${currentPage === 'dashboard' ? '' : currentPage}`}
            onNavigate={setCurrentPage}
          />
        </div>
        <main className="flex-1 overflow-y-auto">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
