from datetime import date


def register_user(client):
    payload = {
        'email': 'test@example.com',
        'password': 'password123',
        'name': 'Tester',
        'birth_date': date(1995, 3, 15).isoformat(),
        'birth_time': '08:30:00',
        'birth_place': 'Shanghai'
    }
    return client.post('/api/auth/register', json=payload)


def test_register_and_login(test_client):
    response = register_user(test_client)
    assert response.status_code == 200
    login_response = test_client.post('/api/auth/login', json={'email': 'test@example.com', 'password': 'password123'})
    assert login_response.status_code == 200
    assert 'access_token' in login_response.json()
