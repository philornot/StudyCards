import pytest
from app.models import Set as SetModel, Card as CardModel


def test_get_empty_sets(client):
    """Test getting sets when database is empty"""
    response = client.get("/api/sets")
    assert response.status_code == 200
    assert response.json() == []


def test_create_set_success(client):
    """Test creating a set with valid data"""
    set_data = {
        "title": "Test Set",
        "description": "Test description",
        "cards": [
            {"term": "Hello", "definition": "Hola", "order": 0},
            {"term": "Goodbye", "definition": "Adiós", "order": 1}
        ]
    }

    response = client.post("/api/sets", json=set_data)
    assert response.status_code == 201

    data = response.json()
    assert data["title"] == "Test Set"
    assert data["description"] == "Test description"
    assert len(data["cards"]) == 2
    assert data["cards"][0]["term"] == "Hello"


def test_create_set_without_title(client):
    """Test creating a set without a title (should fail)"""
    set_data = {
        "description": "Test description",
        "cards": [
            {"term": "Hello", "definition": "Hola", "order": 0}
        ]
    }

    response = client.post("/api/sets", json=set_data)
    assert response.status_code == 422


def test_create_set_without_cards(client):
    """Test creating a set without cards (should fail)"""
    set_data = {
        "title": "Test Set",
        "description": "Test description",
        "cards": []
    }

    response = client.post("/api/sets", json=set_data)
    assert response.status_code == 422


def test_create_set_with_invalid_card(client):
    """Test creating a set with incomplete card data"""
    set_data = {
        "title": "Test Set",
        "cards": [
            {"term": "Hello", "definition": ""},  # Empty definition
        ]
    }

    response = client.post("/api/sets", json=set_data)
    assert response.status_code == 422


def test_get_sets_list(client):
    """Test getting list of sets with card counts"""
    # Create two sets
    set_data_1 = {
        "title": "Set 1",
        "cards": [{"term": "A", "definition": "B", "order": 0}]
    }
    set_data_2 = {
        "title": "Set 2",
        "cards": [
            {"term": "C", "definition": "D", "order": 0},
            {"term": "E", "definition": "F", "order": 1}
        ]
    }

    response_1 = client.post("/api/sets", json=set_data_1)
    response_2 = client.post("/api/sets", json=set_data_2)

    response = client.get("/api/sets")
    assert response.status_code == 200

    data = response.json()
    assert len(data) == 2
    # Sets are ordered by created_at DESC, so Set 2 (newer) comes first
    assert data[0]["title"] == "Set 2"
    assert data[0]["card_count"] == 2
    assert data[1]["title"] == "Set 1"
    assert data[1]["card_count"] == 1


def test_get_set_by_id(client):
    """Test getting a specific set by ID"""
    set_data = {
        "title": "Test Set",
        "description": "Test description",
        "cards": [
            {"term": "Hello", "definition": "Hola", "order": 0}
        ]
    }

    create_response = client.post("/api/sets", json=set_data)
    set_id = create_response.json()["id"]

    response = client.get(f"/api/sets/{set_id}")
    assert response.status_code == 200

    data = response.json()
    assert data["id"] == set_id
    assert data["title"] == "Test Set"
    assert len(data["cards"]) == 1


def test_get_nonexistent_set(client):
    """Test getting a set that doesn't exist"""
    response = client.get("/api/sets/999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_cards_ordered_correctly(client):
    """Test that cards are returned in correct order"""
    set_data = {
        "title": "Test Set",
        "cards": [
            {"term": "Third", "definition": "3", "order": 2},
            {"term": "First", "definition": "1", "order": 0},
            {"term": "Second", "definition": "2", "order": 1}
        ]
    }

    create_response = client.post("/api/sets", json=set_data)
    set_id = create_response.json()["id"]

    response = client.get(f"/api/sets/{set_id}")
    cards = response.json()["cards"]

    assert cards[0]["term"] == "First"
    assert cards[1]["term"] == "Second"
    assert cards[2]["term"] == "Third"