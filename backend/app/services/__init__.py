from datetime import datetime, timedelta
from app.models import CardProgress, ReviewQuality


class SpacedRepetitionService:
    """
    Service implementing SM-2 spaced repetition algorithm.

    Algorithm details:
    - Ease Factor (EF): Starts at 2.5, min 1.3, max 2.5
    - Quality levels: Again(0), Hard(3), Good(4), Easy(5)
    - Intervals calculated based on quality and current progress
    """

    MIN_EASE_FACTOR = 1.3
    MAX_EASE_FACTOR = 2.5
    DEFAULT_EASE_FACTOR = 2.5

    @staticmethod
    def calculate_next_review(
            current_progress: CardProgress,
            quality: ReviewQuality
    ) -> CardProgress:
        """
        Calculate next review date and update progress based on quality rating.

        Args:
            current_progress: Current CardProgress object (can be new)
            quality: ReviewQuality enum value

        Returns:
            Updated CardProgress object
        """
        now = datetime.now()

        # Initialize if new card
        if current_progress.ease_factor == 0:
            current_progress.ease_factor = SpacedRepetitionService.DEFAULT_EASE_FACTOR

        # Handle different quality ratings
        if quality == ReviewQuality.AGAIN:
            # Failed - reset progress
            current_progress.interval_days = 0
            current_progress.repetitions = 0
            current_progress.lapses += 1
            current_progress.ease_factor = max(
                current_progress.ease_factor - 0.2,
                SpacedRepetitionService.MIN_EASE_FACTOR
            )
            # Review again today or tomorrow
            current_progress.next_review = now + timedelta(days=1)

        elif quality == ReviewQuality.HARD:
            # Correct but difficult
            if current_progress.repetitions == 0:
                current_progress.interval_days = 1
            else:
                current_progress.interval_days = int(current_progress.interval_days * 1.2)

            current_progress.ease_factor = max(
                current_progress.ease_factor - 0.15,
                SpacedRepetitionService.MIN_EASE_FACTOR
            )
            current_progress.repetitions += 1
            current_progress.next_review = now + timedelta(days=current_progress.interval_days)

        elif quality == ReviewQuality.GOOD:
            # Correct with some hesitation
            if current_progress.repetitions == 0:
                current_progress.interval_days = 1
            elif current_progress.repetitions == 1:
                current_progress.interval_days = 6
            else:
                current_progress.interval_days = int(
                    current_progress.interval_days * current_progress.ease_factor
                )

            current_progress.repetitions += 1
            current_progress.next_review = now + timedelta(days=current_progress.interval_days)

        elif quality == ReviewQuality.EASY:
            # Perfect recall
            if current_progress.repetitions == 0:
                current_progress.interval_days = 4
            else:
                current_progress.interval_days = int(
                    current_progress.interval_days * current_progress.ease_factor * 1.3
                )

            current_progress.ease_factor = min(
                current_progress.ease_factor + 0.15,
                SpacedRepetitionService.MAX_EASE_FACTOR
            )
            current_progress.repetitions += 1
            current_progress.next_review = now + timedelta(days=current_progress.interval_days)

        current_progress.last_reviewed = now

        return current_progress

    @staticmethod
    def get_card_status(progress: CardProgress) -> str:
        """
        Get the learning status of a card.

        Returns:
            'new' - Never reviewed
            'learning' - Reviewed but not yet mature (repetitions < 3)
            'mature' - Well learned (repetitions >= 3, EF >= 2.0)
        """
        if progress is None or progress.repetitions == 0:
            return 'new'
        elif progress.repetitions < 3 or progress.ease_factor < 2.0:
            return 'learning'
        else:
            return 'mature'