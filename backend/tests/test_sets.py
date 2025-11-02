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


def test_update_set_title_and_description(client):
    """Test updating set title and description"""
    # Create initial set
    set_data = {
        "title": "Original Title",
        "description": "Original description",
        "cards": [{"term": "A", "definition": "B", "order": 0}]
    }
    create_response = client.post("/api/sets", json=set_data)
    set_id = create_response.json()["id"]

    # Update set
    updated_data = {
        "title": "Updated Title",
        "description": "Updated description",
        "cards": [{"term": "A", "definition": "B", "order": 0}]
    }
    response = client.put(f"/api/sets/{set_id}", json=updated_data)

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["description"] == "Updated description"


def test_update_set_add_cards(client):
    """Test adding new cards to existing set"""
    # Create set with 1 card
    set_data = {
        "title": "Test Set",
        "cards": [{"term": "Card 1", "definition": "Def 1", "order": 0}]
    }
    create_response = client.post("/api/sets", json=set_data)
    set_id = create_response.json()["id"]

    # Update with 3 cards
    updated_data = {
        "title": "Test Set",
        "cards": [
            {"term": "Card 1", "definition": "Def 1", "order": 0},
            {"term": "Card 2", "definition": "Def 2", "order": 1},
            {"term": "Card 3", "definition": "Def 3", "order": 2}
        ]
    }
    response = client.put(f"/api/sets/{set_id}", json=updated_data)

    assert response.status_code == 200
    data = response.json()
    assert len(data["cards"]) == 3


def test_update_set_remove_cards(client):
    """Test removing cards from set"""
    # Create set with 3 cards
    set_data = {
        "title": "Test Set",
        "cards": [
            {"term": "Card 1", "definition": "Def 1", "order": 0},
            {"term": "Card 2", "definition": "Def 2", "order": 1},
            {"term": "Card 3", "definition": "Def 3", "order": 2}
        ]
    }
    create_response = client.post("/api/sets", json=set_data)
    set_id = create_response.json()["id"]

    # Update with only 1 card
    updated_data = {
        "title": "Test Set",
        "cards": [{"term": "Card 1", "definition": "Def 1", "order": 0}]
    }
    response = client.put(f"/api/sets/{set_id}", json=updated_data)

    assert response.status_code == 200
    data = response.json()
    assert len(data["cards"]) == 1


def test_update_set_change_card_order(client):
    """Test changing order of cards"""
    # Create set
    set_data = {
        "title": "Test Set",
        "cards": [
            {"term": "First", "definition": "1", "order": 0},
            {"term": "Second", "definition": "2", "order": 1},
            {"term": "Third", "definition": "3", "order": 2}
        ]
    }
    create_response = client.post("/api/sets", json=set_data)
    set_id = create_response.json()["id"]

    # Update with reversed order
    updated_data = {
        "title": "Test Set",
        "cards": [
            {"term": "Third", "definition": "3", "order": 0},
            {"term": "Second", "definition": "2", "order": 1},
            {"term": "First", "definition": "1", "order": 2}
        ]
    }
    response = client.put(f"/api/sets/{set_id}", json=updated_data)

    assert response.status_code == 200
    data = response.json()
    assert data["cards"][0]["term"] == "Third"
    assert data["cards"][1]["term"] == "Second"
    assert data["cards"][2]["term"] == "First"


def test_update_set_validation(client):
    """Test validation when updating set"""
    # Create set
    set_data = {
        "title": "Test Set",
        "cards": [{"term": "A", "definition": "B", "order": 0}]
    }
    create_response = client.post("/api/sets", json=set_data)
    set_id = create_response.json()["id"]

    # Try to update with invalid data (empty title)
    invalid_data = {
        "title": "",
        "cards": [{"term": "A", "definition": "B", "order": 0}]
    }
    response = client.put(f"/api/sets/{set_id}", json=invalid_data)
    assert response.status_code == 422

    # Try to update with no cards
    invalid_data = {
        "title": "Test",
        "cards": []
    }
    response = client.put(f"/api/sets/{set_id}", json=invalid_data)
    assert response.status_code == 422


def test_update_nonexistent_set(client):
    """Test updating a set that doesn't exist"""
    updated_data = {
        "title": "Test",
        "cards": [{"term": "A", "definition": "B", "order": 0}]
    }
    response = client.put("/api/sets/999", json=updated_data)
    assert response.status_code == 404


def test_delete_set_success(client):
    """Test successful deletion of a set"""
    # Create a set
    set_data = {
        "title": "Set to Delete",
        "description": "This will be deleted",
        "cards": [
            {"term": "Card 1", "definition": "Def 1", "order": 0},
            {"term": "Card 2", "definition": "Def 2", "order": 1}
        ]
    }
    create_response = client.post("/api/sets", json=set_data)
    set_id = create_response.json()["id"]

    # Delete the set
    response = client.delete(f"/api/sets/{set_id}")
    assert response.status_code == 204

    # Verify set is deleted
    get_response = client.get(f"/api/sets/{set_id}")
    assert get_response.status_code == 404


def test_delete_set_cascade_deletes_cards(client):
    """Test that deleting a set also deletes all its cards"""
    # Create a set with cards
    set_data = {
        "title": "Set with Cards",
        "cards": [
            {"term": "Card 1", "definition": "Def 1", "order": 0},
            {"term": "Card 2", "definition": "Def 2", "order": 1},
            {"term": "Card 3", "definition": "Def 3", "order": 2}
        ]
    }
    create_response = client.post("/api/sets", json=set_data)
    set_id = create_response.json()["id"]

    # Delete the set
    delete_response = client.delete(f"/api/sets/{set_id}")
    assert delete_response.status_code == 204

    # Verify the set cannot be retrieved
    get_response = client.get(f"/api/sets/{set_id}")
    assert get_response.status_code == 404


def test_delete_nonexistent_set(client):
    """Test deleting a set that doesn't exist"""
    response = client.delete("/api/sets/999")
    assert response.status_code == 404


def test_delete_set_not_in_list(client):
    """Test that deleted set doesn't appear in list"""
    # Create two sets
    set_data_1 = {
        "title": "Set 1",
        "cards": [{"term": "A", "definition": "B", "order": 0}]
    }
    set_data_2 = {
        "title": "Set 2",
        "cards": [{"term": "C", "definition": "D", "order": 0}]
    }

    response_1 = client.post("/api/sets", json=set_data_1)
    set_id_1 = response_1.json()["id"]

    response_2 = client.post("/api/sets", json=set_data_2)
    set_id_2 = response_2.json()["id"]

    # Get list before deletion
    list_response = client.get("/api/sets")
    assert len(list_response.json()) == 2

    # Delete first set
    client.delete(f"/api/sets/{set_id_1}")

    # Get list after deletion
    list_response = client.get("/api/sets")
    sets = list_response.json()
    assert len(sets) == 1
    assert sets[0]["id"] == set_id_2
    assert sets[0]["title"] == "Set 2"