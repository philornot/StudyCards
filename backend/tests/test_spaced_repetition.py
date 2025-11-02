from datetime import datetime, timedelta
from app.services import SpacedRepetitionService
from app.models import CardProgress, ReviewQuality


def test_sm2_algorithm_again_quality():
    """Test algorithm with Again quality (failed recall)"""
    progress = CardProgress(
        ease_factor=2.5,
        interval_days=10,
        repetitions=3,
        lapses=0
    )

    updated = SpacedRepetitionService.calculate_next_review(progress, ReviewQuality.AGAIN)

    assert updated.interval_days == 0
    assert updated.repetitions == 0
    assert updated.lapses == 1
    assert updated.ease_factor == 2.3  # 2.5 - 0.2
    assert updated.last_reviewed is not None
    assert updated.next_review is not None


def test_sm2_algorithm_hard_quality():
    """Test algorithm with Hard quality"""
    progress = CardProgress(
        ease_factor=2.5,
        interval_days=10,
        repetitions=2,
        lapses=0
    )

    updated = SpacedRepetitionService.calculate_next_review(progress, ReviewQuality.HARD)

    assert updated.interval_days == 12  # 10 * 1.2
    assert updated.repetitions == 3
    assert updated.ease_factor == 2.35  # 2.5 - 0.15
    assert updated.last_reviewed is not None


def test_sm2_algorithm_good_quality_first_time():
    """Test algorithm with Good quality for first review"""
    progress = CardProgress(
        ease_factor=2.5,
        interval_days=0,
        repetitions=0,
        lapses=0
    )

    updated = SpacedRepetitionService.calculate_next_review(progress, ReviewQuality.GOOD)

    assert updated.interval_days == 1
    assert updated.repetitions == 1
    assert updated.ease_factor == 2.5  # Unchanged for Good


def test_sm2_algorithm_good_quality_second_time():
    """Test algorithm with Good quality for second review"""
    progress = CardProgress(
        ease_factor=2.5,
        interval_days=1,
        repetitions=1,
        lapses=0
    )

    updated = SpacedRepetitionService.calculate_next_review(progress, ReviewQuality.GOOD)

    assert updated.interval_days == 6
    assert updated.repetitions == 2


def test_sm2_algorithm_good_quality_mature():
    """Test algorithm with Good quality for mature card"""
    progress = CardProgress(
        ease_factor=2.5,
        interval_days=6,
        repetitions=2,
        lapses=0
    )

    updated = SpacedRepetitionService.calculate_next_review(progress, ReviewQuality.GOOD)

    assert updated.interval_days == 15  # 6 * 2.5
    assert updated.repetitions == 3


def test_sm2_algorithm_easy_quality():
    """Test algorithm with Easy quality"""
    progress = CardProgress(
        ease_factor=2.5,
        interval_days=10,
        repetitions=2,
        lapses=0
    )

    updated = SpacedRepetitionService.calculate_next_review(progress, ReviewQuality.EASY)

    assert updated.interval_days == 32  # 10 * 2.5 * 1.3
    assert updated.repetitions == 3
    assert updated.ease_factor == 2.5  # Max cap
    assert updated.last_reviewed is not None


def test_sm2_ease_factor_minimum():
    """Test that ease factor doesn't go below minimum"""
    progress = CardProgress(
        ease_factor=1.3,
        interval_days=5,
        repetitions=2,
        lapses=5
    )

    updated = SpacedRepetitionService.calculate_next_review(progress, ReviewQuality.AGAIN)

    assert updated.ease_factor == 1.3  # Should not go below minimum


def test_sm2_ease_factor_maximum():
    """Test that ease factor doesn't exceed maximum"""
    progress = CardProgress(
        ease_factor=2.5,
        interval_days=10,
        repetitions=3,
        lapses=0
    )

    updated = SpacedRepetitionService.calculate_next_review(progress, ReviewQuality.EASY)

    assert updated.ease_factor == 2.5  # Should not exceed maximum


def test_get_card_status_new():
    """Test card status for new cards"""
    progress = CardProgress(
        ease_factor=2.5,
        interval_days=0,
        repetitions=0,
        lapses=0
    )

    status = SpacedRepetitionService.get_card_status(progress)
    assert status == 'new'


def test_get_card_status_learning():
    """Test card status for learning cards"""
    progress = CardProgress(
        ease_factor=2.5,
        interval_days=1,
        repetitions=2,
        lapses=0
    )

    status = SpacedRepetitionService.get_card_status(progress)
    assert status == 'learning'


def test_get_card_status_mature():
    """Test card status for mature cards"""
    progress = CardProgress(
        ease_factor=2.5,
        interval_days=30,
        repetitions=5,
        lapses=0
    )

    status = SpacedRepetitionService.get_card_status(progress)
    assert status == 'mature'


def test_get_card_status_none():
    """Test card status when progress is None"""
    status = SpacedRepetitionService.get_card_status(None)
    assert status == 'new'