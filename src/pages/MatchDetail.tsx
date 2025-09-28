import { useParams, useNavigate } from 'react-router-dom';
import { useSportsData } from '@/hooks/useSportsData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Clock, Users, Trophy } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function MatchDetail() {
  const { sport, date, index } = useParams<{
    sport: string;
    date: string;
    index: string;
  }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useSportsData();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading match details...</p>
        </div>
      </div>
    );
  }

  if (error || !data || !sport || !date || !index) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2">Match Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested match could not be found.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  const eventIndex = parseInt(index);
  const events = data.events[date] || [];
  const event = events.find((e, i) => e.sport === decodeURIComponent(sport) && i === eventIndex);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2">Match Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested match could not be found.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  const eventTime = new Date(event.unix_timestamp * 1000);
  const isLive = eventTime <= new Date();

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

  const handleStreamClick = (channel: string) => {
    toast({
      title: "Opening Stream",
      description: "Redirecting to external streaming platform...",
    });
    window.open(channel, '_blank');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{getSportIcon(event.sport)}</span>
            <div>
              <h1 className="text-2xl font-bold">{event.sport}</h1>
              <p className="text-muted-foreground">{event.tournament}</p>
            </div>
          </div>
        </div>

        {/* Match Info Card */}
        <Card className="sport-card p-8 border-2 border-primary/20">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {isLive && (
                    <Badge variant="destructive" className="animate-glow-pulse text-lg px-3 py-1">
                      🔴 LIVE
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-sm">
                    <Trophy className="h-4 w-4 mr-1" />
                    {event.tournament}
                  </Badge>
                </div>
                
                <h2 className="text-3xl font-bold gradient-text mb-4">
                  {event.match}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">
                        {isLive 
                          ? `Started ${formatDistanceToNow(eventTime)} ago`
                          : `Starts ${formatDistanceToNow(eventTime)}`
                        }
                      </p>
                      <p className="text-muted-foreground">
                        {format(eventTime, 'PPpp')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">Streams Available</p>
                      <p className="text-muted-foreground">
                        {event.channels.length} platform{event.channels.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-lg">{getSportIcon(event.sport)}</span>
                    <div>
                      <p className="font-medium">Sport</p>
                      <p className="text-muted-foreground">{event.sport}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Streaming Options */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-primary" />
            Available Streams
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.channels.map((channel, index) => (
              <Card 
                key={index}
                className="match-card p-4 cursor-pointer"
                onClick={() => handleStreamClick(channel)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Stream {index + 1}</p>
                    <p className="text-sm text-muted-foreground">
                      {new URL(channel).hostname}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-primary" />
                </div>
              </Card>
            ))}
          </div>
          
          {event.channels.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No streams available for this match</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}