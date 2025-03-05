
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Save, X } from 'lucide-react';

export interface ExerciseSet {
  id: string;
  reps: number;
  weight?: number;
}

interface ExerciseSetListProps {
  sets: ExerciseSet[];
  onSetsChange: (sets: ExerciseSet[]) => void;
}

const ExerciseSetList = ({ sets, onSetsChange }: ExerciseSetListProps) => {
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [tempReps, setTempReps] = useState<string>('');
  const [tempWeight, setTempWeight] = useState<string>('');

  const handleAddSet = () => {
    const newSet: ExerciseSet = {
      id: crypto.randomUUID(),
      reps: 10,
      weight: undefined
    };
    onSetsChange([...sets, newSet]);
  };

  const handleRemoveSet = (setId: string) => {
    onSetsChange(sets.filter(set => set.id !== setId));
  };

  const startEditing = (set: ExerciseSet) => {
    setEditingSetId(set.id);
    setTempReps(set.reps.toString());
    setTempWeight(set.weight?.toString() || '');
  };

  const saveSetEdit = (setId: string) => {
    const updatedSets = sets.map(set => {
      if (set.id === setId) {
        return {
          ...set,
          reps: parseInt(tempReps) || 1,
          weight: tempWeight ? (parseInt(tempWeight) || undefined) : undefined
        };
      }
      return set;
    });
    
    onSetsChange(updatedSets);
    cancelEditing();
  };

  const cancelEditing = () => {
    setEditingSetId(null);
    setTempReps('');
    setTempWeight('');
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-muted-foreground">Sets</h4>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddSet}
          className="h-8 px-2 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Set
        </Button>
      </div>
      
      {sets.length === 0 ? (
        <div className="text-center py-3 text-muted-foreground text-sm">
          No sets added yet. Click "Add Set" to begin.
        </div>
      ) : (
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-2 text-xs font-medium text-muted-foreground">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Reps</div>
            <div className="col-span-5">Weight</div>
            <div className="col-span-2"></div>
          </div>
          
          {/* Set rows */}
          {sets.map((set, index) => (
            <div 
              key={set.id} 
              className="grid grid-cols-12 gap-2 items-center bg-muted/30 p-2 rounded-md"
            >
              <div className="col-span-1 font-medium text-sm">{index + 1}</div>
              
              {editingSetId === set.id ? (
                <>
                  <div className="col-span-4">
                    <Input
                      type="number"
                      min="1"
                      value={tempReps}
                      onChange={(e) => setTempReps(e.target.value)}
                      className="h-8 text-sm"
                      autoFocus
                    />
                  </div>
                  <div className="col-span-5">
                    <Input
                      type="number"
                      min="0"
                      step="5"
                      value={tempWeight}
                      onChange={(e) => setTempWeight(e.target.value)}
                      className="h-8 text-sm"
                      placeholder="Optional"
                    />
                  </div>
                  <div className="col-span-2 flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => saveSetEdit(set.id)}
                      className="h-7 w-7 p-0"
                    >
                      <Save className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={cancelEditing}
                      className="h-7 w-7 p-0"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div 
                    className="col-span-4 cursor-pointer hover:bg-muted/70 rounded p-1 text-sm"
                    onClick={() => startEditing(set)}
                  >
                    {set.reps}
                  </div>
                  <div 
                    className="col-span-5 cursor-pointer hover:bg-muted/70 rounded p-1 text-sm"
                    onClick={() => startEditing(set)}
                  >
                    {set.weight ? `${set.weight} lbs` : 'N/A'}
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveSet(set.id)}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      disabled={sets.length === 1}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseSetList;
