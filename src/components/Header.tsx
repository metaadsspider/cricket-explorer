import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp } from 'lucide-react';

interface HeaderProps {
  totalEvents: number;
  liveEvents: number;
}

export const Header = ({ totalEvents, liveEvents }: HeaderProps) => {
  return (
    <Card className="sport-card p-6 mb-8 border-2 border-primary/20 glow-primary">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">SportsCentral</h1>
              <p className="text-muted-foreground">Live Sports Streaming Hub</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <Badge variant="outline" className="text-success border-success">
                {liveEvents} LIVE
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active Events</p>
          </div>
          
          <div className="text-center">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {totalEvents}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">Total Events</p>
          </div>
        </div>
      </div>
    </Card>
  );
};