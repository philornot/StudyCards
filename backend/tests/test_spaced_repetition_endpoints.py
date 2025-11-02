from datetime import datetime, timedelta


def test_get_study_sr_cards_new_set(client):
    """Test getting study cards for a new set with no progress"""
    # Create a set with cards
    set_data = {
        "title": "Test Set for SR",
        "cards": [
            {"term": "Card 1", "definition": "Def 1", "order": 0},
            {"term": "Card 2", "definition": "Def 2", "order": 1},
            {"term": "Card 3", "definition": "Def 3", "order": 2}
        ]
    }
    create_response = client.post("/api/sets", json=set_data)
    set_id = create_response.json()["id"]

    # Get study cards
    response = client.get(f"/api/sets/{set_id}/study-sr")
    assert response.status_code == 200

    data = response.json()
    assert "cards" in data
    assert "stats" in data

    # All cards should be new
    assert data["stats"]["total_cards"] == 3
    assert data["stats"]["new_cards"] == 3
    assert data["stats"]["review_cards"] == 0
    assert data["stats"]["overdue_cards"] == 0

    # Cards should have no progress
    for card in data["cards"]:
        assert card["progress"] is None


def test_get_study_sr_cards_nonexistent_set(client):
    """Test getting study cards for non-existent set"""
    response = client.get("/api/sets/999/study-sr")
    assert response.status_code == 404


def test_submit_review_new_card_good(client):
    """Test submitting review for a new card with Good quality"""
    # Create a set with one card
    set_data = {
        "title": "Review Test Set",
        "cards": [{"term": "Test", "definition": "Definition", "order": 0}]
    }
    create_response = client.post("/api/sets", json=set_data)
    card_id = create_response.json()["cards"][0]["id"]

    # Submit review
    review_data = {
        "card_id": card_id,
        "quality": "good"
    }
    response = client.post("/api/review", json=review_data)
    assert response.status_code == 200

    data = response.json()
    assert data["card_id"] == card_id
    assert data["ease_factor"] == 2.5
    assert data["interval_days"] == 1
    assert data["repetitions"] == 1
    assert data["lapses"] == 0
    assert data["last_reviewed"] is not None
    assert data["next_review"] is not None


def test_submit_review_again_quality(client):
    """Test submitting review with Again quality (failed)"""
    # Create card and add initial progress
    set_data = {
        "title": "Test Set",
        "cards": [{"term": "Test", "definition": "Def", "order": 0}]
    }
    create_response = client.post("/api/sets", json=set_data)
    card_id = create_response.json()["cards"][0]["id"]

    # First review - Good
    client.post("/api/review", json={"card_id": card_id, "quality": "good"})

    # Second review - Again (failed)
    response = client.post("/api/review", json={"card_id": card_id, "quality": "again"})
    assert response.status_code == 200

    data = response.json()
    assert data["repetitions"] == 0  # Reset
    assert data["lapses"] == 1
    assert data["ease_factor"] < 2.5  # Decreased


def test_submit_review_hard_quality(client):
    """Test submitting review with Hard quality"""
    set_data = {
        "title": "Test Set",
        "cards": [{"term": "Test", "definition": "Def", "order": 0}]
    }
    create_response = client.post("/api/sets", json=set_data)
    card_id = create_response.json()["cards"][0]["id"]

    response = client.post("/api/review", json={"card_id": card_id, "quality": "hard"})
    assert response.status_code == 200

    data = response.json()
    assert data["repetitions"] == 1
    assert data["ease_factor"] < 2.5  # Slightly decreased
    assert data["interval_days"] == 1


def test_submit_review_easy_quality(client):
    """Test submitting review with Easy quality"""
    set_data = {
        "title": "Test Set",
        "cards": [{"term": "Test", "definition": "Def", "order": 0}]
    }
    create_response = client.post("/api/sets", json=set_data)
    card_id = create_response.json()["cards"][0]["id"]

    response = client.post("/api/review", json={"card_id": card_id, "quality": "easy"})
    assert response.status_code == 200

    data = response.json()
    assert data["repetitions"] == 1
    assert data["ease_factor"] == 2.5  # At max already
    assert data["interval_days"] == 4  # First easy review


def test_submit_review_progression(client):
    """Test multiple reviews showing progression"""
    set_data = {
        "title": "Test Set",
        "cards": [{"term": "Test", "definition": "Def", "order": 0}]
    }
    create_response = client.post("/api/sets", json=set_data)
    card_id = create_response.json()["cards"][0]["id"]

    # First review - Good
    response1 = client.post("/api/review", json={"card_id": card_id, "quality": "good"})
    data1 = response1.json()
    assert data1["interval_days"] == 1
    assert data1["repetitions"] == 1

    # Second review - Good
    response2 = client.post("/api/review", json={"card_id": card_id, "quality": "good"})
    data2 = response2.json()
    assert data2["interval_days"] == 6
    assert data2["repetitions"] == 2

    # Third review - Good
    response3 = client.post("/api/review", json={"card_id": card_id, "quality": "good"})
    data3 = response3.json()
    assert data3["interval_days"] == 15  # 6 * 2.5
    assert data3["repetitions"] == 3


def test_submit_review_invalid_card(client):
    """Test submitting review for non-existent card"""
    review_data = {
        "card_id": 999,
        "quality": "good"
    }
    response = client.post("/api/review", json=review_data)
    assert response.status_code == 404


def test_submit_review_invalid_quality(client):
    """Test submitting review with invalid quality"""
    set_data = {
        "title": "Test Set",
        "cards": [{"term": "Test", "definition": "Def", "order": 0}]
    }
    create_response = client.post("/api/sets", json=set_data)
    card_id = create_response.json()["cards"][0]["id"]

    review_data = {
        "card_id": card_id,
        "quality": "invalid"
    }
    response = client.post("/api/review", json=review_data)
    assert response.status_code == 422  # Validation error

