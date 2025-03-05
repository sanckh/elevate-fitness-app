
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedButton from '@/components/AnimatedButton';
import { Ruler, ImagePlus, Weight, Gallery, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';

// Dummy data for progress entries
const progressEntries = [
  {
    id: '1',
    date: new Date(2023, 6, 10),
    weight: 180,
    bodyFat: 18,
    measurements: {
      chest: 42,
      waist: 34,
      arms: 15,
    },
    photos: [
      '/placeholder.svg',
      '/placeholder.svg',
    ]
  },
  {
    id: '2',
    date: new Date(2023, 7, 10),
    weight: 175,
    bodyFat: 16,
    measurements: {
      chest: 43,
      waist: 32,
      arms: 16,
    },
    photos: [
      '/placeholder.svg',
      '/placeholder.svg',
    ]
  },
  {
    id: '3',
    date: new Date(2023, 8, 10),
    weight: 172,
    bodyFat: 15,
    measurements: {
      chest: 44,
      waist: 31,
      arms: 16.5,
    },
    photos: [
      '/placeholder.svg',
      '/placeholder.svg',
    ]
  },
];

const Progression = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEntry, setSelectedEntry] = useState(progressEntries[2]);
  const [activeTab, setActiveTab] = useState('photos');
  const [weight, setWeight] = useState(selectedEntry?.weight?.toString() || '');
  const [bodyFat, setBodyFat] = useState(selectedEntry?.bodyFat?.toString() || '');
  const [chest, setChest] = useState(selectedEntry?.measurements?.chest?.toString() || '');
  const [waist, setWaist] = useState(selectedEntry?.measurements?.waist?.toString() || '');
  const [arms, setArms] = useState(selectedEntry?.measurements?.arms?.toString() || '');

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    // In a real app, we would fetch the entry for this date
    const entry = progressEntries.find(
      (e) => e.date.toDateString() === date?.toDateString()
    );
    if (entry) {
      setSelectedEntry(entry);
      setWeight(entry.weight?.toString() || '');
      setBodyFat(entry.bodyFat?.toString() || '');
      setChest(entry.measurements?.chest?.toString() || '');
      setWaist(entry.measurements?.waist?.toString() || '');
      setArms(entry.measurements?.arms?.toString() || '');
    }
  };

  // Get dates with entries for highlighting on calendar
  const datesWithEntries = progressEntries.map((entry) => entry.date);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      {/* Page Header */}
      <div className="bg-primary text-primary-foreground py-8 mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">Body Progression Tracker</h1>
            <p className="text-primary-foreground/80">Track your physical changes and progress over time</p>
          </div>
        </div>
      </div>
      
      {/* Page Content */}
      <div className="container mx-auto px-4 md:px-6 py-8 flex-1">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Calendar Column */}
            <div className="md:col-span-5">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    <span>Select Date</span>
                  </CardTitle>
                  <CardDescription>View or add progress data for specific dates</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    modifiers={{
                      hasEntry: datesWithEntries,
                    }}
                    className="rounded-md border"
                  />
                  
                  <div className="mt-4">
                    <AnimatedButton 
                      variant="default" 
                      size="sm"
                      className="w-full"
                    >
                      <ImagePlus className="h-4 w-4 mr-2" />
                      Add New Entry
                    </AnimatedButton>
                  </div>
                </CardContent>
              </Card>
              
              {/* Stats Card */}
              {selectedEntry && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Progress Summary</span>
                    </CardTitle>
                    <CardDescription>
                      {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-secondary/20 p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground">Weight</div>
                          <div className="text-xl font-semibold flex items-center gap-1">
                            {selectedEntry.weight} 
                            <span className="text-xs text-muted-foreground">lbs</span>
                          </div>
                        </div>
                        <div className="bg-secondary/20 p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground">Body Fat</div>
                          <div className="text-xl font-semibold flex items-center gap-1">
                            {selectedEntry.bodyFat}
                            <span className="text-xs text-muted-foreground">%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <h4 className="text-sm font-medium mb-2">Measurements</h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Chest:</span>
                            <span>{selectedEntry.measurements.chest}"</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Waist:</span>
                            <span>{selectedEntry.measurements.waist}"</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Arms:</span>
                            <span>{selectedEntry.measurements.arms}"</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Tabs Column */}
            <div className="md:col-span-7">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
                  </CardTitle>
                  <CardDescription>View and update your progress data</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="photos" className="flex items-center gap-2">
                        <Gallery className="h-4 w-4" />
                        <span>Photos</span>
                      </TabsTrigger>
                      <TabsTrigger value="measurements" className="flex items-center gap-2">
                        <Ruler className="h-4 w-4" />
                        <span>Measurements</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="photos">
                      {selectedEntry?.photos?.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          {selectedEntry.photos.map((photo, index) => (
                            <div key={index} className="relative aspect-square rounded-md overflow-hidden border bg-muted">
                              <img 
                                src={photo} 
                                alt={`Progress photo ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Gallery className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">No photos yet</h3>
                          <p className="text-muted-foreground mb-4">
                            Add progress photos to track your physical changes
                          </p>
                          <AnimatedButton variant="outline">
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Upload Photos
                          </AnimatedButton>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="measurements">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="weight">Weight (lbs)</Label>
                            <div className="flex">
                              <div className="relative flex-1">
                                <Weight className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="weight"
                                  value={weight}
                                  onChange={(e) => setWeight(e.target.value)}
                                  className="pl-10"
                                  type="number"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bodyFat">Body Fat (%)</Label>
                            <Input
                              id="bodyFat"
                              value={bodyFat}
                              onChange={(e) => setBodyFat(e.target.value)}
                              type="number"
                            />
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t">
                          <h4 className="text-sm font-medium mb-3">Body Measurements (inches)</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="chest">Chest</Label>
                              <Input
                                id="chest"
                                value={chest}
                                onChange={(e) => setChest(e.target.value)}
                                type="number"
                                step="0.25"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="waist">Waist</Label>
                              <Input
                                id="waist"
                                value={waist}
                                onChange={(e) => setWaist(e.target.value)}
                                type="number"
                                step="0.25"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="arms">Arms</Label>
                              <Input
                                id="arms"
                                value={arms}
                                onChange={(e) => setArms(e.target.value)}
                                type="number"
                                step="0.25"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-4 pt-4 border-t">
                          <AnimatedButton 
                            variant="default"
                          >
                            Save Changes
                          </AnimatedButton>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Progression;
