"""
End-to-end tests for main user flows.
Note: These are basic integration tests. For full E2E testing,
use Playwright or Cypress on the frontend.
"""
import pytest
from fastapi.testclient import TestClient


def test_full_study_flow(client):
    """Test complete flow: create set → study SR → review cards"""
    # 1. Create a set with 3 cards
    set_data = {
        "title": "E2E Test Set",
        "description": "Testing full flow",
        "cards": [
            {"term": "Term 1", "definition": "Def 1", "order": 0},
            {"term": "Term 2", "definition": "Def 2", "order": 1},
            {"term": "Term 3", "definition": "Def 3", "order": 2}
        ]
    }

    create_response = client.post("/api/sets", json=set_data)
    assert create_response.status_code == 201
    set_id = create_response.json()["id"]

    # 2. Get study session - should have 3 new cards
    study_response = client.get(f"/api/sets/{set_id}/study-sr")
    assert study_response.status_code == 200
    study_data = study_response.json()

    assert study_data["stats"]["total_cards"] == 3
    assert study_data["stats"]["new_cards"] == 3
    assert len(study_data["cards"]) == 3

    # 3. Review first card with "good"
    first_card_id = study_data["cards"][0]["id"]
    review_response = client.post("/api/review", json={
        "card_id": first_card_id,
        "quality": "good"
    })
    assert review_response.status_code == 200
    progress = review_response.json()
    assert progress["repetitions"] == 1
    assert progress["interval_days"] == 1

    # 4. Review second card with "easy"
    second_card_id = study_data["cards"][1]["id"]
    review_response = client.post("/api/review", json={
        "card_id": second_card_id,
        "quality": "easy"
    })
    assert review_response.status_code == 200
    progress = review_response.json()
    assert progress["repetitions"] == 1
    assert progress["interval_days"] == 4

    # 5. Get stats - should show progress
    stats_response = client.get(f"/api/sets/{set_id}/stats")
    assert stats_response.status_code == 200
    stats = stats_response.json()

    assert stats["total_cards"] == 3
    assert stats["new_cards"] == 1  # One not reviewed yet
    assert stats["learning_cards"] == 2  # Two reviewed but still learning
    assert stats["reviews_total"] == 2


def test_create_study_edit_delete_flow(client):
    """Test CRUD operations on a set"""
    # Create
    set_data = {
        "title": "CRUD Test",
        "cards": [{"term": "A", "definition": "B", "order": 0}]
    }
    create_response = client.post("/api/sets", json=set_data)
    assert create_response.status_code == 201
    set_id = create_response.json()["id"]

    # Read
    get_response = client.get(f"/api/sets/{set_id}")
    assert get_response.status_code == 200
    assert get_response.json()["title"] == "CRUD Test"

    # Update
    update_data = {
        "title": "CRUD Test Updated",
        "cards": [
            {"term": "A", "definition": "B", "order": 0},
            {"term": "C", "definition": "D", "order": 1}
        ]
    }
    update_response = client.put(f"/api/sets/{set_id}", json=update_data)
    assert update_response.status_code == 200
    assert len(update_response.json()["cards"]) == 2

    # Delete
    delete_response = client.delete(f"/api/sets/{set_id}")
    assert delete_response.status_code == 204

    # Verify deleted
    get_response = client.get(f"/api/sets/{set_id}")
    assert get_response.status_code == 404


def test_reset_progress_flow(client):
    """Test resetting learning progress"""
    # Create set and add progress
    set_data = {
        "title": "Reset Test",
        "cards": [{"term": "X", "definition": "Y", "order": 0}]
    }
    create_response = client.post("/api/sets", json=set_data)
    set_id = create_response.json()["id"]
    card_id = create_response.json()["cards"][0]["id"]

    # Add some progress
    client.post("/api/review", json={"card_id": card_id, "quality": "good"})
    client.post("/api/review", json={"card_id": card_id, "quality": "good"})

    # Verify progress exists
    stats_response = client.get(f"/api/sets/{set_id}/stats")
    stats = stats_response.json()
    assert stats["new_cards"] == 0
    assert stats["learning_cards"] == 1

    # Reset progress
    reset_response = client.post(f"/api/sets/{set_id}/reset-progress")
    assert reset_response.status_code == 204

    # Verify progress is reset
    stats_response = client.get(f"/api/sets/{set_id}/stats")
    stats = stats_response.json()
    assert stats["new_cards"] == 1
    assert stats["learning_cards"] == 0
    assert stats["reviews_total"] == 0