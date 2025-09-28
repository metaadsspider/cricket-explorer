import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface SportsFilterProps {
  availableSports: string[];
  selectedSports: string[];
  onSportsChange: (sports: string[]) => void;
}

export const SportsFilter = ({ availableSports, selectedSports, onSportsChange }: SportsFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSportSelect = (sport: string) => {
    if (!selectedSports.includes(sport)) {
      onSportsChange([...selectedSports, sport]);
    }
    setIsOpen(false);
  };

  const handleSportRemove = (sport: string) => {
    onSportsChange(selectedSports.filter(s => s !== sport));
  };

  const handleClearAll = () => {
    onSportsChange([]);
  };

  const handleShowAll = () => {
    onSportsChange(availableSports);
  };

  const remainingSports = availableSports.filter(sport => !selectedSports.includes(sport));

  return (
    <Card className="p-4 mb-6 border-2 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Filter Sports</h3>
        </div>
        <div className="flex gap-2">
          {selectedSports.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear All
            </button>
          )}
          {selectedSports.length !== availableSports.length && (
            <button
              onClick={handleShowAll}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Show All
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Selected Sports */}
        {selectedSports.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Selected Sports:</p>
            <div className="flex flex-wrap gap-2">
              {selectedSports.map((sport) => (
                <Badge 
                  key={sport} 
                  variant="default" 
                  className="flex items-center gap-1 text-sm px-3 py-1"
                >
                  {sport}
                  <button
                    onClick={() => handleSportRemove(sport)}
                    className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Add Sport Selector */}
        {remainingSports.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Add Sport:</p>
            <Select onValueChange={handleSportSelect} open={isOpen} onOpenChange={setIsOpen}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a sport to add..." />
              </SelectTrigger>
              <SelectContent>
                {remainingSports.map((sport) => (
                  <SelectItem key={sport} value={sport}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedSports.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            No sports selected. All sports are currently shown.
          </p>
        )}
      </div>
    </Card>
  );
};