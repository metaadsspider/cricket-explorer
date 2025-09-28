import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SportsEvent } from '@/types/sports';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface SportColumnProps {
  sport: string;
  events: SportsEvent[];
  dateKey: string;
}

export const SportColumn = ({ sport, events, dateKey }: SportColumnProps) => {
  const navigate = useNavigate();

  const getSportIcon = (sport: string) => {
    const icons: { [key: string]: string } = {
      'Baseball': '⚾',
      'Basketball': '🏀',
      'Football': '⚽',
      'Ice Hockey': '🏒',
      'Boxing': '🥊',
      'UFC': '🥋',
      'Tennis': '🎾',
      'MMA': '🥋',
      'Rugby Union': '🏉',
      'American Football': '🏈',
      'Cricket': '🏏',
      'Volleyball': '🏐',
      'Motorsport': '🏎️',
      'Handball': '🤾',
    };
    return icons[sport] || '🏆';
  };

  const handleMatchClick = (eventIndex: number) => {
    navigate(`/match/${encodeURIComponent(sport)}/${dateKey}/${eventIndex}`);
  };

  if (events.length === 0) return null;

  return (
    <div className="min-w-[320px] max-w-[400px] space-y-4">
      <div className="sticky top-4 z-10">
        <Card className="sport-card p-4 border-2 border-primary/20">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getSportIcon(sport)}</span>
            <div>
              <h2 className="text-xl font-bold gradient-text">{sport}</h2>
              <p className="text-sm text-muted-foreground">
                {events.length} live event{events.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        {events.map((event, index) => {
          const eventTime = new Date(event.unix_timestamp * 1000);
          const isLive = eventTime <= new Date();
          
          return (
            <Card
              key={index}
              className="match-card p-4 space-y-3"
              onClick={() => handleMatchClick(index)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {isLive && (
                      <Badge variant="destructive" className="animate-glow-pulse">
                        LIVE
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {event.tournament}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-sm leading-tight mb-2 hover:text-primary transition-colors">
                    {event.match}
                  </h3>
                  
                  <p className="text-xs text-muted-foreground">
                    {isLive 
                      ? `Started ${formatDistanceToNow(eventTime)} ago`
                      : `Starts ${formatDistanceToNow(eventTime)}`
                    }
                  </p>
                  
                  <p className="text-xs text-accent mt-1">
                    {event.channels.length} stream{event.channels.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};