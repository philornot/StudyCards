# Spaced Repetition Algorithm - Decision Document

## Overview
This document outlines the research and decision-making process for choosing a spaced repetition algorithm for the Study Cards application.

## Algorithms Considered

### 1. SM-2 (SuperMemo 2)
**Pros:**
- Simple and well-documented
- Proven effectiveness since 1988
- Easy to implement
- Requires minimal data storage
- Good for small to medium datasets

**Cons:**
- Less accurate than modern algorithms
- Fixed intervals may not be optimal for all users
- Doesn't adapt well to individual learning patterns

**Formula:**
- EF (Easiness Factor): Starts at 2.5
- Interval calculation based on quality (0-5 scale)
- EF adjustment: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))

### 2. FSRS (Free Spaced Repetition Scheduler)
**Pros:**
- Modern, research-backed algorithm
- Adapts to individual learning patterns
- More accurate predictions
- Open source and actively maintained

**Cons:**
- More complex to implement
- Requires more computational resources
- More data storage needed
- Overkill for simple use cases

### 3. Simplified Custom Algorithm
**Pros:**
- Tailored to specific needs
- Easy to understand and modify
- Minimal storage requirements
- Fast to implement

**Cons:**
- Less proven than established algorithms
- May require tuning and adjustments
- Limited by our research capabilities

## Decision: SM-2 Algorithm

**Rationale:**
We choose SM-2 because:
1. **Simplicity**: Easy to implement and maintain
2. **Proven Track Record**: Used successfully for decades
3. **Sufficient for MVP**: Provides good results without complexity
4. **Low Storage**: Minimal database requirements
5. **Extensibility**: Can be upgraded to FSRS later if needed

## SM-2 Implementation Specification

### Quality Ratings
We'll use 4 quality levels (simplified from original 6):
- **Again (0)**: Complete blackout, wrong response
- **Hard (3)**: Correct response with serious difficulty
- **Good (4)**: Correct response with hesitation
- **Easy (5)**: Perfect response

### Data Storage
For each card, we store:
- `ease_factor`: Starting at 2.5, minimum 1.3
- `interval_days`: Days until next review
- `repetitions`: Number of successful repetitions
- `last_reviewed`: Timestamp of last review
- `next_review`: Calculated next review date
- `lapses`: Number of times rated "Again"

### Interval Calculation

#### For "Again" (quality = 0):
- interval = 0 (review again in same session or next day)
- repetitions = 0
- lapses += 1
- ease_factor -= 0.2 (min 1.3)

#### For "Hard" (quality = 3):
- If repetitions == 0: interval = 1 day
- Else: interval = previous_interval * 1.2
- ease_factor -= 0.15 (min 1.3)

#### For "Good" (quality = 4):
- If repetitions == 0: interval = 1 day
- If repetitions == 1: interval = 6 days
- Else: interval = previous_interval * ease_factor
- repetitions += 1

#### For "Easy" (quality = 5):
- If repetitions == 0: interval = 4 days
- Else: interval = previous_interval * ease_factor * 1.3
- repetitions += 1
- ease_factor += 0.15 (max 2.5)

### Daily New Cards Limit
- Default: 20 new cards per day
- Configurable per user (future feature)

### Review Priority
1. Overdue cards (next_review < today) - sorted by most overdue first
2. Due today cards (next_review == today)
3. New cards (never reviewed) - up to daily limit

## Future Considerations

If we need better accuracy later, we can:
1. Collect learning data from users
2. Implement FSRS as an optional advanced mode
3. Allow users to choose their preferred algorithm
4. Add machine learning to optimize intervals

## References
- [SuperMemo SM-2 Algorithm](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)
- [FSRS Documentation](https://github.com/open-spaced-repetition/fsrs4anki/wiki)
- [Anki's Modified SM-2](https://faqs.ankiweb.net/what-spaced-repetition-algorithm.html)
