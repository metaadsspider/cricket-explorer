import { useSportsData } from '@/hooks/useSportsData';
import { SportColumn } from '@/components/SportColumn';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

const Index = () => {
  const { data, isLoading, error, isRefetching } = useSportsData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin">
            <Loader2 className="h-12 w-12 text-primary mx-auto" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Loading Sports Data</h2>
            <p className="text-muted-foreground">Fetching the latest matches...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to Load Sports Data</h2>
          <p className="text-muted-foreground mb-4">
            Unable to fetch the latest sports information. Please check your connection and try again.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </Card>
      </div>
    );
  }

  if (!data || !data.events) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No Sports Data Available</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </Card>
      </div>
    );
  }

  // Process the data to group by sport
  const sportGroups: { [sport: string]: { events: any[], dateKey: string }[] } = {};
  let totalEvents = 0;
  let liveEvents = 0;

  Object.entries(data.events).forEach(([dateKey, events]) => {
    events.forEach((event) => {
      if (!sportGroups[event.sport]) {
        sportGroups[event.sport] = [];
      }
      
      // Find existing entry for this sport and date, or create new one
      let existingEntry = sportGroups[event.sport].find(entry => entry.dateKey === dateKey);
      if (!existingEntry) {
        existingEntry = { events: [], dateKey };
        sportGroups[event.sport].push(existingEntry);
      }
      
      existingEntry.events.push(event);
      totalEvents++;
      
      const eventTime = new Date(event.unix_timestamp * 1000);
      if (eventTime <= new Date()) {
        liveEvents++;
      }
    });
  });

  // Get unique sports and their combined events
  const sportsWithEvents = Object.entries(sportGroups).map(([sport, dateGroups]) => {
    const allEvents = dateGroups.flatMap(group => group.events);
    const firstDateKey = dateGroups[0]?.dateKey || '';
    return {
      sport,
      events: allEvents.sort((a, b) => a.unix_timestamp - b.unix_timestamp),
      dateKey: firstDateKey
    };
  }).filter(({ events }) => events.length > 0);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <Header totalEvents={totalEvents} liveEvents={liveEvents} />
        
        {isRefetching && (
          <div className="fixed top-4 right-4 z-50">
            <Card className="p-3 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm">Updating...</span>
            </Card>
          </div>
        )}
        
        {sportsWithEvents.length === 0 ? (
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No Live Events</h2>
            <p className="text-muted-foreground">Check back later for upcoming matches.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 auto-rows-start">
            {sportsWithEvents.map(({ sport, events, dateKey }) => (
              <div key={sport} className="animate-slide-up">
                <SportColumn 
                  sport={sport} 
                  events={events} 
                  dateKey={dateKey}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
