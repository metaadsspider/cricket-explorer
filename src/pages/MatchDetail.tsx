import { useParams, useNavigate } from 'react-router-dom';
import { useSportsData } from '@/hooks/useSportsData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ExternalLink, Clock, Users, Trophy } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function MatchDetail() {
  const { sport, date, index } = useParams<{
    sport: string;
    date: string;
    index: string;
  }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useSportsData();
  const { toast } = useToast();
  const [activeStream, setActiveStream] = useState('0');

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
  
  // Find all events for the sport and get the specific one by index
  const sportEvents = events.filter(e => e.sport === decodeURIComponent(sport));
  const event = sportEvents[eventIndex];

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

        {/* Live Stream with Tabs */}
        {event.channels.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              Live Stream
            </h3>
            
            <Tabs value={activeStream} onValueChange={setActiveStream} className="w-full">
              {event.channels.length > 1 && (
                <TabsList className="grid w-full mb-4" style={{ gridTemplateColumns: `repeat(${event.channels.length}, minmax(0, 1fr))` }}>
                  {event.channels.map((channel, index) => (
                    <TabsTrigger key={index} value={index.toString()}>
                      Stream {index + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>
              )}
              
              {event.channels.map((channel, index) => (
                <TabsContent key={index} value={index.toString()} className="mt-0">
                  <div className="aspect-video w-full">
                    <iframe
                      allow="encrypted-media"
                      width="100%"
                      height="100%"
                      scrolling="no"
                      frameBorder="0"
                      allowFullScreen
                      src={channel}
                      title={`Live stream ${index + 1} for ${event.match}`}
                      className="rounded-lg"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                    <ExternalLink className="h-3 w-3" />
                    {new URL(channel).hostname}
                  </p>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        )}

        {event.channels.length === 0 && (
          <Card className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No streams available for this match</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}