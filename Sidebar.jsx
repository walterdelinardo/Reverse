import { 
  LayoutDashboard, 
  Scissors, 
  FileText, 
  BarChart3, 
  MessageSquare, 
  Settings,
  Users
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Cirurgias', href: '/surgeries', icon: Scissors },
  { name: 'Documentos', href: '/documents', icon: FileText },
  { name: 'Relatórios', href: '/reports', icon: BarChart3 },
  { name: 'WhatsApp', href: '/whatsapp', icon: MessageSquare },
  { name: 'Pacientes', href: '/patients', icon: Users },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Sidebar({ currentPath = '/', onNavigate }) {
  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex flex-1 flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            
            return (
              <Button
                key={item.name}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                onClick={() => onNavigate(item.href === '/' ? 'dashboard' : item.href.slice(1))}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

