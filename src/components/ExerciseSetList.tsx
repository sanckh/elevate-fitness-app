import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { ExerciseSet } from '@/interfaces/exercise';
import { ExerciseSetListProps } from '@/interfaces/exercise';

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

  const startEditing = (set: ExerciseSet, field: 'reps' | 'weight') => {
    // Don't restart editing if we're already editing this set
    if (editingSetId === set.id) return;
    
    setEditingSetId(set.id);
    setTempReps(set.reps.toString());
    setTempWeight(set.weight?.toString() || '');
    
    // Let the render cycle complete before focusing
    setTimeout(() => {
      const input = document.querySelector(`[data-set-id="${set.id}"][data-field="${field}"]`) as HTMLInputElement;
      input?.focus();
    }, 0);
  };

  const saveSetEdit = (setId: string) => {
    const currentSet = sets.find(set => set.id === setId);
    if (!currentSet) return;

    const newReps = parseInt(tempReps) || 1;
    const newWeight = tempWeight === '' ? undefined : (parseInt(tempWeight) || undefined);

    const repsChanged = currentSet.reps !== newReps;
    const weightChanged = 
      (currentSet.weight === undefined && newWeight !== undefined) ||
      (currentSet.weight !== undefined && newWeight === undefined) ||
      (currentSet.weight !== newWeight);

    if (!repsChanged && !weightChanged) {
      cancelEditing();
      return;
    }

    const updatedSets = sets.map(set => {
      if (set.id === setId) {
        return {
          ...set,
          reps: newReps,
          weight: newWeight
        };
      }
      return set;
    });
    
    onSetsChange(updatedSets);
    cancelEditing();
  };

  const handleInputBlur = (setId: string, e: React.FocusEvent) => {
    // Don't save if we're moving focus between inputs in the same set
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.tagName === 'INPUT' && relatedTarget.closest('.exercise-set-inputs')) {
      return;
    }
    saveSetEdit(setId);
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
                  <div className="col-span-4 exercise-set-inputs">
                    <Input
                      type="number"
                      min="1"
                      value={tempReps}
                      onChange={(e) => setTempReps(e.target.value)}
                      onBlur={(e) => handleInputBlur(set.id, e)}
                      className="h-8 text-sm"
                      data-set-id={set.id}
                      data-field="reps"
                    />
                  </div>
                  <div className="col-span-5 exercise-set-inputs">
                    <Input
                      type="number"
                      min="0"
                      step="5"
                      value={tempWeight}
                      onChange={(e) => setTempWeight(e.target.value)}
                      onBlur={(e) => handleInputBlur(set.id, e)}
                      className="h-8 text-sm"
                      placeholder="Optional"
                      data-set-id={set.id}
                      data-field="weight"
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
                    onClick={() => startEditing(set, 'reps')}
                  >
                    {set.reps}
                  </div>
                  <div 
                    className="col-span-5 cursor-pointer hover:bg-muted/70 rounded p-1 text-sm"
                    onClick={() => startEditing(set, 'weight')}
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
