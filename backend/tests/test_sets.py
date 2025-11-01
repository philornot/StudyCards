def test_get_set_with_all_details(client):
    """Test that get set returns all necessary details"""
    set_data = {
        "title": "Complete Test Set",
        "description": "Full description here",
        "cards": [
            {"term": "Term 1", "definition": "Definition 1", "order": 0},
            {"term": "Term 2", "definition": "Definition 2", "order": 1},
            {"term": "Term 3", "definition": "Definition 3", "order": 2}
        ]
    }

    create_response = client.post("/api/sets", json=set_data)
    set_id = create_response.json()["id"]

    response = client.get(f"/api/sets/{set_id}")
    assert response.status_code == 200

    data = response.json()

    # Check all fields are present
    assert "id" in data
    assert "title" in data
    assert "description" in data
    assert "created_at" in data
    assert "updated_at" in data
    assert "cards" in data

    # Check data correctness
    assert data["title"] == "Complete Test Set"
    assert data["description"] == "Full description here"
    assert len(data["cards"]) == 3

    # Check each card has all fields
    for card in data["cards"]:
        assert "id" in card
        assert "term" in card
        assert "definition" in card
        assert "order" in card
        assert "set_id" in card


def test_get_set_empty_description(client):
    """Test set with no description"""
    set_data = {
        "title": "No Description Set",
        "cards": [{"term": "A", "definition": "B", "order": 0}]
    }

    create_response = client.post("/api/sets", json=set_data)
    set_id = create_response.json()["id"]

    response = client.get(f"/api/sets/{set_id}")
    assert response.status_code == 200

    data = response.json()
    assert data["description"] is None


def test_get_set_with_many_cards(client):
    """Test set with many cards to check performance"""
    cards = [
        {"term": f"Term {i}", "definition": f"Definition {i}", "order": i}
        for i in range(50)
    ]

    set_data = {
        "title": "Large Set",
        "cards": cards
    }

    create_response = client.post("/api/sets", json=set_data)
    set_id = create_response.json()["id"]

    response = client.get(f"/api/sets/{set_id}")
    assert response.status_code == 200

    data = response.json()
    assert len(data["cards"]) == 50

    # Verify order is maintained
    for i, card in enumerate(data["cards"]):
        assert card["term"] == f"Term {i}"
        assert card["order"] == i