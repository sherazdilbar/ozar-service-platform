# Category Selection State Bug Fix

## Problem
When selecting a category during PRO signup, the `selectedGroup` state was being reset to `null`, causing the "Next: Create Profile" button to disappear.

### Console Logs Showing the Bug
```
🎯 Footer render - selectedGroup: home_repairs categories: 0
🔄 Toggling category: ELECTRICIAN
➕ Added, new count: 1
🎯 Footer render - selectedGroup: home_repairs categories: 1  ← Correct!
🎯 Footer render - selectedGroup: null categories: 1  ← BUG! State reset
```

## Root Cause Analysis
The issue was caused by multiple factors:

1. **Non-functional state updates**: The `toggleCategory` function was reading from `selectedCategories` directly instead of using functional updates, which could cause stale state issues during rapid re-renders.

2. **Early return causing state loss**: The `if (!isOpen) return null;` was placed before the component logic, which could cause the component to unmount and lose state when `isOpen` changed.

3. **Complex footer rendering**: The footer used an IIFE (Immediately Invoked Function Expression) that made debugging difficult and added unnecessary complexity.

## Fixes Applied

### 1. Functional State Updates
Changed from direct state access to functional updates:

**Before:**
```tsx
const toggleCategory = (category: ServiceCategory) => {
  if (selectedCategories.includes(category)) {
    const newCategories = selectedCategories.filter(c => c !== category);
    setSelectedCategories(newCategories);
  } else {
    const newCategories = [...selectedCategories, category];
    setSelectedCategories(newCategories);
  }
};
```

**After:**
```tsx
const toggleCategory = useCallback((category: ServiceCategory) => {
  setSelectedCategories(prev => {
    if (prev.includes(category)) {
      return prev.filter(c => c !== category);
    } else {
      if (prev.length >= 5) {
        setError('Maximum 5 categories allowed...');
        return prev;
      }
      return [...prev, category];
    }
  });
}, []);
```

### 2. Moved Early Return
Moved the `if (!isOpen) return null;` check to after all hooks to prevent state loss:

**Before:**
```tsx
export default function CategorySelectionModal({ ... }) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  // ... other state
  
  if (!isOpen) return null;  // ❌ Too early!
  
  const toggleCategory = () => { ... };
  // ... rest of component
}
```

**After:**
```tsx
export default function CategorySelectionModal({ ... }) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  // ... other state
  
  const toggleCategory = useCallback(() => { ... }, []);
  // ... other functions
  
  if (!isOpen) return null;  // ✅ After all hooks!
  
  return ( ... );
}
```

### 3. Simplified Footer Rendering
Removed the IIFE and used direct conditional rendering:

**Before:**
```tsx
<div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
  {(() => {
    console.log('🎯 Footer render - ...', selectedGroup, ...);
    
    if (profileCreated) {
      return <button>...</button>;
    }
    if (selectedGroup) {
      return <div>...</div>;
    }
    return <div>...</div>;
  })()}
</div>
```

**After:**
```tsx
<div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
  {profileCreated ? (
    <button>...</button>
  ) : selectedGroup ? (
    <div>...</div>
  ) : (
    <div>...</div>
  )}
</div>
```

### 4. Added Comprehensive Debugging
Added debug logs to track state changes and component lifecycle:

```tsx
// Track component mount/unmount
useEffect(() => {
  console.log('🚀 CategorySelectionModal MOUNTED');
  return () => {
    console.log('💀 CategorySelectionModal UNMOUNTED');
  };
}, []);

// Track selectedGroup changes
useEffect(() => {
  console.log('🎯 selectedGroup changed to:', selectedGroup);
}, [selectedGroup]);

// Track selectedCategories changes
useEffect(() => {
  console.log('📦 selectedCategories changed to:', selectedCategories);
}, [selectedCategories]);

// Stack traces for debugging
const handleBack = useCallback(() => {
  console.log('⬅️ Going back, clearing group');
  console.trace('Stack trace for handleBack');
  setSelectedGroup(null);
}, []);
```

### 5. Memoized Callbacks
Used `useCallback` to prevent unnecessary re-creations of handler functions:

```tsx
const toggleCategory = useCallback((category: ServiceCategory) => { ... }, []);
const handleGroupSelect = useCallback((groupId: string) => { ... }, []);
const handleBack = useCallback(() => { ... }, []);
```

## Testing Instructions

1. **Start the web app**: Navigate to signup page
2. **Sign up as PRO**: Fill in details and select PRO role
3. **Select a category group**: Click on "Home & Property Services"
4. **Select a category**: Click on "Electrician"
5. **Verify button appears**: The "Next: Create Profile" button should appear immediately
6. **Check console logs**: Should show:
   ```
   🎯 selectedGroup changed to: home_repairs
   📦 selectedCategories changed to: ['ELECTRICIAN']
   ```
7. **Select more categories**: Button should remain visible
8. **Click "Next: Create Profile"**: Should create profile and show success screen
9. **Click "Go to Dashboard"**: Should redirect to PRO dashboard

## Expected Behavior

- ✅ Button appears immediately when 1 category is selected
- ✅ Button remains visible when selecting/deselecting categories
- ✅ `selectedGroup` state persists throughout category selection
- ✅ No unexpected component unmounts/remounts
- ✅ State updates are consistent and predictable

## Files Modified

- `apps/web/src/components/CategorySelectionModal.tsx`

## Related Issues

- Category selection is mandatory for PRO users
- Minimum 1 category, maximum 5 categories
- Success screen with "Go to Dashboard" button (no auto-redirect)
- Categories persist and display in profile and services pages
